import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import Reducers from './reducers';

const persistConfig = {
    key: 'root',
    storage: storage,
};

//se quiser que todos os reducers persistam, nem bota a prop whitelist no objeto

const pReducer = persistReducer( persistConfig, Reducers );

const store = createStore( pReducer );

const persistor = persistStore( store );

export { store, persistor };