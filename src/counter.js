import React, { useContext } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { AppContext } from './app';

const Counter = () => {
  const { count, incrementCount, decrementCount } = useContext(AppContext);
  
  return (
    <div className="text-center my-4">
      <h3>
        Current Count: <Badge bg="info">{count}</Badge>
      </h3>
      <div className="d-flex justify-content-center gap-2 mt-3">
        <Button variant="success" onClick={incrementCount}>
          Increment
        </Button>
        <Button variant="danger" onClick={decrementCount}>
          Decrement
        </Button>
      </div>
    </div>
  );
};

export default Counter;
