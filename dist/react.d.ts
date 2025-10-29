import { Config } from '@wagmi/core';
import { PublicClient } from 'viem';
import { ReactElement } from 'react';
import { ReactNode } from 'react';

declare type AccountAbstractionContracts = {
    kernelImpl: `0x${string}`;
    kernelFactory: `0x${string}`;
    multichainValidator: `0x${string}`;
    metaFactory: `0x${string}`;
};

declare type ComposeConfigArgs<TConfig extends Config> = {
    wagmi: TConfig;
    getPaymasterEndpoint?: (args: PaymasterEndpointArgs<TConfig>) => string;
    accountAbstractionContracts?: Record<TConfig['chains'][number]['id'], AccountAbstractionContracts>;
};

declare type ComposeConfigReturnType<TConfig extends Config = Config> = {
    getPublicClient: (chainId: TConfig['chains'][number]['id']) => PublicClient;
    hasPaymaster: boolean;
} & Pick<ComposeConfigArgs<TConfig>, 'getPaymasterEndpoint' | 'accountAbstractionContracts'>;

declare type ComposeContextValue<TConfig extends Config> = ComposeConfigReturnType<TConfig>;

export declare function ComposeProvider<TConfig extends Config>({ children, config }: ComposeProviderProps<TConfig>): ReactElement;

export declare interface ComposeProviderProps<TConfig extends Config> {
    children: ReactNode;
    config: ComposeConfigReturnType<TConfig>;
}

declare type PaymasterEndpointArgs<TConfig extends Config> = {
    method: 'pm_getPaymasterStubData' | 'pm_getPaymasterData' | 'pm_sponsorUserOperation';
    chainId: TConfig['chains'][number]['id'];
};

export declare function useCompose<TConfig extends Config>(): ComposeContextValue<TConfig>;

export { }
