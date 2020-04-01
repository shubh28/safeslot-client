import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Container as DefaultContainer
} from "reactstrap";
import axios from "axios";

import { useLocation, Link } from "react-router-dom";
import { API_URL } from "../../consts";
import styled from "styled-components";
import { ReactComponent as Back } from "../../assets/back.svg";
import { ReactComponent as GroceryBack } from "../../assets/grocery.svg";
import { loadState } from "../../helpers/LocalStorage";
import SelectSlotModal from "./SlotsModal";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function Stores() {
  const query = useQuery();

  const lat = query.get("lat");
  const lng = query.get("lng");
  const [stores, setStores] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState();
  // const [storeSlots, setStoreSlots] = useState({
  //   openSlots: false,
  //   slots: [],
  //   selectedStore: "",
  //   selectedSlot: ""
  // });
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

  // function onModalLoad(storesId) {
  //   if (storeSlots.openSlots) {
  //     setStoreSlots({ ...storeSlots, ...{ openSlots: !storeSlots.openSlots } });
  //   } else {
  //   }
  // }

  // function makeBooking() {
  //   const { isLoggedIn, history } = this.props;
  //   const { selectedStore, selectedSlot } = this.state;
  //   const userId =
  //     loadState("userAuthenticationDetails") &&
  //     loadState("userAuthenticationDetails").userId;
  //   if (!isLoggedIn) {
  //     history.push("/login");
  //   } else {
  //     axios
  //       .post("https://safeslot-backend.herokuapp.com/api/bookings", {
  //         store_id: selectedStore,
  //         slot_id: selectedSlot,
  //         user_id: userId
  //       })
  //       .then(res => {
  //         history.push("/bookings");
  //       })
  //       .catch(err => {
  //         alert("Error while making booking");
  //       });
  //   }
  // }
  // function selectSlot(slot) {
  //   setStoreSlots({ ...storeSlots, selectedSlot: slot });
  // }
  const Header = styled.div`
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-gap: 10px;
    background-color: #000000;
    svg {
      height: 24px;
      width: 24px;
    }
  `;

  const Container = styled(DefaultContainer)`
    padding-top: 10px;
    padding-bottom: 40px;
  `;

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
                      <Button
                        outline
                        color="info"
                        onClick={() => {
                          setSelectedStore(store);
                          console.log(store);
                        }}
                      >
                        Book Slot
                      </Button>
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

      {selectedStore ? (
        <SelectSlotModal
          selectedStore={selectedStore}
          onCloseModal={() => setSelectedStore(undefined)}
        />
      ) : null}
    </>
  );
}

export default Stores;
