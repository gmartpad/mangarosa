import { useEffect, useState } from 'react';
import { Container, Form } from './styled';
import axios from 'axios';
import { doLogin, isLogged, doLogout } from '../../helpers/AuthHandler'
import Cookies from 'js-cookie';

export default function Login() {

    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");

    const [rememberPassword, setRememberPassword] = useState(false);

    const login = (e) => {

        e.preventDefault();

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
            nome,
            senha
        }).then((res) => {
            if(!res.data.result) {
                console.log(isLogged())
            }else{
                console.log(res.data)

                const token = res.data.token;
                const id = res.data.result.id_usuario;
                const cargo = res.data.result.cargo;

                doLogin(token, id, cargo, rememberPassword);
                window.location.href = '/';
            }
        }).catch((err) => {
            console.error(err);
        })

    }

    const isUserAuthenticated = (e) => {

        e.preventDefault();

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/isUserAuth`, {
            headers: {
                "x-access-token": Cookies.get('token'),
            },
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error(err);
        })

    }

    return (
        <Container>
            <Form onSubmit={login}>
                <label>
                    Nome:
                    <input name="nome" type="text" value={nome} onChange={e=>setNome(e.target.value)}/>
                </label>
                <label>
                    Senha:
                    <input name="senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} />
                </label>
                <label>
                    Lembrar da Senha:
                    <input name="rememberPassword" type="checkbox" checked={rememberPassword} onChange={e=>setRememberPassword(e.target.checked)}/>
                </label>
                <input type="submit" value="Enviar"/>
                <input type="button" value="Testar Auth" onClick={e=>isUserAuthenticated(e)} />
                <input type="button" value="Deslogar" onClick={e=>{
                    doLogout()
                    console.log(isLogged())
                }} />
                {nome} - {senha} - {rememberPassword ? 'true' : 'false'}
            </Form>
        </Container>
    )
}