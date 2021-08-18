import { Router, Request, Response } from "express";
import { tokenMiddleware } from "../../auth";
import { commentsController } from "../../controllers";

export const router = Router({
  strict: true
});

router.use(tokenMiddleware);

router.post("/", (req: Request, res: Response) => {
  commentsController.create(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
  commentsController.delete(req, res);
});
