import { entryPointV07 } from '@/config/deafults';
import { usePublicClient, useWalletClient } from 'wagmi';

import { useCompose } from '@/libs/react/compose-provider';
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
  const compose = useCompose();

  const publicClient = usePublicClient({ chainId });
  const walletClient = useWalletClient({ chainId });

  const smartAccountQuery = useQuery({
    queryKey: ['smart-account', walletClient.data?.account.address],
    queryFn: async () => {
      const validator = await toMultiChainECDSAValidator(publicClient!, {
        entryPoint: entryPointV07,
        signer: walletClient.data!,
        kernelVersion: KERNEL_V3_1,
        validatorAddress: compose.accountAbstractionContracts?.[chainId]?.multichainValidator,
        multiChainIds: multiChainIds
      });
      const kernelAccount = await createKernelAccount(publicClient as KernelSmartAccountImplementation['client'], {
        entryPoint: entryPointV07,
        plugins: { sudo: validator },
        kernelVersion: KERNEL_V3_1,
        accountImplementationAddress: compose.accountAbstractionContracts?.[chainId]?.kernelImpl,
        factoryAddress: compose.accountAbstractionContracts?.[chainId]?.kernelFactory,
        useMetaFactory: false
      });
      return {
        account: kernelAccount,
        validator: validator
      };
    },
    enabled: !!walletClient.data
  });

  return smartAccountQuery;
};
