import { Request, Response } from "express";
import { CRUDController } from "../crud-controller";
import { firebaseApp } from "../../admin";
import { omit } from "lodash";

const auth = firebaseApp.auth();
const firestore = firebaseApp.firestore();
firestore.settings({ ignoreUndefinedProperties: true });

/**
 * @description UserRatingController
 */
export class UserRatingController implements CRUDController {
    /* eslint-disable */
    /**
      * @implements CRUDController.create
      * @param req
      * @param Response
      */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const liked: boolean = req.body?.firebaseMetadata?.liked;
            const result = await firestore.collection("item_metadata").add({
                "source_id": req.body.id,
                source: req.body.source,
                likes: liked ? [req.params.userId] : []
            });
            res.send((await result.get()).data());
        } catch (err) {
            res.send(err);
        }
    }

    /**
    * @implements CRUDController.read
    * @param req
    * @param Response
    */
    read(req: Request, res: Response): void {
        throw new Error("Method not implemented");
    }

    /**
    * @implements CRUDController.update
    * @param req
    * @param Response
    */
    update(req: Request, res: Response): void {
        auth
        throw new Error("Method not implemented");
    }

    /**
    * @implements CRUDController.delete
    * @param req
    * @param Response
    */
    delete(req: Request, res: Response): void {
        throw new Error("Method not implemented");
    }

    /**
    *
    * @param req
    * @param res
    */
    getAll(req: Request, res: Response): void {
        throw new Error("Method not implemnented");
    }

    async updateOrInsert(req: Request, res: Response) {
        const liked: boolean = req.body?.liked;
        const uid: string = (req as any).uid;
        const collectionRef = firestore.collection("item_metadata");
        const queryRef = collectionRef
            .where("source_id", "==", req.body.sourceId)
            .where("source", "==", req.body.source);
        let result: any = (await queryRef.get()).docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))?.[0];
        if (result) {
            const likeSet = new Set([...(result?.likes || [])]);
            if (liked) {
                likeSet.add(uid);
            } else {
                likeSet.delete(uid);
            }
            result.likes = Array.from(likeSet);
            await collectionRef.doc(result.id).set(omit(result, ["id"]));
        } else {
            result = {
                source_id: req.body.sourceId,
                source: req.body.source,
                likes: [uid]
            }
            result = (await (await collectionRef.add(result)).get()).data();
        }

        res.send(result);
    }

    /* eslint-enable */
}
