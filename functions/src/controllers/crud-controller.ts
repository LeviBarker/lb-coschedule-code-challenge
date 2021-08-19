import { Request, Response } from 'express';

/**
 * @description Abstract CRUD operations
 */
export abstract class CRUDController {
    abstract create(req: Request, res: Response): void;
    abstract read(req: Request, res: Response): void;
    abstract update(req: Request, res: Response): void;
    abstract delete(req: Request, res: Response): void;
}
