import { Request, Response, NextFunction } from 'express';

export function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const date = new Date();
  console.log(
    `[EShop] REQ  - ${date.toLocaleString()}     LOG [Method:${req.method}] [Path: '${req.originalUrl}']`,
  );
  next()
}