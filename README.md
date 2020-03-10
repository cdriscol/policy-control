# policy-control ![CI](https://github.com/cdriscol/policy-control/workflows/CI/badge.svg?branch=master)
<!-- TODO -->
**policy-control** helps you _decide_ if a _user_ can _act_ on a _resource_. No assumptions are made about your data or how you authorize. You are in full control of how your application makes authorization decisions. With **policy-control** policies, you choose what _action_, _resource_, _data_, and _rules_ you need to make a decision and the rest is taken care of.

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
### Decider
A **decider** can evaluate and reduce a set of **policies** to an authorization response (Allow, Deny, Indeterminate).
### Policies
A **policy** can be defined for specific **resources** and **actions** and when evaluated will process **rules** to determine whether an action is allowed.
### Rules
A **rule** can **load** data and evaluates to a boolean response. 
### Loaders
A **loader** will load data into the authorization **context** which can be used to help evaluate **rules**.
### Context
**Context** refers to the data store for our **loaders** to use. **Context** can also be primed and cleared as needed.

<!-- TODO -->
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
