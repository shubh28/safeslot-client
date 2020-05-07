import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { API_URL, URL_REFS } from '../../common/consts';
import { Button } from 'reactstrap';

import { loadState } from '../../helpers/LocalStorage';
import { useHistory } from 'react-router-dom';
import { useLocationAndStoreContext } from '../../contexts/location-and-store-context';
import { FlexContainer, NoSlots } from './styles';

const SlotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  width: 100%;
  font-size: 1rem;
  overflow-y: scroll;
  height: 40vh;
`;

const SlotButton = styled(Button)`
  width: 80%;
  padding: 0.175rem 0.8rem;
`;

const BookSlotButton = styled(Button)`
  padding: 0.175rem 0.8rem;
  width: 5rem;
`;

function ExpandedSlots({ availableSlots = [], storeId, showError }) {
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
    <FlexContainer direction="column" alignItems="center">
      <h4 style={{ textAlign: 'center' }}>Available Times</h4>
      <FlexContainer direction="row">
        <SlotWrapper>
          {availableSlots.length ? (
            availableSlots
              .sort((a, b) => {
                // sorting in front end for now, as I don't know how to formulate Looback queries with nesting in the url
                if (a.start_hours > b.start_hours) {
                  return 1;
                } else if (a.start_hours == b.start_hours) {
                  if (a.start_minutes > b.start_minutes) {
                    return 1;
                  } else {
                    return -1;
                  }
                } else {
                  return -1;
                }
              })
              .map(slot => {
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
                        // size="sm"
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
                          .padStart(
                            2,
                            '0'
                          )} - ${slot.end_hours
                          .toString()
                          .padStart(
                            2,
                            '0'
                          )}:${slot.end_minutes.toString().padStart(2, '0')}`}
                      </SlotButton>
                    )}
                  </span>
                );
              })
          ) : (
            <NoSlots>No Slots Found</NoSlots>
          )}
        </SlotWrapper>
        {availableSlots.length ? (
          <FlexContainer direction="column" alignItems="center">
            <h5>Choose a time and then:</h5>
            <BookSlotButton
              color="info"
              onClick={() => makeBooking(storeSlotId)}
            >
              Book Slot
            </BookSlotButton>
          </FlexContainer>
        ) : null}
      </FlexContainer>
    </FlexContainer>
  );
}
export default ExpandedSlots;
