import type { NextFunction, Request, Response } from "express";
import type { SchemaValue } from "../validator/validateSchema";
import { validateAgainstSchema } from "../validator/validateSchema";

export const validateBody = (schema: SchemaValue) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const error = validateAgainstSchema(req.body, schema);
		if (error) {
			res.status(400).json({ message: error });
			return;
		}
		next();
	};
};
