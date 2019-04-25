# Cypress Daywalker

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
[Example](https://github.com/JaySunSyn/cypress-daywalker/blob/master/example/cypress/integration/example.spec.js)

Some custom commands:

```js
cy.get('my-el').call('close')

cy.get('paper-button').dispatch('click')
cy.get('paper-button').dispatch(new MouseEvent('click'))

cy.get('paper-input').setProp('moto moto')
cy.get('paper-input').setProp('Question', 'label')
```
