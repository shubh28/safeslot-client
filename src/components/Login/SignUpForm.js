import React, {PureComponent} from 'react';
import {Form, FormGroup, Input, Button} from 'reactstrap';

export default class SignUpForm extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			phone: '',
			password: ''
		}
	}

	onLoginClick = (e) => {
		e.preventDefault();
		const {email, phone, name, password} = this.state;
		if (email==='' || password === '' || phone === '' || name === '') {
			alert("All fields are mandatory. Please try again");
		}else {
			// make user sign up
		}
	}

	handleChange = (e) => {
		var obj = {...this.state};
		obj[e.target.name] = e.target.value;
		this.setState(obj);
	}

	render() {
		const {email, phone, name, password} = this.state;
		return (
			<Form>
				<FormGroup>
					<Input type="text" value={name} onChange={this.handleChange} name="name" placeholder="Enter name" />
				</FormGroup>
				<FormGroup>
					<Input type="email" value={email} onChange={this.handleChange} name="email" placeholder="Enter Email" />
				</FormGroup>
				<FormGroup>
					<Input type="number" value={phone} onChange={this.handleChange} name="phone" placeholder="Enter Contact Number" />
				</FormGroup>
				<FormGroup>
					<Input type="password" value={password} onChange={this.handleChange} name="password" placeholder="Enter Password" />
				</FormGroup>
				<p>Alrady have account? <a href="#" onClick={this.props.toggleLogin}>Login</a></p>
				<Button color="info">SignUp</Button>
			</Form>
		);
	}
}