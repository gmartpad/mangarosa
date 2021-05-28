import './App.css';

import PropTypes from 'prop-types';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import { Home, Login } from './pages'
import { Header } from './components';
import { Container } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

function App( { classes } ) {
  return (
    <Router>
      <Header/>
      <Container>
        <div className={classes.toolbar} ></div>
        <Switch>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/users">
            <Users/>
          </Route>
          <Route exact path="/">
            <Home/>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

function Users() {
  return <h2>Users</h2>;
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

const styles = (theme) => ({
  toolbar: theme.mixins.toolbar,
})

export default withStyles(styles)(App);