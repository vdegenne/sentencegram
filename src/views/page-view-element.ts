import { LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('page-view-element')
export class PageViewElement extends LitElement {
  @property({ type: Boolean })
  protected active = false;

  shouldUpdate() {
    return this.active;
  }
}