import React from 'react';
import styled from 'styled-components';
import { formatSlotHours } from '../../helpers/formatStoreHours';

const SlotCard = function({ slot }) {
  const {
    start_hours,
    start_minutes,
    end_hours,
    end_minutes,
    maximun_people_allowed
  } = slot;
  return (
    <Card>
      <p>{formatSlotHours(slot)}</p>
      <p>{maximun_people_allowed + ' bookings available'}</p>
    </Card>
  );
};

const Card = styled.div`
  height: 4rem;
  width: 100%;
  border: 1px gray solid;
  border-radius: 1rem;
  margin: 0.1rem;
  padding: 1rem;
  line-height: 0.5rem;
  font-size: 1.25rem;
`;

export default SlotCard;
