import { LitElement, html, css } from 'lit'
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
import { store } from './redux/store.js'
import { changePage, PageValue, setCurrentSentenceId } from './redux/reducers/app.js'
import './redux/firebase-redux.js'
import { watch, connect } from 'lit-redux-watch'

declare global {
  interface Window {
    app: AppContainer;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}

@customElement('app-container')
export class AppContainer extends connect(store)(LitElement) {

  @watch('app.page')
  private page;

  static styles = css`
  header {
    display: flex;
    justify-content: space-between;
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
        store.dispatch(setCurrentSentenceId(crumbs[1]))
      }
    }
    store.dispatch(changePage(page))
  }

  render () {
    return html`
    <header>
      <div></div>
      <mwc-icon-button icon="account_circle"
        @click=${()=>{this.onAccountCircleClick()}}></mwc-icon-button>
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
}
