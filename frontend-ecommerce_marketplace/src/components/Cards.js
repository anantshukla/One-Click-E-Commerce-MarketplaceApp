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
              src='images/vegetables.jpg'
              text='Fresh Vegetables and Fruits'
              label='Grocery'
              path='/products'
            />
            <CardItem
              src='images/clothes.jpg'
              text='Latest Fashion at Best Price'
              label='Fashion'
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
              src='images/schoolsupply.jpg'
              text='Back to School Best Deals'
              label='School Supplies'
              path='/products'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
