import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { Comment } from '../../models/comment';
import { take } from "rxjs/operators";
import { cloneDeep } from 'lodash';

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

  @Output() deleteClicked: EventEmitter<string> = new EventEmitter();
  @Output() editClicked: EventEmitter<string | null> = new EventEmitter();

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
    this.deleteClicked.emit(String(this.comment?.id));
  }

  handleEditClick() {
    this.editClicked.emit(this.comment?.id);
  }

  async handleSaveClick() {
    this.isSaving = true;
    const comment: Comment = await this.commentService.update({
      id: this.comment?.id,
      body: this.comment?.body
    }).pipe(take(1)).toPromise();
    this.isSaving = false;
    this.commentChanged = false;
    this.editClicked.emit(null);
    this.originalComment = comment;
  }

  handleCommentInput(event: any) {
    this.commentChanged = true;
    if (this.comment) {
      this.comment.body = event.target.value;
    }
  }

  handleCancelClick(){
    this.editClicked.emit(null);
    this.commentChanged = false;
    this.comment = this.originalComment;
  }

}
