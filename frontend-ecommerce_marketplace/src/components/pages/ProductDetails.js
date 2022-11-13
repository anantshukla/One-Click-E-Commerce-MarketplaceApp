import React, { useState, useEffect } from 'react';
import './ProductDetails.css';
import '../../App.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function ProductDetails(props) {
  const { productId } = props.location.state
  console.warn(productId)

  const [data, setData] = useState('');
  const history = useHistory();
  const [img, setImg] = useState();
  
  // load product details
  useEffect(() => {
    axios.post(
      "http://localhost:3001/getProductDetails/",
      {productId: productId
      }).then((res) => {
        console.log(res.data.message.advertisementDetails);
        setData(res.data.message.advertisementDetails);
        setImg(`http://localhost:3001/getProductImage/${res.data.message.advertisementDetails.imageName}`);
      }).catch((e) => console.log(e));

      
  }, [productId])

  return (
  <div>

      <div className="details">
        <img src={img} alt="" height={300} width={300}  />
        <div className="box">
          <div className="row">
            <h2> PRODUCT NAME: {data.productName}</h2>
          </div>
          <span>Price: ${data.price}</span>
          <p>Category: {data.categoryName}</p>
          <p>Product Description: {data.productDescription}</p>

        </div>
      </div>

      <input className='button_goback' type="button" onClick={() => history.push("/products")} value="Go Back" />
    </div>
  )
}


export default ProductDetails;