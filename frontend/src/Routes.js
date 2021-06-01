import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import RouteHandler from './components/RouteHandler'

import { Home, Login, Registrar, Registros, Registro } from './pages';

function Routes( { classes } ) {

    return (
        <Container>
            <div className={classes.toolbar} ></div>
            <Switch>
                <RouteHandler exact path="/">
                    <Home/>
                </RouteHandler>
                <RouteHandler public path="/login">
                    <Login/>
                </RouteHandler>
                <RouteHandler private exact path="/registros">
                    <Registros/>
                </RouteHandler>
                <RouteHandler private path="/registros/:id">
                    <Registro/>
                </RouteHandler>
                <RouteHandler private path="/:usuario_colaborador/registrar">
                    <Registrar/>
                </RouteHandler>
                <RouteHandler admin private path="/:usuario_colaborador/validar/:id">
                    <Registro/>
                </RouteHandler>
            </Switch>
        </Container>
    )

}

Routes.propTypes = {
    classes: PropTypes.object.isRequired
}

const styles = (theme) => ({
    toolbar: theme.mixins.toolbar,
})

export default withStyles(styles)(Routes);