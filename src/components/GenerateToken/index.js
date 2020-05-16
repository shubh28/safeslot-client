import React, {useState, useEffect} from 'react';
import { Card, CardBody, FormGroup, Input, Button } from 'reactstrap';
import axios from 'axios';

import { Header } from '../common';
import { API_URL } from '../../common/consts';

import safeslot from '../../assets/safeslot.png';
import storesvg from '../../assets/storesvg.svg';

export default (props) => {
	const [store, setStore] = useState({});
	const [mobile, setMobile] = useState('');
	const [token, setToken] = useState({});
	const storeId = props.match.params.storeid;
	useEffect(() => {
		axios
			.get(`${API_URL}/stores/${storeId}`)
			.then(res => {
				setStore(res.data);
			});
		getTokenNumber();
		setInterval(() => {
			getTokenNumber();
		}, 30000);
	}, []);

	const getTokenNumber = () => {
		const date = new Date();
		date.setHours = 0;
		date.setMinutes = 0;
		date.setSeconds = 0;
		date.setMilliseconds = 0;
		const filter = {
			store_id: storeId,
			date: {
				gt: date
			}
		};
		axios
			.get(`${API_URL}/tokens?filter=${JSON.stringify(filter)}`)
			.then(res => {
				setToken(res.data[0] || {});
			})
	}

	const generateToken = () => {
		
	}

	const viewToken = () => {
		if (!mobile) {
			alert("Enter mobile number");
			return;
		}
		props.history.push(`/store/${storeId}/token/status/${mobile}`);
	}

	return(
		<>
			<img src={safeslot} width="100%" style={{marginBottom: "18px"}} />
			<Card>
				<CardBody className="text-center">
					<img src={storesvg} style={{ margin: "auto", display: "block" }} />
					<h2 >Take your token of</h2>
					<div style={{background: "#eee", padding: "4px"}} > <h3>{store.name}</h3></div>
					<h4>Current Token Number is <strong>{token.current_token || 0}</strong></h4>
				</CardBody>
			</Card>
			<br></br>
			<FormGroup>
				<Input 
					type="tel" 
					placeholder="Enter Mobile Number" 
					onChange={(e) => setMobile(e.target.value)}
					value={mobile}
				/>
			</FormGroup>
			<FormGroup>
				<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
					<Button
						color="info"
						style={{width: "50%"}}
						onClick={generateToken}
					>
						Generate token
	               	</Button>
					<Button
						color="info"
						style={{ width: "50%" }}
						onClick={viewToken}
					>
						View your token
	               	</Button>
				</div>
			</FormGroup>
		</>
	)
}