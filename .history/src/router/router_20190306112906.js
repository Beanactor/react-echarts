import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import loginComponent from '../components/login/loginComponent';
// import registerComponent from '../components/registerComponent';
import app from '../pages/app/app';
export default class AppRouter extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<BrowserRouter>
                <Switch>
                    <Route exact path="/login/:id" component={loginComponent}></Route>
                    <Route exact path="/app/:id" component={app}></Route>
                    <Route exact path="/registerComponent" component={registerComponent}></Route>
                </Switch>
            </BrowserRouter>
		)
	}
}