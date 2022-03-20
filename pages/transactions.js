import Footer from '../Components/Footer/Footer'
import Header from '../Components/Header/Header'
import HeaderMeta from '../Components/HeaderMeta'
import Transactions from '../Components/Transactions/Transactions'

const transactions = () => {
  return (
    <div>
      <HeaderMeta title='Elon Goat -Transactions' />
      <Header />
      <Transactions />
      <Footer />
    </div>
  )
}

export default transactions
