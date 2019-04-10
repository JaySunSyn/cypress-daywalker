import {LitElement, html} from '@polymer/lit-element';
import '@polymer/paper-button';
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
            <div>
                <paper-button class="click" @click=${this._onclick}>
                    <span class="label">Click</span>
                </paper-button>
            </div>
        `;
    }

    _onclick() {
        alert('Hello');
    }

}

customElements.define('my-element', MyElement);