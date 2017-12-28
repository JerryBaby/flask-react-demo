import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import Navigation from './main';
import WrappedRegistrationForm from './auth/register';
import WrapperLoginForm from './auth/login';


class App extends Component {
    render() {
        return (
            <Router>
              <Switch>
                <Route path="/auth/register" component={WrappedRegistrationForm} />
                <Route path="/auth/login" component={WrapperLoginForm} />
                <Route path="/" component={Navigation} />
              </Switch>
            </Router>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('react-demo'));
