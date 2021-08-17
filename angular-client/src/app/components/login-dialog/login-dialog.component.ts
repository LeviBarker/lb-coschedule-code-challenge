import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  providers: [AuthService]
})
export class LoginDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public auth: AuthService) {
      this.auth.user$.subscribe((user) => {
        if(user){
          this.dialogRef.close();
        }
      })
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
