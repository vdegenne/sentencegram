import { onAuthStateChanged } from 'firebase/auth'
import { collection, collectionGroup, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'
import user, { addSentence, Canvas, loadSentences, removeSentence, resetSentences, Sentence, setUserUID, updateSentence } from './reducers/user.js'
import { store } from './store.js'

let unsubscribe

// on user connection
onAuthStateChanged(auth, (user) => {
  store.dispatch(setUserUID(user ? user.uid : undefined))
  // as soon as the user connects we fetch the data
  if (user) {
    // when a sentence document change
    unsubscribe = onSnapshot(collection(db, 'users', user.uid, 'sentences'), (csnap) => {
      csnap.docChanges().forEach((docchange) => {
        switch (docchange.type) {
          case 'added':
            store.dispatch(addSentence({id: docchange.doc.id, ...docchange.doc.data()} as Sentence))
            break;
          case 'removed':
            store.dispatch(removeSentence(docchange.doc.id))
            break;
          case 'modified':
            store.dispatch(updateSentence({
              id: docchange.doc.id,
              ...docchange.doc.data()
            }as Sentence))
            break;
        }
      })
    })
  }
  else {
    if (unsubscribe) {
      unsubscribe()
      store.dispatch(loadSentences([])) // clear the user data
    }
  }
})


export async function updateSentenceCanvas (sentenceId: string, canvas: Canvas) {
  if (store.getState().user.isSignedIn) {
    const docRef = doc(db, 'users', store.getState().user.uid!, 'sentences', sentenceId)
    await updateDoc(docRef, {
      canvas
    })
  }
}