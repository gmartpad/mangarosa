import Cookies from 'js-cookie';

export const isLogged = () => {
    let token = Cookies.get('token');
    return token ? true : false;
}

export const doLogin = (token, id, cargo, usuario, rememberPassword = false) => {
    if(rememberPassword){
        Cookies.set('token', token, { expires: 999 });
        Cookies.set('id', id, { expires: 999 });
        Cookies.set('cargo', cargo, { expires: 999 });
        Cookies.set('usuario', usuario, { expires: 999 });
    } else {
        Cookies.set('token', token);
        Cookies.set('id', id);
        Cookies.set('cargo', cargo);
        Cookies.set('usuario', usuario);
    }
}

export const doLogout = () => {
    Cookies.remove('token');
}

export const isAdmin = () => {
    let cargo = Cookies.get('cargo');
    return cargo === 'A' ? true : false;
}