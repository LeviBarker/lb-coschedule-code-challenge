import { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase-functions/v1/firestore';
import * as functions from 'firebase-functions';
import { omit } from 'lodash';
import { firebaseApp } from '../admin';

const firestore = firebaseApp.firestore();

/**
 * Firebase DAO Adapter
 * @todo Consider implementing an interface to plug-in with something like:
 *  MongoDBDAOAdapter, SQLDAOAdapter
 */
export class FirebaseDAOAdapter {
    /**
     * Get Firebase CollectionReference
     * @param path 
     * @param whereClauses 
     * @returns 
     */
    static getCollectionRef(
        path: string,
        whereClauses: {
            field: string,
            operator: FirebaseFirestore.WhereFilterOp,
            value: any
        }[] = []): FirebaseFirestore.CollectionReference {
        return whereClauses
            .reduce((collectionRef: any, currentClause: {
                field: string,
                operator: FirebaseFirestore.WhereFilterOp,
                value: any
            }) => {
                return collectionRef.where(currentClause.field, currentClause.operator, currentClause.value);
            }, firestore.collection(path));
    }

    /**
     * Get Firebase Collection values
     * @param path 
     * @param whereClauses 
     * @returns 
     */
    static async getCollectionValues(
        path: string,
        whereClauses: {
            field: string,
            operator: FirebaseFirestore.WhereFilterOp,
            value: any
        }[] = []): Promise<any[]> {
        try {
            return (await this.getCollectionRef(path, whereClauses).get())
                .docs.map((doc: QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...doc.data()
                }));
        } catch (e) {
            functions.logger.error(e);
            return [];
        }
    }

    /**
     * Get Firebase DocumentReference
     * @param collectionPath 
     * @param id 
     * @returns 
     */
    static getDocumentRef(collectionPath: string, id: string): FirebaseFirestore.DocumentReference {
        return this.getCollectionRef(collectionPath).doc(id);
    }

    /**
     * Get Firebase Document data
     * @param collectionPath 
     * @param id 
     * @returns 
     */
    static async getDocumentData(collectionPath: string, id: string): Promise<any> {
        try {
            const documentSnapshot: DocumentSnapshot = await this.getDocumentRef(collectionPath, id).get();
            return {
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            };
        } catch (e) {
            functions.logger.error(e);
            return null;
        }
    }

    /**
     * Add Firestore document
     * @param collectionPath 
     * @param data 
     * @returns 
     */
    static async addDocument<T>(collectionPath: string, data: T | any): Promise<T | any> {
        try {
            const documentReference: FirebaseFirestore.DocumentReference =
                await this.getCollectionRef(collectionPath).add(data);
            const documentSnapshot: DocumentSnapshot = await documentReference.get();
            return {
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            };
        } catch (e) {
            functions.logger.error(e);
            return null;
        }
    }

    /**
     * Update Firestore document
     * @param collectionPath 
     * @param data 
     * @returns 
     */
    static async updateDocument<T>(collectionPath: string, data: T | any): Promise<T | any> {
        try {
            const writeResult: FirebaseFirestore.WriteResult =
                await this.getDocumentRef(collectionPath, data?.id).update(omit(data, ['id']));
            if (writeResult) {
                return data;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    /**
     * Set Firestore document
     * @param collectionPath 
     * @param data 
     * @returns 
     */
    static async setDocument<T>(collectionPath: string, data: T | any): Promise<T | any> {
        try {
            const writeResult: FirebaseFirestore.WriteResult =
                await this.getDocumentRef(collectionPath, data?.id).set(omit(data, ['id']));
            if (writeResult) {
                return data;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    /**
     * Delete Firestore document by ID
     * @param collectionPath 
     * @param id 
     * @returns 
     */
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

    /**
     * Get unique value via whereClauses
     * @param collectionPath 
     * @param whereClauses 
     * @returns 
     */
    static async getUniqueDocumentValue(
        collectionPath: string,
        whereClauses: {
            field: string,
            operator: FirebaseFirestore.WhereFilterOp,
            value: any
        }[] = []): Promise<any> {
        try {
            const collectionValues = await this.getCollectionValues(collectionPath, whereClauses);
            if (collectionValues.length > 1) {
                functions.logger.log(`Multiple values for expected unique value at ${collectionPath} on ${JSON.stringify(whereClauses)}`);
            }
            return collectionValues[0];
        } catch (e) {
            functions.logger.error(e);
            return null;
        }
    }
}
