import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';

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

