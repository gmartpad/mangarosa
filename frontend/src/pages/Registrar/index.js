import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { 
    Container, 
    TextField, 
    Grid, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    Checkbox, 
    Button, 
    Paper, 
    Typography 
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Cookies from 'js-cookie'
import { useHistory } from 'react-router-dom'

function Registrar( { classes } ) {

    const id = Cookies.get('id');

    const [nomeRef, setNomeRef] = useState('');
    const [emailRef, setEmailRef] = useState('');
    const [CPFRef, setCPFRef] = useState('');

    const [nomeErrorText, setNomeErrorText] = useState('');
    const [emailErrorText, setEmailErrorText] = useState('');
    const [CPFErrorText, setCPFErrorText] = useState('');
    const [celularErrorText, setCelularErrorText] = useState('');

    const [buttonsDisabled, setButtonsDisabled] = useState(true);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [CPF, setCPF] = useState('');
    const [celular, setCelular] = useState('');

    //----------------------------------------------------------------

    const history = useHistory();

    //----------------------------------------------------------------

    const dispatch = useDispatch();

    //----------------------------------------------------------------

    const setSuccess = (success) => dispatch({
        type: 'SET_SUCCESS',
        payload: {
            success
        }
    })

    //-------------------------------------------------------------

    const getRef = (id) => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/usuarios/${id}`, {
            headers: {
                "x-access-token": Cookies.get('token'),
            }
        }).then((res) => {
            setNomeRef(res.data.nome);
            setEmailRef(res.data.email);
            setCPFRef(res.data.cpf);
        }).catch((err) => {
            console.log(err)
        })
    }

    const registrar = (e) => {
        e.preventDefault();
        
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/registros`, {
            usuario: Cookies.get('id'),
            nome,
            email,
            cpf: CPF,
            celular,
            conhecimentos: JSON.stringify(right)
        }, {
            headers: {
                "x-access-token": Cookies.get('token'),
            },
        }).then((res)=>{
            if(res.data.auth){
                setSuccess(res.data.message);
                setTimeout(()=>{
                    history.push('/');
                }, 200)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    const checaNome = (nome) => {
        if(nome !== nomeRef){
            setNomeErrorText('Este não é seu nome. Talvez tenha digitado algo errado.')
        } else {
            setNomeErrorText('');
        }
    }

    const checaEmail = (email) => {
        if(!/\S+\@\S+\.\S+/.test(email)){
            setEmailErrorText('Exemplo: fulano@mail.com');
        } else {
            if(email !== emailRef){
                setEmailErrorText('Este não é seu email. Talvez tenha digitado algo de errado.')
            } else {
                setEmailErrorText('');
            }
        }
    }

    const checaCPF = (cpf) => {
        if(!/[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}/.test(cpf)){
            setCPFErrorText('Exemplo: 123.456.789-10');
        } else {
            if(cpf !== CPFRef){
                setCPFErrorText('Este não é seu CPF. Talvez tenha digitado algo de errado.')
            } else {
                setCPFErrorText('');
            }
        }
    }

    const checaCelular = (celular) => {
        if(!/\([0-9]{2}\)\s[0-9]\s[0-9]{4}\-[0-9]{4}/.test(celular) && celular.length > 0){
            setCelularErrorText('Exemplo: (99) 9 9999-9999');
        } else {
            setCelularErrorText('');
        }
    }

    //-----------------------------------------------

    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState(['Git', 'React', 'PHP', 'NodeJS', 'DevOps', 'Banco de Dados', 'TypeScript']);
    const [right, setRight] = useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setChecked(newChecked);
    };

    function not(a, b) {
        return a.filter((value) => b.indexOf(value) === -1);
    }
    
    function intersection(a, b) {
        return a.filter((value) => b.indexOf(value) !== -1);
    }

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const customList = (items) => (
        <Paper className={classes.paper}>
            <List dense component="div" role="list">
            {items.map((value) => {
                const labelId = `transfer-list-item-${value}-label`;

                return (
                <ListItem key={value} role="listitem" button onClick={(leftChecked.length >= 3 && right.length <= 3) || (right.length == 3) || (leftChecked.length == 1 && right.length == 2) || (leftChecked.length == 2 && right.length == 1) ? null : handleToggle(value)}>
                    <ListItemIcon>
                    <Checkbox
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        disabled={ (leftChecked.length >= 3 && right.length <= 3) || (right.length == 3) || (leftChecked.length == 1 && right.length == 2) || (leftChecked.length == 2 && right.length == 1)}
                    />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value}`} />
                </ListItem>
                );
            })}
            <ListItem />
            </List>
        </Paper>
    );

    //------------------------------------------------

    const ativaBotao = () => {
        if(
            nomeErrorText.length == 0 &&
            emailErrorText.length == 0 &&
            CPFErrorText.length == 0 &&
            celularErrorText.length == 0 &&
            right.length >= 1
        ){
            setButtonsDisabled(false);
        }else{
            setButtonsDisabled(true);
        }
    }

    //------------------------------------------------

    useEffect(()=>{
        getRef(id);
    }, [])

    useEffect(()=>{
        ativaBotao()
    }, [nomeErrorText, emailErrorText, CPFErrorText, celularErrorText, right])

    return (
        <Container>
            <Typography
                className={classes.titleStyle}
                variant="h4"
            >
                REGISTRAR PONTO
            </Typography>
            <form
                className={classes.form}
                onSubmit={e=>registrar(e)}
            >
                <TextField
                    className={classes.input}
                    color="secondary" 
                    label="Nome" 
                    variant="outlined" 
                    value={nome} 
                    onChange={e=>setNome(e.target.value)}
                    onBlur={e=>checaNome(e.target.value)}
                    required
                    error={nomeErrorText.length > 0}
                    helperText={nomeErrorText}
                />
                <TextField
                    className={classes.input}
                    color="secondary" 
                    label="Email" 
                    variant="outlined" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)}
                    onBlur={e=>checaEmail(e.target.value)}
                    required
                    error={emailErrorText.length > 0}
                    helperText={emailErrorText}
                />
                <TextField
                    className={classes.input}
                    color="secondary" 
                    label="CPF" 
                    variant="outlined" 
                    value={CPF} 
                    onChange={e=>setCPF(e.target.value)}
                    onBlur={e=>checaCPF(e.target.value)}
                    required
                    error={CPFErrorText.length > 0}
                    helperText={CPFErrorText}
                />
                <TextField
                    className={classes.input}
                    color="secondary" 
                    label="Celular" 
                    variant="outlined" 
                    value={celular} 
                    onChange={e=>setCelular(e.target.value)}
                    onBlur={e=>checaCelular(e.target.value)}
                    error={celularErrorText.length > 0}
                    helperText={celularErrorText}
                />
                <Typography
                    variant="h6"
                    className={classes.titleStyle}
                >
                    Conhecimentos (min. 1 - máx. 3)
                </Typography>
                <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                    <Grid item>{customList(left)}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                        {/* <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleAllRight}
                            disabled
                            aria-label="move all right"
                        >
                            ≫
                        </Button> */}
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0 || right.length >= 3}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                        </Grid>
                    </Grid>
                    <Grid item>{customList(right)}</Grid>
                </Grid>
                <Button 
                    className={classes.buttonSubmit}
                    variant="contained"
                    color="secondary" 
                    disabled={buttonsDisabled} 
                    type="submit"
                >
                    REGISTRAR PONTO
                </Button>
            </form>
        </Container>
    )
}

Registrar.propTypes = {
    classes: PropTypes.object.isRequired
}

const styles = (theme) => ({ 

    root: {
        margin: 'auto 0 2.4em 0',
    },
    paper: {
        width: 200,
        height: 230,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
    buttonSubmit: {
        fontWeight: 'bold',
        minHeight: '50px'
    },
    input: {
        margin: '0.8em 0',
    },
    titleStyle: {
        textAlign: 'center',
        margin: '0.8em 0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '3.0em'
    }

})

export default withStyles(styles)(Registrar);