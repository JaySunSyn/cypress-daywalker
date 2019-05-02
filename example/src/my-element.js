import {LitElement, html} from '@polymer/lit-element';
import '@polymer/paper-button';
import '@polymer/paper-input/paper-input';

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
                <paper-input label="Label"></paper-input>
            </div>
            <paper-input id="important" label="VIP"></paper-input>
            <div class="foo moo">Milk</div>
        `;
    }

    _onclick() {
        alert('Hello');
    }

}

customElements.define('my-element', MyElement);