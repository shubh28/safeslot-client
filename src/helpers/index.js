import React from 'react';

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

export const createHours = (type, shop_open_hours, shop_close_hours) => {
    const options = [];
    // const { shop_open_hours, shop_close_hours } = this.state;
    if (type === 'start') {
      const endTime = shop_close_hours !== 0 ? parseInt(shop_close_hours) : 23;
      for (let i = 0; i <= endTime; i++) {
        options.push(
          <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
          </option>
        );
      }
    } else {
      const startTime = shop_open_hours !== 0 ? parseInt(shop_open_hours) : 0;
      for (let i = startTime; i <= 23; i++) {
        options.push(
          <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
          </option>
        );
      }
    }
    return options;
  };

export const createMinutes = type => {
    const options = [];
    // const { shop_close_minutes, shop_open_minutes } = this.state;
    // if (type === "start") {
    // const endTime = shop_close_minutes !== 0 ? parseInt(shop_close_minutes) : 55;
    for (let i = 0; i <= 45; i += 15) {
      options.push(
        <option key={i} value={i.toString().padStart(2, '0')}>
          {i.toString().padStart(2, '0')}
        </option>
      );
    }
    // }

    // else {
    //   const startTime = shop_open_minutes !== 0 ? parseInt(shop_open_minutes) : 0;
    //   for(let i=startTime; i<=55; i+=15){
    //     options.push(
    //       <option key={i} value={i.toString().padStart(2, '0')}>
    //         {i.toString().padStart(2, '0')}
    //       </option>
    //     );
    //   }
    // }
    return options;
  };
