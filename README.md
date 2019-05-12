# Cypress Daywalker
[![Gitter](https://img.shields.io/gitter/room/DAVFoundation/DAV-Contributors.svg?style=flat-square)](https://gitter.im/cypress-daywalker)

Use Cypress Daywalker to test your web components (Polymer, lit-html, ...) app.

Please star this repo if you use this plugin. This helps me to understand how many people it is useful for and motivates me to continue improving it.

## Installation

### 1. Install the dependency
Add the plugin to your `devDependencies`

```bash
npm install -D cypress-daywalker
```
### 2. Add daywalker commands
At the top of **`cypress/support/commands.js`**:
```js
import 'cypress-daywalker/commands'
```

### 3. Add the Daywalker script
You need to inject `cypress-daywalker.js` into your application's entrypoint. This can happen by manually or dynamically adding a script tag to your entrypoint file. (If you test a built app, don't forget to add 'node_modules/cypress-daywalker/cypress-daywalker.js' as an extra dependency.)

#### Via a static script tag
This is the easiest way: At the top of your entrypoint file e.g. **`index.html`** add the following script tag.

```html
  <!-- Eventually adjust the path to your node modules -->
  <script src="./node_modules/cypress-daywalker/cypress-daywalker.js"></script>
```

#### Via a dynamic script tag
You might want to avoid that the script tag ends up in a production environment. Therefore, you can inject the script tag into your document before any other javascript gets executed by listening to the `window:before:load` event.

```javascript
context('Default', () => {
  before(() => {

    // INJECT THE SCRIPT LIKE THIS:
    cy.on('window:before:load', (w) => {
      const script = w.document.createElement('script');
      
      // Eventually adjust the path to your node modules
      script.src = '/node_modules/cypress-daywalker/cypress-daywalker.js';
      
      // // If you cannot reach your node_modules folder easily (e.g. in a Java application), try to load it via a cdn.
      // script.src = 'https://cdn.jsdelivr.net/gh/jaysunsyn/cypress-daywalker@0.1.1/cypress-daywalker.js';
      
      
      w.document.querySelector('head').appendChild(script);
    });

    cy.visit('http://localhost:3000/');
  });
  it('input gets filled', () => {
    // Test stuff
  });
});
```

## Usage
Find an [example here](https://github.com/JaySunSyn/cypress-daywalker/blob/master/example/).

Not all CSS selectors are supported yet, so do not use it as you would use jQuery or the usual querySelector command. Please create issues of use cases where you would like better querying functionalities. For the apps this plugin was developed for, the current functionalities worked pretty well.

### Query
By default, `cy.get` returns the first found node. If you want it to return any other one, there are two options: 

*nth*
1. `cy.get('my-element', {nth: 2})`
2. `cy.get(paper-input:nth(3) input')`

If you want to retrieve all results, add the `all`  flag like this `cy.get('my-element', {all: true})`.

#### By Tag

This works very well.

```js
cy.get('paper-button')
```

#### By ID

This works very well.

```js
cy.get('#submit')
cy.get('paper-button#submit')
```

#### By Class

Find custom elements everywhere in the app or *native elements at root level*.

```js
cy.get('.foo')
cy.get('.foo.moo')
```

#### By Direct Parent

```html
<div class="find-me">
  <paper-button></paper-button>
</div>
<paper-button></paper-button>
```

```js
cy.get('.find-me > paper-button')
```

#### By path

Starting from the root level:

```js
cy.get('div my-element paper-input#important')
```

or starting from any custom element:

```js
cy.get('my-element div#jay')
```

Starting a path with a native element which is inside a shadow root is not supported.

### Lazy loaded components
If you lazy load some components, you can, for example, add a `.wait(500)` to your `.visit()` command to wait for them to get available.

### Commands
Not all cypress commands can be used yet. For some, there are replacements below.

#### Click

Instead of `.click()` use:

```js
cy.get('paper-button').dispatch('click') // Results in Event('click')
cy.get('paper-button').dispatch(new MouseEvent('click')) // Or pass in any other event
```

#### Type

Instead of `.type('Hello world')` use:

```js
cy.get('paper-input').setProp('moto moto') // Results in the value property gets set
cy.get('paper-input').setProp('Question', 'label') // Or specify the property name
```

#### Invoke

Instead of `.invoke()` use:

```js
cy.get('my-el').call('close')
```

# Contributors
- [Antonio Maria Calabretta](https://github.com/amcalabretta)
