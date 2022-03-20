import React, {useEffect, useState} from 'react'
import SelectTag from './SelectTag'
import Image from 'next/image'
import {Form} from 'react-bootstrap'
import ReactLoading from 'react-loading'
import {BsArrowDown} from 'react-icons/bs'

import {
  addNewNetwork,
  connectToWallet,
  swapTOKENS,
  updateSecondChain,
  updateToken,
} from '../../Redux/RootSlice'
import chains from '../../Contracts/chains.json'

// bridgeImages
import CATOSHI_LOGO from '../../Assets/catoshiLogo.png'
import GOATELON_LOGO from '../../Assets/elon-goat.png'
import SHIH_LOGO from '../../Assets/shihLogo.png'
import KISHIMOTO_LOGO from '../../Assets/kishiLogo.png'
import MELIODAS_LOGO from '../../Assets/meliodasLogo.jpg'

// blochchianImages
import ETH_LOGO from '../../Assets/ethereumLogo.svg'
import BNB_LOGO from '../../Assets/bnbLogo.svg'
import FTM_LOGO from '../../Assets/fantomLogo.svg'
import AVAX_LOGO from '../../Assets/avalancheLogo.svg'
import MATIC_LOGO from '../../Assets/polygonLogo.svg'
import {useDispatch, useSelector} from 'react-redux'
import {
  checkAllowanceOfUser,
  getBridgeBalance,
  getCalculatedTokenValue,
  getContracts,
} from '../../React_Query/getTheInfo'
import endPoints from '../../React_Query/apiEndpoints.json'
import {supportedChains} from '../../Contracts/ChainId'

