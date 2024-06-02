# node-email-validation
A email validation package for NodeJS. A simple module to validate an e-mail address.

[![travis build](https://travis-ci.org/manavshrivastavagit/node-email-validation.svg?branch=master&style=flat-square)](https://travis-ci.org/manavshrivastavagit/node-email-validation.svg?branch=master)
[![version](https://img.shields.io/npm/v/node-email-validation.svg?style=flat-square)]((http://npm.im/node-email-validation))
[![size](https://img.shields.io/github/languages/code-size/manavshrivastavagit/node-email-validation)](https://img.shields.io/github/languages/code-size/manavshrivastavagit/node-email-validation)
[![node](https://img.shields.io/node/v/node-email-validation?style=flat-square)](https://img.shields.io/node/v/node-email-validation?style=flat-square)

## Installation
Install via NPM:

```bash
npm install node-email-validation

```

## Usage

#### javascript

```javascript

var validator = require("node-email-validation");

validator.is_email_valid("test@email.com"); // true

```

#### TypeScript

```typescript

import * as EmailValidator from 'node-email-validation';

EmailValidator.is_email_valid("test@email.com"); // true


```

Yes, it's really all you need to get started as you can see in this live and interactive demo:

[![Edit Button](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/recursing-dubinsky-vszmz)

## Questions

For *how-to* questions and other non-issues,
please use [StackOverflow](https://stackoverflow.com/search?q=node-email-validation) instead of Github issues.
There is a StackOverflow tag called "node-email-validation" that you can use to tag your questions.



## Contributing

We'd greatly appreciate any [contribution](/CONTRIBUTING.md) you make. :)


## License

This project is licensed under the terms of the
[MIT license](/LICENSE).


