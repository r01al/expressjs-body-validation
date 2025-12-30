import type { NextFunction, Request, Response } from "express";
import type { SchemaValue } from "../validator/validateSchema";
import { validateAgainstSchema, validateSchemaDefinition } from "../validator/validateSchema";

export const validateBody = (schema: SchemaValue) => {
	const schemaError = validateSchemaDefinition(schema);
	return (req: Request, res: Response, next: NextFunction) => {
		if (schemaError) {
			res.status(400).json({ message: schemaError });
			return;
		}

		const error = validateAgainstSchema(req.body, schema);
		if (error) {
			res.status(400).json({ message: error });
			return;
		}
		next();
	};
};
