import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import { Home, Login } from './pages'
import { doLogin, isLogged, doLogout } from './helpers/AuthHandler'


export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              { isLogged() ?
                <a 
                  onClick={e=>{
                    doLogout();
                    window.location.href = '/';
                  }}
                >
                  Sair
                </a>
                           :
                <Link to="/login">Login</Link>
              }
            </li>
          </ul>
        </nav>

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

      </div>
    </Router>
  );
}

function Users() {
  return <h2>Users</h2>;
}