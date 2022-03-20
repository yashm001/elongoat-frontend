import React from 'react'
import {Container, Image} from 'react-bootstrap'
import Swap from '../Swap/Swap'

const LandingPage = () => {
  return (
    <div className='home'>
      <Container>
        <div className='home_wrapper'>
          <div className='home_wrapper_body'>
            <Swap />
          </div>
        </div>
      </Container>
    </div>
  )
}

export default LandingPage
