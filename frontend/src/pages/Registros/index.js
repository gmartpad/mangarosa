import PropTypes from 'prop-types';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import { withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { DataGrid, ptBR } from '@material-ui/data-grid';
import { isAdmin } from '../../helpers/AuthHandler'
import axios from 'axios'
import Cookies from 'js-cookie'
import moment from 'moment'

function Registros( { classes } ) {

    const [userId, setUserId] = useState(Cookies.get('id'));

    //-----------------------------------------

    const history = useHistory();

    //-----------------------------------------

    const dispatch = useDispatch();

    const setRegistros = (registros) => dispatch({
        type: 'SET_REGISTROS',
        payload: {
            registros
        }
    })

    //-----------------------------------------

    const registros = useSelector(state => state.registros);

    //-----------------------------------------

    const resgatarRegistros = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/registros`, {
            headers: {
                "x-access-token": Cookies.get('token'),
            },
        }).then((res) => {
            res.data.map((i, k) => {
                i.id = i.id_registro
                i.validadoExtenso = i.validado === 'N' ? 'Não Validado' : 'Validado'
                i.datetimeregistroformatado = moment.utc(i.datetimeregistro, 'YYYY-MM-DDTHH:mm:ss.sssZ').local().format('HH:mm:ss DD/MM/YYYY');
            })
            setRegistros(res.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(()=>{
        resgatarRegistros();
    }, [])

    const usuarioAtual = (e) => {
        return e.usuario === userId;
    }

    //-----------------------------------------

    const columns = [
        { field: 'id', headerName: 'ID Geral', width: 150 },
        { field: 'nome', headerName: 'Nome', width: 250 },
        { field: 'datetimeregistroformatado', headerName: 'Hora e Data', width: 300 },
        { field: 'validadoExtenso', headerName: 'Validado', width: 150 }
    ]

    const theme = createMuiTheme(
        {
          palette: {
            primary: { main: '#f50057' },
          },
        },
        ptBR,
      );

    return (
        <>
            <Typography
                className={classes.titleStyle}
                variant="h4"
            >
                REGISTROS
            </Typography>
            { isAdmin() ?
                <div style={{height: 400, width: '100%'}}>
                    <ThemeProvider theme={theme}>
                        <DataGrid 
                            rows={registros.registros} 
                            columns={columns} 
                            pageSize={5}
                            onRowClick={e => history.push(`/${e.row.usuario_colaborador}/validar/${e.row.idnregistrousuario}`) }
                            hideFooterSelectedRowCount={true}
                            sortModel={[
                                {
                                    field: 'nome',
                                    sort: 'asc'
                                }
                            ]}
                        />
                    </ThemeProvider>
                </div>
                        :
                <div style={{height: 400, width: '100%'}}>
                    <ThemeProvider theme={theme}>
                        <DataGrid 
                            rows={registros.registros.filter(usuarioAtual)} 
                            columns={columns} 
                            pageSize={5}
                            onRowClick={e=> history.push(`/registros/${e.row.id_registro}`)}
                            hideFooterSelectedRowCount={true}
                            sortModel={[
                                {
                                    field: 'nome',
                                    sort: 'asc'
                                }
                            ]}
                        />
                    </ThemeProvider>
                </div>
            }
            
        </>
    )
}

Registros.propTypes = {
    classes: PropTypes.object.isRequired
}

const styles = { 
    titleStyle: {
        textAlign: 'center',
        margin: '0.8em 0',
    },
}

export default withStyles(styles)(Registros);