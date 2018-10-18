import React from "react";
import ReactDOM from "react-dom";
import render from "react-dom";
import {Router, Route, browserHistory, IndexRoute} from "react-router";

import {Root} from "./Components/Root";
import {Login} from "./Components/Login";
import {PersonalInformation} from "./Components/PersonalInformation";
import {Email} from "./Components/Email";
import {Password} from "./Components/Password";
import {Phone} from "./Components/Phone";


class App extends React.Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path={"/"} component={Root} >
                    <IndexRoute component={Login} />
                    <Route path={"personal_information"} component={PersonalInformation} />
                    <Route path={"email"} component={Email} />
                    <Route path={"phone"} component={Phone} />
                    <Route path={"password"} component={Password} />
                </Route>
            </Router>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;