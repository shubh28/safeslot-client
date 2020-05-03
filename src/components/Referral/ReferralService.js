import axios from 'axios';
import { API_URL } from '../../common/consts';

export default class ReferralService {
  postReferredStore = async (body) => {
    let res = await axios.post(`${API_URL}/stores`, {...body});
    return res;
  }

  getLocations = async (value) => {
    let res = axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=pk.eyJ1Ijoic2h1YmgyOCIsImEiOiJjazhidHQ1Z2QwZm11M2lxcGd0Y21uMnR4In0.pkJ2tMkAcfeI6PC7gHIIwQ&cachebuster=1585165720796&autocomplete=true&limit=8`);
    return res;
  }

  updateSlotsForReferredStore = async (storeId, slots) => {
    await axios.delete(`${API_URL}/stores/${storeId}/stores_slots`);
    let res = await axios.post(`${API_URL}/stores/${storeId}/stores_slots`, slots);
    return res.data;
  }

}
