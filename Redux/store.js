import {configureStore} from '@reduxjs/toolkit'
import rootReducer from './RootSlice'

const store = configureStore({
  reducer: {
    root: rootReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}),
})

export default store
