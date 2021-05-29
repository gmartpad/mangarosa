import { useDispatch } from 'react-redux'
import { Route, Redirect } from 'react-router-dom';
import { isLogged, isAdmin } from '../../helpers/AuthHandler';

export default ({ children, ...rest }) => {

    let logged = isLogged();

    let admin = isAdmin();

    let authorized = ((rest.admin && !admin) || (rest.private && !logged) || (rest.public && logged) ) ? false : true;

    //-----------------------------------------

    const dispatch = useDispatch();

    const setError = (error) => dispatch({
        type: 'SET_ERROR',
        payload: {
            error
        }
    });

    //------------------------------------------

    const setErrorElement = () => {
        setError('Você não tem autorização para acessar esta rota.')
        return (<></>);
    }

    return (
        <Route
            {...rest}
            render={()=>

                authorized 
                ?
                    children
                :
                    <>
                        {setErrorElement()}
                        <Redirect to="/"/>
                    </>
            }
        />
    );

}

//'Você não tem autorização para acessar esta rota.'