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
  const [tokenNumber, setTokenNumber] = useState("");
	const storeId = props.match.params.storeid;
	useEffect(() => {
		axios
			.get(`${API_URL}/stores/${storeId}`)
			.then(res => {
				setStore(res.data);
			});
		getTokenNumber().then(res => {
			setToken(res.data[0] || {});
		});
		setInterval(() => {
			getTokenNumber().then(res => {
				setToken(res.data[0] || {});
			});
		}, 30000);
	}, []);

	const getTokenNumber = () => {
		const date = new Date();
		date.setHours(0)
		date.setMinutes(0)
		date.setSeconds(0)
		date.setMilliseconds(0)

		const filter = {
			"where": {
				"and": [{ "store_id": storeId }, {
					date: {
						gte: date
					}
				}]
			}
		}
		return axios.get(`${API_URL}/tokens?filter=${JSON.stringify(filter)}`)
	}

	const generateToken = () => {

		if (!mobile) {
			alert("Please enter mobile number");
			return;
		}
		const date = new Date();
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		const filter = { 
			"where": { 
				"and": [{ "store_id": storeId }, { "mobile": mobile }, {date: {gte: date}}]
			},
			"order": "token_number DESC"
		}
		axios.get(`${API_URL}/tokenBookings?filter=${JSON.stringify(filter)}`)
			.then(res => {
				const booking = res.data[0] || {};
				if (res.data.length > 0 && booking.token_number >= token.current_token) {
					props.history.push(`/store/${storeId}/token/status/${mobile}`);
				} else {
					getTokenNumber().then(res => {
						const tokenInfo = res.data[0] || {};
						const body = {
							store_id: storeId,
							mobile,
							token_number: tokenInfo.next_assign_token + 1 || 1,
							date
						};
						axios.post(`${API_URL}/tokenBookings`, {...body}).then(res => {
              setTokenNumber(`Token Number ${res.data.token_number} generated for Mobile:${res.data.mobile}`);
							if (!tokenInfo.id) {

								const body = {
									date,
									next_assign_token: 1,
									current_token: 1,
									store_id: storeId
								}
								axios.post(`${API_URL}/tokens`, {...body})
									.then(r => {
										props.history.push(`/store/${storeId}/token/status/${mobile}`);
									}).catch(err => {
										alert("Some error occurred. Please try again");
									})
							} else {
								axios.patch(`${API_URL}/tokens/${tokenInfo.id}`, { next_assign_token: tokenInfo.next_assign_token + 1 })
								.then(res => {
									props.history.push(`/store/${storeId}/token/status/${mobile}`);	
								}).catch(err => {
									alert("Some error occurred. Please try again");
								})

							}
						}).catch(err => {
							alert("Some error occurred. Please try again");
						});
					})

				}
			})
	}

	const viewToken = () => {
		if (!mobile) {
			alert("Enter mobile number");
			return;
		}
		props.history.push(`/store/${storeId}/token/status/${mobile}`);
	}

  let standalone = (
    <div>
      <img src={safeslot} width="100%" style={{marginBottom: "18px"}} />
			<Card>
				<CardBody className="text-center">
					<img src={storesvg} style={{ margin: "auto", display: "block" }} />
					<h2 >Create a Token for {store.name}</h2>
				</CardBody>
			</Card>
			<br></br>
    </div>
  );

  if (props.fromOwnerPage)
    standalone = "";

	return(
		<>
			{standalone}
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
        {tokenNumber}
			</FormGroup>
		</>
	)
}