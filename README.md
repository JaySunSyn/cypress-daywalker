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