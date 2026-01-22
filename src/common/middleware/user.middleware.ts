import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const { ['']: id, ['']: role } = req.headers

    if (id && role) {(req as any).user = {
        id: +id,
        role
      }
    }

    next()
  }
}
