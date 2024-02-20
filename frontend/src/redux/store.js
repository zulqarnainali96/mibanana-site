import { configureStore } from '@reduxjs/toolkit'
import UserReducers from './reducers/reducers'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
    // blacklist : ['customerBrand', 'project_list']
}
const persistedReducers = persistReducer(persistConfig, UserReducers)

export let store = configureStore({ reducer: persistedReducers })
export let persister = persistStore(store)