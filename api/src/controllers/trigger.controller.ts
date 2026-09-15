import { Request, Response } from 'express';
import { TriggerService } from '../services/trigger.service';

export const createTrigger = async (req: Request, res: Response) => {
  try {
    const trigger = await TriggerService.createTrigger(req.body);
    res.status(201).json(trigger);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTriggers = async (_req: Request, res: Response) => {
  try {
    const triggers = await TriggerService.getTriggers();
    res.status(200).json(triggers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
