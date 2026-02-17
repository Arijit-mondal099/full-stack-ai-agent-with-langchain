import { NextFunction, Request, RequestHandler, Response } from "express"

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const async_hander = (handler: AsyncRequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    }
}
