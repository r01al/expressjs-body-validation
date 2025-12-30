import type { SchemaFunction } from "../schemaTypes";
export const validateFunction = (
	payload: unknown,
	schema: SchemaFunction,
	path: string
): string | null => {
	try {
		// Delegate to user-supplied predicate for custom validation.
		const ok = schema(payload);
		if (!ok) {
			return path ? `invalid field '${path}'` : "invalid payload";
		}
		return null;
	} catch (error) {
		const message = error instanceof Error ? error.message : "validator threw";
		return path ? `invalid field '${path}': ${message}` : `invalid payload: ${message}`;
	}
};
