---
title: thenBuilder
description: The way to define Then steps in Step Forge
---

The `thenBuilder` is used to define `Then` steps. It uses a builder pattern to define the different parts of the step. The chain is depicted below and we'll cover each part in detail below.

![thenBuilder](../../../assets/builder-chain.svg)

## Properties

### thenBuilder<GivenState, WhenState>

In order to start building a then step, use the `thenBuilder` function. This function takes two generic parameters:

- `GivenState`: the type of your defined Given state
- `WhenState`: the type of your defined When state

If you aren't sure how to define these states, check out the [setting up Cucumber](/docs/guides/setting-up-cucumber) guide.

```typescript
const thenBuilder = thenBuilder<GivenState, WhenState, ThenState>();
```

> **Note**: In Cucumber Given, When, and Then steps are all interchangeable, however, in Step Forge they are not. If you are going to have a step be used in the Then section, it must be defined using the `thenBuilder`.

Chains to:

- [statement](#thenBuilderstatement)

### thenBuilder.statement

```typescript
statement(string);
statement((...args: any[]) => string);
```

The `statement` property defines the text that will match to your Gherkin files. It can take either a string or a function that returns a string. This is required for your step to function.

```typescript
// Example using a string
thenBuilder<GivenState, WhenState, ThenState>().statement(
  "Then my balance should be 900 dollars"
);

// Example using a statement variables
thenBuilder<GivenState, WhenState, ThenState>().statement(
  (amount: number) => `Then my balance should be ${amount} dollars`
);
```

> **Note**: If you are using statement variables that aren't strings, it's important to use parsers to ensure you get the correct type.

Chains to:

- [parsers](#thenBuilderparsers) (optional)
- [dependencies](#thenBuilderdependencies) (optional)
- [step](#thenBuilderstep-required)

### thenBuilder.parsers

```typescript
parsers(parsers: Parser<any>[])
```

Cucumber by default passes in all statement variables as strings. Parsers allow you to convert those strings into strongly typed values in your step definition. Step Forge comes with built in parsers for most common primitive types, but you can also create your own. See the [parsers](/docs/reference/parsers) documentation for more information.

```typescript
// Number example
thenBuilder<GivenState, WhenState, ThenState>()
  .statement((amount: number) => `Then my balance should be ${amount} dollars`)
  .parsers([numberParser]);

// Multiple types example
thenBuilder<GivenState, WhenState, ThenState>()
  .statement(
    (account: string, amount: number) =>
      `Then the ${account} balance should be ${amount} dollars`
  )
  .parsers([stringParser, numberParser]);
```

Chains to:

- [dependencies](#thenBuilderdependencies) (optional)
- [step](#thenBuilderstep-required)

### thenBuilder.dependencies

```typescript
dependencies(state: { given: { [key: string]: 'required' | 'optional' }, when: { [key: string]: 'required' | 'optional' } })
```

Dependencies allow you to inject values from the shared scenario state into your step function. The following rules apply to dependencies:

- In Then steps, dependencies can be from `Given`, `When`, or `Then` state
- Dependencies can only be added on keys in the respective state types
- Required dependencies will cause the step to fail if the value is not found at runtime
- Optional dependencies will not cause the step to fail if the value is not found at runtime
- Optional dependencies are typed as possibly undefined values to the `step` function

```typescript
// Required dependency example
thenBuilder<GivenState, WhenState, ThenState>().dependencies({
  given: {
    account: "required",
  },
  when: {
    transaction: "required",
  },
  then: {
    order: "required",
  },
});

// Optional dependency example
thenBuilder<GivenState, WhenState>().dependencies({
  given: {
    account: "optional",
  },
  when: {
    transaction: "optional",
  },
  then: {
    order: "optional",
  },
});
```

Chains to:

- [step](#thenBuilderstep)

### thenBuilder.step

```typescript
step(step: ({ variables: V, given: G, when: W, then: T }) => void);
```

The `step` property defines the function that will be called when the step is matched. Unlike Given and When steps, Then steps do not return any state - they are used for assertions. We'll break down each part in detail below.

Chains to:

- [register](#thenBuilderregister)

#### Variables (V)

The `variables` parameter is an array containing the exact variables defined in the `statement` function or none if the `statement` function takes no arguments. Additionally, the types of each element in the array will be the output type of their corresponding parser if one was provided, otherwise it will be `string`. Attempting to depend on too many variables, or use it as an incompatible type with result in a TypeScript error.

##### No variables example

When no variables are defined in the `statement` function, the `variables` array will be typed as an empty array. It is not required to destructure the `variables` parameter in this case, but attempting to access it will result in a TypeScript error.

```typescript
thenBuilder<GivenState, WhenState>()
  .statement(`Then my order should be complete`)
  .step(({ variables: [] }) => {
    expect(orderStatus).toBe("complete");
  });
```

##### Number example

```typescript
thenBuilder<GivenState, WhenState>()
  .statement((amount: number) => `Then my balance should be ${amount} dollars`)
  .parsers([numberParser])
  // The type of amount will be number, due to the numberParser
  // The length of the variables array will be typed as strictly 1 due to the statement function only taking a single argument
  .step(({ variables: [amount], when: { balance } }) => {
    expect(balance).toBe(amount);
  });
```

#### Given (G)

The `given` parameter is an object containing the keys from the `dependencies.given` object typed based on the `GivenState` type. If no dependencies are defined, the `given` object will be empty.

```typescript
interface GivenState {
  account: {
    initialBalance: number;
  };
}

thenBuilder<GivenState, WhenState>()
  .dependencies({
    given: {
      account: "required",
    },
  })
  .step(({ given: { account } }) => {
    expect(account.initialBalance).toBeGreaterThan(0);
  });
```

#### When (W)

The `when` parameter is an object containing the keys from the `dependencies.when` object typed based on the `WhenState` type. This allows Then steps to make assertions about the state produced by When steps.

```typescript
interface WhenState {
  transaction: {
    status: string;
    amount: number;
  };
}

thenBuilder<GivenState, WhenState>()
  .dependencies({
    when: {
      transaction: "required",
    },
  })
  .step(({ when: { transaction } }) => {
    expect(transaction.status).toBe("complete");
    expect(transaction.amount).toBeGreaterThan(0);
  });
```

#### Then (T)

The `then` parameter is an object containing the keys from the `dependencies.then` object typed based on the `ThenState` type. This allows Then steps to make assertions about the state produced by Then steps.

```typescript
interface ThenState {
  order: {
    status: string;
  };
}

thenBuilder<GivenState, WhenState, ThenState>()
  .dependencies({
    then: {
      order: "required",
    },
  })
  .step(({ then: { order } }) => {
    expect(order.status).toBe("complete");
  });
```

#### Return value

The value returned from the `step` function will be merged into the `Then` state of the current scenario.

> **Note**: It is common for Then steps to only assert and not return anything.

```typescript
// Example of asserting without returning anything
thenBuilder<GivenState, WhenState, ThenState>()
  .statement(`my order should be complete`)
  .dependencies({
    when: {
      order: "required",
    },
  })
  .step(({ when: { order } }) => {
    expect(order.status).toBe("complete");
  });
```

```typescript
// Example of adding to Then state
thenBuilder<GivenState, WhenState, ThenState>()
  .statement(`When I process the payment`)
  .step(() => {
    return {
      payment: {
        status: "processed",
        timestamp: new Date(),
      },
    };
  });
```

### thenBuilder.register

The `register` function registers this step with Cucumber so that it will understand how to execute it. This is not required when using the Step Forge runner, but is required when using Cucumber's native runner.
