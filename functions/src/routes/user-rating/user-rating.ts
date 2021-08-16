import { Router, Request, Response } from "express";
import { userRatingController } from "../../controllers";

export const router = Router({
  strict: true
});

/**
 * @description Facade for User Rating object
 */
router.patch("/rate", async (req: Request, res: Response) => {
  await userRatingController.rateFacade(req, res);
});
