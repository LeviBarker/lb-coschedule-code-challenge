import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { CommentsService } from 'src/app/api/comments.service';
import { SearchService } from 'src/app/api/search.service';
import {orderBy} from "lodash";
import { AuthService } from 'src/app/auth/auth.service';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  providers: [SearchService, CommentsService]
})
export class ItemComponent implements OnInit {

  sourceId: any;
  item: any;
  message: string = '';
  dialogRef: MatDialogRef<any> | null = null;

  constructor(private route: ActivatedRoute,
     private router: Router, 
     private dialog: MatDialog,
     public auth: AuthService,
     private commentsService: CommentsService,
     private searchService: SearchService) {
  }

  ngOnInit(): void {
    this.getItem();
  }

  async getItem(){
    const paramMap: ParamMap = await this.route.queryParamMap.pipe(take(1)).toPromise();
    this.sourceId = paramMap.get("sourceId");
    this.item = await this.searchService.getById(this.sourceId).pipe(take(1)).toPromise();
    this.item.comments = orderBy(this.item.comments, ['timestamp._seconds'], ['desc']);
  }

  goBack(){
    this.router.navigate(['./search']);
  }

  openLoginDialog() {
    this.dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '250px',
      data: {}
    });
  }

  async handleAddComment(){
    const user = await this.auth.user$.pipe(take(1)).toPromise();
    if(user){
      const res = await this.commentsService.create({message: this.message, sourceId: this.sourceId}).pipe(take(1)).toPromise();
    if(!this.item.comments){
      this.item.comments = [];
    }
    this.item.comments = orderBy([...this.item.comments, res], ['timestamp._seconds'], ['desc']);
    this.message = '';
    } else {
      this.openLoginDialog();
    }
    
  }

  handleMessageInput(event: any){
    this.message = event.target.value;
  }

  async handleDeleteClick(comment: any){
    const res: any = await this.commentsService.delete(comment.id).pipe(take(1)).toPromise();
    if(res._writeTime){
      this.item.comments = this.item.comments.filter((_comment: any) => {
        return comment.id !== _comment.id;
      });
    }
  }

}
