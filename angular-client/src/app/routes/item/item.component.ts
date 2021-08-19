import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { CommentsService } from 'src/app/api/comments.service';
import { SearchService } from 'src/app/api/search.service';
import { orderBy } from "lodash";
import { AuthService } from 'src/app/auth/auth.service';
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
  editingCommentId: string | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private commentsService: CommentsService,
    private searchService: SearchService) {
  }

  ngOnInit(): void {
    this.getItem();
  }

  async getItem() {
    const paramMap: ParamMap = await this.route.queryParamMap.pipe(take(1)).toPromise();
    this.sourceId = paramMap.get("sourceId");
    this.item = await this.searchService.getById(this.sourceId).pipe(take(1)).toPromise();
    this.item.comments = orderBy(this.item.comments, ['timestamp._seconds'], ['desc']);
  }

  goBack() {
    this.router.navigate(['./search']);
  }

  async handleCommentAdded(event: any) {
    if (!this.item.comments) {
      this.item.comments = [];
    }
    this.item.comments = orderBy([...this.item.comments, event], ['timestamp._seconds'], ['desc']);
  }

  handleMessageInput(event: any) {
    this.message = event.target.value;
  }

  async handleDeleteClick(id: string): Promise<void> {
    const res: any = await this.commentsService.delete(id).pipe(take(1)).toPromise();
    if (res.deleted) {
      this.item.comments = this.item.comments.filter((_comment: any) => {
        return id !== _comment.id;
      });
    }
  }

  handleEditClick(id: string | null) {
    this.editingCommentId = id;
  }

  handleLaunchClick() {
    window.open(this.item.images?.original?.url, '_blank');
  }
}
