import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";
import { tap } from "rxjs/operators";

/**
 * Authentication service (using AngularFireAuth)
 */
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

    /**
     * Sign in using Google provider popup
     * @returns 
     */
    async googleSignIn(): Promise<firebase.User | null> {
        const provider = new firebase.auth.GoogleAuthProvider();
        const credential = this.afAuth.signInWithPopup(provider);
        return (await credential).user;
    }

    /**
     * Sign out
     */
    async signOut(): Promise<void> {
        await this.afAuth.signOut();
    }
}