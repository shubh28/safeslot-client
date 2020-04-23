import axios from 'axios';
import { API_URL } from '../../common/consts';


export default class AddSlotService {

  fetchSlots = async (storeId) => {
    let res = await axios.get(`${API_URL}/stores/${storeId}/stores_slots`);
    return res.data;
  }

  deleteAllSlots = async (storeId) => {
    await axios.delete(`${API_URL}/stores/${storeId}/stores_slots`);
  }

  deleteSlots = async (slotId) => {
    await axios.delete(`${API_URL}/stores_slots/${slotId}`);
  }

  addSlots = async (slots, storeId) => {
    let res = await axios.post(`${API_URL}/stores/${storeId}/stores_slots`, slots);
    return res.data;
  }

  getStoreData = async (storeId) => {
    const res = await axios.get(`${API_URL}/stores/${storeId}`);
    return res.data
  }

  updateShopOpenHours = async (storeId, hours) => {
    const res = await axios.patch(`${API_URL}/stores/${storeId}`, {
      shop_open_hours: hours
    })
    return res.data
  }

  updateShopOpenMins = async (storeId, mins) => {
    const res = await axios.patch(`${API_URL}/stores/${storeId}`, {
      shop_open_minutes: mins
    })
    return res.data
  }

  updateShopCloseHours = async (storeId, hours) => {
    const res = await axios.patch(`${API_URL}/stores/${storeId}`, {
      shop_close_hours: hours
    })
    return res.data
  }

  updateShopCloseMins = async (storeId, mins) => {
    const res = await axios.patch(`${API_URL}/stores/${storeId}`, {
      shop_close_minutes: mins
    })
    return res.data
  }


  updateSlotDuration = async (storeId, duration) => {
    const res = await axios.patch(`${API_URL}/stores/${storeId}`, {
      slot_duration: duration
    })
    return res.data
  }

  updateSlotMaxPeopleAllowed = async (slotId, max) => {
    const res = await axios.patch(`${API_URL}/stores_slots/${slotId}`, {
      maximun_people_allowed : max
    })
    return res.data;
  }
}
