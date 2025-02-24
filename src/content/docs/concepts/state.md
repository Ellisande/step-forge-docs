---
title: State and World
description: Learn about Step Forge's opinionated approach to state management
---

Step Forge has a strict and opinionated approach to scenario state. Cucumber allows all steps to freely access and modify the scenario state (through what it called the `World` object). Step Forge takes a different approach.

## State Fundamentals

- State is divided into three distinct categories: `Given`, `When`, and `Then`.
- Each category has it's own state object that is immutable and typed.
- State can only be modified by the return value of a `step` function.
- State can only be accessed by allowed steps with the proper dependencies declared.

![State Division](../../../assets/state-access.svg)

## State Division

Scenario state is divided into parts to help avoid some common pitfalls of BDD testing. Specifically, with totally open and mutable state it can be easy to make changes that have side effects on other parts of the scenario. Similarly, it can be easy to use a value believing that it's a result, only to find out that it is part of the scenario setup and the assertion does nothing.

By splitting the state into parts the step itself becomes declarative about the kind of value it is expecting. Additionally, but restricting access to later parts of state, we ensure that data can't end up in the wrong place.
