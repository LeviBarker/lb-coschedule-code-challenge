import { Request } from "express";
import { auth } from "firebase-admin";
import { firebaseApp } from "./admin";

const _auth = firebaseApp.auth();

export const getDecodedToken =
    async (req: Request): Promise<auth.DecodedIdToken | null> => {
        if ((!req.headers.authorization ||
            !req.headers.authorization.startsWith("Bearer ")) &&
            !(req.cookies && req.cookies.__session)) {
            return null;
        }

        let idToken;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")) {
            console.log("Found \"Authorization\" header");
            // Read the ID Token from the Authorization header.
            idToken = req.headers.authorization.split("Bearer ")[1];
        } else if (req.cookies) {
            console.log("Found \"__session\" cookie");
            // Read the ID Token from cookie.
            idToken = req.cookies.__session;
        } else {
            // No cookie
            return null;
        }

        try {
            const decodedIdToken = await _auth.verifyIdToken(idToken);
            console.log("ID Token correctly decoded", decodedIdToken);
            return decodedIdToken;
        } catch (error) {
            console.error("Error while verifying Firebase ID token:", error);
            return null;
        }
    };
