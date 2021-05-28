import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Form } from './styled';
import axios from 'axios';
import { doLogin } from '../../helpers/AuthHandler'
import Cookies from 'js-cookie';
import { Container, TextField, Checkbox, FormControlLabel, Button, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({ classes }) {

    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const [rememberPassword, setRememberPassword] = useState(false);

    const notifyError = (m) => toast.error(m);
    const notifySuccess = (m) => toast.success(m, {autoClose: 3000});

    const login = (e) => {

        e.preventDefault();

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
            nome,
            senha
        }).then((res) => {
            if(!res.data.result) {
                notifyError(res.data.message)
            }else{
                const token = res.data.token;
                const id = res.data.result.id_usuario;
                const cargo = res.data.result.cargo;
                
                doLogin(token, id, cargo, rememberPassword);
                
                notifySuccess(`Login efetuado com sucesso!`);
                
                setTimeout(()=>{
                    window.location.href = '/';
                }, 3000)
            }
        }).catch((err) => {
            console.log(`${err}`);
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
            console.log(err);
        })

    }

    return (
        <Container>
            <Typography
                className={classes.titleStyle}
                variant="h4"
            >
                LOGIN
            </Typography>
            <Form
                onSubmit={login}
            >
                <TextField
                    className={classes.input}
                    color="secondary" 
                    label="Nome" 
                    variant="outlined" 
                    value={nome} 
                    onChange={e=>setNome(e.target.value)}
                    required
                />
                <TextField
                    type="password"
                    className={classes.input}
                    color="secondary" 
                    label="Senha" 
                    variant="outlined" 
                    value={senha} 
                    onChange={e=>setSenha(e.target.value)}
                    required
                />
                <FormControlLabel
                    className={classes.input}
                    control={
                        <Checkbox
                            name="rememberPassword"
                            checked={rememberPassword}
                            onChange={e=>setRememberPassword(e.target.checked)}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    }
                    label="Lembrar da Senha"
                />
                <Button 
                    className={classes.button}
                    type="submit" 
                    variant="contained" 
                    color="secondary"
                >
                    Enviar
                </Button>
                {/* <Button 
                    variant="contained" 
                    color="secondary"
                >
                    Testar Auth
                </Button> */}
                {/* {nome} - {senha} - {rememberPassword ? 'true' : 'false'} */}
            </Form>
            <ToastContainer />
        </Container>
    )
}

Login.propTypes = {
    classes: PropTypes.object.isRequired
}

const styles = { 

    input: {
        margin: '0.8em 0',
    },
    titleStyle: {
        textAlign: 'center',
        margin: '0.8em 0',
    },
    button: {
        fontWeight: 'bold',
        minHeight: '50px'
    }

}

export default withStyles(styles)(Login);