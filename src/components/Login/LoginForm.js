import React, {PureComponent} from 'react';
import {Form, FormGroup, Input, Button} from 'reactstrap';
import axios from 'axios';

import {saveState, loadState} from '../../helpers/LocalStorage';

export default class LoginForm extends PureComponent {


	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		}
	}

	componentDidMount() {
		const token = loadState('userAuthenticationDetails') && loadState('userAuthenticationDetails').id;
		if (token) {
			this.props.history.push('/');
		}
	}

	onLoginClick = (e) => {
		e.preventDefault();
		const {email, password} = this.state;
		if (email==='' || password === '') {
			alert("Please enter email and password");
		}else {
			// make user sign up
			axios.post("http://localhost:3000/api/users/login", {email, password})
				.then(res => {
					saveState('userAuthenticationDetails', res.data);
					this.props.history.push("/");
					console.log("User info");
				})
				.catch(err => {
					alert("Error in logging user");
				})
		}
	}

	handleChange = (e) => {
		var obj = {...this.state};
		obj[e.target.name] = e.target.value;
		this.setState(obj);
	}

	render() {
		return (
			<Form>
				<FormGroup>
					<Input type="email" value={this.state.email} onChange={this.handleChange} name="email" id="exampleEmail" placeholder="Enter Email" />
				</FormGroup>
				<FormGroup>
					<Input type="password" value={this.state.password} onChange={this.handleChange} name="password" id="examplePassword" placeholder="Enter Password" />
				</FormGroup>
				<p>Don't have account? <a href="#" onClick={this.props.toggleLogin}>Sign Up</a></p>
				<Button type="submit" color="info" onClick={this.onLoginClick}>Login</Button>
			</Form>
		);
	}
}