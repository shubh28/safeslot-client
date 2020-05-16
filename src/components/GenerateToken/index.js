import React, {useEffect} from 'react';

import axios from 'axios';

import { API_URL } from '../../common/consts';

export default (props) => {
	console.log(props);
	useEffect(() => {
		const filter = {
		};
		axios
		  .get(`${API_URL}/stores?filter=${JSON.stringify(filter)}`)
	}, [])

	return(
		<div>Hey Token</div>
	)
}