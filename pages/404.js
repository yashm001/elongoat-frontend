import Footer from '../Components/Footer/Footer'
import Header from '../Components/Header/Header'
import Link from 'next/link'
import {Container} from 'react-bootstrap'
import HeaderMeta from '../Components/HeaderMeta'

const NotFound = () => {
  return (
    <>
      <HeaderMeta title='404 - Elon Goat' />
      <Header />
      <div className='pageNotFound'>
        <Container>
          <div className='NotFoundWrapper'>
            <h1>404</h1>
            <h2>Page not found</h2>
            <button className='btn_brand'>
              <Link href='/'>Go to home</Link>
            </button>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  )
}

export default NotFound
