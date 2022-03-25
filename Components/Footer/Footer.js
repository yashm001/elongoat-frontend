import React from 'react'
import Image from 'next/image'
import {Col, Container, Row} from 'react-bootstrap'
import { BsFacebook, BsTwitter, BsTelegram, BsInstagram, BsYoutube } from 'react-icons/bs'
import CATOSHI_LOGO from '../../Assets/catoshiLogo.png'
import ELON_L from '../../Assets/elon-l.png'
import ELON_R from '../../Assets/elon-r.png'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="2" className='text-center'>
            <Image
              src={ELON_L}
              height={148}
              width={93}
            />
          </Col>
          <Col md="auto">
            <Col xs={12} sm={7} className='mb-3 text-center'>
              <div className="footer-content-wrap">
                <div>
                  <a
                    className='footer-link'
                    href='https://elongoat.io/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Elon Goat Website
                  </a>
                </div>
                <div className='footer_socials'>
                  <a
                    href='https://twitter.com/ElonGoatToken'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <BsTwitter />
                  </a>
                  <a
                    href='https://www.instagram.com/elongoatoken/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <BsInstagram />
                  </a>
                  <a
                    href='https://t.me/elon_goat_token'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <BsTelegram />
                  </a>
                  <a
                    href='https://www.youtube.com/channel/UCZ4KZ2g8-hKeRi5N7EtCSnw'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <BsYoutube />
                  </a>
                </div>
                <div>
                  <a
                    className='footer-link'
                    href='https://catoshi.cat/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <div className="d-inline-block catoshi-footer">
                      <Image
                        src={CATOSHI_LOGO}
                        height={30}
                        width={30}
                      />
                    </div>
                    <div className="d-inline-block">Powered by Catoshi</div>
                  </a>
                </div>
              </div>
            </Col>
          </Col>
          <Col xs lg="2" className='text-center'>
            <Image
              src={ELON_R}
              height={128}
              width={72}
            />
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
