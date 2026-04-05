import type { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  res.status(501).json({ success: false, data: null, error: { message: 'Not implemented' } });
};

export const login = async (req: Request, res: Response) => {
  res.status(501).json({ success: false, data: null, error: { message: 'Not implemented' } });
};

export const getProfile = async (req: Request, res: Response) => {
  res.status(501).json({ success: false, data: null, error: { message: 'Not implemented' } });
};
