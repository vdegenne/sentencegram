import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState  {
  page: 'sentences'|'sentence'|'404';
  currentSentenceId?: string;
}
export type PageValue = AppState['page']

const slice = createSlice({
  name: 'app',
  initialState: { page: 'sentences' } as AppState,
  reducers: {
    setPage(state, action: PayloadAction<PageValue>) {
      state.page = action.payload
    },
    setCurrentSentenceId (state, action) {
      state.currentSentenceId = action.payload
    }
  }
})

export const {setPage, setCurrentSentenceId} = slice.actions
export default slice.reducer