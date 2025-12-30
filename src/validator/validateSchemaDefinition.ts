import type { SchemaArray, SchemaObject, SchemaValue } from "./schemaTypes";
import { SchemaType } from "./schemaTypes";
import { ensureRootPath, formatPath, isPlainObject } from "./schemaUtils";

const schemaTypeValues = new Set(Object.values(SchemaType));

// Returns true when schema value is a supported primitive type token.
const isSchemaPrimitive = (value: unknown): value is string => {
	return typeof value === "string" && schemaTypeValues.has(value as any);
};

// Ensures array schemas are empty (accept any item) or single-item (item schema).
const validateArraySchema = (schema: SchemaArray, path: string): string | null => {
	if (schema.length > 1) {
		return `invalid schema at '${ensureRootPath(path)}': array schema must have 0 or 1 item`;
	}
	if (schema.length === 0) return null;
	return validateSchemaDefinition(schema[0], formatPath(ensureRootPath(path), 0));
};

// Walks object schemas and validates each nested schema value.
const validateObjectSchema = (schema: SchemaObject, path: string): string | null => {
	for (const key of Object.keys(schema)) {
		const error = validateSchemaDefinition(schema[key], formatPath(ensureRootPath(path), key));
		if (error) return error;
	}
	return null;
};

// Validates that a schema definition is composed of supported primitives, arrays, objects, or functions.
export const validateSchemaDefinition = (schema: SchemaValue, path = ""): string | null => {
	if (typeof schema === "function") return null;

	if (isSchemaPrimitive(schema)) return null;

	if (Array.isArray(schema)) {
		return validateArraySchema(schema, path);
	}

	if (isPlainObject(schema)) {
		return validateObjectSchema(schema, path);
	}

	return `invalid schema at '${ensureRootPath(path)}': unsupported schema type`;
};
