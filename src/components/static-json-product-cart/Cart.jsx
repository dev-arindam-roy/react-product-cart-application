import React, { useEffect, useState } from 'react';

const Cart = ({ sendCartList, onCartItemRemove }) => {
  const [myCart, setMyCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const calculateTotalAmount = () => {
    let total = 0;

    // Ensure `getProductList` is defined and is an array
    if (Array.isArray(myCart) && myCart.length > 0) {
      myCart.forEach((item) => {
        total += parseFloat(item.price) * parseFloat(item.qty);
      });
    }

    return total.toFixed(2);
  };
  // Update the cart when `sendCartList` changes
  useEffect(() => {
    setMyCart(sendCartList);
  }, [sendCartList]);

  // Calculate the total amount when `myCart` changes
  useEffect(() => {
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [myCart]);
  
  return (
    <>
      {myCart.length > 0 ? (
        <div>
          <h3>
            Cart Items:({myCart.length}) - Rs.
            {Math.round(totalAmount).toFixed(2)}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ borderBottom: '1px solid black' }}>
              <tr>
                <th style={{ textAlign: 'left' }}>SL</th>
                <th style={{ textAlign: 'left' }}>Product</th>
                <th style={{ textAlign: 'left' }}>Price</th>
                <th style={{ textAlign: 'left' }}>QTY</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th style={{ textAlign: 'right' }}>#</th>
              </tr>
            </thead>
            <tbody>
              {myCart.map((item, index) => {
                return (
                  <tr key={'cart-item-' + index}>
                    <td style={{ textAlign: 'left' }}>{index + 1}</td>
                    <td style={{ textAlign: 'left' }}>{item.name}</td>
                    <td style={{ textAlign: 'left' }}>
                      {parseFloat(item.price).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'left' }}>{item.qty}</td>
                    <td style={{ textAlign: 'right' }}>
                      {(parseFloat(item.price) * parseFloat(item.qty)).toFixed(
                        2
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type='button'
                        style={{
                          background: 'none',
                          color: 'black',
                          padding: '4px',
                          fontSize: '14px',
                          border: 'none',
                        }}
                        onClick={() => onCartItemRemove(index)}
                      >
                        [x]
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot
              style={{
                borderTop: '1px solid black',
                borderBottom: '1px solid black',
              }}
            >
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: 'right',
                    fontWeight: '600',
                    paddingTop: '8px',
                  }}
                >
                  Total Amount:
                </td>
                <td
                  style={{
                    fontWeight: 'bold',
                    paddingTop: '8px',
                    textAlign: 'right',
                  }}
                >
                  {totalAmount}
                </td>
                <td></td>
              </tr>
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: 'right',
                    fontWeight: '600',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                  }}
                >
                  Total Payable Amount:
                </td>
                <td
                  style={{
                    fontWeight: 'bold',
                    paddingTop: '8px',
                    textAlign: 'right',
                  }}
                >
                  {Math.round(totalAmount).toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <p>No Cart Item(s)</p>
      )}
    </>
  );
};

export default Cart;
