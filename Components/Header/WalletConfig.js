import React, {useEffect, useState} from 'react'
import {Nav} from 'react-bootstrap'
import {BsWallet2} from 'react-icons/bs'
import AccountInfo from './AccountInfo'
import endPoints from '../../React_Query/apiEndpoints.json'
import ReactLoading from 'react-loading'

import {
  getTheCurrentChainBalance,
  getVaultBalance,
} from '../../React_Query/getTheInfo'
import {numberFormateWithDigits, shorten} from '../../Utils/helpers'
import {useDispatch, useSelector} from 'react-redux'
import {
  addNewNetwork,
  clearHashValue,
  connectToWallet,
  updateFirstChainBalances,
  updateSecondChainBalances,
  updateUserAddress,
} from '../../Redux/RootSlice'
import chains from '../../Contracts/chains.json'
import {supportedChains} from '../../Contracts/ChainId'
import WalletCheck from './WalletCheck'

const WalletConfig = () => {
  const dispatch = useDispatch()
  const {userAddress, provider, token, chainId, secondChain, transactionHash} =
    useSelector((state) => state.root)
  const [showModal, setShowModal] = useState(false)
  const [preChain, setPrevChain] = useState('')
  const [endpoint, setEndpoint] = useState('')
  const [bridgeEndpoint, setBridgeEndpoint] = useState('')
  const [showChainError, setShowChainError] = useState(false)

  const {
    data,
    isLoading,
    isError,
    refetch: balanceRefetch,
  } = getTheCurrentChainBalance(endpoint, userAddress, token)

  const {
    data: bridgeData,
    isLoading: bridgeLoading,
    isError: bridgeIsError,
    refetch: vaultRefetch,
  } = getVaultBalance(bridgeEndpoint, token)

  useEffect(() => {
    if (data && !isLoading && !isError && data?.data?.Tokens) {
      dispatch(updateFirstChainBalances(data?.data?.Tokens))
    }
  }, [data])
  useEffect(() => {
    if (
      bridgeData &&
      !bridgeLoading &&
      !bridgeIsError &&
      bridgeData?.data?.vault_balance
    ) {
      dispatch(updateSecondChainBalances(bridgeData?.data?.vault_balance))
    }
  }, [bridgeData])

  useEffect(() => {
    const isValidId = supportedChains.includes(Number(chainId))
    if (chainId /*&& userAddress*/ && isValidId) {
      const route = endPoints[`${chainId}`]['chainBalance']
      const bridgeRoute = endPoints[secondChain]['vaultBalance']
      setEndpoint(route)
      // console.log("setting bridge route", bridgeRoute)
      setBridgeEndpoint(bridgeRoute)
    }
  }, [chainId,secondChain/*, userAddress*/])

  useEffect(() => {
    if (chainId /*&& userAddress*/) {
      const isValidId = supportedChains.includes(Number(chainId))
      setShowChainError(!isValidId)
    }
  }, [chainId/*, userAddress*/])

  const connect = () => {
    dispatch(connectToWallet())
  }

  useEffect(() => {
    const res = localStorage.getItem('networkInfo')
    if (res) {
      setPrevChain(res)
    } else {
      localStorage.setItem('networkInfo', chains['ETH'])
      addNewNetwork(chains['ETH'])
    }
  }, [])

  useEffect(() => {
    if (preChain) {
      addNewNetwork(preChain)
    }
  }, [preChain])

  useEffect(() => {
    if (provider) {
      // Subscribe to accounts change
      provider.on('accountsChanged', (accounts) => {
        updateUserAddress(accounts[0])
      })

      // Subscribe to chainId change
      provider.on('chainChanged', (chainId) => {
        window.location.reload()
      })
      // Subscribe to provider connection
      provider.on('connect', (info) => {
        console.log(info)
      })

      // Subscribe to provider disconnection
      provider.on('disconnect', (error) => {
        console.log(error)
      })
    }
  }, [provider])

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (address) => {
        dispatch(updateUserAddress(address[0]))
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }, [])

  useEffect(() => {
    if (transactionHash?.length > 0) {
      balanceRefetch()
      vaultRefetch()
      setTimeout(() => {
        dispatch(clearHashValue())
      }, 5000)
    }
  }, [transactionHash])

  return (
    <>
      <Nav>
        <Nav.Link className='wallet'>
          {chains[`${chainId}`]} MAINNET |{' '}
          {userAddress && !isError ? (
            isLoading ? (
              <ReactLoading
                type='bars'
                color='#ffffff'
                height={20}
                width={30}
              />
            ) : data?.data?.status === 'true' || data?.data?.status === true ? (
              numberFormateWithDigits(data?.data?.Tokens, 2)
            ) : (
              '0.00'
            )
          ) : (
            '0.00'
          )}
        </Nav.Link>
        <Nav.Link className='wallet'>
          {chains[`${secondChain}`]} VAULT |{' '}
          {userAddress && !bridgeIsError ? (
            bridgeLoading ? (
              <ReactLoading
                type='bars'
                color='#ffffff'
                height={20}
                width={30}
              />
            ) : bridgeData?.data?.status === 'true' ||
              bridgeData?.data?.status === true ? (
              numberFormateWithDigits(bridgeData?.data?.vault_balance, 2)
            ) : (
              '0.00'
            )
          ) : (
            '0.00'
          )}
        </Nav.Link>
        {userAddress ? (
          <Nav.Link className='wallet' onClick={() => setShowModal(true)}>
            {shorten(userAddress)}
          </Nav.Link>
        ) : (
          <Nav.Link className='wallet' onClick={connect}>
            <BsWallet2 />
            Connect Wallet
          </Nav.Link>
        )}
      </Nav>
      <AccountInfo smShow={showModal} setSmShow={setShowModal} />
      <WalletCheck
        walletShow={showChainError}
        setWalletShow={setShowChainError}
      />
    </>
  )
}

export default WalletConfig
