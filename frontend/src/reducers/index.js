import { combineReducers } from 'redux';

import RegistrosReducer from './RegistrosReducer';
import ToastReducer from './ToastReducer';

export default combineReducers({
    registros: RegistrosReducer,
    toastr: ToastReducer,
});