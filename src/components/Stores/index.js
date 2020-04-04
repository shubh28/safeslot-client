import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Badge } from 'reactstrap';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { API_URL } from '../../common/consts';
import styled from 'styled-components';
import { ReactComponent as Back } from '../../assets/back.svg';
import { ReactComponent as GroceryBack } from '../../assets/grocery.svg';
import Slots from './Slots';
import { Container } from '../../styles';
import { Header } from '../common';
import { useLocationAndStoreContext } from '../../contexts/location-and-store-context';

function Stores() {
  const [stores, setStores] = useState();
  const [loading, setLoading] = useState(false);
  const {
    location: { latitude: lat, longitude: lng }
  } = useLocationAndStoreContext();

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
        alert('Some error while fetching stores');
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
      'logo title'
      'logo address'
      'logo distance';

    .logo {
      grid-area: logo;
      width: 75px;
      height: 75px;
      margin: auto;
    }
    .title {
      grid-area: title;

      .badge {
        float: right;
      }
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
      <Header heading="place name" backPath={'/'} />

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
                          {store.isVerified ? (
                            <Badge className="badge" color="success">
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="badge" color="warning">
                              Not Verified
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="address">
                          {store.address}, {store.locality}, {store.city}
                        </div>
                        <div className="distance">
                          {store.distance
                            ? `${Math.floor(store.distance * 100) / 100}kms`
                            : ''}
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
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
              <div className="emptySearch">
                Sorry we could not find any store near you. Want to refer nearby
                stores?
                <Button tag={Link} to="/refer" outline color="info">
                  Refer Stores
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}

export default Stores;
