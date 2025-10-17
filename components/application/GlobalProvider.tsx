"use client"

import React from 'react'
import { Provider } from 'react-redux'
import { persistor, store } from '@/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from './Loading'

const GlobalProvider = ({ children } : any) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor} >
        {children}
      </PersistGate>
    </Provider>
  )
}

export default GlobalProvider
