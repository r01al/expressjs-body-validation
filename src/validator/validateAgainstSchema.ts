import type { SchemaValue } from "./schemaTypes";
import { ensureRootPath } from "./schemaUtils";
import { validateSchemaDefinition } from "./validateSchemaDefinition";
import { validateArray } from "./validators/validateArray";
import { validateFunction } from "./validators/validateFunction";
import { validateObject } from "./validators/validateObject";
import { validatePrimitive } from "./validators/validatePrimitive";

export const validateAgainstSchema = (
	payload: unknown,
	schema: SchemaValue,
	path = ""
): string | null => {
	// Validate schema structure before validating payload.
	const schemaError = validateSchemaDefinition(schema, path);
	if (schemaError) return schemaError;

	if (typeof schema === "function") {
		// Custom validator function decides validity for this path.
		return validateFunction(payload, schema, path);
	}

	if (typeof schema === "string") {
		// Primitive schema type token (e.g. "string", "number", "any").
		return validatePrimitive(payload, schema, ensureRootPath(path));
	}

	if (Array.isArray(schema)) {
		// Array schema: validate payload is array and items against item schema.
		return validateArray(payload, schema, path, validateAgainstSchema);
	}

	// Object schema: validate payload is object and each key against nested schema.
	return validateObject(payload, schema, path, validateAgainstSchema);
};
