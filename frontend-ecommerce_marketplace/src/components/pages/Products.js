import React, { useState, useEffect } from 'react';
import './Products.css';
import axios from 'axios';
import { Link } from 'react-router-dom'
// import { getToken } from '../../Utils/Common';

function Products(props) {
 
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.post(
      "http://localhost:3001/getAllProducts"
    ).then((res) => {
      console.log(res.data.message.products);
      setData(res.data.message.products);
    }).catch((e) => console.log(e));
  }, [])

  // console.log(JSON.parse(getToken())['statusCode'])

    return (
      <>
      <div id="product">
        {
          data.map(product => (
            <div className="card" key={product.productId}>
              <Link to={{ pathname: '/productdetails', state: { productId: product.productId} }}>
                <img src={product.imageURL} alt="" />
              </Link>
              <div className="content">
                <h3>
                <Link to={{ pathname: '/productdetails', state: { productId: product.productId} }}> {product.productName}</Link>
                </h3>
                <span>${product.price}</span>
                <p>{product.productName}</p>
                {/* <button >Add to cart</button> */}
              </div>
            </div>
          ))
        }
      </div>
      </>
    )

}

export default Products;
