import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class AuthService {
    userSubject: BehaviorSubject<any> = new BehaviorSubject(null);
    user: any;
    user$: Observable<any>;
    token$: Observable<any>;

    constructor(private afAuth: AngularFireAuth) { 
        this.user$ = this.afAuth.authState.pipe(tap((user: any) => this.user = user));
        this.token$ = this.afAuth.idToken;
    }

    async googleSignIn(){
        const provider = new firebase.auth.GoogleAuthProvider();
        const credential = this.afAuth.signInWithPopup(provider);
        return (await credential).user;
    }

    async signOut() {
        await this.afAuth.signOut();
    }
}