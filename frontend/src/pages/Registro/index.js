import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from "react-router-dom";
import { DetalhesRegistro } from '../../components';
import { isAdmin } from '../../helpers/AuthHandler';
import { CircularProgress, Typography, Container, Box, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';

function Registro( { classes } ) {

    let { usuario_colaborador, id } = useParams();

    //-----------------------------------------

    const history = useHistory();

    //-----------------------------------------

    const dispatch = useDispatch();

    const setError = (error) => dispatch({
        type: 'SET_ERROR',
        payload: {
            error
        }
    });

    //------------------------------------------

    const [registro, setRegistro] = useState({})
    const [loading, setLoading] = useState(true);
    const [novoDia, setNovoDia] = useState('');
    const [data, setData] = useState('');

    const [buttonsDisabled, setButtonsDisabled] = useState(false)
    const [dataValidacao, setDataValidacao] = useState('');

    const filtrarDiaDaSemana = (data) => {
        const stringData = moment.utc(data, 'YYYY-MM-DDTHH:mm:ss.sssZ').local().format('dddd, DD/MM/YYYY  HH:mm:ss');
        const dia = stringData.split(',')[0];
        const resto = stringData.split(',')[1];

        switch(dia){
            case 'Sunday':
                setNovoDia('Domingo');
                break;
            case 'Monday':
                setNovoDia('Segunda-feira');
                break;
            case 'Tuesday':
                setNovoDia('Terça-Feira')
                break;
            case 'Wednesday':
                setNovoDia('Quarta-feira')
                break;
            case 'Thursday':
                setNovoDia('Quinta-feira')
                break;
            case 'Friday':
                setNovoDia('Sexta-feira')
                break;
            case 'Saturday':
                setNovoDia('Sábado')
                break;
            default:
                break;
        }

        const newData = novoDia + ',' + resto;

        setData(newData);

    }   

    const buscarRegistro = () => {
        if(isAdmin()){
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/usuarios/nome/${usuario_colaborador}`, {
                headers: {
                    "x-access-token": Cookies.get('token'),
                },
            })
            .then((res) => {

                axios.get(`${process.env.REACT_APP_API_BASE_URL}/registros/${res.data.id_usuario}/${id}`, {
                    headers: {
                        "x-access-token": Cookies.get('token'),
                    },
                })
                .then((res) => {
                    if(res.data !== ''){
                        if(res.data.datetimevalidacao !== null){
                            setButtonsDisabled(true);
                            setDataValidacao(moment.utc(res.data.datetimevalidacao, 'YYYY-MM-DDTHH:mm:ss.sssZ').local().format('DD/MM/YYYY HH:mm:ss'));
                        }
                        setRegistro(res.data);
                        setLoading(false);

                    } else {
                        setError('Não há registro com essa combinação Usuário/ID')
                        setTimeout(()=>{
                            history.push('/');
                        }, 200)
                    }
                })
                .catch((err) => {
                    setError('Não há registro com essa combinação Usuário/ID')
                    setTimeout(()=>{
                        history.push('/');
                    }, 200)
                })

            })
            .catch((err) => {
                // console.log(err);
            })
        }else{
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/registros/${id}`, {
                headers: {
                    "x-access-token": Cookies.get('token'),
                },
            })
            .then((res) => {
                if(res.data !== ''){
                    if(res.data.datetimevalidacao !== null){
                        setButtonsDisabled(true);
                        setDataValidacao(moment.utc(res.data.datetimevalidacao, 'YYYY-MM-DDTHH:mm:ss.sssZ').local().format('DD/MM/YYYY HH:mm:ss'));
                    }
                    setRegistro(res.data);
                    setLoading(false);

                } else {
                    setError('Não há registro seu com este ID')
                    setTimeout(()=>{
                        history.push('/');
                    }, 200)
                }
            })
            .catch((err) => {
                setError('Não há registro seu com este ID')
                setTimeout(()=>{
                    history.push('/');
                }, 200)
            })
        }
    }

    const validarRegistro = (validado) => {

        setButtonsDisabled(true);

        axios.patch(`${process.env.REACT_APP_API_BASE_URL}/registros/${registro.id_registro}`, {
            validado,
            datetimevalidacao: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            headers: {
                "x-access-token": Cookies.get('token'),
            },
        }).then((res) => {
            buscarRegistro();
        }).catch((err) => {
            // console.log(err)
        })
    }

    useEffect(()=>{
        buscarRegistro();
    }, [])

    useEffect(()=>{
        if(registro !== {}){
            filtrarDiaDaSemana(registro.datetimeregistro);
        }
    }, [registro, data])

    return (
        <Container>
            <Box
                className={loading ? classes.boxLoading : null}
            >
                {loading ? 
                    <CircularProgress color="secondary"/>
                        :
                        <>
                            <DetalhesRegistro 
                                title={isAdmin() ? 'VALIDAÇÃO DE REGISTRO' : 'REGISTRO'}
                                registro={registro}
                                data={data}
                                setButtonsDisabled={setButtonsDisabled}
                                setDataValidacao={setDataValidacao} 
                            />
                            {dataValidacao !== '' ?
                                <Typography className={classes.infoVal} variant="h6"> Registro Validado em: {dataValidacao}</Typography>
                                                    :
                                null
                            }
                            {isAdmin() ?
                                <Box
                                    className={classes.buttonContainer}
                                >
                                    <Button 
                                        className={classes.buttonSuccess}
                                        type="submit" 
                                        variant="contained"
                                        disabled={buttonsDisabled}
                                        onClick={e=>validarRegistro('S')}
                                    >
                                        VALIDAR
                                    </Button>
                                    <Button 
                                        className={classes.buttonError}
                                        type="submit" 
                                        variant="contained"
                                        disabled={buttonsDisabled} 
                                        onClick={e=>validarRegistro('N')}
                                    >
                                        NÃO VALIDAR
                                    </Button>
                                </Box>
                                    :
                                null
                            }
                        </>
                }
            </Box>
        </Container>
    )
}

Registro.propTypes = {
    classes: PropTypes.object.isRequired
}

const styles = { 

    infoVal: {
        margin: '1.6em 0 0 0',
        textAlign: 'center'
    },
    buttonSuccess: {
        fontWeight: 'bold',
        minHeight: '50px',
        color: '#fff',
        backgroundColor: '#00cc00',
        '&:hover': {
            backgroundColor: '#009900'
        }
    },
    buttonError: {
        fontWeight: 'bold',
        minHeight: '50px',
        color: '#fff',
        backgroundColor: '#cc0000',
        '&:hover': {
            backgroundColor: '#990000'
        }
    },
    boxLoading: {
        height: '100%',
        padding: '1.6em 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        margin: '3.5em 0',
    }
}

export default withStyles(styles)(Registro);