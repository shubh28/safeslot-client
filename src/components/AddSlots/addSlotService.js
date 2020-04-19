import axios from 'axios';
import { API_URL } from '../../common/consts';


export default class AddSlotService {

  fetchSlots = async (storeId) => {
    const filter = { where: { storeId: storeId } };
    const res = await  axios
    .get(
      `${API_URL}/stores_slots?filter=${JSON.stringify(
        filter
      )}`
    );
    return res;
  }

  deleteSlots = async (slotId) => {
    await axios.delete(`${API_URL}/stores_slots/${slotId}`);
  }

  addSlots = async (body) => {
    const res = await axios.post(`${API_URL}/stores_slots`, {
      ...body
    });
    return res;
  }
}
