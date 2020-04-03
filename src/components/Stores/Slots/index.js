import React, { useState,useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../../../consts";
import { Button } from "reactstrap";

import { loadState } from "../../../helpers/LocalStorage";
import { useHistory } from "react-router-dom";
import { useLocationAndStoreContext } from "../../../contexts/location-and-store-context";

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

function Slots({ availableSlots=[], storeId }) {
  const history = useHistory();
  const {storeSlotId,setStoreSlotId} = useLocationAndStoreContext();

  function makeBooking(slotId) {
    const tokenObj = loadState("userAuthenticationDetails");
    const token = tokenObj && tokenObj.id;
    const userId = tokenObj && tokenObj.userId;
    if (token && userId) {
      axios
        .post(`${API_URL}/bookings`, {
          store_id: storeId,
          slot_id: slotId,
          user_id: userId
        })
        .then(res => {
          console.log("makeBooking successful");
          history.push("/bookings");
        })
        .catch(err => {
          alert("Error while making booking");
        });
    } else {
      setStoreSlotId(slotId)
      history.push("/login");
    }
  }

  return (
    <>
    <SlotWrapper>
      {availableSlots.length ? (
        availableSlots.map(slot => {
          return (
            <>
              {slot && (
                <SlotButton
                  key={slot.id}
                  color="info"
                  outline={!(slot.id===storeSlotId)}
                  size="sm"
                  onClick={() => setStoreSlotId(slot.id)}
                >
                  {`${slot.start_time} - ${slot.end_time}`}
                </SlotButton>
              )}
            </>
          );
        })
      ) : (
        <div>No slots found</div>
      )}

    </SlotWrapper>
    {availableSlots.length  && 
      <Button onClick={()=>makeBooking(storeSlotId)}>Book Slot</Button>}
    </>
  );
}
export default Slots;
