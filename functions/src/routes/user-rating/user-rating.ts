import { Router, Request, Response } from 'express';
import { tokenMiddleware } from '../../auth';
import { userRatingController } from '../../controllers';

export const router = Router({
  strict: true
});

// Authorize this route
router.use(tokenMiddleware);

router.patch('/rate', (req: Request, res: Response) => {
  userRatingController.updateOrInsert(req, res);
});
