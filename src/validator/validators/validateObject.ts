import type { SchemaObject, SchemaValue } from "../schemaTypes";
import { ensureRootPath, formatPath, isPlainObject, typeOfValue } from "../schemaUtils";

export type ValidatorFn = (payload: unknown, schema: SchemaValue, path: string) => string | null;

export const validateObject = (
	payload: unknown,
	schema: SchemaObject,
	path: string,
	validate: ValidatorFn
): string | null => {
	if (!isPlainObject(payload)) {
		const actualType = typeOfValue(payload);
		return `invalid field '${ensureRootPath(path)}': expected object, got ${actualType}`;
	}

	for (const key of Object.keys(schema)) {
		if (!(key in payload)) {
			const missingPath = formatPath(ensureRootPath(path), key);
			return `missing field '${missingPath}'`;
		}
		const error = validate(payload[key], schema[key], formatPath(ensureRootPath(path), key));
		if (error) return error;
	}

	return null;
};
