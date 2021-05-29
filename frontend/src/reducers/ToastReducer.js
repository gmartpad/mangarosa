const initialState = {
    error: '',
    success: ''
}

const ToastReducer = (state = initialState, action) => {

    switch(action.type){
        case 'SET_ERROR':
            return {...state,
                error: action.payload.error,
            }
        case 'SET_SUCCESS':
            return {...state,
                success: action.payload.success
            }
        case 'DELETE_ERROR':
            return {...state,
                error: ''
            }
        case 'DELETE_SUCCESS':
            return {...state,
                success: ''
            }
        default: 
            break;
    }

    return state;

}

export default ToastReducer;