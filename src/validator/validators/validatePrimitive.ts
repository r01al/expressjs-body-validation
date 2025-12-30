import { SchemaType } from "../schemaTypes";
import type { SchemaPrimitive } from "../schemaTypes";
import { typeOfValue } from "../schemaUtils";

export const validatePrimitive = (
	value: unknown,
	schema: SchemaPrimitive,
	path: string
): string | null => {
	if (schema === SchemaType.Any) return null;
	const actualType = typeOfValue(value);
	if (schema !== actualType) {
		return `invalid field '${path}': expected ${schema}, got ${actualType}`;
	}
	return null;
};
