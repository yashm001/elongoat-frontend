import Image from 'next/image'
import React from 'react'
import {Container, Nav, Navbar} from 'react-bootstrap'
import Link from 'next/link'

// Logo
import BrandLogo from '../../Assets/Logo.png'
import WalletConfig from './WalletConfig'

const Header = () => {
  return (
    <Navbar collapseOnSelect expand='lg' bg='' variant='dark' fixed='top'>
      <Container>
        <Link href='/'>
          <Navbar.Brand>
            <Image
              alt='Logo'
              src={BrandLogo}
              className='eg-logo d-inline-block align-top'
              width={73}
              height={71}
            />
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'></Nav>
          <WalletConfig />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
