import type { SchemaValue } from "./schemaTypes";
import { ensureRootPath } from "./schemaUtils";
import { validateArray } from "./validators/validateArray";
import { validateFunction } from "./validators/validateFunction";
import { validateObject } from "./validators/validateObject";
import { validatePrimitive } from "./validators/validatePrimitive";

export const validateAgainstSchema = (
	payload: unknown,
	schema: SchemaValue,
	path = ""
): string | null => {
	if (typeof schema === "function") {
		return validateFunction(payload, schema, path);
	}

	if (typeof schema === "string") {
		return validatePrimitive(payload, schema, ensureRootPath(path));
	}

	if (Array.isArray(schema)) {
		return validateArray(payload, schema, path, validateAgainstSchema);
	}

	return validateObject(payload, schema, path, validateAgainstSchema);
};
