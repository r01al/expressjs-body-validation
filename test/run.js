const assert = require("assert");

let validateAgainstSchema;
let SchemaType;
try {
	({ validateAgainstSchema, SchemaType } = require("../dist/validator/validateSchema"));
} catch (error) {
	console.error("Build output not found. Run `npm run build` first.");
	process.exit(1);
}

const mustPass = (title, payload, schema) => {
	const error = validateAgainstSchema(payload, schema);
	try {
		assert.strictEqual(error, null);
		console.log(`✅ PASS: ${title}`);
	} catch (err) {
		console.error(`❌ FAIL: ${title}`);
		throw err;
	}
};

const mustFail = (title, payload, schema, messagePart) => {
	const error = validateAgainstSchema(payload, schema);
	try {
		assert.ok(error, "Expected validation to fail");
		if (messagePart) {
			assert.ok(error.includes(messagePart), `Expected message to include '${messagePart}', got '${error}'`);
		}
		console.log(`✅ PASS: ${title}`);
	} catch (err) {
		console.error(`❌ FAIL: ${title}`);
		throw err;
	}
};

mustPass(
	"simple number passes",
	{
		a: 1
	},
	{
		a: SchemaType.Number
	}
);

mustFail(
	"simple number fails",
	{
		a: "1"
	},
	{
		a: SchemaType.Number
	},
	"expected number"
);

mustPass(
	"nested object passes",
	{
		a: {
			b: "ok"
		}
	},
	{
		a: {
			b: SchemaType.String
		}
	}
);

mustFail(
	"nested object missing field",
	{
		a: {}
	},
	{
		a: {
			b: SchemaType.String
		}
	},
	"missing field"
);

mustPass(
	"array of objects passes",
	{
		a: [
			{
				b: 2
			},
			{
				b: 3
			}
		]
	},
	{
		a: [
			{
				b: SchemaType.Number
			}
		]
	}
);

mustFail(
	"array of objects fails",
	{
		a: [
			{
				b: "x"
			}
		]
	},
	{
		a: [
			{
				b: SchemaType.Number
			}
		]
	},
	"expected number"
);

mustPass(
	"custom validator passes",
	{
		score: 10
	},
	{
		score: (value) => typeof value === "number" && value >= 0
	}
);

mustFail(
	"custom validator fails",
	{
		score: -1
	},
	{
		score: (value) => typeof value === "number" && value >= 0
	}
);

mustPass(
	"complex nested object passes",
	{
		user: {
			id: 123,
			profile: {
				name: "Ada",
				email: "ada@example.com"
			}
		},
		settings: {
			theme: "dark",
			notifications: true
		},
		roles: [
			{
				name: "admin",
				level: 5
			},
			{
				name: "editor",
				level: 3
			}
		]
	},
	{
		user: {
			id: SchemaType.Number,
			profile: {
				name: SchemaType.String,
				email: SchemaType.String
			}
		},
		settings: {
			theme: SchemaType.String,
			notifications: SchemaType.Boolean
		},
		roles: [
			{
				name: SchemaType.String,
				level: SchemaType.Number
			}
		]
	}
);

mustFail(
	"complex nested object missing field",
	{
		user: {
			id: 123,
			profile: {
				name: "Ada"
			}
		},
		settings: {
			theme: "dark",
			notifications: true
		},
		roles: [
			{
				name: "admin",
				level: 5
			}
		]
	},
	{
		user: {
			id: SchemaType.Number,
			profile: {
				name: SchemaType.String,
				email: SchemaType.String
			}
		},
		settings: {
			theme: SchemaType.String,
			notifications: SchemaType.Boolean
		},
		roles: [
			{
				name: SchemaType.String,
				level: SchemaType.Number
			}
		]
	},
	"missing field"
);

mustPass(
	"deep array with meta passes",
	{
		order: {
			id: "ORD-1",
			items: [
				{
					sku: "ABC",
					qty: 2,
					meta: {
						fragile: false
					}
				},
				{
					sku: "XYZ",
					qty: 1,
					meta: {
						fragile: true
					}
				}
			]
		}
	},
	{
		order: {
			id: SchemaType.String,
			items: [
				{
					sku: SchemaType.String,
					qty: SchemaType.Number,
					meta: {
						fragile: SchemaType.Boolean
					}
				}
			]
		}
	}
);

mustFail(
	"deep array with meta fails",
	{
		order: {
			id: "ORD-1",
			items: [
				{
					sku: "ABC",
					qty: "2",
					meta: {
						fragile: false
					}
				}
			]
		}
	},
	{
		order: {
			id: SchemaType.String,
			items: [
				{
					sku: SchemaType.String,
					qty: SchemaType.Number,
					meta: {
						fragile: SchemaType.Boolean
					}
				}
			]
		}
	},
	"expected number"
);

mustPass(
	"root array schema passes",
	[
		{
			id: 1
		},
		{
			id: 2
		}
	],
	[
		{
			id: SchemaType.Number
		}
	]
);

