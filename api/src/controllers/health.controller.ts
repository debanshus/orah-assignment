import { Request, Response } from 'express';

export class HealthController {
  static check(_req: Request, res: Response) {
    res.status(200).json({ message: 'I am healthy!' });
  }
}
