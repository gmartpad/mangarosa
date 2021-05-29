const initialState = {
    registros: []
}

const RegistrosReducer = (state = initialState, action) => {

    switch(action.type){
        case 'SET_REGISTROS':
            return { ...state,
                registros: action.payload.registros
            }
        default:
            break;
    }

    return state;

}

export default RegistrosReducer;