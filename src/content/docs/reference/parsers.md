---
title: parsers
description: How to strongly type your statement variables
---

By default, Cucumber provides all statement variables as strings. Step Forge wants to be able to provide a strongly typed developer experience, however, and parsers are the way to do this.

The `parsers` function can be chained off the `statement` function from any of the builder functions. It requires you to provide a `parser` for each variable in the statement. If you explicitly type your statement variables, it will require you to provide compatible parsers.

```typescript
whenBuilder<GivenState, WhenState>()
  .statement((amount: number) => `When I withdraw ${amount} dollars`)
  // Requires exactly 1 parser, and that parser must be able to convert a string to the type number
  .parsers([numberParser]);
```

If you don't provide parsers then your variables will be typed as `string` in your step, regardless of what you defined in the `statement` function.

```typescript
whenBuilder<GivenState, WhenState>()
  .statement((amount: number) => `When I withdraw ${amount} dollars`)
  .step(({ variables: [amount] }) => {
    // amount is typed as string here, regardless of what you defined in the statement function because no parsers were provided
  });
```

## Available Parsers

Step Forge comes with a number of built-in parsers for common primitive types.

- `numberParser`: Parses a string to a number
- `intParser`: Parses a string to an integer
- `booleanParser`: Parses a string to a boolean
- `stringParser`: Parses a string to a string

Example of using the `numberParser`:

```typescript
import { numberParser } from "@step-forge/step-forge";

whenBuilder<GivenState, WhenState>()
  .statement((amount: number) => `When I withdraw ${amount} dollars`)
  .parsers([numberParser])
  .step(({ variables: [amount] }) => {
    // amount is typed as number here because we provided the numberParser
  });
```

## Custom Parsers

You can easily create your owner parsers, the only requirement is that they implement the `Parser` interface.

```typescript
interface Parser<T> {
  parse(value: string): T;
  gherkin: string;
}
```

### Parser.parse

The `parse` method is used to convert a string to the desired type.

```typescript
// Implementing a customer int parser
const myParser: Parser<number> = {
  parse: (value: string) => parseInt(value),
  gherkin: "{int}",
};
```

### Parser.gherkin

The `gherkin` property is used to determine the syntax that should be used when converting the statement to Cucumber's custom matching syntax. The vast majority of custom parsers will use the value `{string}` since Cucumber only supports a few native types.

```typescript
// Implementing a custom json parser
const myCustomParser: Parser<MyCustomType> = {
  parse: (value: string) => JSON.parse(value),
  gherkin: "{string}",
};
```

### Using a custom parser

```typescript
const myCustomType = {
  name: string;
  age: number;
};

const myCustomParser: Parser<MyCustomType> = {
  parse: (value: string) => JSON.parse(value),
  gherkin: "{string}",
};

whenBuilder<GivenState, WhenState>()
  .statement(
    (json: MyCustomType) =>
      `When I send the following JSON: ${JSON.stringify(json)}`
  )
  .parsers([myCustomParser])
  .step(({ variables: [json] }) => {
    // json is typed as MyCustomType here because we provided the myCustomParser
  });
```

## Downstream Impacts

The generic value of your parser (`MyCustomType` in the example above) will be used to type the variables in your step function.
