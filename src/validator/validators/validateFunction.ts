import type { SchemaFunction } from "../schemaTypes";
export const validateFunction = (
	payload: unknown,
	schema: SchemaFunction,
	path: string
): string | null => {
	const ok = schema(payload);
	if (!ok) {
		return path ? `invalid field '${path}'` : "invalid payload";
	}
	return null;
};
