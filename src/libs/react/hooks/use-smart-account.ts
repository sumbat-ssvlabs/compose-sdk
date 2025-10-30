import { entryPointV07 } from '@/config/deafults';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

import { useComposeConfig } from '@/libs/react/compose-provider';
import { createUserOps } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { toMultiChainECDSAValidator } from '@zerodev/multi-chain-ecdsa-validator';
import type { KernelSmartAccountImplementation } from '@zerodev/sdk';
import { createKernelAccount } from '@zerodev/sdk';
import { KERNEL_V3_1 } from '@zerodev/sdk/constants';
type Props = {
  chainId: number;
  multiChainIds?: number[];
};
export const useSmartAccount = ({ chainId, multiChainIds = [] }: Props) => {
  const account = useAccount();
  const composeConfig = useComposeConfig();

  const walletClient = useWalletClient();
  const publicClient = usePublicClient({ chainId });

  if (!composeConfig.accountAbstractionContracts?.[chainId]) {
    console.error(`Account abstraction contracts not fou  nd for chain ${chainId}`);
  }

  const smartAccountQuery = useQuery({
    queryKey: ['smart-account', walletClient.data?.account.address, chainId, multiChainIds],
    queryFn: async () => {
      const validator = await toMultiChainECDSAValidator(publicClient!, {
        entryPoint: entryPointV07,
        signer: walletClient.data!,
        kernelVersion: KERNEL_V3_1,
        validatorAddress: composeConfig.accountAbstractionContracts?.[chainId]?.multichainValidator,
        multiChainIds: multiChainIds
      });
      const kernelAccount = await createKernelAccount(publicClient as KernelSmartAccountImplementation['client'], {
        entryPoint: entryPointV07,
        plugins: { sudo: validator },
        kernelVersion: KERNEL_V3_1,
        accountImplementationAddress: composeConfig.accountAbstractionContracts?.[chainId]?.kernelImpl,
        factoryAddress: composeConfig.accountAbstractionContracts?.[chainId]?.kernelFactory,
        useMetaFactory: false
      });
      return {
        validator: validator,
        account: {
          ...kernelAccount,
          createUserOp: createUserOps.bind(null, composeConfig, kernelAccount)
        }
      };
    },
    enabled: account.isConnected && !!walletClient.data && !!composeConfig.accountAbstractionContracts?.[chainId]
  });

  return {
    publicClient,
    account: smartAccountQuery.data?.account,
    validator: smartAccountQuery.data?.validator,
    isLoading: smartAccountQuery.isLoading,
    isError: smartAccountQuery.isError,
    error: smartAccountQuery.error
  };
};
