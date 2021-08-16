import { Request, Response } from "express";
import { CRUDController } from "../crud-controller";
import { firebaseApp } from "../../admin";
import { getDecodedToken } from "../../auth";

const auth = firebaseApp.auth();
const firestore = firebaseApp.firestore();

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
            console.log("inserted");
            res.send((await result.get()).data());
        } catch(err) {
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

    async rateFacade(req: Request, res: Response): Promise<void> {
        const decodedIdToken = await getDecodedToken(req);
        if(!decodedIdToken?.uid){
            res.status(401).send("Unauthorized");
            return;
        }

        req.params.userId = decodedIdToken.uid;

        const firebaseItemId: string = req.body?.firebaseMetadata?.id;
        
        if(firebaseItemId){
            this.update(req, res);
        } else {
            await this.create(req, res);
        }
    }
    /* eslint-enable */
}
