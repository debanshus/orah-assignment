import { Request, Response } from 'express';
import { ConcernService } from '../services/concern.service';

export class ConcernController {
  static async getAll(_req: Request, res: Response) {
    try {
      const concerns = await ConcernService.getAll();
      res.json(concerns);
    } catch (error: any) {
      console.error('Error fetching concerns:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await ConcernService.update(id, req.body);
      res.status(200).json({ message: 'Success' });
    } catch (error: any) {
      console.error('Error updating concern:', error);
      if (error.message === 'Concern not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}
