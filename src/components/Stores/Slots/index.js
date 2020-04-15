import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { API_URL, URL_REFS } from '../../../common/consts';
import { Button } from 'reactstrap';

import { loadState } from '../../../helpers/LocalStorage';
import { useHistory } from 'react-router-dom';
import { useLocationAndStoreContext } from '../../../contexts/location-and-store-context';

const SlotWrapper = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  font-size: 0.8rem;
`;

const SlotButton = styled(Button)`
  font-size: 0.8rem;
  padding: 0.175rem 0.8rem;
`;

function Slots({ availableSlots = [], storeId, showError }) {
  const history = useHistory();
  const { storeSlotId, setStoreSlotId } = useLocationAndStoreContext();

  function makeBooking({ storeId: bookingStoreId, slotId: bookingSlotId }) {
    const tokenObj = loadState('userAuthenticationDetails');
    const token = tokenObj && tokenObj.id;
    const userId = tokenObj && tokenObj.userId;
    if (token && userId) {
      axios
        .get(
          `${API_URL}/booking-slot/status?storeId=${bookingStoreId}&slotId=${bookingSlotId}`
        )
        .then(res => {
          if (res.data.message === 'Success') {
            axios
              .post(`${API_URL}/bookings`, {
                store_id: bookingStoreId,
                slot_id: bookingSlotId,
                user_id: userId
              })
              .then(res => {
                history.push('/bookings');
              })
              .catch(err => {
                showError('danger', 'Error while making booking');
              });
          } else {
            showError(
              'danger',
              'Some error while validating slot. Please try again'
            );
          }
        })
        .catch(err => {
          if (err.response && err.response.status === 400) {
            showError('danger', err.response.data.message);
          } else {
            showError('danger', 'Some error occurred.');
          }
        });
    } else {
      setStoreSlotId({ slotId: bookingSlotId, storeId: bookingStoreId });
      history.push(`/login?ref=${URL_REFS.stores}`);
    }
  }

  return (
    <>
      <SlotWrapper>
        {availableSlots.length ? (
          availableSlots.map(slot => {
            return (
              <span key={slot.id}>
                {slot && (
                  <SlotButton
                    color="info"
                    outline={
                      !(
                        slot.id === storeSlotId.slotId &&
                        storeId === storeSlotId.storeId
                      )
                    }
                    size="sm"
                    onClick={() =>
                      setStoreSlotId({ storeId: storeId, slotId: slot.id })
                    }
                  >
                    {`${slot.start_hours
                      .toString()
                      .padStart(
                        2,
                        '0'
                      )}:${slot.start_minutes
                      .toString()
                      .padStart(2, '0')} - ${slot.end_hours
                      .toString()
                      .padStart(2, '0')}:${slot.end_minutes
                      .toString()
                      .padStart(2, '0')}`}
                  </SlotButton>
                )}
              </span>
            );
          })
        ) : (
          <div>No slots found</div>
        )}
      </SlotWrapper>
      {availableSlots.length ? (
        <Button color="info" onClick={() => makeBooking(storeSlotId)}>
          Book Slot
        </Button>
      ) : null}
    </>
  );
}
export default Slots;
