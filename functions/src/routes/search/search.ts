import { Router, Request, Response } from "express";
import { searchController } from "../../controllers";

export const router = Router({
  strict: true
});

router.get("/:id", (req: Request, res: Response) => {
  searchController.getGifById(req, res);
});

router.get("*", (req: Request, res: Response) => {
  searchController.searchGiphy(req, res);
});