mustFail(
	"root array schema fails on item",
	[
		{
			id: 1
		},
		{
			id: "2"
		}
	],
	[
		{
			id: SchemaType.Number
		}
	],
	"expected number"
);

mustPass(
	"body is array of strings passes",
	[
		"one",
		"two",
		"three"
	],
	[
		SchemaType.String
	]
);

mustFail(
	"body is array of strings fails",
	[
		"one",
		2,
		"three"
	],
	[
		SchemaType.String
	],
	"expected string"
);

mustPass(
	"null type passes",
	{
		value: null
	},
	{
		value: SchemaType.Null
	}
);

mustFail(
	"null type fails",
	{
		value: "nope"
	},
	{
		value: SchemaType.Null
	},
	"expected null"
);

mustPass(
	"any type accepts value",
	{
		value: 123
	},
	{
		value: SchemaType.Any
	}
);

mustFail(
	"object type fails on array payload",
	{
		value: []
	},
	{
		value: SchemaType.Object
	},
	"expected object"
);

mustPass(
	"empty array schema accepts any array",
	{
		items: [
			1,
			"two",
			true
		]
	},
	{
		items: []
	}
);

mustFail(
	"payload not object for object schema",
	"not-an-object",
	{
		value: SchemaType.String
	},
	"expected object"
);

mustPass(
	"function override on nested field",
	{
		user: {
			age: 21
		}
	},
	{
		user: {
			age: (value) => typeof value === "number" && value >= 18
		}
	}
);

mustFail(
	"function override on nested field fails",
	{
		user: {
			age: 16
		}
	},
	{
		user: {
			age: (value) => typeof value === "number" && value >= 18
		}
	},
	"invalid field"
);

mustPass(
	"function override on root payload passes",
	{
		id: 10,
		role: "admin"
	},
	(value) => value && typeof value === "object" && value.role === "admin"
);

mustFail(
	"function override on root payload fails",
	{
		id: 10,
		role: "user"
	},
	(value) => value && typeof value === "object" && value.role === "admin"
);

mustPass(
	"function override inside array passes",
	{
		items: [
			{
				id: 1,
				score: 80
			},
			{
				id: 2,
				score: 95
			}
		]
	},
	{
		items: [
			{
				id: SchemaType.Number,
				score: (value) => typeof value === "number" && value >= 70
			}
		]
	}
);

mustFail(
	"function override inside array fails",
	{
		items: [
			{
				id: 1,
				score: 60
			}
		]
	},
	{
		items: [
			{
				id: SchemaType.Number,
				score: (value) => typeof value === "number" && value >= 70
			}
		]
	},
	"invalid field"
);

mustPass(
	"function override for object node passes",
	{
		user: {
			id: 7,
			name: "Zed",
			active: true
		}
	},
	{
		user: (value) =>
			value &&
			typeof value === "object" &&
			value.active === true &&
			typeof value.name === "string"
	}
);

mustFail(
	"function override for object node fails",
	{
		user: {
			id: 7,
			name: "Zed",
			active: false
		}
	},
	{
		user: (value) =>
			value &&
			typeof value === "object" &&
			value.active === true &&
			typeof value.name === "string"
	},
	"invalid field"
);

mustPass(
	"array of arrays passes",
	{
		matrix: [
			[1, 2, 3],
			[4, 5, 6]
		]
	},
	{
		matrix: [
			[
				SchemaType.Number
			]
		]
	}
);

mustFail(
	"array of arrays fails on inner item",
	{
		matrix: [
			[1, 2],
			[3, "4"]
		]
	},
	{
		matrix: [
			[
				SchemaType.Number
			]
		]
	},
	"expected number"
);

mustPass(
	"array of mixed object shapes via function",
	{
		items: [
			{
				type: "A",
				value: 10
			},
			{
				type: "B",
				value: "ok"
			}
		]
	},
	{
		items: [
			(value) =>
				value &&
				typeof value === "object" &&
				((value.type === "A" && typeof value.value === "number") ||
					(value.type === "B" && typeof value.value === "string"))
		]
	}
);

mustFail(
	"array of mixed object shapes via function fails",
	{
		items: [
			{
				type: "A",
				value: 10
			},
			{
				type: "B",
				value: 99
			}
		]
	},
	{
		items: [
			(value) =>
				value &&
				typeof value === "object" &&
				((value.type === "A" && typeof value.value === "number") ||
					(value.type === "B" && typeof value.value === "string"))
		]
	},
	"invalid field"
);

mustFail(
	"invalid schema array length",
	{
		value: [
			1,
			2
		]
	},
	{
		value: [
			SchemaType.Number,
			SchemaType.Number
		]
	},
	"invalid schema"
);

mustFail(
	"invalid schema primitive value",
	{
		value: 1
	},
	{
		value: 123
	},
	"invalid schema"
);

mustFail(
	"function validator throws",
	{
		value: 1
	},
	{
		value: () => {
			throw new Error("boom");
		}
	},
	"boom"
);

console.log("🎉 All tests passed.");
