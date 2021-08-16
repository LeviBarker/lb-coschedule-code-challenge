import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";

@Injectable({ providedIn: 'root' })
export class AuthService {
    user$: Observable<any>;
    token$: Observable<any>;

    constructor(private afAuth: AngularFireAuth) { 
        this.user$ = this.afAuth.authState;
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