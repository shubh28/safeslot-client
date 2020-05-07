import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import { API_URL } from '../../common/consts';
import { formatStoreHours } from '../../helpers/formatStoreHours';
import { Header } from '../common';
import {
  FlexContainer,
  LoaderContainer,
  LoaderWheel,
  GridContainer,
  HeaderDataContainer
} from './styles';
import { ReactComponent as GroceryBack } from '../../assets/grocery.svg';
import { Card, CardBody, CardTitle, Badge } from 'reactstrap';
import Alerts from '../Alerts';
import ExpandedSlots from './ExpandedSlots';
const grocery = require('../../assets/home.jpg');

const SingleStoreLanding = function() {
  const { storeid } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [storeData, setStoreData] = useState();
  const [error, setError] = useState({ type: '', message: '' });

  const showError = (type, message) => setError({ type, message });
  const closeError = () => setError({ type: '', message: '' });

  useEffect(() => {
    async function fetchStoreData() {
      let hours = new Date().getUTCHours() + 5;
      hours %= 24;
      console.log(hours);
      const filter = JSON.stringify({
        where: {
          isOperating: true,
          id: storeid
        },
        include: [
          {
            relation: 'stores_slots',
            scope: {
              where: {
                start_hours: {
                  gt: hours
                }
              }
            }
          }
        ]
      });
      const { data: store } = await axios.get(
        `${API_URL}/stores/findOne?filter=${filter}`
      );
      // need some error handling if url is incorrect
      if (store === null) {
        showError('danger', 'Store not found');
      }
      setStoreData(store);
    }
    try {
      fetchStoreData().then(() => setLoaded(true));
    } catch (err) {
      console.err(err);
      setLoaded(true);
    }
  }, []);

  return (
    <>
      <Header heading={'Store Viewer'} backPath={'/stores'} />
      {loaded ? (
        <GridContainer>
          <FlexContainer>
            {storeData !== null ? (
              <Card key={storeData.id}>
                <CardBody>
                  <HeaderDataContainer>
                    <GroceryBack className="logo" />
                    <CardTitle className="title">
                      <strong>{storeData.name}</strong>
                      {storeData.isVerified ? (
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
                      {storeData.address}, {storeData.locality},{' '}
                      {storeData.city}
                    </div>
                  </HeaderDataContainer>
                </CardBody>
              </Card>
            ) : null}
            <Alerts
              type={error.type}
              message={error.message}
              onClose={closeError}
            />
          </FlexContainer>
          <ExpandedSlots
            availableSlots={storeData.stores_slots}
            storeId={storeData.id}
            showError={showError}
          />
        </GridContainer>
      ) : (
        <LoaderContainer>
          <LoaderWheel color="primary" />
          <h1>Loading ...</h1>
        </LoaderContainer>
      )}
    </>
  );
};

export default SingleStoreLanding;
