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
      const { data: store } = await axios.get(
        `${API_URL}/stores/findOne?filter[where][id]=${storeid}&filter[include][stores_slots]`
      );
      setStoreData(store);
    }
    try {
      fetchStoreData().then(() => setLoaded(true));
    } catch (err) {
      console.err(err);
    }
  }, []);

  return (
    <>
      <Header heading={'Store Viewer'} backPath={'/stores'} />
      {loaded ? (
        <GridContainer>
          <FlexContainer>
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
                    {storeData.address}, {storeData.locality}, {storeData.city}
                  </div>
                  <div className="distance">
                    {storeData.distance
                      ? `${Math.floor(storeData.distance * 100) / 100}kms`
                      : ''}
                  </div>
                </HeaderDataContainer>
              </CardBody>
            </Card>
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
