import React, {useState, useEffect}  from 'react';
import { Card, CardBody, FormGroup, Input, Button, Container, Row, Col } from 'reactstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import axios from 'axios';

import { Header } from '../common';
import { API_URL } from '../../common/consts';

import safeslot from '../../assets/safeslot.png';
import storesvg from '../../assets/storesvg.svg';

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
                console.log(store)
            });

        //search for token booking
        const date = new Date();
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		const tokenBookingFilter = { "where": { "and": [{ "store_id": storeid }, { "mobile": phone }, {date: {gte: date}}] } }
        axios
            .get(`${API_URL}/tokenBookings?filter=${JSON.stringify(tokenBookingFilter)}`)
            .then(res => {
                res.data && res.data.length>0 && updateUserToken(res.data[0].token_number)
            })

        //search for current token
        const tokenFilter = { "where": { "store_id": storeid }}
        axios
            .get(`${API_URL}/tokens?filter=${JSON.stringify(tokenFilter)}`)
            .then(res => {
                res.data && res.data.length>0  && updateCurrentToken(res.data[0].current_token)
            })
            
	}, []);

	return(
		<>
			<img src={safeslot} width="100%" style={{marginBottom: "18px"}} />
			<Card>
				<CardBody className="text-center">
                <img src={storesvg} style={{  display: "block" }} />
                <div style={{background: "#eee", padding: "4px" }} > <h3>{store.name}</h3></div>
				</CardBody>
			</Card>
			<br></br>
            <CircularProgressbar value={currentToken} text={userToken} minValue={0} maxValue={currentToken} />
			{/* <FormGroup>
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
			</FormGroup> */}
		</>
	)
}