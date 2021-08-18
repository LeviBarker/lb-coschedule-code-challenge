import { Request, Response } from "express";
import { firebaseApp } from "../../admin";
import { UserRating } from "../../models/user-rating";
import { FirebaseDAOAdapter } from "../../dao/firestore-dao-adapter";

const firestore = firebaseApp.firestore();
firestore.settings({ ignoreUndefinedProperties: true });

/**
 * @description UserRatingController
 */
export class UserRatingController {
    /**
      * @implements CRUDController.create
      * @param req
      * @param Response
      */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const liked: boolean = req.body?.firebaseMetadata?.liked;
            const data: any =
                await FirebaseDAOAdapter.addDocument("item_metadata", {
                    sourceId: req.body.id,
                    source: req.body.source,
                    likes: liked ? [req.params.userId] : []
                });
            res.send(data);
        } catch (err) {
            res.send(err);
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    async updateOrInsert(req: Request, res: Response): Promise<void> {
        const userRating: UserRating = req.body;
        const uid: string = (req as any).uid;

        let result: any =
            (await FirebaseDAOAdapter.getCollectionValues("item_metadata", [
                {
                    field: "sourceId",
                    operator: "==",
                    value: userRating.sourceId
                },
                {
                    field: "source",
                    operator: "==",
                    value: userRating.source
                }
            ]))?.[0];

        if (result) {
            const likeSet = new Set([...(result?.likes || [])]);
            if (userRating.liked) {
                likeSet.add(uid);
            } else {
                likeSet.delete(uid);
            }
            result.likes = Array.from(likeSet);
            result = await FirebaseDAOAdapter.updateDocument("item_metadata", result);
        } else {
            result = {
                sourceId: userRating.sourceId,
                source: userRating.source,
                likes: [uid]
            };
            result = await FirebaseDAOAdapter.addDocument("item_metadata", result);
        }

        res.send(result);
    }
}
