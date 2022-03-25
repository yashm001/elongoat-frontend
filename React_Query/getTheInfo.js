import {useQuery} from 'react-query'
import {apiRequest} from './axios_utils'

// Explorer Images
const ETH_EXP =
  'https://etherscan.io/images/brandassets/etherscan-logo-circle.jpg'
const BSC_EXP =
  'https://bscscan.com/images/brandassets/bscscan-logo-circle.jpg'
// const FTM_EXP =
//   'https://assets.coingecko.com/coins/images/4001/large/Fantom.png?1558015016'
// const AVAX_LOGO =
//   'https://logowik.com/content/uploads/images/avalanche-coin-avax8592.jpg'
// const MATIC_LOGO =
//   'https://polygonscan.com/images/brandassets/PolygonScan-logo-circle.jpg'

// ##############################
const getAllTheContracts = ({queryKey}) => {
  const network = queryKey[1]
  const token = queryKey[2]
  return apiRequest({
    url: `/getContractAddress?network=${network}&token=${token}`,
  })
}

export const getContracts = (network, token) => {
  return useQuery(['getContracts', network, token], getAllTheContracts)
}

// ##############################

const chainBalance = ({queryKey}) => {
  const route = queryKey[1]
  const address = queryKey[2]
  const token = queryKey[3]
  if (route == '') {
    return
  }
  return apiRequest({
    url: `${route}?userAddress=${address}&token=${token}`,
  })
}
export const getTheCurrentChainBalance = (route, address, token) => {
  return useQuery(['chainBalance', route, address, token], chainBalance)
}

// ##############################

const vaultBalance = ({queryKey}) => {
  const route = queryKey[1]
  const token = queryKey[2]
  if (route == '') {
    return
  }
  return apiRequest({
    url: `${route}?token=${token}`,
  })
}
export const getVaultBalance = (route, token) => {
  return useQuery(['vaultBalance', route, token], vaultBalance)
}

// ##############################

const checkAllowance = ({queryKey}) => {
  const route = queryKey[1]
  const token = queryKey[2]
  const address = queryKey[3]
  const amount = queryKey[4]
  if (route == '') {
    return
  }
  return apiRequest({
    url: `${route}?token=${token}&userAddress=${address}&amount=${amount}`,
  })
}

export const checkAllowanceOfUser = (route, token, address, amount) => {
  return useQuery(
    ['checkAllowance', route, token, address, amount],
    checkAllowance
  )
}

// ##############################

// const postTranx = ({queryKey}) => {
//   const route = queryKey[1]
//   const txnHash = queryKey[2]
//   const swapAmount = queryKey[3]
//   const fromTimestamp = queryKey[4]
//   const toChain = queryKey[5]

//   return apiRequest({
//     url: `${route}?txnHash=${txnHash}&token=${token}&swapAmount=${swapAmount}&fromTimestamp=${fromTimestamp}&toChain=${toChain}`,
//   })
// }
// export const postTransaction = (
//   route,
//   txnHash,
//   token,
//   swapAmount,
//   fromTimestamp,
//   toChain
// ) => {
//   return useQuery(
//     [
//       'postTransaction',
//       route,
//       txnHash,
//       token,
//       swapAmount,
//       fromTimestamp,
//       toChain,
//     ],
//     postTranx
//   )
// }

// ##############################

const bridgeBalance = ({queryKey}) => {
  const route = queryKey[1]
  const token = queryKey[2]
  const chain = queryKey[3]
  if (route == '') {
    return
  }
  return apiRequest({
    url: `${route}?token=${token}&toChain=${chain}`,
  })
}
export const getBridgeBalance = (route, token, chain) => {
  return useQuery(['bridgeBalance', route, token, chain], bridgeBalance)
}

// ##############################

const calculateTokenValue = ({queryKey}) => {
  const route = queryKey[1]
  const amount = queryKey[2]
  const token = queryKey[3]
  if (route == '') {
    return
  }
  return apiRequest({
    url: `${route}?amount=${amount}&token=${token}`,
  })
}
export const getCalculatedTokenValue = (route, amount, token) => {
  return useQuery(
    ['calculateTokenValue', route, amount, token],
    calculateTokenValue
  )
}

// ##############################

const transactions = ({queryKey}) => {
  const token = queryKey[1]
  const toChain = queryKey[2]
  const fromChain = queryKey[3]
  return apiRequest({
    url: `/getTrxDetails?token=${token}&toChain=${toChain}&fromChain=${fromChain}`,
  })
}
export const getAllTheTransactions = (token, toChain, fromChain) => {
  return useQuery(['transactions', token, toChain, fromChain], transactions, {
    select: (data) => {
      const response = data?.data?.data?.map((item, index) => ({
        ...item,
        newId: Number(index) + 1,
        fromChainInfo: {
          image:
            item?.fromChain === 'BSC'
              ? BSC_EXP
              : item?.fromChain === 'ETH'
              ? ETH_EXP
              // : item?.fromChain === 'AVAX'
              // ? AVAX_LOGO
              // : item?.fromChain === 'FTM'
              // ? FTM_EXP
              // : item?.fromChain === 'MAT' || item?.fromChain === 'MATIC'
              // ? MATIC_LOGO
              : 'javascript:void(0)',
          trnx:
            item?.fromChain === 'BSC'
              ? `https://bscscan.com/tx/${item?.fromTransactionHash}`
              : item?.fromChain === 'ETH'
              ? `https://etherscan.io/tx/${item?.fromTransactionHash}`
              // : item?.fromChain === 'AVAX'
              // ? `https://explorer.avax.network/tx/${item?.fromTransactionHash}`
              // : item?.fromChain === 'FTM'
              // ? `https://ftmscan.com/tx/${item?.fromTransactionHash}`
              // : item?.fromChain === 'MAT' || item?.fromChain === 'MATIC'
              // ? `https://polygonscan.com/tx/${item?.fromTransactionHash}`
              : 'javascript:void(0)',
        },
        toChainInfo: {
          image:
            item?.toChain === 'BSC'
              ? BSC_EXP
              : item?.toChain === 'ETH'
              ? ETH_EXP
              // : item?.toChain === 'AVAX'
              // ? AVAX_LOGO
              // : item?.toChain === 'FTM'
              // ? FTM_EXP
              // : item?.toChain === 'MAT' || item?.toChain === 'MATIC'
              // ? MATIC_LOGO
              : 'javascript:void(0)',
          trnx:
            item?.toChain === 'BSC'
              ? `https://bscscan.com/tx/${item?.toTransactionHash}`
              : item?.toChain === 'ETH'
              ? `https://etherscan.io/tx/${item?.toTransactionHash}`
              // : item?.toChain === 'AVAX'
              // ? `https://explorer.avax.network/tx/${item?.toTransactionHash}`
              // : item?.toChain === 'FTM'
              // ? `https://ftmscan.com/tx/${item?.toTransactionHash}`
              // : item?.toChain === 'MAT' || item?.toChain === 'MATIC'
              // ? `https://polygonscan.com/tx/${item?.toTransactionHash}`
              : 'javascript:void(0)',
            isSuccess:
              item?.toTransactionHash == ''
              ? false
              : true,
        },
      }))
      return response
    },
  })
}

// ##############################
