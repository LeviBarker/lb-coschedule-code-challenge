import { Request, Response } from "express";
import { timestamp } from "../../admin";
import { FirebaseDAOAdapter } from "../../dao/firestore-dao-adapter";
import { Comment } from "../../models/comment";
import { get } from "lodash";

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
    const comment: Comment = req.body;
    const name = (req as any).name;
    const uid = (req as any).uid;
    const email = (req as any).email;

    if (comment.body && comment.sourceId) {
      const data: Comment = await FirebaseDAOAdapter
        .addDocument<Comment>("comments", {
        author: name || email,
        timestamp: timestamp.now(),
        sourceId: comment.sourceId,
        body: comment.body,
        uid
      });

      await this.updateItemMetadataCommentNumber(comment.sourceId, "increment");

      res.send(data);
    } else {
      res.status(400).send("Missing body or sourceId");
    }
  }

  /**
   * 
   * @param req
   * @param res 
   */
  async read(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    if (id) {
      const data: any = await FirebaseDAOAdapter.getDocumentData("comments", id);
      res.send(data);
    }
  }

  /**
   * 
   * @param req 
   * @param res 
   * @returns 
   */
  async update(req: Request, res: Response): Promise<void> {
    const comment: Comment = req.body;
    if (comment.id) {
      const data: Comment = 
        await FirebaseDAOAdapter.updateDocument<Comment>("comments", comment);
      res.send(data);
      return;
    }
    res.status(400).send("ID is required");
  }

  /**
   * @description delete comment by ID
   * @param req
   * @param res
   * @returns
   */
  async delete(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    const uid: string = (req as any).uid;

    if (id) {
      const comment: Comment = 
        await FirebaseDAOAdapter.getDocumentData("comments", id) as Comment;
      if (comment.uid !== uid) {
        res.status(403).send("Forbidden");
        return;
      }
      await this.updateItemMetadataCommentNumber(comment.sourceId, "decrement");
      const deleted: boolean = 
        await FirebaseDAOAdapter.deleteDocument("comments", id);
      res.send({ deleted });
    } else {
      res.status(400).send("Missing commentId");
    }
  }

  /**
   * Updates ItemMetadata comment number
   * @param sourceId 
   * @param action 
   */
  async updateItemMetadataCommentNumber(sourceId: string, action: "increment" | "decrement"): Promise<void> {
    const itemMetadata: any = 
      await FirebaseDAOAdapter.getUniqueDocumentValue("item_metadata", [{
      field: "sourceId",
      operator: "==",
      value: sourceId
    }]);

    let numberOfComments = get(itemMetadata, "numberOfComments", 0);

    if (action === "increment") {
      numberOfComments += 1;
    } else {
      numberOfComments -= 1;
      if (numberOfComments < 0) {
        numberOfComments = 0;
      }
    }

    if (itemMetadata?.id) {
      const updateValue: any = {
        id: itemMetadata.id,
        numberOfComments
      };
      await FirebaseDAOAdapter.updateDocument("item_metadata", updateValue);
    } else {
      const insertValue: any = {
        likes: [],
        sourceId,
        numberOfComments
      };
      await FirebaseDAOAdapter.addDocument("item_metadata", insertValue);
    }
  }
}
