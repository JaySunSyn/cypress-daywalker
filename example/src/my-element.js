import {LitElement, html} from '@polymer/lit-element';

/**
 * `my-element` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class MyElement extends LitElement {
    render() {
        return html`
            <div>My custom element</div>
            <div id="jay">My ID custom element</div>
        `;
    }

}

customElements.define('my-element', MyElement);