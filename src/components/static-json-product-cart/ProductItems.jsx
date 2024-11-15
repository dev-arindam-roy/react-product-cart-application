import React from 'react';

const ProductItems = ({ sendItem, sendIndex, addToCart }) => {
  return (
    <>
      <div
        key={'product-' + sendIndex}
        style={{
          float: 'left',
          margin: '15px',
          paddingBottom: '10px',
          width: '150px',
          border: '1px solid black',
          padding: '6px',
          textAlign: 'center',
          borderRadius: '4px'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src={require(`./images/${sendItem.name.toLowerCase()}.png`)}
            alt={sendItem.name.toLowerCase()}
            style={{ width: '60px' }}
          />
        </div>
        <div>
          <p>
            <span style={{ fontSize: '16px' }}>{sendItem.name}</span>
          </p>
          <p style={{ lineHeight: '0px' }}>
            <span
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'green',
              }}
            >
              Rs.{parseFloat(sendItem.price).toFixed(2)}
            </span>
          </p>
          <p>
            <button
              type='button'
              style={{
                padding: '6px',
                backgroundColor: 'black',
                color: 'white',
                fontSize: '14px',
                borderRadius: '4px',
              }}
              onClick={() => addToCart(sendIndex, sendItem.name)}
            >
              Add To Cart
            </button>
          </p>
        </div>
        <div style={{ clear: 'both' }}></div>
      </div>
    </>
  );
};

export default ProductItems;
