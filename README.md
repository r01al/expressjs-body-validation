# express-body-validation ✅

Lightweight Express middleware for validating `req.body` against a schema.

## Install 📦

```bash
npm install @r01al/express-body-validation
```

## Usage 🚀

```ts
import express from "express";
import { SchemaType, validateBody } from "@r01al/express-body-validation";

const app = express();
app.use(express.json());

app.post(
	"/users",
	validateBody({
		name: SchemaType.String,
		age: SchemaType.Number,
		address: {
			city: SchemaType.String
		},
		tags: [SchemaType.String],
		score: (value) => typeof value === "number" && value >= 0
	}),
	(req, res) => {
		res.json({ ok: true });
	}
);
```

## API 📚

### validateBody(schema)

Returns an Express middleware that validates `req.body`.

- `schema`: `SchemaValue`

### SchemaType

Use these constants instead of raw strings:

- `SchemaType.String`
- `SchemaType.Number`
- `SchemaType.Boolean`
- `SchemaType.Object`
- `SchemaType.Array`
- `SchemaType.Null`
- `SchemaType.Any`

### SchemaValue

```ts
import type { SchemaValue } from "@r01al/express-body-validation";

const schema: SchemaValue = {
	name: SchemaType.String,
	age: SchemaType.Number
};
```

Supported shapes:

- **Primitives**: `SchemaType.*`
- **Objects**: `{ user: { id: SchemaType.Number } }`
- **Arrays**: `[SchemaType.String]` or `[{ id: SchemaType.Number }]`
- **Functions**: `(value) => boolean` to fully override validation at that node

Schema is validated before use. Invalid schemas return an error message instead of throwing.

## Examples ✨

### Array body

```ts
app.post(
	"/tags",
	validateBody([
		SchemaType.String
	]),
	(req, res) => {
		res.json({ ok: true });
	}
);
```

### Nested object + arrays

```ts
validateBody({
	order: {
		id: SchemaType.String,
		items: [
			{
				sku: SchemaType.String,
				qty: SchemaType.Number
			}
		]
	}
});
```

### Function override

```ts
validateBody({
	password: (value) => typeof value === "string" && value.length >= 8
});
```

#### Function validator details

- The function receives the **raw value** at that schema node.
- Return `true` to accept, `false` to reject.
- If the function throws, the error is caught and returned as a validation message.

Example with custom error message:

```ts
validateBody({
	age: (value) => {
		if (typeof value !== "number") {
			throw new Error("age must be a number");
		}
		return value >= 18;
	}
});
```

## Errors ⚠️

If validation fails, the middleware responds with HTTP 400:

```json
{ "message": "missing field 'payload.user.name'" }
```

or

```json
{ "message": "invalid field 'payload.age': expected number, got string" }
```

## Build 🛠️

```bash
npm run build
```

## Test 🧪

```bash
npm test
```

## Node Support 🟢

- Node `>=14` (see `package.json` engines)

## License 📝

ISC
