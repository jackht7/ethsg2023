const contractAddress = import.meta.env.VITE_PUBLIC_SMART_CONTRACT_ADDRESS;

export const config = {
  // '0x13881': {
  //   name: 'Mumbai',
  //   contractAddress: '',
  //   symbol: 'MATIC',
  //   blockExplorer: 'https://mumbai.polygonscan.com',
  //   rpcUrl: 'https://rpc-mumbai.maticvigil.com',
  // },
  '0xe704': {
    name: 'Linea',
    contractAddress:
      contractAddress || '0xb0ed5C158B7966462088b8312459299517fe9eFB',
    symbol: 'ETH',
    blockExplorer: 'https://explorer.goerli.linea.build',
    rpcUrl: 'https://rpc.goerli.linea.build',
  },
  '0xe9ac0dc': {
    name: 'Neon',
    contractAddress:
      contractAddress || '0xfD69f04D100841dF40BC31989a216E4731645f92',
    symbol: 'NEON',
    blockExplorer: 'https://devnet.neonscan.org',
  },
  '0x1389': {
    name: 'Mantle',
    contractAddress:
      contractAddress || '0x4B52749b6c3CDF470F905fDed5971aBbdaA32537',
    symbol: 'MNT',
    blockExplorer: 'https://explorer.testnet.mantle.xyz/',
  },
  // '0x5': {
  //   name: 'Goerli',
  //   contractAddress: '',
  //   symbol: 'ETH',
  //   blockExplorer: 'https://goerli.etherscan.io',
  //   rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  // },
};

/**
 * It returns true if the id is a key of the config object
 * @param {string | null} [id] - The network ID of the network you want to check.
 * @returns A function that takes an id and returns a boolean.
 */
export const isSupportedNetwork = (
  id?: string | null,
): id is keyof typeof config => {
  if (!id) {
    return false;
  }
  const isHexChain = id.startsWith('0x');
  const networkId = isHexChain ? id : `0x${Number(id).toString(16)}`; // if not hexstring transform to hexString
  // Make sure that networkId is in our supported network and is the current network set in .env
  return (
    networkId in config && import.meta.env.VITE_PUBLIC_NETWORK_ID === networkId
  );
};
