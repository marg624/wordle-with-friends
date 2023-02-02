import React from 'react';
import { useEffect } from 'react';

function BoardTask(props) {
  const TIME_MS = 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      let resp = props.updateStateFunc(props.meFirst);
      if (resp) {
        return null;
      }
    }, TIME_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  return null;
}

export default BoardTask;