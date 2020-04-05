import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, Popover, PopoverBody } from 'reactstrap';
import { loadState } from '../../helpers/LocalStorage';
import { URL_REFS } from '../../common/consts';

export default function NoStores() {
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

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
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <div className="emptySearch">
        Sorry we could not find any store near you. Want to refer nearby stores?
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
