import React from 'react';

const CartActionButtons = ({printHandler, screenshotHandler, deleteCartHandler}) => {
  return (
    <>
      <button
        type='button'
        style={{
          background: 'green',
          color: 'white',
          padding: '8px',
          fontSize: '14px',
          borderRadius: '4px',
        }}
        onClick={printHandler}
      >
        Print Cart
      </button>
      <button
        type='button'
        style={{
          background: 'maroon',
          color: 'white',
          padding: '8px',
          fontSize: '14px',
          borderRadius: '4px',
          marginLeft: '5px',
        }}
        onClick={screenshotHandler}
      >
        Screenshot
      </button>
      <button
        type='button'
        style={{
          background: 'red',
          color: 'white',
          padding: '8px',
          fontSize: '14px',
          borderRadius: '4px',
          marginLeft: '5px',
        }}
        onClick={deleteCartHandler}
      >
        Delete Cart
      </button>
    </>
  );
};

export default CartActionButtons;
