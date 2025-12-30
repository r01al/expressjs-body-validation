export const SchemaType = {
	String: "string",
	Number: "number",
	Boolean: "boolean",
	Object: "object",
	Array: "array",
	Null: "null",
	Any: "any"
} as const;

export type SchemaPrimitive = typeof SchemaType[keyof typeof SchemaType];

export type SchemaFunction = (value: unknown) => boolean;

export type SchemaValue = SchemaPrimitive | SchemaObject | SchemaArray | SchemaFunction;

export type SchemaObject = { [key: string]: SchemaValue };
export type SchemaArray = [SchemaValue] | [];
