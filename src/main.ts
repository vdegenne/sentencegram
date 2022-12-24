import { LitElement, html, css, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@material/mwc-snackbar'
import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-textarea'
// import { connect } from 'pwa-helpers'
import './views/sentences-view.js'
import './views/sentence-view.js'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from './firebase'
import { RootState, store } from './redux/store.js'
import { setPage, PageValue, setCurrentSentenceId } from './redux/reducers/app.js'
import './redux/firebase-redux.js'
import { watch, connect } from 'lit-redux-watch'
import { goTo, promptNewSentence } from './utils.js'
import { Firestore } from './redux/firebase-redux.js'
import { SentenceView } from './views/sentence-view.js'
import { Sentence } from './redux/reducers/user.js'

declare global {
  interface Window {
    app: AppContainer;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}

@customElement('app-container')
export class AppContainer extends connect(store)(LitElement) {

  @watch('user.sentences')
  private sentences: Sentence[] = []

  @watch('app.page')
  private page: PageValue = 'sentences';

  @watch('user.isSignedIn')
  private isSignedIn: boolean = false;

  stateChanged (state: RootState) {
    this.sentences = state.user.sentences
    this.page = state.app.page
    this.isSignedIn = state.user.isSignedIn
  }

  static styles = css`
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin:4px;
  }
  #pages {
    /* margin: 24px; */
  }
  .page {
    display: none;
  }
  .page[active] {
    display: block;
  }
  `

  constructor () {
    super()
    this.processHash()
    window.onhashchange = this.processHash
  }

  processHash () {
    const hash = window.location.hash.slice(1)
    const crumbs = hash.slice(1).split('/')
    let page = crumbs[0] as PageValue || 'sentences'
    if (page == 'sentence') {
      if (!crumbs[1]) {
        page = '404'
      }
      else {
        // try {
        //   this.shadowRoot!.querySelector<SentenceView>('sentence-view')!.requestUpdate()
        // } catch (e) {}
        store.dispatch(setCurrentSentenceId(crumbs[1]))
      }
    }
    store.dispatch(setPage(page))
  }

  render () {
    return html`
    <header>
      ${this.page === 'sentence' ? html`
      <mwc-icon-button icon="list"
        @click=${()=>{goTo('/')}}></mwc-icon-button>
      ` : html`
      <div><mwc-icon>gesture</mwc-icon>sentencegram</div>
      `}
      <div>
        ${this.sentences.length > 1 ? html`
        <mwc-icon-button icon="casino" @click=${()=>{this.onCasinoButtonClick()}}></mwc-icon-button>
        ` : nothing}
        ${this.isSignedIn ? html`
        <mwc-icon-button icon="add" @click=${()=>{this.onAddButtonClick()}}></mwc-icon-button>
        ` : nothing}

        <mwc-icon-button
          @click=${()=>{this.onAccountCircleClick()}}>
          ${auth.currentUser?.photoURL ? html`
          <img src="${auth.currentUser.photoURL}" style="border-radius:25%">
          ` : html`
          <mwc-icon>account_circle</mwc-icon>
          `}
        </mwc-icon-button>
      </div>
    </header>

    <div id=pages>
      <sentences-view class=page ?active=${this.page == 'sentences'}></sentences-view>
      <sentence-view class=page ?active=${this.page == 'sentence'}></sentence-view>
    </div>
    `
  }

  async onAccountCircleClick() {
    if (store.getState().user.isSignedIn) {
      await signOut(auth)
      window.toast('disconnected')
      return
    }
    await signInWithPopup(auth, new GoogleAuthProvider)
    window.toast('connected')
  }

  async onAddButtonClick () {
    try {
      const input = await promptNewSentence(document.body)
      if (input) {
        const id = await Firestore.addNewSentence(input)
        goTo(`/sentence/${id}`)
      } else {
        window.toast("The sentence can't be empty")
      }
    }
    catch (e) {
      /* canceled */
    }
  }

  onCasinoButtonClick() {
    const currentId = store.getState().app.currentSentenceId
    let random: Sentence
    do { // make sure we don't pick same sentence
      random = this.sentences[Math.floor(Math.random() * this.sentences.length)]
    } while (random.id == currentId)

    goTo(`/sentence/${random.id}`)
  }
}
