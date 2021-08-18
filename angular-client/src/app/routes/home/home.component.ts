import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { set } from 'lodash';
import { Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { SearchService } from 'src/app/api/search.service';
import { UserRatingService } from 'src/app/api/user-rating.service';
import { AuthService } from 'src/app/auth/auth.service';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SearchService, UserRatingService, AuthService]
})
export class HomeComponent implements OnInit {

  searchValue: string = '';
  results: any = [];
  searchIsLoading: boolean = false;
  dialogRef: MatDialogRef<any> | null = null;
  subscriptions: Subscription = new Subscription();

  constructor(private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private searchService: SearchService,
    public userRatingService: UserRatingService,
    public auth: AuthService,
    public router: Router) {
    this.subscribeToAuthChange();
  }

  ngOnInit(): void {
    this.applyStorageValue();
  }

  subscribeToAuthChange(): void {
    this.auth.user$.subscribe(() => {
      this.handleSearch();
    });
  }

  applyStorageValue(): void {
    const storageValue = localStorage.getItem("searchValue");
    if (storageValue) {
      this.searchValue = storageValue;
      this.handleSearch();
    }
  }


  openLoginDialog(): void {
    this.dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '250px',
      data: {}
    });
  }

  handleSearchInput(ev: any): void {
    this.searchValue = ev.target.value;
    localStorage.setItem("searchValue", this.searchValue);
  }

  async handleSearch(): Promise<void> {
    this.searchIsLoading = true;

    try {
      const user = await this.auth.user;
      const res: any = await this.searchService.search(this.searchValue).toPromise();
      this.results = this.processSearchResults(user?.uid, res.data);
    } catch (e) {
      this.snackBar.open("Unable to get search results");
    }

    this.searchIsLoading = false;
  }

  async handleLikeClick(result: any): Promise<void> {
    if (result._disabled) {
      return;
    }
    result._disabled = true;

    const user = await this.auth.user$.pipe(take(1)).toPromise();
    if (user) {
      result.liked = !result.liked;
      set(result, "firebaseMetadata.likes", this.processLikes(result.liked, result?.firebaseMetadata?.likes, user.uid));
      this.userRatingService.rateItem({
        sourceId: result.id,
        source: "giphy",
        liked: result.liked
      })
        .pipe(take(1), finalize(() => {
          result._disabled = false;
        }))
        .subscribe((res) => { });
    } else {
      this.openLoginDialog();
    }
  }

  handleCommentClick(result: any): void {
    this.router.navigate([`./item`], { queryParams: { sourceId: result.id, source: 'giphy' } });
  }

  processLikes(liked: boolean, likes: any[], uid: string): string[] {
    const likeSet = new Set([...(likes || [])]);
    if (liked) {
      likeSet.add(uid);
    } else {
      likeSet.delete(uid);
    }
    return Array.from(likeSet);
  }

  processSearchResults(uid: string, data: any[]): any[] {
    if (!uid) {
      return data;
    }
    return data.map((item: any) => {
      if (item.firebaseMetadata && item.firebaseMetadata.likes.indexOf(uid) !== -1) {
        item.liked = true;
      }
      return item;
    });
  }

}
