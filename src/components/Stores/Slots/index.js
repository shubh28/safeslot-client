import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { API_URL, URL_REFS } from '../../../common/consts';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

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
  .before {
    display: inline;
  }
  .after {
    display: none;
  }
  :hover .before {
    display: none;
  }
  :hover .after {
    display: inline;
  }
`;

const NoSlotButton = styled(Button)`
  :disabled {
    color: black;
    background-color: white;
    border-color: red;
    opacity: 100;
    :hover {
      opacity: 80%;
      background: red;
      border-color: red;
      color: white;
    }
  }
`;

const MakeBookingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SlotMsg = styled.div`
  font-size: 1rem;
`;

function Slots({ availableSlots = [], storeId, showError, isVerified }) {
  const history = useHistory();
  const { storeSlotId, setStoreSlotId } = useLocationAndStoreContext();
  const [slotsLeftMsg, setSlotsLeftMsg] = React.useState();

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
          availableSlots
            .filter(
              slot => slot.maximun_people_allowed - slot.bookings.length > 0
            )
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
                      size="sm"
                      onClick={() => {
                        setStoreSlotId({
                          storeId: storeId,
                          slotId: slot.id,
                          slotObj: slot
                        });
                        setSlotsLeftMsg(
                          isVerified
                            ? `${slot.maximun_people_allowed -
                                slot.bookings.length}
                        slots left`
                            : `${slot.bookings.length} bookings`
                        );
                        console.log(slot);
                      }}
                    >
                      <span className="before">
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
                      </span>
                      <span className="after">
                        {isVerified
                          ? `${slot.maximun_people_allowed -
                              slot.bookings.length}
                  slots left`
                          : `${slot.bookings.length} bookings`}
                      </span>
                    </SlotButton>
                  )}
                </span>
              );
            })
        ) : (
          <NoSlotButton disabled={true}>No Slots Found</NoSlotButton>
        )}
      </SlotWrapper>
      <div style={{display: 'flex', alignItems: 'center', 'justifyContent': 'space-between'}}>
        {availableSlots.length ? (
          <MakeBookingWrapper>
            <Button color="info" onClick={() => makeBooking(storeSlotId)}>
              Book This Slot
          </Button>
            <SlotMsg>{slotsLeftMsg}</SlotMsg>
          </MakeBookingWrapper>
        ) : null}
        <Link to={`/store/${storeId}/token`}>
          <Button color="success">
            Generate Token
        </Button>
        </Link>        
      </div>
    </>
  );
}
export default Slots;
