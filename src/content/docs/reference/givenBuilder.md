---
title: givenBuilder
description: The way to define Given steps in Step Forge
---

The `givenBuilder` is used to define `Given` steps. It uses a builder pattern to define the different parts of the step. The chain is depicted below and we'll cover each part in detail below.

![givenBuilder](../../../assets/builder-chain.svg)

## Properties

### givenBuilder<GivenState>

In order to start building a given step, use the `givenBuilder` function. This function takes a generic parameter `GivenState` which should be the type of your defined Given state. If you aren't sure how to define given state check out the [setting up Cucumber](/docs/guides/setting-up-cucumber) guide.

```typescript
const givenBuilder = givenBuilder<GivenState>();
```

> **Note**: In Cucumber Given, When, and Then steps are all interchangeable, however, in Step Forge they are not. If you are going to have a step be used in the Given section, it must be defined using the `givenBuilder`.

Chains to:

- [statement](#givenBuilderstatement)

### givenBuilder.statement

```typescript
statement(string);
statement((...args: any[]) => string);
```

The `statement` property defines the text that will match to your Gherkin files. It can take either a string or a function that returns a string. This is required for your step to function.

```typescript
// Example using a string
givenBuilder<GivenState>().statement("Given I have 1000 dollars in my account");

// Example using a statement variables
givenBuilder<GivenState>().statement(
  (amount: number) => `Given I have ${amount} dollars in my account`
);
```

> **Note**: If you are using statement variables that aren't strings, it's important to use parsers to ensure you get the correct type.

Chains to:

- [parsers](#givenBuilderparsers) (optional)
- [dependencies](#givenBuilderdependencies) (optional)
- [step](#givenBuilderstep-required)

### givenBuilder.parsers

```typescript
parsers(parsers: Parser<any>[])
```

Cucumber by default passes in all statement variables as strings. Parsers allow you to convert those strings into strongly typed values in your step definition. Step Forge comes with built in parsers for most common primitive types, but you can also create your own. See the [parsers](/docs/reference/parsers) documentation for more information.

When using the `parsers` function you are required to pass in the exact same number of parsers as there are statement variables. Additionally, if you declared explicit types for your statement variables, you will be required to pass in parsers that can convert to that type.

```typescript
// Number example
givenBuilder<GivenState>()
  .statement((amount: number) => `Given I have ${amount} dollars in my account`)
  .parsers([numberParser]);

// Int example, since TS has no strict int type, this returns a number that has been rounded to the nearest integer
givenBuilder<GivenState>()
  .statement((amount: number) => `Given I have ${amount} dollars in my account`)
  .parsers([intParser]);

// String example
givenBuilder<GivenState>()
  // No Parser is needed since string is the default type
  .statement((name: string) => `Given I have a user named ${name}`);

// Mix of types
givenBuilder<GivenState>()
  .statement(
    (name: string, amount: number) =>
      `Given I have ${amount} dollars in my account`
  )
  // You must explicitly pass in the string parser, since we need to customize the amount type
  .parsers([stringParser, numberParser]);
```

Chains to:

- [dependencies](#givenBuilderdependencies) (optional)
- [step](#givenBuilderstep-required)

### givenBuilder.dependencies

```typescript
dependencies(state: { given: { [key: string]: 'required' | 'optional' } })
```

Dependencies allow you to inject values from the shared scenario state into your step function. The following rules apply to dependencies:

- In Given steps, dependencies can only be from the `Given` state
- Dependencies can only be added on keys in the `Given` state type
- Required dependencies will cause the step to fail if the value is not found at runtime
- Optional dependencies will not cause the step to fail if the value is not found at runtime
- Optional dependencies are typed as possibly undefined values to the `step` function
- The `step` function only has access to values from state that are declared as dependencies

```typescript
// Required dependency example
givenBuilder<GivenState>().dependencies({
  given: {
    user: "required",
  },
});

// Optional dependency example
givenBuilder<GivenState>().dependencies({
  given: {
    user: "optional",
  },
});
```

Chains to:

- [step](#givenBuilderstep)

### givenBuilder.step

```typescript
step(step: ({ variables: V, given: G}) => Partial<GivenState>);
```

The `step` property defines the function that will be called when the step is matched. It has the most complicated behavior of all the builder functions, so we'll break down each part in detail below.

Chains to:

- [register](#givenBuilderregister)

#### Variables (V)

The `variables` parameter is an array containing the exact variables defined in the `statement` function or none if the `statement` function takes no arguments. Additionally, the types of each element in the array will be the output type of their corresponding parser if one was provided, otherwise it will be `string`. Attempting to depend on too many variables, or use it as an incompatible type with result in a TypeScript error.

##### No variables example

When no variables are defined in the `statement` function, the `variables` array will be typed as an empty array. It is not required to destructure the `variables` parameter in this case, but attempting to access it will result in a TypeScript error.

```typescript
givenBuilder<GivenState>()
  .statement(`Given I have 1000 dollars in my account`)
  .step(({ variables: [] }) => {
    return {
      valid: true,
    };
  });
```

##### Number example

```typescript
givenBuilder<GivenState>()
  .statement((amount: number) => `Given I have ${amount} dollars in my account`)
  .parsers([numberParser])
  // The type of amount will be number, due to the numberParser
  // The length of the variables array will be typed as strictly 1 due to the statement function only taking a single argument
  .step(({ variables: [amount] }) => {
    return {
      amount,
    };
  });
```

##### Multiple variables example

```typescript
givenBuilder<GivenState>()
  .statement(
    (name: string, amount: number) =>
      `Given I have ${amount} dollars in my account`
  )
  .parsers([stringParser, numberParser])
  // The type of name will be string, due to the stringParser
  // The type of amount will be number, due to the numberParser
  // The length of the variables array will be typed as strictly 2 due to the statement function taking two arguments
  .step(({ variables: [name, amount] }) => {
    return {
      name,
      amount,
    };
  });
```

#### Given (G)

The `given` parameter is an object containing the keys from the `dependencies.given` object typed based on the `GivenState` type. If no dependencies are defined, the `given` object will be empty.

##### No dependencies example

When no dependencies are defined, the `given` object will be empty. Attempting to access any key will result in a TypeScript error.

```typescript
givenBuilder<GivenState>()
  .dependencies({
    given: {},
  })
  .step(({ given }) => {
    return {
      valid: true,
    };
  });
```

##### Required dependency example

In this example we have a `GivenState` type that has a `user` property. Our step requires the `user` property to be defined to succeed, so we declare a required dependency on it. If the `user` property is not defined at runtime, the step will fail.

```typescript
interface GivenState {
  user: {
    name: string;
  };
}

givenBuilder<GivenState>()
  .dependencies({
    given: {
      user: "required",
    },
  })
  // given.user will be typed as { name: string } since that is how its defined in the GivenState type
  // If given.user is not defined at runtime, the step will fail
  .step(({ given: { user } }) => {
    return {
      user,
    };
  });
```

##### Optional dependency example

In this example we have a `GivenState` type that has a `user` property. Our step does not require the `user` property to be defined to succeed, so we declare an optional dependency on it. If the `user` property is not defined at runtime, it will be `undefined` in the `given` object.

```typescript
interface GivenState {
  user: {
    name: string;
  };
}

givenBuilder<GivenState>()
  .dependencies({
    given: {
      user: "optional",
    },
  })
  // given.user will be typed as { name: string } | undefined since it is optional
  .step(({ given: { user } }) => {
    const defaultUser = user ?? { name: "John Doe" };
    return {
      user: defaultUser,
    };
  });
```

#### Return Value

The value returned from the `step` function will be merged into the `Given` state of the current scenario.

```typescript
givenBuilder<GivenState>()
  .statement(`Given I have 1000 dollars in my account`)
  .step(() => {
    return { amount: 1000 };
  });
```

In this example, the `amount` property will be merged into the `Given` state of the current scenario. Assuming this was the first step in the scenario the scenario state would now be `{ given: { amount: 1000 } }` and is now available to any subsequent steps in the scenario.

### givenBuilder.register

```typescript
register();
```

The `register` function registers this step with Cucumber so that it will understand how to execute it. This is not required when using the Step Forge runner, but is required when using Cucumber's native runner.
