export const getSlotTime = (slot = {}) => {
  if (!slot.start_hours) {
    return '';
  }
  return `${slot.start_hours
    .toString()
    .padStart(2, '0')}:${slot.start_minutes
    .toString()
    .padStart(2, '0')} - ${slot.end_hours
    .toString()
    .padStart(2, '0')}:${slot.end_minutes.toString().padStart(2, '0')}`;
};
