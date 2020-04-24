import axios from 'axios';
import { API_URL } from '../../common/consts';


export default class AddSlotService {

  fetchSlots = async (storeId) => {
    let res = await axios.get(`${API_URL}/stores/${storeId}/stores_slots`);
    return res.data.map(slot => {
      return {
        start_hours:slot.start_hours,
        start_minutes:slot.start_minutes,
        end_hours:slot.end_hours,
        end_minutes:slot.end_minutes,
        maximun_people_allowed: slot.maximun_people_allowed
      }
    });
  }

  // two steps to update the slots.first we delete the existing slots
  // and then replace them by posting new ones.
  updateSlots = async (storeId, slots) => {
    await axios.delete(`${API_URL}/stores/${storeId}/stores_slots`);
    let res = await axios.post(`${API_URL}/stores/${storeId}/stores_slots`, slots);
    return res.data;
  }

  getStoreData = async (storeId) => {
    const res = await axios.get(`${API_URL}/stores/${storeId}`);
    return res.data
  }

  updateStore = async (storeId, openHours, openMins, closeHours, closeMins, duration) => {
    const res = await axios.patch(`${API_URL}/stores/${storeId}`, {
      shop_open_hours: openHours,
      shop_open_minutes: openMins,
      shop_close_hours: closeHours,
      shop_close_minutes: closeMins,
      slot_duration: duration
    })
    return res.data
  }
}
