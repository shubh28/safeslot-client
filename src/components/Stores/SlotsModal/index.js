import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./../../../consts";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

function SelectSlotModal({ selectedStore: { id: storeId }, onCloseModal }) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(undefined);
  const [displayModal, setDisplayModal] = useState(false);

  useEffect(() => {
    setDisplayModal(!!storeId);

    setLoadingSlots(true);
    const filter = { where: { storesId: storeId }, include: "slots" };
    axios
      .get(`${API_URL}stores_slots_counts?filter=${JSON.stringify(filter)}`)
      .then(res => {
        setAvailableSlots(res.data);
      })
      .catch(err => {
        alert("Some error while fetching stores");
      })
      .finally(() => setLoadingSlots(false));
  }, [storeId]);

  return (
    <Modal isOpen={!!storeId} toggle={onCloseModal}>
      <ModalHeader toggle={onCloseModal}>Select your slot</ModalHeader>
      <ModalBody>
        {loadingSlots ? (
          <div>Loading slots...</div>
        ) : availableSlots.length ? (
          availableSlots.map(slot => {
            return (
              <Button
                key={slot.id}
                color="info"
                outline={
                  slot.slots &&
                  availableSlots.selectedSlot !==
                    `${slot.slots.start_time} - ${slot.slots.end_time}`
                }
                size="sm"
                onClick={() => {
                  slot.slots &&
                    setSelectedSlot(
                      `${slot.slots.start_time} - ${slot.slots.end_time}`
                    );
                }}
              >
                {slot.slots &&
                  `${slot.slots.start_time} - ${slot.slots.end_time}`}
              </Button>
            );
          })
        ) : (
          <div>No slots found</div>
        )}
      </ModalBody>
      <ModalFooter>
        {/*  <Button
          color="info"
          onClick={makeBooking}
          disabled={storeSlots.selectedSlot === ""}
        >
          Book Now
        </Button>{" "}*/}
        <Button color="info" outline onClick={onCloseModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
export default SelectSlotModal;
