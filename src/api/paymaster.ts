import { api } from '@/api/api-client';
import { endpoint } from '@/utils/api';
import { stringifyBigints } from '@/utils/bigint';
import { camelCase } from 'lodash-es';
import type { Hex } from 'viem';
import { numberToHex } from 'viem';
import type { GetPaymasterDataParameters } from 'viem/account-abstraction';

interface PaymasterResponseData {
  id: 1;
  jsonrpc: '2.0';
  result: {
    paymaster: `0x${string}`;
    paymasterData: `0x${string}`;
    paymasterPostOpGasLimit: Hex;
    paymasterVerificationGasLimit: Hex;

    preVerificationGas: Hex;
    callGasLimit: Hex;
    verificationGasLimit: Hex;
  };
}

export const getPaymasterDataForChain = async (
  params: GetPaymasterDataParameters,
  method: 'pm_getPaymasterStubData' | 'pm_getPaymasterData' | 'pm_sponsorUserOperation'
) => {
  console.log('calling Paymaster', params, method);
  const chainName = camelCase(getChainName(params.chainId as (typeof config.chains)[number]['id'])!);

  const nToHexIfIs = (n: number | bigint | undefined) => (n ? numberToHex(n) : undefined);

  const userOpOnly = {
    callData: params.callData,
    initCode: params.initCode,
    callGasLimit: nToHexIfIs(params.callGasLimit),
    factory: params.factory,
    factoryData: params.factoryData,
    maxFeePerGas: nToHexIfIs(params.maxFeePerGas || 0),
    maxPriorityFeePerGas: nToHexIfIs(params.maxPriorityFeePerGas || 0),
    nonce: nToHexIfIs(params.nonce),
    sender: params.sender,
    preVerificationGas: nToHexIfIs(params.preVerificationGas || 0),
    verificationGasLimit: nToHexIfIs(params.verificationGasLimit || 0),
    paymasterPostOpGasLimit: nToHexIfIs(params.paymasterPostOpGasLimit || 0),
    paymasterVerificationGasLimit: nToHexIfIs(params.paymasterVerificationGasLimit || 0)
  };

  if (!import.meta.env.VITE_PAYMASTER_URL) {
    throw new Error('VITE_PAYMASTER_URL is not set - Paymaster Service URL - set it in .env to support paymaster');
  }

  const paymasterParams = [userOpOnly, params.entryPointAddress];

  if (method !== 'pm_sponsorUserOperation') {
    paymasterParams.push(numberToHex(params.chainId));
  }

  return api
    .post<PaymasterResponseData>(
      endpoint(import.meta.env.VITE_PAYMASTER_URL, 'rpc/v1', chainName),
      {
        jsonrpc: '2.0',
        id: 1,
        method,
        params: paymasterParams
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        transformRequest: [stringifyBigints]
      }
    )
    .then((res) => {
      console.log('Paymaster response', res);
      return {
        ...res.result,
        paymasterPostOpGasLimit: BigInt(res.result?.paymasterPostOpGasLimit || '0'),
        paymasterVerificationGasLimit: BigInt(res.result.paymasterVerificationGasLimit || '0')
      };
    });
};
