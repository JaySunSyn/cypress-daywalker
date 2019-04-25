### Installation

Add the plugin to `devDependencies`
```bash
npm install -D cypress-daywalker
```

At the top of **`cypress/support/commands.js`**:
```js
import 'cypress-daywalker/commands'
```

**Include the daywalker script:**

either via a) At the top of your entrypoint e.g. **`index.html`**:
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

### Use
[Example](https://github.com/JaySunSyn/cypress-daywalker/blob/master/example/cypress/integration/example.spec.js)

Some custom commands:

```js
cy.get('my-el').call('close')

cy.get('paper-button').dispatch('click')
cy.get('paper-button').dispatch(new MouseEvent('click'))

cy.get('paper-input').setProp('moto moto')
cy.get('paper-input').setProp('Question', 'label')
```
