import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducers/app.js'
import userReducer from './reducers/user.js'

// const LOCALSTORAGE_KEY = 'sentencegram:app'

// const loadPreloadedState = () => {
//   const local = localStorage.getItem(LOCALSTORAGE_KEY)
//   return local
//     ? JSON.parse(local)
//     : undefined;
// }


// store
export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer
  },
  // preloadedState: loadPreloadedState()
})


// store.subscribe(() => {
//   localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({app: store.getState().app}))
// })

export type RootState = ReturnType<typeof store.getState>