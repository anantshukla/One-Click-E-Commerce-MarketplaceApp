import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      <video  className='VideoTag' autoPlay loop muted >
        <source src='/videos/video.mp4' type='video/mp4'/>
      </video>
      <h1>Everything You Need Is Here</h1>
      <p>BEST DEALS !</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          GET STARTED
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          PRODUCTS <i className='fas fa-check' />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
