import { configureStore } from '@reduxjs/toolkit'
import UserReducers from './reducers/reducers'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['project_notifications', 'rightSideDrawer', 'private_chat_message','unread_chat_message']
}
const persistedReducers = persistReducer(persistConfig, UserReducers)

export let store = configureStore({ reducer: persistedReducers })
export let persister = persistStore(store)