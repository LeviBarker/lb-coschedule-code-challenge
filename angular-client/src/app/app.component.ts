import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from './api/search.service';
import {finalize} from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { UserRatingService } from './api/user-rating.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SearchService, UserRatingService]
})
export class AppComponent implements OnDestroy {
  
  searchValue: string = '';
  results: any = [];
  searchIsLoading: boolean = false;
  subscriptions: Subscription = new Subscription();

  constructor(private _snackBar: MatSnackBar, private searchService: SearchService, public userRatingService: UserRatingService, public auth: AuthService) { }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  handleSearchInput(ev: any){
    this.searchValue = ev.target.value;
  }

  handleSearch(){
    this.searchIsLoading = true;
    this.subscriptions.add(this.auth.user$?.subscribe((user) => {
      this.searchService
      .search(this.searchValue)
      .pipe(finalize(() => {this.searchIsLoading = false}))
      .subscribe(
        (res: any) => this.results = this.processSearchResults(user.uid, res.data),
        (err: any) => this._snackBar.open("Unable to get search results")
      );
    }));
  }

  handleLikeClick(result: any){
    // TODO: Check if logged in, else open login dialog
    this.subscriptions.add(this.auth.user$?.subscribe((user) => {
      if(user){
        console.log(user);
        result.liked = !result.liked;
        this.userRatingService.rateItem({
          "source_id": result.id,
          source: "giphy",
          liked: result.liked
        }).subscribe((res) => {
          console.log(res);
        });
      } else {
        alert('login');
      }
    }));
    // this.subscriptions.add(this.auth.user$?.subscribe(user => console.log(user)));
  }

  processSearchResults(uid: string, data: any[]){
    return data.map((item: any) => {
      if(item.firebaseMetadata && item.firebaseMetadata.likes.indexOf(uid) !== -1){
        item.liked = true;
      }
      return item;
    });
  }
}

