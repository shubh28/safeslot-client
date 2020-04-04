import React, { useState, useEffect, useMemo } from 'react';
import { Alert } from 'reactstrap';

const Alerts = (props) => {
  const { message, type, onClose } = props;
  const [visible, setVisible] = useState(Boolean(message));

  const onDismiss = () => {
    onClose();
    setVisible(false);
  };

  useEffect(() => {
    setVisible(Boolean(message));
  }, [message]);

  return (
    <Alert color={type} isOpen={visible} toggle={onDismiss}>
      {message}
    </Alert>

  );
};

export default Alerts;
