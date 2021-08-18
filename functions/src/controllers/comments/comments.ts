import { Request, Response } from "express";
import { firebaseApp, timestamp } from "../../admin";

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
    const body: string = req.body?.body;
    const sourceId: string = req.body?.sourceId;
    const name = (req as any).name;
    const uid = (req as any).uid;
    const email = (req as any).email;

    if (body && sourceId) {
      const documentRef = await firestore.collection("comments").add({
        author: name || email,
        timestamp: timestamp.now(),
        source_id: sourceId,
        uid,
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
    const commentId: string = req.params.id;
    const uid: string = (req as any).uid;

    if (commentId) {
      const docRef = firestore.collection("comments").doc(commentId);
      const data: any = (await docRef.get()).data();
      if (data.uid !== uid) {
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
