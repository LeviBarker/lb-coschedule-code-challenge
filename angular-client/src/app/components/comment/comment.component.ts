import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {Comment} from '../../models/comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment | null = null;
  @Input() uid: string | null = null;

  @Output() onDeleteClick: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  handleDeleteClick(comment: Comment){
    this.onDeleteClick.emit(String(comment?.id));
  }

}
