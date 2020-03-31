import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container as DefaultContainer
} from "reactstrap";
import axios from "axios";

import { useLocation, Link } from "react-router-dom";
import { API_URL } from "../../consts";
import styled from "styled-components";
import { ReactComponent as Back } from "../../assets/back.svg";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function Stores() {
  const query = useQuery();

  const lat = query.get("lat");
  const lng = query.get("lng");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}stores/location?lat=${lat}&lng=${lng}`)
      .then(res => {
        setStores(res.data);
      })
      .catch(err => {
        alert("Some error while fetching stores");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lat, lng]);

  const Header = styled.div`
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-gap: 10px;
    background-color: #000000;
  `;

  const Container = styled(DefaultContainer)`
    padding-top: 10px;
    padding-bottom: 40px;
  `;
  return (
    <>
      <Header>
        <div>
          <Link to={"/"}>
            <Button>
              <Back />
            </Button>
          </Link>
        </div>
        <div></div>
      </Header>
      <Container className="theme-Container" fluid={true}>
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : stores.length ? (
            <>
              {stores.map(store => {
                return (
                  <Card key={store.id}>
                    <CardBody>
                      <CardTitle>
                        <h3>{store.name}</h3>
                      </CardTitle>
                      <CardSubtitle>
                        {store.address}, {store.locality}, {store.city}
                      </CardSubtitle>
                      <Button
                        outline
                        color="info"
                        onClick={() => this.toggleModal(store.id)}
                      >
                        Book Slot
                      </Button>
                    </CardBody>
                  </Card>
                );
              })}
            </>
          ) : (
            <>
              <h3>Sorry! No stores found around this location.</h3>
              <h6>
                We are working hard to reach, meanwhile please be careful and
                stay safe!
              </h6>
            </>
          )}
        </div>
      </Container>
    </>
  );
}

export default Stores;
