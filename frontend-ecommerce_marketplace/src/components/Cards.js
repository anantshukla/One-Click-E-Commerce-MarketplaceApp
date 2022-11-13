import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out these EPIC Deals!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/menclothing.jpg'
              text='Latest Men Fashion at Best Deals'
              label='Men Clothing'
              path='/products'
            />
            <CardItem
              src='images/clothes.jpg'
              text='Latest Women Fashion at Best Price'
              label='Women Fashion'
              path='/products'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/gadgets.jpg'
              text='Best Gadgets at Lowest price'
              label='Electronics'
              path='/products'
            />
            <CardItem
              src='images/appliances.jpg'
              text='Household APpliances Best Deals Now'
              label='Appliances'
              path='/products'
            />
            <CardItem
              src='images/jewelery.jpg'
              text='Jewellery - Best Accessories'
              label='Jewellery'
              path='/products'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
