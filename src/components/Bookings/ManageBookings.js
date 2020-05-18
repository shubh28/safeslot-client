import React, { useState } from 'react';
import {Button, Container, Row, Col, Image} from 'react-bootstrap';
import {CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ManageBookings(){
    const [currentToken, setCurrentToken] =  useState(25);
    const [totalToken, setTotalToken] =  useState(30);
    
    const handleClick = (incr) =>{
        setCurrentToken(currentToken+ incr)
    }

    return <>
        <Container className="text-center">
            <Row>
                <Col>
                    <Image src="./assets/safeslot.png" fuid/>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Image src="./assets/store.svg" fluid/>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col >
                    <CircularProgressbar background={"#95ac52"} styles={buildStyles({backgroundColor: '#95ac52', pathColor: '#b5e51d', textColor: 'white'})} value={currentToken} maxValue={totalToken} text={currentToken} />
                    <h4 className="mt-2 font-weight-bold">Current Token</h4>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button onClick={() => handleClick(-1)} variant="secondary">Serve Prev</Button>
                    <Button  onClick={() => handleClick(+1)} variant="secondary">Serve Next</Button>
                </Col>
            </Row>
        </Container>
        </>
}