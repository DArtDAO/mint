import { useContractCall, useContractFunction } from '@usedapp/core'
import { Contract, utils } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import ERC721MinterABI from '../../artifacts/contracts/ERC721Minter.sol/ERC721Minter.json'
import FixedPriceMinterABI from '../../artifacts/contracts/FixedPriceMinter.sol/FixedPriceMinter.json'
import FixedPriceSpecificIDMinterABI from '../../artifacts/contracts/FixedPriceSpecificIDMinter.sol/FixedPriceSpecificIDMinter.json'
import config from '../../config'

const ERC721MinterAbi: Interface = new utils.Interface(ERC721MinterABI.abi)
const FixedPriceMinterAbi: Interface = new utils.Interface(
  FixedPriceMinterABI.abi
)
const FixedPriceSpecificIDMinterAbi: Interface = new utils.Interface(
  FixedPriceSpecificIDMinterABI.abi
)

export const useIsSaleActive = () => {
  const [paused] =
    useContractCall({
      abi: ERC721MinterAbi,
      address: config.minterAddress,
      method: 'paused',
      args: [],
    }) || []
  return !paused
}

export const useIncrementalMinterMintPrice = () => {
  return useMintPrice(FixedPriceMinterAbi)
}

export const useSpecificIdMinterMintPrice = () => {
  return useMintPrice(FixedPriceSpecificIDMinterAbi)
}

function useMintPrice(abi: utils.Interface) {
  const [tokenPrice] =
    useContractCall({
      abi: abi,
      address: config.minterAddress,
      method: 'tokenPrice',
      args: [],
    }) || []
  return tokenPrice
}

export const useMaxMintPerTx = () => {
  const [maxMintPerTx] =
    useContractCall({
      abi: FixedPriceMinterAbi,
      address: config.minterAddress,
      method: 'maxMintsPerTx',
      args: [],
    }) || []
  return maxMintPerTx && maxMintPerTx.toNumber()
}

export const useIncrementalMinterMint = () => {
  const contract = new Contract(config.minterAddress, FixedPriceMinterAbi)
  const { state, send } = useContractFunction(contract, 'mint')
  return send
}

export const useSpecificIdMinterMint = () => {
  const contract = new Contract(
    config.minterAddress,
    FixedPriceSpecificIDMinterAbi
  )
  const { state, send } = useContractFunction(contract, 'mint')
  return send
}

export const usePauseSale = () => {
  const contract = new Contract(config.minterAddress, ERC721MinterAbi)
  const { send } = useContractFunction(contract, 'pause')
  return send
}

export const useUnpauseSale = () => {
  const contract = new Contract(config.minterAddress, ERC721MinterAbi)
  const { send } = useContractFunction(contract, 'unpause')
  return send
}

export const useStartingBlock = () => {
  const [startBlock] =
    useContractCall({
      abi: ERC721MinterAbi,
      address: config.minterAddress,
      method: 'startingBlock',
      args: [],
    }) || []
  return startBlock && startBlock.toNumber()
}