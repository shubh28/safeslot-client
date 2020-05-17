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

  fetchTokens = async (storeId) => {
    const date = new Date();
		date.setHours(0)
		date.setMinutes(0)
		date.setSeconds(0)
		date.setMilliseconds(0)

		const filter = {
			"where": {
				"and": [{ "store_id": storeId }, {
					"date": {
						"gte": date
					}
				}]
      },
      "order": "current_token ASC"
    };
    
    const response = await axios.get(`${API_URL}/tokens?filter=${JSON.stringify(filter)}`);
    return response.data[0] || [];
  }

  updateToken = async (tokenId, tokenData) => {
    const response = await axios.put(`${API_URL}/tokens/${tokenId}`, {...tokenData});
    return response;
  }
}
