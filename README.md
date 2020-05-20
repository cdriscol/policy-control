# policy-control ![CI](https://github.com/cdriscol/policy-control/workflows/CI/badge.svg?branch=master) [![codecov](https://codecov.io/gh/cdriscol/policy-control/branch/master/graph/badge.svg)](https://codecov.io/gh/cdriscol/policy-control)
<!-- TODO -->
**policy-control** helps you _decide_ if a _user_ is authorized to _act_ on a _resource_. No assumptions are made about your data or how you make authorization decisions. With **policy-control** policies, you are in full control of how your application makes authroizations decisions. Policies allow you to choose what _action_, _resource_, _data_, and _rules_ you need to make a decision and the rest is taken care of.

<!-- TODO -->
## Getting started
```bash
$ yarn add policy-control
```

## Core concepts
<!-- TODO -->
### User
A user making the request.
### Resource
A resource the user is acting on.
### Action
The action the user is taking on the resource.
### Policies
A **policy** can be defined for specific **resources** and **actions** and when evaluated will process **rules** to determine whether an action is allowed.
### Rules
A **rule** can **load** data and evaluates to a boolean response. 
### Loaders
A **loader** will load data into the decision **context** which can be used to help evaluate **rules**.
### Context
**Context** refers to the data store for our **loaders** to use. **Context** can also be primed and cleared as needed.
### Decider
A **decider** can evaluate and reduce a set of **policies** to an **authorization decision**.
### Authorization Decision
An **authorization decision** returns a permission response (Allow, Deny, Indeterminate).

## Decision Flow
<!-- TODO -->
Each authorization decision follows the same flow and can be demonstrated by a simple authorized GET request:
1. Alice does GET on /post/123.
1. API receives call and authenticates Alice.
1. API asks policy control for a decision, _Is Alice authorized to read post 123?_
1. Policy Control finds and applies any policies for reading posts.
1. Each policy loads necessary attributes, evaluates rules, and returns a decision.
1. Policy decisions are reduced to a final authorization decision (e.g. Allow, Deny, Indeterminate)
1. If decision is Allow the request is continued, otherwise an authorization error (401) is thrown.

## Examples (WIP)
Below are several examples intended to help you see how **policy-control** can be used in your project:

- [Basic usage](#)
- [Role based access control (RBAC)](#)
- [Attribute based access control (ABAC)](#)

<!-- TODO -->
## Core features (WIP)
- Flexible policies
- Simple API - no "extras"
- Effecient data fetching
- Very lightweight
- Extensible
- TypeScript support
- User/Resource/Action policies
- Async data loading built-in
