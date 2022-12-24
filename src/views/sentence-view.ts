import { css, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { store } from '../redux/store.js';
import { PageViewElement } from './page-view-element.js';
import { watch, connect } from 'lit-redux-watch';
import { CanvasElement } from '../components/canvas-element.js';
import { Firestore } from '../redux/firebase-redux.js';
import { Sentence } from '../redux/reducers/user.js';


@customElement('sentence-view')
export class SentenceView extends connect(store)(PageViewElement) {

  @watch('user.sentences')
  private sentences: Sentence[] = []

  @watch('app.currentSentenceId')
  private sentenceId!: string

  @query('canvas-element') canvasElement!: CanvasElement;

  static styles = css`
  #tools {
    display:flex;
    margin: 0 auto;
    padding: 3px;
    justify-content: space-between;
    /* align-items: center; */
    max-width: 640px;
  }
  `

  render () {
    const sentence = this.sentences.find(s => s.id == this.sentenceId)

    if (!sentence) {
      return html`
      <!-- <p>This sentence can't be found.</p> -->
      `
    }

    return html`
    <div style="max-width:640px;margin:0 auto;padding:12px">${sentence.value}</div>
    <canvas-element .content="${sentence.canvas}"></canvas-element>
    <div id=tools>
      <mwc-icon-button icon="cleaning_services" @click=${()=>{this.canvasElement.clear()}}></mwc-icon-button>
      <mwc-button unelevated @click=${()=>{this.onSaveButtonClick()}} icon="save">save</mwc-button>
    </div>
    `
  }

  // get sentenceId () {
  //   return window.location.hash.slice(2).split('/')[1]
  // }

  onSaveButtonClick() {
    // here we have to save the canvas into the firestore
    Firestore.updateSentenceCanvas(this.sentenceId, this.canvasElement.serializeContent())
  }
}