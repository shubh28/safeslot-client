import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, Popover, PopoverBody } from 'reactstrap';
import { loadState } from '../../helpers/LocalStorage';
import { URL_REFS } from '../../common/consts';

export default function ReferStores({ nostores }) {
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  let message = nostores
    ? 'Sorry we could not find any store near you. Want to refer nearby stores?'
    : "Can't find a store?";

  function onReferClick() {
    const tokenObj = loadState('userAuthenticationDetails');
    const token = tokenObj && tokenObj.id;
    const userId = tokenObj && tokenObj.userId;
    if (token && userId) {
      history.push('/refer');
    } else {
      setShowModal(true);
    }
  }
  return (
    <div style={{ textAlign: 'center', marginTop: nostores ? '100px' : '5px' }}>
      <div className="emptySearch">
        {message}
        <Button id="refer-button" outline color="info" onClick={onReferClick}>
          Refer Stores
        </Button>
        <Popover
          placement="bottom"
          isOpen={showModal}
          target="refer-button"
          toggle={() => setShowModal(!showModal)}
        >
          <PopoverBody>
            Please <Link to={`/login?ref=${URL_REFS.referStore}`}>Login</Link>{' '}
            to refer a store.
          </PopoverBody>
        </Popover>
      </div>
    </div>
  );
}
