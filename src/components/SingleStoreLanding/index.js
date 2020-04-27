import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import { API_URL } from '../../common/consts';
import { formatStoreHours } from '../../helpers/formatStoreHours';
import { Header } from '../common';
import { FlexContainer, LoaderContainer, LoaderWheel } from './styles';
import SlotCard from './SlotCard';
const grocery = require('../../assets/home.jpg');

const SingleStoreLanding = function() {
  const { storeid } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [storeData, setStoreData] = useState();

  useEffect(() => {
    async function fetchStoreData() {
      const { data: store } = await axios.get(
        `${API_URL}/stores/findOne?filter[where][id]=${storeid}&filter[include][stores_slots]`
      );
      console.log(store);
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
      <Header heading={'Store View'} backPath={'/stores'} />
      {loaded ? (
        <FlexContainer direction="column">
          <h2>{storeData.name}</h2>
          <FlexContainer>
            <img src={grocery} width="50%" />
            <FlexContainer direction="column">
              <h6>{storeData.address}</h6>
              <h6>{storeData.city}</h6>
              <h6>{storeData.locality}</h6>
              <h6>{formatStoreHours(storeData)}</h6>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer direction="column">
            {storeData.stores_slots.map(slot => (
              <SlotCard key={slot.id} slot={slot} />
            ))}
          </FlexContainer>
        </FlexContainer>
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
