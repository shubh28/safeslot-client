import axios from 'axios';
import { API_URL } from '../../common/consts';

export default class OwnerHomeService {

  fetchUser = async (userId) => {
    const res = await axios.get(`${API_URL}/users/${userId}?filter={"include": "stores"}`);
    console.log(res.data);
    return res;
  }

  fetchBookings = async (storeId) => {
    const filter = {
      where: { store_id: storeId },
      include: ['stores', 'stores_slots', 'users']
    };
    const res = await axios.get(`${API_URL}/bookings?filter=${JSON.stringify(filter)}`);
    return res;
  }

}
