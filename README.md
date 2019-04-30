# Cypress Daywalker

[![Gitter](https://img.shields.io/gitter/room/DAVFoundation/DAV-Contributors.svg?style=flat-square)](https://gitter.im/cypress-daywalker)

## Installation

Add the plugin to `devDependencies`
```bash
npm install -D cypress-daywalker
```

At the top of **`cypress/support/commands.js`**:
```js
import 'cypress-daywalker/commands'
```

## Usage

### Include the daywalker script

**Include the daywalker script automatically:**

The daywalker script gets injected when visiting a page via `cy.visit()`.

If you do not use `cy.visit`, add the script manually.

**Include the daywalker script manually:**

either via a) At the top of your entrypoint e.g. **`index.html`** add following script tag
```html
    <script src="./node_modules/cypress-daywalker/cypress-daywalker.js"></script>
```
or via b) Dynamically add the daywalker script before each test

```javascript
context('Default', () => {
  before(() => {
    cy.on('window:before:load', (w) => {
      const script = w.document.createElement('script');
      script.src = '/node_modules/cypress-daywalker/cypress-daywalker.js';
      w.document.querySelector('head').appendChild(script);
    });
    cy.visit('http://localhost:3000/');
  });
  it('input gets filled', () => {
    ...
  });
});
```

[Example](https://github.com/JaySunSyn/cypress-daywalker/blob/master/example/cypress/integration/example.spec.js)

### Custom commands

#### Click

Instead of `.click()` use:

```js
cy.get('paper-button').dispatch('click')
cy.get('paper-button').dispatch(new MouseEvent('click'))
```

#### Type

Instead of `.type('Hello world')` use:

```js
cy.get('paper-input').setProp('moto moto')
cy.get('paper-input').setProp('Question', 'label')
```

#### Invoke

Instead of `.invoke()` use:

```js
cy.get('my-el').call('close')
```
