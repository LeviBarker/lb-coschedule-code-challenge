import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    this.auth.user$.subscribe(() => {
      this.handleSearch();
    });
  }

  ngOnInit(): void {
    this.applyStorageValue();
  }

  applyStorageValue(){
    const storageValue = localStorage.getItem("searchValue");
    if(storageValue){
      this.searchValue = storageValue;
      this.handleSearch();
    }
  }


  openLoginDialog() {
    this.dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '250px',
      data: {}
    });
  }

  handleSearchInput(ev: any) {
    this.searchValue = ev.target.value;
    localStorage.setItem("searchValue", this.searchValue);
  }

  async handleSearch() {
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

  async handleLikeClick(result: any) {
    if (result._disabled) {
      return;
    }
    result._disabled = true;

    const user = await this.auth.user$.pipe(take(1)).toPromise();
    if (user) {
      result.liked = !result.liked;
      const likes = result?.firebaseMetadata?.likes;
      const likeSet = new Set([...(likes || [])]);
      if (result.liked) {
        likeSet.add(user.uid);
      } else {
        likeSet.delete(user.uid);
      }
      set(result, "firebaseMetadata.likes", Array.from(likeSet));
      this.userRatingService.rateItem({
        "source_id": result.id,
        source: "giphy",
        liked: result.liked
      })
        .pipe(take(1), finalize(() => {
          result._disabled = false;
        }))
        .subscribe((res) => {
          // console.log({res});
        });
    } else {
      this.openLoginDialog();
    }
  }

  handleCommentClick(result: any) {
    console.log(result);
    this.router.navigate([`./item`], { queryParams: { sourceId: result.id, source: 'giphy' } });
  }

  processSearchResults(uid: string, data: any[]) {
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
