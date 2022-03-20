import React from 'react'
import {Modal} from 'react-bootstrap'
import Image from 'next/image'
import ETH_LOGO from '../../Assets/ethereumLogo.svg'
import BNB_LOGO from '../../Assets/bnbLogo.svg'
// import FTM_LOGO from '../../Assets/fantomLogo.svg'
// import AVAX_LOGO from '../../Assets/avalancheLogo.svg'
// import MATIC_LOGO from '../../Assets/polygonLogo.svg'

const WalletCheck = ({walletShow, setWalletShow}) => {
  const TokensList = [
    {
      token: 'Ethereum',
      image: ETH_LOGO,
    },
    {token: 'BSC', image: BNB_LOGO},
    // {
    //   token: 'Fantom',
    //   image: FTM_LOGO,
    // },
    // {
    //   token: 'Avalanche',
    //   image: AVAX_LOGO,
    // },
    // {
    //   token: 'Polygon',
    //   image: MATIC_LOGO,
    // },
  ]
  return (
    <Modal
      dialogClassName='modal-30w'
      show={walletShow}
      onHide={() => setWalletShow(false)}
    >
      <div className='wallet_modal'>
        <h4>Wallet Not Supported</h4>
        <p>Please Connect to the Supported Wallets</p>
        <div className='chains'>
          {TokensList?.map((chain) => (
            <div key={chain.id} className='chainItem'>
              <Image src={chain?.image} alt={chain?.token} />
              <p>{chain?.token}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default WalletCheck
