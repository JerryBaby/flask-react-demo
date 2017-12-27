import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Navigation from './main';


class App extends Component {
    render() {
        return (
            <Router>
              <Route path="/" component={Navigation} />
            </Router>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('react-demo'));
