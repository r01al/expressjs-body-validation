import type { SchemaArray, SchemaValue } from "../schemaTypes";
import { ensureRootPath, formatPath, typeOfValue } from "../schemaUtils";

export type ValidatorFn = (payload: unknown, schema: SchemaValue, path: string) => string | null;

export const validateArray = (
	payload: unknown,
	schema: SchemaArray,
	path: string,
	validate: ValidatorFn
): string | null => {
	if (!Array.isArray(payload)) {
		const actualType = typeOfValue(payload);
		return `invalid field '${ensureRootPath(path)}': expected array, got ${actualType}`;
	}

	if (schema.length === 0) return null;
	const itemSchema = schema[0];
	for (let i = 0; i < payload.length; i += 1) {
		const error = validate(payload[i], itemSchema, formatPath(ensureRootPath(path), i));
		if (error) return error;
	}
	return null;
};
