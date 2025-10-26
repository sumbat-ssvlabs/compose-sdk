import { defineChain } from 'viem';
import {
  arbitrum as arbitrumChain,
  base as baseChain,
  mainnet as mainnetChain,
  optimism as optimismChain,
  polygon as polygonChain
} from 'viem/chains';

export const hoodi = defineChain({
  id: 560048,
  name: 'Hoodi',
  network: 'hoodi',
  nativeCurrency: {
    name: 'Hoodi',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [
        'https://ethereum-hoodi-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27'
      ]
    }
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://hoodi.etherscan.io'
    }
  },
  iconBackground: 'none',
  iconUrl: '/images/networks/light.svg',
  testnet: true
});

export const rollupA = defineChain({
  id: 77777,
  name: 'Rollup A',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rollup-rpc-1.stage.ops.ssvlabsinternal.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Rollup A',
      url: 'https://blockscout-rollup-1.stage.ops.ssvlabsinternal.com/'
    }
  },
  iconBackground: 'none',
  iconUrl: '/images/networks/light.svg',
  testnet: true
});

export const rollupB = defineChain({
  id: 88888,
  name: 'Rollup B',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rollup-rpc-2.stage.ops.ssvlabsinternal.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Rollup B',
      url: 'https://blockscout-rollup-2.stage.ops.ssvlabsinternal.com/'
    }
  },
  iconBackground: 'none',
  iconUrl: '/images/networks/light.svg',
  testnet: true
});

export const polygon = {
  ...polygonChain,
  rpcUrls: {
    default: {
      http: ['https://polygon-rpc.com']
    }
  }
};

export const mainnet = {
  ...mainnetChain,
  rpcUrls: {
    default: {
      http: ['https://eth.llamarpc.com']
    }
  }
};

export const base = {
  ...baseChain,
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org']
    }
  }
};

export const arbitrum = {
  ...arbitrumChain,
  rpcUrls: {
    default: {
      http: ['https://arb1.arbitrum.io/rpc']
    }
  }
};

export const optimism = {
  ...optimismChain,
  rpcUrls: {
    default: {
      http: ['https://mainnet.optimism.io']
    }
  }
};
