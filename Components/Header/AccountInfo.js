import {Modal} from 'react-bootstrap'
import {useSelector} from 'react-redux'
import {disconnectWallet} from '../../Redux/RootSlice'

const AccountInfo = ({smShow, setSmShow}) => {
  const {userAddress, web3Modal, provider} = useSelector((state) => state.root)

  const disconnect = () => {
    disconnectWallet(web3Modal, provider)
  }
  return (
    <Modal
      dialogClassName='modal-30w'
      show={smShow}
      onHide={() => setSmShow(false)}
    >
      <div className='wallet_modal'>
        <h4>Wallet Address</h4>
        <p>{userAddress}</p>
        {/* {window.isSecsetSmShow(false)ureContext && ( */}
        <div className='wallet_btns'>
          <button
            className='btn_brand'
            onClick={() => navigator.clipboard.writeText(userAddress)}
          >
            Copy to clipboard
          </button>
          <button className='btn_brand' onClick={disconnect}>
            Disconnect
          </button>
        </div>
        {/* )} */}
      </div>
    </Modal>
  )
}

export default AccountInfo
