import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { Comment } from '../../models/comment';
import { take } from "rxjs/operators";
import { cloneDeep, isEqual } from 'lodash';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  providers: [CommentsService]
})
export class CommentComponent implements OnChanges {

  @Input() comment: Comment | null = null;
  @Input() editing: boolean = false;
  @Input() uid: string | null = null;

  @Output() onDeleteClick: EventEmitter<string> = new EventEmitter();
  @Output() onEditClick: EventEmitter<string | null> = new EventEmitter();

  commentChanged: boolean = false;
  isSaving: boolean = false;
  originalComment: Comment | null = null;

  constructor(private commentService: CommentsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    const commentChange: SimpleChange = changes.comment;
    if(commentChange){
      this.originalComment = cloneDeep(commentChange.currentValue);
    }
  }

  handleDeleteClick() {
    this.isSaving = true;
    this.onDeleteClick.emit(String(this.comment?.id));
  }

  handleEditClick() {
    this.onEditClick.emit(this.comment?.id);
  }

  async handleSaveClick() {
    this.isSaving = true;
    const comment: Comment = await this.commentService.update({
      id: this.comment?.id,
      body: this.comment?.body
    }).pipe(take(1)).toPromise();
    this.isSaving = false;
    this.commentChanged = false;
    this.onEditClick.emit(null);
    this.originalComment = comment;
  }

  handleCommentInput(event: any) {
    this.commentChanged = true;
    if (this.comment) {
      this.comment.body = event.target.value;
    }
  }

  handleCancelClick(){
    this.onEditClick.emit(null);
    this.commentChanged = false;
    this.comment = this.originalComment;
  }

}
