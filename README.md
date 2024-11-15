# React Product Cart App
> A simple cart application with all options

## Check the Application
[https://dev-arindam-roy.github.io/react-product-cart-application/](https://dev-arindam-roy.github.io/react-product-cart-application/)


```js
import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import productJson from './fruits.json';
import ProductItems from './ProductItems';
import CartActionButtons from './CartActionButtons';
import Cart from './Cart';

const StaticJsonProductCart = () => {
  const [productList, setProductList] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const emitAddToCart = (keyIndex, itemName) => {
    //get product/item by index, its not needed as find product by name
    let cartItem = productJson[keyIndex];

    //find product/item by the name
    cartItem = productList.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );

    let itemQty = 1;

    // Check if the item already exists in the cart
    const existingItemIndex = cartList.findIndex(
      (item) => item.name === cartItem.name
    );

    if (existingItemIndex !== -1) {
      // Item exists in the cart, update the quantity
      itemQty = cartList[existingItemIndex].qty + 1;
      cartItem = { ...cartItem, qty: itemQty };

      // Create a copy of the cart list and update the item
      const updatedCartList = [...cartList];
      updatedCartList[existingItemIndex] = cartItem;
      setCartList(updatedCartList);
      saveInLocalStorage(updatedCartList);
    } else {
      // Item does not exist in the cart, add it with qty: 1
      cartItem = { ...cartItem, qty: itemQty };
      setCartList([...cartList, cartItem]);
      saveInLocalStorage(cartList);
    }

    //console.log(cartList);
  };

  const emitOnCartItemRemoveHandler = (keyIndex) => {
    const updatedCartList = cartList.filter((_, index) => index !== keyIndex);
    setCartList(updatedCartList);
    saveInLocalStorage(updatedCartList);
  };

  const emitDeleteCartHandler = () => {
    setCartList([]);
    saveInLocalStorage([]);
  };

  const printRef = useRef();
  const emitPrintHandler = useReactToPrint({
    content: () => printRef.current,
  });

  const emitScreenshotHandler = () => {
    htmlToImage
      .toPng(document.getElementById('printArea'))
      .then(function (dataUrl) {
        download(
          dataUrl,
          new Date().toISOString().replace(/[:.]/g, '-') + '.png'
        );
      });
  };

  const saveInLocalStorage = (updatedCartList) => {
    localStorage.setItem(
      '_onex_simple_cartlist_',
      JSON.stringify(updatedCartList)
    );
  };

  // Filter products based on the search term
  const filteredProducts = productList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //for search load
  useEffect(() => {
    if (searchTerm !== '') {
      setProductList(filteredProducts);
    } else {
      setProductList(productJson);
    }
  }, [searchTerm]);

  //for localstorage load
  useEffect(() => {
    const storedProductListItems = localStorage.getItem(
      '_onex_simple_cartlist_'
    );
    if (storedProductListItems) {
      setCartList(JSON.parse(storedProductListItems));
    }
  }, []);

  //for initial page load
  useEffect(() => {
    setProductList(productJson);
  }, []);
  return (
    <>
      <div
        style={{ width: '950px', margin: '60px auto', fontFamily: 'monospace' }}
      >
        <h1 style={{ textAlign: 'center' }}>
          <strong>PRODUCT CART APPLICATION</strong>
        </h1>
        {cartList.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              paddingTop: '5px',
              paddingBottom: '5px',
            }}
          >
            <CartActionButtons
              printHandler={emitPrintHandler}
              screenshotHandler={emitScreenshotHandler}
              deleteCartHandler={emitDeleteCartHandler}
            />
          </div>
        )}
        <hr />
        <div
          style={{
            width: '450px',
            float: 'left',
            maxHeight: '500px',
            overflowY: 'scroll',
          }}
        >
          <div style={{ padding: '0 15px 0 15px' }}>
            <input
              type='text'
              placeholder='Search...'
              style={{ width: '338px', padding: '8px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {productList.length > 0 ? (
            productList.map((item, index) => {
              return (
                <ProductItems
                  key={'productItem-' + index}
                  sendItem={item}
                  sendIndex={index}
                  addToCart={emitAddToCart}
                />
              );
            })
          ) : (
            <p>No Products Found!</p>
          )}
        </div>
        <div style={{ width: '460px', float: 'right' }}>
          <div
            style={{
              width: '100%',
              fontFamily: 'monospace',
              paddingBottom: '30px',
            }}
            ref={printRef}
            id='printArea'
          >
            <Cart
              sendCartList={cartList}
              onCartItemRemove={emitOnCartItemRemoveHandler}
            />
          </div>
        </div>
        <div style={{ clear: 'both' }}></div>
      </div>
    </>
  );
};

export default StaticJsonProductCart;
```

```js
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
```

```js
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
```

```js
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
```