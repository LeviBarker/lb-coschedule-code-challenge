import { Request, Response } from "express";
import { firebaseApp, timestamp } from "../../admin";
import { getDecodedToken } from "../../auth";

const firestore: FirebaseFirestore.Firestore = firebaseApp.firestore();

/**
 * @description CommentsController
 */
export class CommentsController {
  /**
   * @param req
   * @param res
   * @returns
   */
  async create(req: Request, res: Response): Promise<void> {
    const decodedIdToken = await getDecodedToken(req);
    if (!decodedIdToken?.uid) {
      res.status(401).send("Unauthorized");
      return;
    }

    const body: string = req.body?.message;
    const sourceId: string = req.body?.sourceId;

    if (body && sourceId) {
      const documentRef = await firestore.collection("comments").add({
        author: decodedIdToken.displayName || decodedIdToken.email,
        uid: decodedIdToken.uid,
        timestamp: timestamp.now(),
        source_id: sourceId,
        body
      });
      const dataRef = await documentRef.get();
      res.send({
        id: dataRef.id,
        ...dataRef.data()
      });
    } else {
      res.status(400).send("Missing body or sourceId");
    }
  }

  /**
   * @description delete comment by ID
   * @param req
   * @param res
   * @returns
   */
  async delete(req: Request, res: Response): Promise<void> {
    const decodedIdToken = await getDecodedToken(req);
    if (!decodedIdToken?.uid) {
      res.status(401).send("Unauthorized");
      return;
    }

    const commentId: string = req.params.id;

    if (commentId) {
      const docRef = firestore.collection("comments").doc(commentId);
      const data: any = (await docRef.get()).data();
      if (data.uid !== decodedIdToken.uid) {
        res.status(403).send("Forbidden");
        return;
      }
      const result = await docRef.delete();
      res.send(result);
    } else {
      res.status(400).send("Missing commentId");
    }
  }
}
