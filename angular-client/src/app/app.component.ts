import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from './api/search.service';
import { take, finalize } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { UserRatingService } from './api/user-rating.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { set } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AuthService]
})
export class AppComponent {

  dialogRef: MatDialogRef<any> | null = null;

  constructor(public auth: AuthService, public dialog: MatDialog) { }

  openLoginDialog() {
    this.dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '320px',
      data: {}
    });
  }
}

