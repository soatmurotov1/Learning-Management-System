import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userHeader = req.headers['x-user-id']
    const roleHeader = req.headers['x-user-role']
    if (userHeader && roleHeader) {
      (req as any).user = {
        id: parseInt(userHeader as string),
        role: roleHeader as string
      }
    }

    next()
  }
}
