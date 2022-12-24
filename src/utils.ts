import { Dialog } from '@material/mwc-dialog';
import { html, render } from 'lit';

export function goTo (path = '/') {
  window.location.hash = path
}

export async function promptNewSentence (host: HTMLElement|ShadowRoot, initialValue: string = '') {
  const dialog = new Dialog;
  dialog.heading = 'New Sentence'
  // @ts-ignore
  dialog.style = '--mdc-dialog-min-width: calc(100vw - 42px)';


  render(html`
  <style>
    mwc-textarea {
      width: 100%;
      margin: 12px 0;
    }
  </style>
  <mwc-textarea outlined rows=12 dialogInitialFocus>${initialValue}</mwc-textarea>

  <mwc-button outlined slot="secondaryAction" dialogAction="close">cancel</mwc-button>
  <mwc-button unelevated slot="primaryAction" dialogAction="submit">create</mwc-button>
  `, dialog)

  host.appendChild(dialog)
  dialog.show()

  try {
    const input: string = await new Promise((resolve, reject) => {
      // @ts-ignore
      dialog.addEventListener('closed', (e: CustomEvent) => {
        if (e.detail.action === 'close') {
          reject()
          return
        }

        // send the informations
        resolve(dialog.querySelector('mwc-textarea')!.value)
      })
    })

    return input
  }
  catch (e) {
    throw new Error('Dialog was canceled')
  }
  finally {
    dialog.remove()
  }
}