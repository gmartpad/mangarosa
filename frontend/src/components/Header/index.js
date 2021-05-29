import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { isLogged, doLogout, isAdmin } from '../../helpers/AuthHandler';
import { AppBar, Toolbar, Typography, Link as LinkM, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Cookies from 'js-cookie';

function Header( { classes } ) {

    const [logged, setLogged] = useState(isLogged());
    const [admin, setAdmin] = useState(isAdmin());
    const [usuarioColaborador, setUsuarioColaborador] = useState(Cookies.get('usuario'));

    const toastr = useSelector(state => state.toastr);

    useEffect(()=>{
        setLogged(isLogged());
        setAdmin(isAdmin());
    }, [toastr])

    return (
        <AppBar color="secondary">
          <Toolbar>
            <Typography 
                className={classes.headerTitle}
                variant="h5"
            >
                <LinkM 
                    className={classes.headerTitle}
                    component={Link} 
                    to={'/'}
                >
                    MANGA ROSA
                </LinkM>
            </Typography>
            <Box
                className={classes.boxSpan} 
                component="span"
            >
                { logged ?
                    <Typography
                        className={classes.headerMenuItem}
                    >
                        <LinkM 
                            className={classes.linkm}
                            component={Link} 
                            to={'/registros'}
                        >
                            REGISTROS
                        </LinkM>
                    </Typography>
                            :
                    null
                }
                { logged && !admin ?
                    <Typography
                        className={classes.headerMenuItem}
                    >
                        <LinkM 
                            className={classes.linkm}
                            component={Link} 
                            to={`/${usuarioColaborador}/registrar`}
                        >
                            REGISTRAR
                        </LinkM>
                    </Typography>
                            :
                    null
                }
            </Box>
            <Typography
                className={classes.loginSair}
            >
              { logged ?
                <LinkM
                    className={classes.linkm}
                    onClick={e=>{
                        doLogout();
                        window.location.href = '/';
                    }}
                >
                    SAIR
                </LinkM>
                           :
                <LinkM 
                    className={classes.linkm}
                    component={Link} 
                    to={'/login'}
                >
                    LOGIN
                </LinkM>
              }
            </Typography>
          </Toolbar>
        </AppBar>
    )
}

Header.propTypes = {
    classes: PropTypes.object.isRequired
}

const styles = {
    linkm: {
        color: '#fff',
        textDecoration: 'none',
        cursor: 'pointer',
        border: 'none',
        background: 'rgba(0,0,0,0)',
        padding: '0',

    },
    boxSpan: {
        display: 'flex',
    },
    headerTitle: {
        marginRight: '1.6em',
        fontWeight: 'bold',
        color: '#fff',
        textDecoration: 'none !important'
    },
    headerMenuItem: {
        padding: '0 .8em'
    },
    loginSair: {
        marginLeft: 'auto',
        fontWeight: 'bold'
    }
}

export default withStyles(styles)(Header);