const Swap = () => {
  const dispatch = useDispatch()
  const {
    balanceOfChain,
    balanceOfSecondChain,
    userAddress,
    token,
    chainId,
    provider,
    secondChain,
    swapLoading,
    transactionHash,
  } = useSelector((state) => state.root)
  const [bridgeEndpoint, setBridgeEndpoint] = useState('')
  const [bridgeToken, setBridgeToken] = useState('ELONGOAT')
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [price, setPrice] = useState('')
  const [preChain, setPrevChain] = useState('')
  const [fromErrors, setFromErrors] = useState(false)
  const [toErrors, setToErrors] = useState(false)
  const [errorOne, setErrorOne] = useState(false)
  const [errorTwo, setErrorTwo] = useState(false)
  const [convertValueRoute, setConvertValueRoute] = useState('')
  const [allowanceRoute, setAllowanceValueRoute] = useState('')
  const [hasAllownace, setHasAllowance] = useState(false)

  // api calls
  const {data: convertedData, isLoading: convertedDataLoading} =
    getCalculatedTokenValue(convertValueRoute, price, token)

  useEffect(() => {
    const isValidId = supportedChains.includes(Number(secondChain))
    if (secondChain /*&& userAddress*/ && isValidId) {
      const convertRoute = endPoints[secondChain]['convertValue']
      setConvertValueRoute(convertRoute)
    }
  }, [secondChain/*, userAddress*/])

  // end of API calls

  useEffect(() => {
    let res = localStorage.getItem('networkInfo')
    if(chainId != undefined)
      res = chainId.toString()
    if (res) {
      setFromToken(res)
      console.log(res)
    }
  }, [chainId])

  useEffect(() => {
    // const res = localStorage.getItem('networkInfoTwo')
    // if (res) {
    //   setPrevChain(res)
    // } else {
    //   localStorage.setItem('networkInfoTwo', chains['BSC'])
    //   setPrevChain(chains['BSC'])
    // }
    if(fromToken == chains['BSC']) {
      setPrevChain(chains['ETH'])
    }else {
      setPrevChain(chains['BSC'])
    }
  }, [fromToken])

  useEffect(() => {
    if (preChain) {
      setToToken(preChain)
      dispatch(updateSecondChain(preChain))
    }
  }, [preChain])

  // Error Handling
  useEffect(() => {
    if (
      balanceOfChain === 0 ||
      price === 0 ||
      price === '' ||
      Number(price) > Number(balanceOfChain) ||
      !userAddress
    ) {
      setFromErrors(true)
    } else {
      setFromErrors(false)
    }
  }, [balanceOfChain, price, userAddress])

  useEffect(() => {
    if (Number(price) > Number(balanceOfChain)) {
      setErrorOne(true)
    } else {
      setErrorOne(false)
    }
  }, [balanceOfChain, price])

  useEffect(() => {
    if (
      Number(
        convertedData?.data?.status === 'true' ||
          convertedData?.data?.status === true
          ? convertedData?.data?.output
          : 0
      ) > Number(balanceOfSecondChain)
    ) {
      setErrorTwo(true)
    } else {
      setErrorTwo(false)
    }
  }, [balanceOfSecondChain, convertedData])
  useEffect(() => {
    if (
      convertedData?.data?.output === 0 ||
      balanceOfSecondChain === 0 ||
      balanceOfSecondChain === '' ||
      Number(convertedData?.data?.output) > Number(balanceOfSecondChain) ||
      !userAddress
    ) {
      setToErrors(true)
    } else {
      setToErrors(false)
    }
  }, [balanceOfSecondChain, convertedData, userAddress])

  // End of Error Handling

  const handleBridgeToken = (value) => {
    setBridgeToken(value.value)
    dispatch(updateToken(value.value))
  }

  const bridgeList = [
    {value: 'ELONGOAT', label: 'ELONGOAT', image: GOATELON_LOGO},
    // {value: 'SHIH', label: 'SHIH', image: SHIH_LOGO},

    // {
    //   value: 'KISHIMOTO',
    //   label: 'KISHIMOTO',
    //   image: KISHIMOTO_LOGO,
    // },
    // {
    //   value: 'MELIODAS',
    //   label: 'MELIODAS',
    //   image: MELIODAS_LOGO,
    // },
  ]
  const TokensList = [
    {
      token: 'ETH',
      label: 'ETH',
      image: ETH_LOGO,
      value: chains['ETH'],
    },
    {token: 'BSC', label: 'BSC', image: BNB_LOGO, value: chains['BSC']},
    // {
    //   token: 'FTM',
    //   label: 'FTM',
    //   image: FTM_LOGO,
    //   value: chains['FTM'],
    // },
    // {
    //   token: 'AVAX',
    //   label: 'AVAX',
    //   image: AVAX_LOGO,
    //   value: chains['AVAX'],
    // },
    // {
    //   token: 'MATIC',
    //   label: 'MATIC',
    //   image: MATIC_LOGO,
    //   value: chains['MATIC'],
    // },
  ]

  const handleFromToken = (value) => {
    // setFromToken(value.value)
    addNewNetwork(value.value)
    localStorage.setItem('networkInfo', value.value)
  }
  const handleToToken = (value) => {
    setToToken(value.value)
    localStorage.setItem('networkInfoTwo', value.value)
    dispatch(updateSecondChain(value.value))
  }

  const handlePriceChange = (e) => {
    const {value} = e.target
    const priceRegex = /^[0-9]*\.?[0-9]*$/
    if (value === '') {
      setPrice('')
    } else if (priceRegex.test(value)) {
      setPrice(value)
    }
  }

  const updateMaxBalance = () => {
    const obj = {
      target: {value: balanceOfChain},
    }
    handlePriceChange(obj)
  }

  // swap Integration
  const {data: contract, isLoading: contractLoading} = getContracts(
    chains[fromToken],
    token
  )
  const {
    data: bridgeData,
    isLoading: bridgeLoading,
    isError: bridgeIsError,
  } = getBridgeBalance(bridgeEndpoint, token, chains[secondChain])

  const {data: allowance, isLoading: allowanceLoading} = checkAllowanceOfUser(
    allowanceRoute,
    token,
    userAddress,
    price
  )
  useEffect(() => {
    setHasAllowance(allowance?.data?.response)
  }, [allowance])

  useEffect(() => {
    const isValidId = supportedChains.includes(Number(chainId))
    if (chainId /*&& userAddress*/ && isValidId) {
      const bridgeRoute = endPoints[chainId]['bridgeBalance']
      const allowance = endPoints[chainId]['allowance']
      setBridgeEndpoint(bridgeRoute)
      setAllowanceValueRoute(allowance)
      // setHasAllowance(allowance?.data?.status)
    }
  }, [chainId/*, userAddress*/])

  const swapTokens = () => {
    dispatch(
      swapTOKENS({
        swapContract: contract?.data,
        bridgeBalance: bridgeData?.data?.bridgeFees,
        provider,
        price,
        userAllowance:
          allowance?.data?.status === 'true' || allowance?.data?.status == true
            ? allowance?.data?.response
            : false,
        secondChain,
        chainId,
        token,
        userAddress,
      })
    )
  }
  useEffect(() => {
    if (transactionHash?.length > 0) {
      setPrice('')
    }
  }, [transactionHash])

  return (
    <div className='swap'>
      <div className="swap_logo">
        <Image
          className='elon-goat-logo'
          src={GOATELON_LOGO}
          width={217}
          height={25}
        />
      </div>
      <div className='swap_body'>
        <div className='input_label'>
          <Form.Label>From</Form.Label>
          <button onClick={updateMaxBalance}>MAX</button>
        </div>
        <div className='inputWrapper'>
          <Form.Control
            type='tel'
            className='shadow-none'
            style = {{color:'black'}}
            placeholder='0.00'
            value={price}
            disabled={!userAddress}
            readOnly={!userAddress}
            onChange={handlePriceChange}
          />
          <SelectTag
            handleSelectChange={handleFromToken}
            options={TokensList}
            selectedValue={fromToken}
          />
        </div>
        {errorOne && (
          <small style={{color: 'red', fontSize: '12px'}}>
            Please Fund your wallet with $ELONGOAT
          </small>
        )}
        <BsArrowDown className='arrow_down' />
        <div className='input_label'>
          <Form.Label>To</Form.Label>
        </div>
        <div className='inputWrapper'>
          <Form.Control
            type='tel'
            placeholder='0.00'
            className='shadow-none'
            style = {{color:'black'}}
            value={
              convertedData?.data?.status === 'true' ||
              convertedData?.data?.status === true
                ? convertedData?.data?.output
                : null
            }
            //   onChange={handleInput}
            disabled={true}
            readOnly
          />
          {convertedDataLoading && (
            <ReactLoading type='bars' color='#ffffff' height={20} width={30} />
          )}
          <SelectTag
            handleSelectChange={handleToToken}
            options={TokensList}
            selectedValue={toToken}
            disabled={fromToken}
          />
        </div>
        {errorTwo && (
          <small style={{color: 'red', fontSize: '12px'}}>
            Insufficient vault Balance on Destination Chain.
          </small>
        )}
      </div>
      <div className='swap_footer'>
        {userAddress ? (
          <button
            className={
              fromErrors ||
              toErrors ||
              allowanceLoading ||
              bridgeLoading ||
              contractLoading ||
              swapLoading
                ? 'btn_brand btn_disabled'
                : 'btn_brand'
            }
            //TODO: add aproveTokens button
            onClick={swapTokens}
            disabled={
              fromErrors ||
              toErrors ||
              allowanceLoading ||
              bridgeLoading ||
              contractLoading ||
              swapLoading
            }
          >
            {allowanceLoading ||
            bridgeLoading ||
            contractLoading ||
            swapLoading ? (
              <ReactLoading
                type='bars'
                color='#ffffff'
                height={30}
                width={30}
                className='m-auto'
              />
            ) : hasAllownace? ('Bridge'):  (
              'Approve and Bridge'
            )}
          </button>
        ) : (
          <button
            className='btn_brand'
            onClick={() => dispatch(connectToWallet())}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  )
}

export default Swap
