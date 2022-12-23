import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Canvas = string;
export interface Sentence {
  id: string;
  value: string;
  canvas: Canvas;
}

interface UserState {
  isSignedIn: boolean;
  uid?: string;
  sentences: Sentence[]
}

const slice =  createSlice({
  name: 'user',
  initialState: { isSignedIn: false, sentences: [] } as UserState,
  reducers: {
    setUserUID (state, action: PayloadAction<string|undefined>) {
      if (action.payload) {
        state.isSignedIn = true
        state.uid = action.payload
      }
      else {
        state.isSignedIn = false
        state.uid = undefined
      }
    },
    resetSentences (state) {
      state.sentences = []
    },
    loadSentences (state, action: PayloadAction<Sentence[]>) {
      state.sentences = action.payload
    },
    addSentence (state, action: PayloadAction<Sentence>) {
      state.sentences.push(action.payload)
    },
    removeSentence (state, action: PayloadAction<string>) {
      state.sentences.splice(state.sentences.findIndex(s => s.id === action.payload), 1)
    },
    updateSentence (state, action: PayloadAction<Sentence>) {
      const sentence = state.sentences.find(s => s.id == action.payload.id)!
      Object.assign(sentence, action.payload)
    }
  }
})


export const {setUserUID, resetSentences, loadSentences, addSentence, removeSentence, updateSentence} = slice.actions
export default slice.reducer