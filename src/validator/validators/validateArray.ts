import type { SchemaArray, SchemaValue } from "../schemaTypes";
import { ensureRootPath, formatPath, typeOfValue } from "../schemaUtils";

export type ValidatorFn = (payload: unknown, schema: SchemaValue, path: string) => string | null;

export const validateArray = (
	payload: unknown,
	schema: SchemaArray,
	path: string,
	validate: ValidatorFn
): string | null => {
	// Array schemas require the payload itself to be an array.
	if (!Array.isArray(payload)) {
		const actualType = typeOfValue(payload);
		return `invalid field '${ensureRootPath(path)}': expected array, got ${actualType}`;
	}

	// Empty array schema means "array of anything".
	if (schema.length === 0) return null;
	const itemSchema = schema[0];
	// Validate each item against the single item schema.
	for (let i = 0; i < payload.length; i += 1) {
		const error = validate(payload[i], itemSchema, formatPath(ensureRootPath(path), i));
		if (error) return error;
	}
	return null;
};
