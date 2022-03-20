import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import WalletLink from 'walletlink'
import toast from 'react-hot-toast'
import {BigNumber, ethers} from 'ethers'
import networks from '../Contracts/networkConfi.json'
import chains from '../Contracts/chains.json'
import {apiRequest} from '../React_Query/axios_utils'
import endPoints from '../React_Query/apiEndpoints.json'

export const addNewNetwork = async (id) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: networks[id]?.chainId}],
    })
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networks[id]],
        })
      } catch (addError) {}
    }
  }
}

export const connectToWallet = createAsyncThunk('wallet', async () => {
  try {
    const providerOptions = {
      injected: {
        display: {
          name: 'Metamask',
          description: 'Connect with the provider in your Browser',
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          // bridge: 'https://bridge.walletconnect.org',
          // infuraId: '14a0951f47e646c1b241aa533e150219',
          rpc:{
            3: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            97: "https://speedy-nodes-nyc.moralis.io/7ef5d24e2c4157673144f3de/bsc/testnet",
          }
        },
      },
      walletlink: {
        package: WalletLink, // Required
        options: {
          appName: 'My Awesome App', // Required
          infuraId: '14a0951f47e646c1b241aa533e150219', // Required unless you provide a JSON RPC url; see `rpc` below
          // rpc: '', // Optional if `infuraId` is provided; otherwise it's required
          rpc:{
            3: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            97: "https://speedy-nodes-nyc.moralis.io/7ef5d24e2c4157673144f3de/bsc/testnet",
          }
          // chainId: 1, // Optional. It defaults to 1 if not provided
          // darkMode: false, // Optional. Use dark theme, defaults to false
        },
      },
    }
    const web3Modal = new Web3Modal({
      providerOptions,
    })
    const instance = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(instance)
    const signer = provider.getSigner()
    const accounts = await provider.listAccounts()
    const {chainId} = await provider.getNetwork()
    return {
      web3Modal,
      provider,
      userAddress: accounts[0],
      chainId: chainId,
    }
  } catch (error) {
    console.log(error.message)
  }
})
export const swapTOKENS = createAsyncThunk(
  'swapTokens',
  async ({
    swapContract,
    bridgeBalance,
    provider,
    price,
    userAllowance,
    secondChain,
    chainId,
    token,
    userAddress,
  }) => {
    try {
      const tokenContract = new ethers.Contract(
        swapContract?.TokenAddress,
        swapContract?.tokenAbi,
        provider
      )
      const bridgeContract = new ethers.Contract(
        swapContract?.bridgeAddress,
        swapContract?.bridgeAbi,
        provider
      )
      const signer = provider.getSigner()
      const network =  await provider.getNetwork()
      const expectedChainId = network.chainId
      // console.log(expectedChainId, chainId)

      if( expectedChainId != chainId) {
        swapToastSuccess = toast.error('Please Select correct chain in metamask')
        return
      }
      const tokenContractSigner = tokenContract.connect(signer)
      const bridgeContractSigner = bridgeContract.connect(signer)
      const newAmount = BigNumber.from(parseInt(price*1000000000).toString())
      let amount = newAmount?.toString()
      const postRoute = endPoints[`${chainId}`]['postTransaction']
      if (!userAllowance) {
        const num = ethers.utils
          .parseUnits('115792089237316195423570985008687907853', 'gwei')
          .toString()
        const approveTxn = await tokenContractSigner.approve(
          swapContract?.bridgeAddress,
          num
        )
        await approveTxn.wait()
        const options = {value: bridgeBalance}
        // to deal with max button rundoff error
        const maxBalance = tokenContract.balanceOf(userAddress)
        if(parseInt(amount)> maxBalance) {
          amount = maxBalance.toString()
        }
        const response = await bridgeContractSigner.swap(amount, secondChain)
        if (response?.hash) {
          const res = await apiRequest({
            url: `${postRoute}?txHash=${
              response?.hash
            }&token=${token}&swapAmount=${price}&fromTimestamp=${new Date().toISOString()}&toChain=${
              chains[secondChain]
            }`,
          })
          if (res?.data?.status === 'true' || res?.data?.status === true) {
            await response.wait()
            return response.hash
          }
        }
      } else {
        const options = {value: bridgeBalance}
        // to deal with max roundoff error
        const maxBalance = tokenContract.balanceOf(userAddress)
        if(parseInt(amount)> maxBalance) {
          amount = maxBalance.toString()
        }
        const response = await bridgeContractSigner.swap(
          amount,
          secondChain,
          options
        )
        if (response?.hash) {
          const res = await apiRequest({
            url: `${postRoute}?txHash=${
              response?.hash
            }&token=${token}&swapAmount=${price}&fromTimestamp=${new Date().toISOString()}&toChain=${
              chains[secondChain]
            }`,
          })
          if (res?.data?.status === 'true' || res?.data?.status === true) {
            await response.wait()
            return response.hash
          }
        }
      }
    } catch (error) {
      toast.error(error?.message)
      console.log(error.message)
    }
  }
)

export const disconnectWallet = async (web3Modal, provider) => {
  if (provider.close) {
    await provider.close()
    await web3Modal.clearCachedProvider()
  }
  await web3Modal.clearCachedProvider()
  window.location.reload()
}

const initialState = {
  provider: null,
  userAddress: '',
  chainId: 0,
  web3Modal: null,
  token: 'ELONGOAT',
  secondChain: 'BSC',
  balanceOfChain: 0,
  balanceOfSecondChain: 0,
  transactionHash: '',
  swapLoading: false,
}

let swapToast
let swapToastSuccess
let swapToastError

const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    updateToken(state, {payload}) {
      state.token = payload
    },
    updateSecondChain(state, {payload}) {
      state.secondChain = payload
    },
    updateFirstChainBalances(state, {payload}) {
      state.balanceOfChain = payload
    },
    updateSecondChainBalances(state, {payload}) {
      state.balanceOfSecondChain = payload
    },
    updateUserAddress(state, {payload}) {
      state.userAddress = payload
    },
    clearHashValue(state, {payload}) {
      state.transactionHash = ''
    },
  },
  extraReducers: {
    [connectToWallet.pending]: (state) => {},
    [connectToWallet.fulfilled]: (state, {payload}) => {
      state.provider = payload?.provider
      state.userAddress = payload?.userAddress
      state.chainId = payload?.chainId
      state.web3Modal = payload?.web3Modal
      toast.success('Wallet Connected')
    },
    [connectToWallet.rejected]: (state, {error}) => {
      if (error.code === 4001) {
        // console.log('Please connect to MetaMask.')
        toast.error('Please connect to MetaMask.')
      } else {
        console.error(error)
      }
    },
    [swapTOKENS.pending]: (state) => {
      state.swapLoading = true
      toast.dismiss(swapToastSuccess)
      toast.dismiss(swapToastError)
      swapToast = toast.loading('Swapping......')
    },
    [swapTOKENS.fulfilled]: (state, {payload}) => {
      state.swapLoading = false
      toast.dismiss(swapToast)
      state.transactionHash = payload
      swapToastSuccess = toast.success('Swapped Successfully')
    },
    [swapTOKENS.rejected]: (state, {error}) => {
      state.swapLoading = false
      toast.dismiss(swapToast)
      toast.dismiss(swapToastSuccess)
      swapToastError = toast.error(error?.message)
      console.error(error)
    },
  },
})

export default rootSlice.reducer
export const {
  updateUserAddress,
  updateToken,
  updateSecondChain,
  updateFirstChainBalances,
  updateSecondChainBalances,
  clearHashValue,
} = rootSlice.actions
