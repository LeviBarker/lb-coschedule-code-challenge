import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { take } from 'rxjs/operators';

/**
 * Authentication service (using AngularFireAuth)
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
    user$: Observable<firebase.User | null>;
    token$: Observable<string | null>;

    constructor(private afAuth: AngularFireAuth) { 
        this.user$ = this.afAuth.authState;
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
     * Sign up with email and password
     * @param email 
     * @param password 
     * @returns 
     */
    async signUpWithEmailAndPassword(email: string, password: string) {
        const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        return credential;
    }

    /**
     * Sign in with email and password
     * @param email
     * @param password 
     * @returns 
     */
    async signInWithEmailAndPassword(email: string, password: string) {
        const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
        return credential;
    }
    /**
     * Sign out
     */
    async signOut(): Promise<void> {
        await this.afAuth.signOut();
    }

    /**
     * Get currently signed in user
     * @returns
     */
    async getUser(): Promise<firebase.User | null> {
        return await this.afAuth.user.pipe(take(1)).toPromise();
    }

    /**
     * Get ID Token
     * @returns
     */
    async getToken(prefix: string = ''): Promise<string | null> {
        return `${prefix}${await this.afAuth.idToken.pipe(take(1)).toPromise()}`;
    }
}