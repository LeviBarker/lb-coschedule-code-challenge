import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  providers: [AuthService]
})
export class LoginDialogComponent {

  email: string = '';
  password: string = '';
  displayPassword: boolean = false;
  emailButtonsDisabled: boolean = true;
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar,
    public auth: AuthService) {
    this.subscribeToAuthChange();
  }

  subscribeToAuthChange(): void {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.dialogRef.close();
        this.snackbar.open(`Welcome back ${user.displayName || user.email}`, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleEmailInput(event: any){
    this.email = event.target.value;
    this.emailButtonsDisabled = this.email === '' || this.password === '';
  }

  handlePasswordInput(event: any){
    this.password = event.target.value;
    this.emailButtonsDisabled = this.email === '' || this.password === '';
  }

  handleDisplayPasswordClick(){
    this.displayPassword = !this.displayPassword;
  }

  async handleSignUpClick(){
    this.errorMessage = '';
    await this.auth.signUpWithEmailAndPassword(this.email, this.password).catch((err: any) => {
      this.errorMessage = err?.message || 'Error signing up';
    });
  }

  async handleSignInClick(){
    this.errorMessage = '';
    await this.auth.signInWithEmailAndPassword(this.email, this.password).catch((err: any) => {
      this.errorMessage = err?.message || 'Error signing up';
    });
  }

}
