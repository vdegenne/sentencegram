import { Dialog } from '@material/mwc-dialog';
import { addDoc, collection } from 'firebase/firestore';
import { html, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
// import { connect } from 'pwa-helpers';
import { db } from '../firebase.js';
import { RootState, store } from '../redux/store.js';
import { goTo } from '../utils.js';
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
    <mwc-button @click=${()=>{this.promptNewSentence()}} unelevated icon=add>add sentence</mwc-button>

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

  stateChanged(state: RootState) {
    this.isSignedIn = state.user.isSignedIn
  }

  async promptNewSentence () {
    const dialog = new Dialog;
    dialog.heading = 'New Sentence'


    render(html`
    <style>
      mwc-textarea {
        width: 100%;
        margin: 12px 0;
      }
    </style>
    <mwc-textarea outlined label="sentence" dialogInitialFocus></mwc-textarea>

    <mwc-button outlined slot="secondaryAction" dialogAction="close">cancel</mwc-button>
    <mwc-button unelevated slot="primaryAction" dialogAction="submit">create</mwc-button>
    `, dialog)

    this.shadowRoot!.appendChild(dialog)
    dialog.show()


    const input: string = await new Promise((resolve, reject) => {
      // @ts-ignore
      dialog.addEventListener('closed', (e: CustomEvent) => {
        if (e.detail.action === 'close') {
          reject()
          return
        }

        // send the informations
        resolve(dialog.querySelector('mwc-textarea')!.value)

        dialog.remove()
      })
    })

    if (!input) {
      window.toast('The input can\'t be empty.')
    }
    else {
      this.registerSentence(input)
    }
  }

  async registerSentence (input: string) {
    if (this.isSignedIn) {
      const cref = collection(db, 'users', store.getState().user.uid!, 'sentences')
      const doc = await addDoc(cref, {
        value: input,
        canvas: ''
      })

      goTo(`/sentence/${doc.id}`)
    }
  }
}