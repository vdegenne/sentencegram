import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { store } from '../redux/store.js';
import { goTo } from '../utils.js';

@customElement('sentence-strip')
export class SentenceStrip extends LitElement {
  @property()
  private sentenceId;

  static styles = css`
  :host {
    display: block;
    margin: 4px;
    padding: 21px;
    border: 1px solid #ccc;
    color: #757575;
    border-radius: 4px;
    cursor: pointer;
  }
  `

  constructor () {
    super()
    this.addEventListener('click', () => {
      goTo(`/sentence/${this.sentenceId}`)
    })
  }

  render() {
    const sentence = store.getState().user.sentences.find(sentence => sentence.id == this.sentenceId)
    if (!sentence) {
      return nothing;
    }

    return html`
    <span>${sentence.value}</span>
    `
  }
}