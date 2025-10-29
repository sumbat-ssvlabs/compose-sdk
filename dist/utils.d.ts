import { Abi } from 'abitype';
import { AbiFunction } from 'abitype';
import { AbiParameter } from 'abitype';
import { AbiParametersToPrimitiveTypes } from 'abitype';
import { AbiParameterToPrimitiveType } from 'abitype';
import { AbiType } from 'abitype';
import { AbiTypeToPrimitiveType } from 'abitype';
import { Address } from 'viem';
import { Config } from '@wagmi/core';
import { CreateKernelAccountReturnType } from '@zerodev/sdk';
import { ExtractAbiFunction } from 'abitype';
import { ExtractAbiFunctionNames } from 'abitype';
import { ExtractAbiFunctions } from 'abitype';
import { Hex } from 'viem';
import { PaymasterActions } from 'viem/account-abstraction';
import { PrepareUserOperationReturnType } from 'viem/account-abstraction';
import { PublicClient } from 'viem';

export declare type AbiEncoder<T extends AbiFunction[]> = {
    [Fn in T[number] as Fn['name']]: Fn['inputs'] extends readonly [] ? () => Hex : (params: AbiInputsToParams<Fn['inputs']>) => Hex;
};

export declare type AbiInputsToParams<T extends readonly AbiParameter[]> = {
    [K in T[number] as K['name'] extends string ? K['name'] : never]: AbiParameterToPrimitiveType<K>;
};

declare type AccountAbstractionContracts = {
    kernelImpl: `0x${string}`;
    kernelFactory: `0x${string}`;
    multichainValidator: `0x${string}`;
    metaFactory: `0x${string}`;
};

export declare const bigintAbs: (n: bigint) => bigint;

export declare const bigintFloor: (value: bigint, precision?: bigint) => bigint;

export declare const bigintFormatter: Intl.NumberFormat;

export declare const bigintifyNumbers: (numbers: readonly number[] | number[]) => bigint[];

export declare const bigintMax: (...args: bigint[]) => bigint;

export declare const bigintMin: (...args: bigint[]) => bigint;

export declare const bigintRound: (value: bigint, precision: bigint) => bigint;

declare type Call = {
    to: Address;
    value: bigint;
    data: Hex;
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

export declare interface ComposedSignedUserOpsTxReturnType {
    raw: Hex;
    hash: Hex;
    to: Address;
    chainId: number;
    gas: Hex;
    maxFeePerGas: Hex;
    maxPriorityFeePerGas: Hex;
    userOpHashes: Hex[];
}

export declare const createAbiEncoder: <T extends Abi = Abi>(abi: T) => AbiEncoder<ExtractAbiFunctions<T, "nonpayable" | "payable">[]>;

export declare const createUserOp: ({ account, chainId, calls }: CreateUserOpParams, config: ComposeConfigReturnType) => Promise<{
    account: CreateKernelAccountReturnType<"0.7">;
    chainId: number;
    callData: `0x${string}`;
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preVerificationGas: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
    paymaster: PaymasterActions | undefined;
}>;

declare type CreateUserOpParams = {
    account: CreateKernelAccountReturnType<'0.7'>;
    chainId: number;
    calls: Call[];
};

export declare function encodeXtMessage(params: {
    senderId?: string;
    entries: Array<{
        chainId: number | bigint;
        rawTx: Hex;
    }>;
}): Hex;

export declare const ethFormatter: Intl.NumberFormat;

export declare const extractAbiFunction: <abi extends Abi, functionName extends ExtractAbiFunctionNames<abi>>(abi: abi, functionName: functionName) => ExtractAbiFunction<abi, functionName>;

export declare const formatBigintInput: (num: bigint, decimals?: number) => string;

export declare const formatSSV: (num: bigint, decimals?: number) => string;

/**
 * Checks if the difference between two bigints exceeds a specified tolerance.
 *
 * @param {bigint} a - The first bigint value.
 * @param {bigint} b - The second bigint value.
 * @param {bigint} [tolerance] - default is `parseUnits("0.0001", 18)`.
 */
export declare const isBigIntChanged: (a: bigint, b: bigint, tolerance?: bigint) => boolean;

export declare const ms: (value: number, unit: keyof typeof units) => number;

declare type NoBigints<T> = {
    [K in keyof T]: T[K] extends bigint ? string : T[K] extends bigint ? NoBigints<T[K]> : T[K];
};

export declare const numberFormatter: Intl.NumberFormat;

export declare const paramsToArray: <Fn extends AbiFunction, Params extends Record<string, AbiTypeToPrimitiveType<AbiType>>>({ params, abiFunction }: {
    params: Params;
    abiFunction: Fn;
}) => AbiParametersToPrimitiveTypes<Fn["inputs"]>;

declare type PaymasterEndpointArgs<TConfig extends Config> = {
    method: 'pm_getPaymasterStubData' | 'pm_getPaymasterData' | 'pm_sponsorUserOperation';
    chainId: TConfig['chains'][number]['id'];
};

export declare const percentageFormatter: {
    format: (value?: number) => string;
};

export declare const _percentageFormatter: Intl.NumberFormat;

export declare const roundOperatorFee: (fee: bigint, precision?: bigint) => bigint;

export declare const sortNumbers: <T extends bigint | number>(numbers: T[]) => T[];

/**
 * Converts bigints to strings in an object or array.
 * @param anything - The object or array to convert.
 * @returns A new object or array with bigints converted to strings.
 * @example
 * stringifyBigints(1n) → "1"
 * stringifyBigints([1n]) → ["1"]
 * stringifyBigints({a: 1n, b: { c: 1n }}) → {a: "1", b: {c: "1"}}
 */
export declare const stringifyBigints: <T>(anything: T) => NoBigints<T>;

export declare function toRpcUserOpCanonical(op: PrepareUserOperationReturnType): {
    sender: `0x${string}`;
    nonce: `0x${string}`;
    initCode: `0x${string}`;
    factory: `0x${string}` | undefined;
    factoryData: `0x${string}` | undefined;
    callData: `0x${string}`;
    callGasLimit: `0x${string}`;
    verificationGasLimit: `0x${string}`;
    preVerificationGas: `0x${string}`;
    maxFeePerGas: `0x${string}`;
    maxPriorityFeePerGas: `0x${string}`;
    paymaster: true | `0x${string}` | {
        getPaymasterData?: PaymasterActions["getPaymasterData"] | undefined;
        getPaymasterStubData?: PaymasterActions["getPaymasterStubData"] | undefined;
    } | ({
        getPaymasterData?: PaymasterActions["getPaymasterData"] | undefined;
        getPaymasterStubData?: PaymasterActions["getPaymasterStubData"] | undefined;
    } & `0x${string}`) | undefined;
    paymasterData: `0x${string}` | undefined;
    paymasterVerificationGasLimit: `0x${string}`;
    paymasterPostOpGasLimit: `0x${string}`;
    signature: `0x${string}`;
};

export declare const tryCatch: <T>(fn: () => T) => [T | null, Error | null];

declare const units: {
    readonly seconds: 1000;
    readonly minutes: 60000;
    readonly hours: 3600000;
    readonly days: 86400000;
    readonly weeks: 604800000;
    readonly months: 2629746000;
    readonly years: 31556952000;
};

export { }
