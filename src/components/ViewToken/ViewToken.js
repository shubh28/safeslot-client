import React, {useState, useEffect}  from 'react';
import { Card, CardBody, FormGroup, Input, Button, Container, Row, Col } from 'reactstrap';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import axios from 'axios';

import { Header } from '../common';
import { API_URL } from '../../common/consts';

import safeslot from '../../assets/safeslot.png';
import storesvg from '../../assets/storesvg.svg';
import safeslotIcon from '../../assets/safeslot_icon.png';

export default (props) => {
    const { storeid, phone } = props.match.params;
    const [store, setStore] = useState({});
    const [currentToken , updateCurrentToken ] = useState(0);
    const [userToken , updateUserToken ] = useState(0);
	useEffect(() => {
        //search for storeName
		axios
			.get(`${API_URL}/stores/${storeid}`)
			.then(res => {
                setStore(res.data);
            });

        //search for token booking
        const date = new Date();
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		const tokenBookingFilter = { 
			"where": { 
				"and": [{ "store_id": storeid }, { "mobile": phone }, {date: {gte: date}}]
			},
			"order": "token_number DESC"
		}
        axios
            .get(`${API_URL}/tokenBookings?filter=${JSON.stringify(tokenBookingFilter)}`)
            .then(res => {
                res.data && res.data.length>0 && updateUserToken(res.data[0].token_number)
            })            
		getTokenNumber();
		setInterval(() => {
			getTokenNumber();
		}, 20000)
	}, []);

	const getTokenNumber = () => {
		const date = new Date();
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		
		//search for current token

		const tokenFilter = { "where": { "and": [{ "store_id": storeid }, { date: { gte: date } }] } }
		axios
			.get(`${API_URL}/tokens?filter=${JSON.stringify(tokenFilter)}`)
			.then(res => {
				res.data && res.data.length > 0 && updateCurrentToken(res.data[0].current_token)
			})

	};

	return(
		<>
			<img src={safeslot} width="100%" style={{marginBottom: "18px"}} />
			<Card>
				<CardBody className="text-center">
                <img src={storesvg} style={{ margin: "auto", display: "block" }} />
                <div style={{background: "#eee", padding: "4px" }} > <h3>{store.name}</h3></div>
				</CardBody>
			</Card>
			<br></br>
      {
        currentToken > 0 && userToken > 0 && 
          <CircularProgressbarWithChildren background value={currentToken} maxValue={userToken}>
            <img src={safeslotIcon} style={{position: "absolute", marginTop: "50%", height: "80%", width: "40%"}} />
          </CircularProgressbarWithChildren>
      }
            
      <h4 className="text-center">Current Token</h4>
      <br></br>
      <h2>Your Token: {userToken}</h2>
	    <br></br>
	    <br></br>
	    <br></br>
	    <br></br>

		</>
	)
}
