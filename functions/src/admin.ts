import * as admin from "firebase-admin";

export const firebaseApp: admin.app.App = admin.initializeApp();
export const timestamp: any = admin.firestore.Timestamp;
