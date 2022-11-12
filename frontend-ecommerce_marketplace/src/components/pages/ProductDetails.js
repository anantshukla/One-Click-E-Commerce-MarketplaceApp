import React, { useState, useEffect } from 'react';
import './ProductDetails.css';
import './Products.css';
import axios from 'axios';
import { removeUserSession } from '../../Utils/Common';

function ProductDetails(props) {
    const {productId} = props.location.state
    console.warn(productId)

    const [data, setData] = useState('');
    
    // load product details
    useEffect(() => {
      axios.post(
        "http://localhost:3001/getProductDetails/",
        { productId: productId
         }).then((res) => {
        console.log(res.data.message.advertisementDetails);
        setData(res.data.message.advertisementDetails);
      }).catch((e) => console.log(e));
    }, [])


    // handle click event of logout button
    const handleLogout = () => {
        removeUserSession();
        props.history.push('/login');
      }
   

      return (
        <>
        <input className='button_logout' type="button" onClick={handleLogout} value="Logout" />
        <h1>{data.productName}</h1>
            {/* {
                data.map(item =>(
                    <div className="details" key={item.productId}>
                        <img src={item.imageURL} alt=""/>
                        <div className="box">
                            <div className="row">
                                <h2>{item.productName}</h2>
                                <span>${item.price}</span>
                            </div>
                            <p>{item.categoryName}</p>
                            <p>{item.productDescription}</p>
                           
                        </div>
                    </div>
                ))
            } */}
            
        </>
    )
}


export default ProductDetails;