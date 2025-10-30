import { getPaymasterDataForChain } from '@/api/paymaster';
import type { ComposeConfigReturnType } from '@/config/create';
import type { CreateKernelAccountReturnType } from '@zerodev/sdk';
import { type Address, type Hex } from 'viem';

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GetPaymasterDataParameters, PaymasterActions } from 'viem/account-abstraction';

const FALLBACK_CALL_GAS_LIMIT = 900_000n;
const MIN_VERIFICATION_GAS_LIMIT = 1_200_000n;
const PRE_VERIFICATION_GAS = 90_000n;

const withMargin = (value: bigint, marginPct = 25n) => value + (value * marginPct) / 100n;

type Call = {
  to: Address;
  value: bigint;
  data: Hex;
};

export const createUserOps = async (
  config: ComposeConfigReturnType,
  account: CreateKernelAccountReturnType<'0.7'>,
  calls: Call[]
) => {
  const chainId = account.client.chain!.id;

  const publicClient = config.getPublicClient(chainId);
  if (!publicClient) {
    throw new Error(`Public client not found for chain ${chainId}`);
  }

  account.client.chain?.id;
  // Estimate gas for each call
  const callGasEstimates = await Promise.all(
    calls.map((call) =>
      publicClient
        .estimateGas({
          account,
          to: call.to,
          data: call.data,
          value: call.value
        })
        .then(withMargin)
        .catch((error: Error) => {
          console.warn(
            `Gas estimation failed for call to ${call.to}, falling back`,
            'message' in error ? error.message : 'Unknown error'
          );
          return FALLBACK_CALL_GAS_LIMIT;
        })
    )
  );

  // Sum all call gas limits
  const callGasLimit = callGasEstimates.reduce((acc, gas) => acc + gas, 0n);

  // Calculate verification gas limit
  const verificationGasLimit =
    callGasLimit + PRE_VERIFICATION_GAS > MIN_VERIFICATION_GAS_LIMIT
      ? callGasLimit + PRE_VERIFICATION_GAS
      : MIN_VERIFICATION_GAS_LIMIT;

  // Estimate fees per gas
  const gasEstimate = await publicClient.estimateFeesPerGas();

  const paymaster: PaymasterActions | undefined = config.hasPaymaster
    ? {
        getPaymasterData: (parameters: GetPaymasterDataParameters) => {
          return getPaymasterDataForChain({
            params: parameters,
            method: 'pm_sponsorUserOperation',
            getPaymasterEndpoint: config.getPaymasterEndpoint!
          });
        },
        getPaymasterStubData: (parameters: GetPaymasterDataParameters) => {
          return getPaymasterDataForChain({
            params: parameters,
            method: 'pm_getPaymasterStubData',
            getPaymasterEndpoint: config.getPaymasterEndpoint!
          });
        }
      }
    : undefined;

  const callData = await account.encodeCalls(calls);

  return {
    account,
    chainId,
    callData,
    callGasLimit,
    verificationGasLimit,
    preVerificationGas: PRE_VERIFICATION_GAS,
    maxFeePerGas: gasEstimate.maxFeePerGas!,
    maxPriorityFeePerGas: gasEstimate.maxPriorityFeePerGas!,
    paymaster
  };
};

export type UserOps = Awaited<ReturnType<typeof createUserOps>>;

// type SendUserOpsParams = {
//   operations: {
//     account: CreateKernelAccountReturnType<'0.7'>;
//     publicClient: PublicClient<Transport, Chain, Account, ComposeRpcSchema>;
//     userOps: UserOps;
//   }[];
// };
// export const sendUserOps = async ({ operations }: SendUserOpsParams) => {
//   const signedOps = (
//     await prepareAndSignUserOperations(
//       operations.map((operation) => operation.account.client),
//       operations.map((operation) => operation.userOps)
//     )
//   ).map(toRpcUserOpCanonical);

//   const builds = await Promise.all(
//     operations.map((operation, index) =>
//       operation.publicClient.request({
//         method: 'compose_buildSignedUserOpsTx',
//         params: [signedOps[index], { chainId: operation.chainId }]
//       })
//     )
//   );

//   const explorerUrls = operations.map((operation, index) =>
//     new URL(`tx/${builds[index].hash}`, operation.publicClient.chain.blockExplorers?.default?.url).toString()
//   );

//   return txs;
// };
