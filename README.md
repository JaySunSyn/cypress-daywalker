### Installation

Add the plugin to `devDependencies`
```bash
npm install -D cypress-daywalker
```

At the top of **`cypress/support/commands.js`**:
```js
import 'cypress-daywalker/commands'
```

At the top of your endtrypoint e.g. **`index.html`**:
```html
    <script src="./node_modules/cypress-daywalker/cypress-daywalker.js"></script>
```

### Use
[Example](https://github.com/JaySunSyn/cypress-daywalker/blob/master/example/cypress/integration/example.spec.js)

Some custom commands:

```js
cy.get('my-el').call('close')
cy.get('my-el').dispatch('click')
cy.get('paper-input').setProp('Hello how are you?')
cy.get('paper-input').setProp('Question', 'label')
```
