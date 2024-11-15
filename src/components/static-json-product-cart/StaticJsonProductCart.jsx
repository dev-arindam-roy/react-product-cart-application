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
