import { Request, Response, NextFunction } from 'express';
import { firebaseApp } from './admin';

const auth = firebaseApp.auth();

export const tokenMiddleware =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if ((!req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer ')) &&
            !(req.cookies && req.cookies.__session)) {
            res.status(401).send('Unauthorized');
            return;
        }

        let idToken;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')) {
            idToken = req.headers.authorization.split('Bearer ')[1];
        } else if (req.cookies) {
            idToken = req.cookies.__session;
        } else {
            // No cookie
            res.status(401).send('Unauthorized');
            return;
        }

        try {
            const decodedIdToken = await auth.verifyIdToken(idToken);
            (req as any).uid = String(decodedIdToken.uid);
            (req as any).name = String(decodedIdToken.name);
            (req as any).email = String(decodedIdToken.email);
            next();
            return;
        } catch (error) {
            console.error('Error while verifying Firebase ID token:', error);
            res.status(500).send(error);
            return;
        }
    };
