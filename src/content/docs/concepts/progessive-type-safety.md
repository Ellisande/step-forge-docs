---
title: Progressive Type Safety
description: Learn about Step Forge's progressive type safety
---

As you describe your step implementation through your builder, each time you tell Step Forge more about your step it refines the types internally so that your actual step code has argument types that exactly match what you've described.

This provides great compile time checks against mistakes, particularly for complex steps. Even better though, it allows Step Forge to do some really cool static analysis of your scenarios.

### How it works

Let's look at a fairly complex step implementation and break down the typing.

```typescript
thenBuilder<GivenState, WhenState, ThenState>()
  .statement(
    (amount: number, currency: string) =>
      `I have ${amount} ${currency} in my bank account`
  )
  .parsers([numberParser, stringParser])
  .dependencies({
    when: {
      account: "required",
    },
  })
  // Variables are typed as `[amount: number, currency: string]` an exactly two element array that matches the order of the parsers and statement variables
  // The `when` dependency is typed as `{ account: Account }` you only have access to the single piece of state you've declared
  .step(({ variables: [amount, currency], when: { account } }) => {
    const balance = account.balance;
    expect(balance.amount).toBe(amount);
    expect(balance.currency).toBe(currency);
  });
```
