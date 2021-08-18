import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-functions/v1/firestore";
import * as functions from "firebase-functions";
import { omit } from "lodash";
import { firebaseApp } from "../admin";

const firestore = firebaseApp.firestore();

export class FirebaseDAOAdapter {

    static getCollectionRef(path: string, whereClauses: { field: string, operator: FirebaseFirestore.WhereFilterOp, value: any }[] = []): FirebaseFirestore.CollectionReference {
        return whereClauses.reduce((collectionRef: any, currentClause: { field: string, operator: FirebaseFirestore.WhereFilterOp, value: any }) => {
            return collectionRef.where(currentClause.field, currentClause.operator, currentClause.value);
        }, firestore.collection(path));
    }

    static async getCollectionValues(path: string, whereClauses: { field: string, operator: FirebaseFirestore.WhereFilterOp, value: any }[] = []): Promise<any[]> {
        try {
            return (await this.getCollectionRef(path, whereClauses).get()).docs.map((doc: QueryDocumentSnapshot) => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (e) {
            functions.logger.error(e);
            return [];
        }

    }

    static getDocumentRef(collectionPath: string, id: string): FirebaseFirestore.DocumentReference {
        return this.getCollectionRef(collectionPath).doc(id);
    }

    static async getDocumentData(collectionPath: string, id: string) {
        try {
            const documentSnapshot: DocumentSnapshot = await this.getDocumentRef(collectionPath, id).get();
            return {
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            }
        } catch (e) {
            functions.logger.error(e);
            return null;
        }

    }

    static async addDocument<T>(collectionPath: string, data: any): Promise<T | any> {
        try {
            const documentReference: FirebaseFirestore.DocumentReference =
                await this.getCollectionRef(collectionPath).add(data);
            const documentSnapshot: DocumentSnapshot = await documentReference.get();
            return {
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            }
        } catch (e) {
            functions.logger.error(e);
            return null;
        }
    }

    static async updateDocument<T>(collectionPath: string, data: any): Promise<T | any> {
        try {
            const writeResult: FirebaseFirestore.WriteResult =
                await this.getDocumentRef(collectionPath, data?.id).update(omit(data, ["id"]));
            if (writeResult) {
                return data;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    static async deleteDocument(collectionPath: string, id: string): Promise<boolean> {
        try {
            const writeResult: FirebaseFirestore.WriteResult = await this.getDocumentRef(collectionPath, id).delete();
            if (writeResult) {
                return true;
            }
        } catch (e) {
            functions.logger.error(e);
        }
        return false;
    }

    static async getUniqueDocumentValue(collectionPath: string, whereClauses: { field: string, operator: FirebaseFirestore.WhereFilterOp, value: any }[] = []): Promise<any> {
        try {
            return (await this.getCollectionRef(collectionPath, whereClauses).limit(1).get()).docs.map((doc: QueryDocumentSnapshot) => ({
                id: doc.id,
                ...doc.data()
            }))?.[0];
        } catch (e) {
            functions.logger.error(e);
            return null;
        }
    }

}