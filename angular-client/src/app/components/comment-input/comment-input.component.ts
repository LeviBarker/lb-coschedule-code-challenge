import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommentsService } from 'src/app/api/comments.service';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { Comment } from 'src/app/models/comment';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss']
})
export class CommentInputComponent {

  @Input() sourceId: string | null = null;

  @Output() commentAdded: EventEmitter<Comment> = new EventEmitter();

  message: string = '';
  dialogRef: MatDialogRef<any> | null = null;
  isSaving: boolean = false;

  constructor(private auth: AuthService, private commentsService: CommentsService, private dialog: MatDialog) { }

  async handleAddComment() {
    const user = await this.auth.user$.pipe(take(1)).toPromise();
    if (user && this.sourceId) {
      this.isSaving = true;
      const res = await this.commentsService.create({ body: this.message, sourceId: this.sourceId }).pipe(take(1)).toPromise();
      this.commentAdded.emit(res);
      this.message = '';
      this.isSaving = false;
    } else {
      this.openLoginDialog();
    }

  }

  handleMessageInput(event: any) {
    this.message = event.target.value;
  }

  openLoginDialog() {
    this.dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '320px',
      data: {}
    });
  }

}
