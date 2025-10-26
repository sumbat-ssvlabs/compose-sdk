import { getEntryPoint } from '@zerodev/sdk/constants';

export const entryPointV07 = getEntryPoint('0.7');

export const accountAbstractionContracts = {
  kernelImpl: '0x1ff48513f8722113ab840fdfd1866957d08bd5d2',
  kernelFactory: '0xcfb519af7e3e4b772c619ed12bcdc7d758ac6ee6',
  multichainValidator: '0x5e729b0d9d35fa3bd7ace526437151ec9e1d5929',
  metaFactory: '0x54db674c515e5fdec3f91345bc2fdafafd8b3b8a'
} as const;

export const composeDefaults = {
  tokens: {
    WETH: '0x356dA0CBA100a69B3FD3F2Ce4871B7e3921E7553',
    USDC: '0xeA0DB94b4c702d9cA0Fcc65715A035B24dF3452D',
    SSV: '0x79155fb8d8dE01522bE1Cbd17e538966d78d1565'
  },
  bridge: '0x31c57E2910496e46Bb883EDeb1eB2bee8E3Ee82C'
} as const;
