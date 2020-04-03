import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import axios from "axios";

import { useLocation, Link } from "react-router-dom";
import { API_URL } from "../../consts";
import styled from "styled-components";
import { ReactComponent as Back } from "../../assets/back.svg";
import { ReactComponent as GroceryBack } from "../../assets/grocery.svg";
import Slots from "./Slots";
import { Container } from "../../styles";
import { Header } from "../common";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function Stores() {
  const query = useQuery();

  const lat = query.get("lat");
  const lng = query.get("lng");
  const [stores, setStores] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_URL}/stores/location?lat=${lat}&lng=${lng}`)
      .then(res => {
        const stores = res.data.map(store => {
          const { stores_slots_count, ...others } = store;
          const slots = stores_slots_count.map(store_slot => store_slot.slots);
          return {
            ...others,
            slots
          };
        });
        console.log({ data: stores });

        setStores(stores);
      })
      .catch(err => {
        alert("Some error while fetching stores");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lat, lng]);




  const HeaderDataContainer = styled.div`
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "logo title"
      "logo address"
      "logo distance";

    .logo {
      grid-area: logo;
      width: 75px;
      height: 75px;
      margin: auto;
    }
    .title {
      grid-area: title;
    }
    .address {
      grid-area: address;
      font-size: 1rem;
    }
    .distance {
      grid-area: distance;
      font-size: 0.8rem;
    }
  `;
  return (
    <>
       <Header heading='place name' backPath={'/'} /> 
         
     
      <Container className="theme-Container" fluid={true}>
        <div>
          {loading || !stores ? (
            <div>Loading...</div>
          ) : stores.length ? (
            <>
              {stores.map(store => {
                return (
                  <Card key={store.id}>
                    <CardBody>
                      <HeaderDataContainer>
                        <GroceryBack className="logo" />
                        <CardTitle className="title">
                          <strong>{store.name}</strong>
                        </CardTitle>
                        <div className="address">
                          {store.address}, {store.locality}, {store.city}
                        </div>
                        <div className="distance">
                          {store.distance
                            ? `${Math.floor(store.distance * 100) / 100}kms`
                            : ""}
                        </div>
                      </HeaderDataContainer>
                      <Slots availableSlots={store.slots} storeId={store.id} />
                      {/* <Button
                        outline
                        color="info"
                        onClick={() => {
                          setSelectedStore(store);
                          console.log(store);
                        }}
                      >
                        Book Slot
                      </Button> */}
                    </CardBody>
                  </Card>
                );
              })}
            </>
          ) : (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
              <h3>
                Sorry! the stores around the location are yet not registered.
              </h3>
              <h6>
                We are working hard to reach, meanwhile please be careful and
                stay safe!
              </h6>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}

export default Stores;
