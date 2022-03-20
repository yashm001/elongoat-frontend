import React, {useEffect, useMemo, useState} from 'react'
import {getAllTheTransactions} from '../../React_Query/getTheInfo'
import chains from '../../Contracts/chains.json'
import ReactLoading from 'react-loading'

// bridgeImages
import CATOSHI_LOGO from '../../Assets/catoshiLogo.png'
import GOATELON_LOGO from '../../Assets/elon-goat.png'
// import SHIH_LOGO from '../../Assets/shihLogo.png'
// import KISHIMOTO_LOGO from '../../Assets/kishiLogo.png'
// import MELIODAS_LOGO from '../../Assets/meliodasLogo.jpg'

// blochchianImages
import ETH_LOGO from '../../Assets/ethereumLogo.svg'
import BNB_LOGO from '../../Assets/bnbLogo.svg'
// import FTM_LOGO from '../../Assets/fantomLogo.svg'
// import AVAX_LOGO from '../../Assets/avalancheLogo.svg'
// import MATIC_LOGO from '../../Assets/polygonLogo.svg'

import SelectTag from '../Swap/SelectTag'
import {Container, Form} from 'react-bootstrap'
import TransactionsTable from './TransactionsTable'
import {shorten} from '../../Utils/helpers'
import {updateSecondChain} from '../../Redux/RootSlice'
import { useDispatch } from 'react-redux'

const Transactions = () => {
  const dispatch = useDispatch()
  const [bridgeToken, setBridgeToken] = useState('None')
  const [fromToken, setFromToken] = useState('None')
  const [toToken, setToToken] = useState('None')
  const [preChain, setPrevChain] = useState('')

  const {
    data: allTransactions,
    isLoading,
    isFetching,
  } = getAllTheTransactions(
    bridgeToken,
    toToken === 'None' ? 'None' : chains[toToken],
    fromToken === 'None' ? 'None' : chains[fromToken]
  )

  const bridgeList = [
    {value: 'EGT', label: 'ELONGOAT', image: GOATELON_LOGO},
    // {value: 'CATOSHI', label: 'CATOSHI', image: CATOSHI_LOGO},
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
      token: 'None',
      label: 'None',
      image: ETH_LOGO,
      value: 'None',
    },
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

  useEffect(() => {
    const res = localStorage.getItem('networkInfoTwo')
    if (res) {
      setPrevChain(res)
    } else {
      localStorage.setItem('networkInfoTwo', chains['BSC'])
    }
  }, [])

  useEffect(() => {
    if (preChain) {
      dispatch(updateSecondChain(preChain))
    }
  }, [preChain])

  const handleBridgeToken = (value) => {
    setBridgeToken(value.value)
  }

  const handleFromToken = (value) => {
    setFromToken(value.value)
  }
  const handleToToken = (value) => {
    setToToken(value.value)
  }
  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'newId',
      },
      {
        Header: 'User Address',
        accessor: 'walletAddress',
        Cell: (info) => <p>{shorten(info?.value)}</p>,
      },
      {
        Header: 'From Tranx Hash',
        accessor: 'fromChainInfo',
        Cell: (info) => (
          <>
            <a
              href={info?.value?.trnx}
              target='_blank'
              rel='noopener noreferrer'
            >
              <img className='exlporer_img' src={info?.value?.image} alt='' />
            </a>
          </>
        ),
      },
      {
        Header: 'To Tranx Hash',
        accessor: 'toChainInfo',
        Cell: (info) => (

          info?.value?.isSuccess == true?(
          <a href={info?.value?.trnx} target='_blank' rel='noopener noreferrer'>
            <img className='exlporer_img' src={info?.value?.image} alt='' />
          </a>
          ):(<span>Pending on Destination Chain</span> )

        ),
      },
      {
        Header: 'Amount',
        accessor: 'swapAmount',
      },
      {
        Header: 'Token',
        accessor: 'token',
      },
      {
        Header: 'Time Stamp',
        accessor: 'fromTimestamp',
          Cell: (info) => (
          <span>{new Date(info?.value).toLocaleString('en-GB',{month: 'short', year: 'numeric', day: 'numeric', hour: 'numeric',minute:'numeric'/*, timeZoneName:'short'*/})}</span>
        ),
      },
    ],
    []
  )

  const tableData = useMemo(() => allTransactions, [allTransactions, isLoading])

  return (
    <div className='transactions'>
      <Container fluid>
        <div className='transactions_wrapper'>
          <div className='filter'>
            <div className='filter_left'>
              <div>
                <Form.Label>Token</Form.Label>
                <SelectTag
                  handleSelectChange={handleBridgeToken}
                  options={bridgeList}
                  selectedValue={bridgeToken}
                />
              </div>
              <div>
                <Form.Label>From Chain</Form.Label>
                <SelectTag
                  handleSelectChange={handleFromToken}
                  options={TokensList}
                  selectedValue={fromToken}
                />
              </div>
              <div>
                <Form.Label>To Chain</Form.Label>
                <SelectTag
                  handleSelectChange={handleToToken}
                  options={TokensList}
                  selectedValue={toToken}
                />
              </div>
            </div>
            {/* <div className='filter_right'>
              <button className='btn_brand'>Apply</button>
              <button className='btn_brand'>Cancel</button>
            </div> */}
          </div>
          <div className='transactions_table'>
            {!isLoading ? (
              <TransactionsTable columns={columns} data={tableData} />
            ) : (
              <div className='d-flex align-items-center justify-content-center h-100'>
                <ReactLoading
                  type='bars'
                  color='#ffffff'
                  height={50}
                  width={50}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Transactions
