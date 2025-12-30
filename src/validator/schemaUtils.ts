import { SchemaType } from "./schemaTypes";
import type { SchemaPrimitive } from "./schemaTypes";

export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const typeOfValue = (value: unknown): SchemaPrimitive => {
	if (value === null) return SchemaType.Null;
	if (Array.isArray(value)) return SchemaType.Array;
	if (typeof value === "string") return SchemaType.String;
	if (typeof value === "number" && !Number.isNaN(value)) return SchemaType.Number;
	if (typeof value === "boolean") return SchemaType.Boolean;
	if (isPlainObject(value)) return SchemaType.Object;
	return SchemaType.Any;
};

export const formatPath = (path: string, key: string | number): string => {
	if (typeof key === "number") return `${path}[${key}]`;
	return path ? `${path}.${key}` : key;
};

export const ensureRootPath = (path: string): string => (path ? path : "payload");
