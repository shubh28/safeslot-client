import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../../../consts";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { loadState } from "../../../helpers/LocalStorage";

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

function Slots({ availableSlots }) {
  //   const [availableSlots, setAvailableSlots] = useState([]);
  //   const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(undefined);

  //   useEffect(() => {
  //     setLoadingSlots(true);
  //     const filter = { where: { storesId: storeId }, include: "slots" };
  //     axios
  //       .get(`${API_URL}stores_slots_counts?filter=${JSON.stringify(filter)}`)
  //       .then(res => {
  //         setAvailableSlots(res.data);
  //       })
  //       .catch(err => {
  //         alert("Some error while fetching stores");
  //       })
  //       .finally(() => setLoadingSlots(false));
  //   }, [storeId]);

  function makeBooking() {
    const { isLoggedIn, history } = this.props;
    const { selectedStore, selectedSlot } = this.state;
    const userId =
      loadState("userAuthenticationDetails") &&
      loadState("userAuthenticationDetails").userId;
    if (!isLoggedIn) {
      history.push("/login");
    } else {
      axios
        .post(`${API_URL}bookings`, {
          store_id: selectedStore,
          slot_id: selectedSlot,
          user_id: userId
        })
        .then(res => {
          history.push("/bookings");
        })
        .catch(err => {
          alert("Error while making booking");
        });
    }
  }

  return (
    // <Modal isOpen={!!storeId} toggle={onCloseModal}>
    //   <ModalHeader toggle={onCloseModal}>Select your slot</ModalHeader>
    //   <ModalBody>

    <SlotWrapper>
      {//   loadingSlots ? (
      //     <div>Loading slots...</div>
      //   ) :

      availableSlots.length ? (
        availableSlots.map(slot => {
          return (
            <>
              {slot && (
                <SlotButton
                  key={slot.id}
                  color="info"
                  outline={
                    slot &&
                    availableSlots.selectedSlot !==
                      `${slot.start_time} - ${slot.end_time}`
                  }
                  size="sm"
                  onClick={() => {
                    slot &&
                      setSelectedSlot(`${slot.start_time} - ${slot.end_time}`);
                  }}
                >
                  {slot && `${slot.start_time} - ${slot.end_time}`}
                </SlotButton>
              )}
            </>
          );
        })
      ) : (
        <div>No slots found</div>
      )}
      {/* </ModalBody>
      <ModalFooter>
         <Button color="info" onClick={makeBooking} disabled={!selectedSlot}>
          Book Now
        </Button>{" "} }
        <Button color="info" outline onClick={onCloseModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal> */}
    </SlotWrapper>
  );
}
export default Slots;
