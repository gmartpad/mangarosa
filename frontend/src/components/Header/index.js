import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isLogged, doLogout } from '../../helpers/AuthHandler';
import { AppBar, Toolbar, Typography, Link as LinkM, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

function Header( { classes } ) {
    return (
        <AppBar color="secondary">
          <Toolbar>
            <Typography 
                className={classes.headerTitle}
                variant="h5"
            >
                MANGA ROSA
            </Typography>
            <Box
                className={classes.boxSpan} 
                component="span"
            >
                <Typography
                    className={classes.headerMenuItem}
                >
                    <LinkM 
                        className={classes.linkm}
                        component={Link} 
                        to={'/'}
                    >
                        HOME
                    </LinkM>
                </Typography>
            </Box>
            <Typography
                className={classes.loginSair}
            >
              { isLogged() ?
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
        textDecoration: 'none'
    },
    boxSpan: {
        display: 'flex',
    },
    headerTitle: {
        marginRight: '1.6em',
        fontWeight: 'bold'
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