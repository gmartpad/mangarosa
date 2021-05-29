import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import { doLogin } from '../../helpers/AuthHandler'
import { Container, TextField, Checkbox, FormControlLabel, Button, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({ classes }) {

    const history = useHistory();

    //-----------------------------------------

    const dispatch = useDispatch();

    const setSuccess = (success) => dispatch({
        type: 'SET_SUCCESS',
        payload: {
            success
        }
    })

    //------------------------------------------

    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");

    const [rememberPassword, setRememberPassword] = useState(false);

    const notifyError = (m) => toast.error(m);

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
                const usuario = res.data.result.usuario;
                
                doLogin(token, id, cargo, usuario, rememberPassword);
                
                setSuccess(`Login efetuado com sucesso!`);
                
                setTimeout(()=>{
                    history.push('/');
                }, 200)
            }
        }).catch((err) => {
            console.log(`${err}`);
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
            <form
                className={classes.form}
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
            </form>
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
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    }

}

export default withStyles(styles)(Login);