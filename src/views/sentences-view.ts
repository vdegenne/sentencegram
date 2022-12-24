import { Dialog } from '@material/mwc-dialog';
import { addDoc, collection } from 'firebase/firestore';
import { html, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
// import { connect } from 'pwa-helpers';
import { db } from '../firebase.js';
import { RootState, store } from '../redux/store.js';
import { goTo, promptNewSentence } from '../utils.js';
import { PageViewElement } from './page-view-element.js';
import { watch, connect } from 'lit-redux-watch';
import { Sentence } from '../redux/reducers/user.js';

@customElement('sentences-view')
export class SentencesView extends connect(store)(PageViewElement) {
  @watch('user.isSignedIn')
  private isSignedIn: boolean = false;

  @watch('user.sentences')
  private sentences: Sentence[] = [];

  protected render() {
    return html`
    ${this.isSignedIn ? html`
    <!-- <mwc-button @click=${()=>{promptNewSentence(document.body)}} unelevated icon=add>add sentence</mwc-button> -->

    ${this.sentences.map(sentence => {
      return html`
      <sentence-strip sentenceId=${sentence.id}></sentence-strip>
      `
    })}

    ` : html`
    <p>Sign In to create new sentences</p>
    `}
    `
  }
}