import { jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { k as keccak256, l as checksumAddress, n as concatHex, q as toRlp, s as numberToHex, u as hexToBytes, v as isHex, w as toHex, x as hexToBigInt, y as size, z as hexToNumber, A as isAddressEqual, B as getAddress, L as LruMap, C as encodeAbiParameters, D as getAction, E as readContract, F as parseAbi, G as AccountNotFoundError, H as parseAccount, I as stringToHex, J as getTypesForEIP712Domain, K as validateTypedData, M as serializeTypedData, N as isAddress, O as InvalidAddressError, P as encodeFunctionData, Q as call, R as decodeFunctionResult, S as getContractError, T as AccountTypeNotSupportedError, U as prepareAuthorization, V as KernelModuleIsModuleInstalledAbi, W as getChainId, X as getUserOperationHash, Y as KernelV3AccountAbi, Z as KERNEL_NAME, _ as CALL_TYPE, $ as VALIDATOR_TYPE, a0 as VALIDATOR_MODE, a1 as isPluginInitialized, a2 as getEncodedPluginsData$1, a3 as safeCreateCallAddress, a4 as KernelV3ExecuteAbi, a5 as EXEC_TYPE, a6 as KernelModuleInstallAbi, a7 as entryPoint07Address, a8 as KernelVersionToAddressesMap, a9 as MAGIC_VALUE_SIG_REPLAYABLE, aa as dist, ab as SignTransactionNotSupportedBySmartAccountError, i as createUserOps, e as entryPointV07, ac as KERNEL_V3_1 } from "./index-BNq_n_5e.mjs";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { concat, ContractFunctionRevertedError, RpcRequestError, InvalidInputRpcError, UnknownRpcError, decodeErrorResult, RawContractError, BaseError, concatHex as concatHex$1, pad, createWalletClient, custom, encodeFunctionData as encodeFunctionData$1, decodeFunctionResult as decodeFunctionResult$1, publicActions, toFunctionSelector, getAbiItem, toHex as toHex$1, hexToBigInt as hexToBigInt$1, zeroAddress, encodeAbiParameters as encodeAbiParameters$1, parseAbiParameters, maxUint192, maxUint16, parseAbi as parseAbi$1, encodeDeployData, keccak256 as keccak256$1, stringToHex as stringToHex$1, domainSeparator, isAddressEqual as isAddressEqual$1, createNonceManager as createNonceManager$1, getTypesForEIP712Domain as getTypesForEIP712Domain$1, validateTypedData as validateTypedData$1, hashTypedData, hashMessage } from "viem";
import { useQuery } from "@tanstack/react-query";
const entryPoint06Abi = [
  {
    inputs: [
      { name: "preOpGas", type: "uint256" },
      { name: "paid", type: "uint256" },
      { name: "validAfter", type: "uint48" },
      { name: "validUntil", type: "uint48" },
      { name: "targetSuccess", type: "bool" },
      { name: "targetResult", type: "bytes" }
    ],
    name: "ExecutionResult",
    type: "error"
  },
  {
    inputs: [
      { name: "opIndex", type: "uint256" },
      { name: "reason", type: "string" }
    ],
    name: "FailedOp",
    type: "error"
  },
  {
    inputs: [{ name: "sender", type: "address" }],
    name: "SenderAddressResult",
    type: "error"
  },
  {
    inputs: [{ name: "aggregator", type: "address" }],
    name: "SignatureValidationFailed",
    type: "error"
  },
  {
    inputs: [
      {
        components: [
          { name: "preOpGas", type: "uint256" },
          { name: "prefund", type: "uint256" },
          { name: "sigFailed", type: "bool" },
          { name: "validAfter", type: "uint48" },
          { name: "validUntil", type: "uint48" },
          { name: "paymasterContext", type: "bytes" }
        ],
        name: "returnInfo",
        type: "tuple"
      },
      {
        components: [
          { name: "stake", type: "uint256" },
          { name: "unstakeDelaySec", type: "uint256" }
        ],
        name: "senderInfo",
        type: "tuple"
      },
      {
        components: [
          { name: "stake", type: "uint256" },
          { name: "unstakeDelaySec", type: "uint256" }
        ],
        name: "factoryInfo",
        type: "tuple"
      },
      {
        components: [
          { name: "stake", type: "uint256" },
          { name: "unstakeDelaySec", type: "uint256" }
        ],
        name: "paymasterInfo",
        type: "tuple"
      }
    ],
    name: "ValidationResult",
    type: "error"
  },
  {
    inputs: [
      {
        components: [
          { name: "preOpGas", type: "uint256" },
          { name: "prefund", type: "uint256" },
          { name: "sigFailed", type: "bool" },
          { name: "validAfter", type: "uint48" },
          { name: "validUntil", type: "uint48" },
          { name: "paymasterContext", type: "bytes" }
        ],
        name: "returnInfo",
        type: "tuple"
      },
      {
        components: [
          { name: "stake", type: "uint256" },
          { name: "unstakeDelaySec", type: "uint256" }
        ],
        name: "senderInfo",
        type: "tuple"
      },
      {
        components: [
          { name: "stake", type: "uint256" },
          { name: "unstakeDelaySec", type: "uint256" }
        ],
        name: "factoryInfo",
        type: "tuple"
      },
      {
        components: [
          { name: "stake", type: "uint256" },
          { name: "unstakeDelaySec", type: "uint256" }
        ],
        name: "paymasterInfo",
        type: "tuple"
      },
      {
        components: [
          { name: "aggregator", type: "address" },
          {
            components: [
              { name: "stake", type: "uint256" },
              {
                name: "unstakeDelaySec",
                type: "uint256"
              }
            ],
            name: "stakeInfo",
            type: "tuple"
          }
        ],
        name: "aggregatorInfo",
        type: "tuple"
      }
    ],
    name: "ValidationResultWithAggregation",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "userOpHash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        name: "factory",
        type: "address"
      },
      {
        indexed: false,
        name: "paymaster",
        type: "address"
      }
    ],
    name: "AccountDeployed",
    type: "event"
  },
  { anonymous: false, inputs: [], name: "BeforeExecution", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        name: "totalDeposit",
        type: "uint256"
      }
    ],
    name: "Deposited",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "aggregator",
        type: "address"
      }
    ],
    name: "SignatureAggregatorChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        name: "totalStaked",
        type: "uint256"
      },
      {
        indexed: false,
        name: "unstakeDelaySec",
        type: "uint256"
      }
    ],
    name: "StakeLocked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        name: "withdrawTime",
        type: "uint256"
      }
    ],
    name: "StakeUnlocked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        name: "withdrawAddress",
        type: "address"
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256"
      }
    ],
    name: "StakeWithdrawn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "userOpHash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "sender",
        type: "address"
      },
      {
        indexed: true,
        name: "paymaster",
        type: "address"
      },
      {
        indexed: false,
        name: "nonce",
        type: "uint256"
      },
      { indexed: false, name: "success", type: "bool" },
      {
        indexed: false,
        name: "actualGasCost",
        type: "uint256"
      },
      {
        indexed: false,
        name: "actualGasUsed",
        type: "uint256"
      }
    ],
    name: "UserOperationEvent",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "userOpHash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        name: "nonce",
        type: "uint256"
      },
      {
        indexed: false,
        name: "revertReason",
        type: "bytes"
      }
    ],
    name: "UserOperationRevertReason",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        name: "withdrawAddress",
        type: "address"
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Withdrawn",
    type: "event"
  },
  {
    inputs: [],
    name: "SIG_VALIDATION_FAILED",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "initCode", type: "bytes" },
      { name: "sender", type: "address" },
      { name: "paymasterAndData", type: "bytes" }
    ],
    name: "_validateSenderAndPaymaster",
    outputs: [],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "unstakeDelaySec", type: "uint32" }],
    name: "addStake",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "depositTo",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "deposits",
    outputs: [
      { name: "deposit", type: "uint112" },
      { name: "staked", type: "bool" },
      { name: "stake", type: "uint112" },
      { name: "unstakeDelaySec", type: "uint32" },
      { name: "withdrawTime", type: "uint48" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "getDepositInfo",
    outputs: [
      {
        components: [
          { name: "deposit", type: "uint112" },
          { name: "staked", type: "bool" },
          { name: "stake", type: "uint112" },
          { name: "unstakeDelaySec", type: "uint32" },
          { name: "withdrawTime", type: "uint48" }
        ],
        name: "info",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "sender", type: "address" },
      { name: "key", type: "uint192" }
    ],
    name: "getNonce",
    outputs: [{ name: "nonce", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "initCode", type: "bytes" }],
    name: "getSenderAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { name: "sender", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "initCode", type: "bytes" },
          { name: "callData", type: "bytes" },
          { name: "callGasLimit", type: "uint256" },
          {
            name: "verificationGasLimit",
            type: "uint256"
          },
          {
            name: "preVerificationGas",
            type: "uint256"
          },
          { name: "maxFeePerGas", type: "uint256" },
          {
            name: "maxPriorityFeePerGas",
            type: "uint256"
          },
          { name: "paymasterAndData", type: "bytes" },
          { name: "signature", type: "bytes" }
        ],
        name: "userOp",
        type: "tuple"
      }
    ],
    name: "getUserOpHash",
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { name: "sender", type: "address" },
              { name: "nonce", type: "uint256" },
              { name: "initCode", type: "bytes" },
              { name: "callData", type: "bytes" },
              {
                name: "callGasLimit",
                type: "uint256"
              },
              {
                name: "verificationGasLimit",
                type: "uint256"
              },
              {
                name: "preVerificationGas",
                type: "uint256"
              },
              {
                name: "maxFeePerGas",
                type: "uint256"
              },
              {
                name: "maxPriorityFeePerGas",
                type: "uint256"
              },
              {
                name: "paymasterAndData",
                type: "bytes"
              },
              { name: "signature", type: "bytes" }
            ],
            name: "userOps",
            type: "tuple[]"
          },
          {
            name: "aggregator",
            type: "address"
          },
          { name: "signature", type: "bytes" }
        ],
        name: "opsPerAggregator",
        type: "tuple[]"
      },
      { name: "beneficiary", type: "address" }
    ],
    name: "handleAggregatedOps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { name: "sender", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "initCode", type: "bytes" },
          { name: "callData", type: "bytes" },
          { name: "callGasLimit", type: "uint256" },
          {
            name: "verificationGasLimit",
            type: "uint256"
          },
          {
            name: "preVerificationGas",
            type: "uint256"
          },
          { name: "maxFeePerGas", type: "uint256" },
          {
            name: "maxPriorityFeePerGas",
            type: "uint256"
          },
          { name: "paymasterAndData", type: "bytes" },
          { name: "signature", type: "bytes" }
        ],
        name: "ops",
        type: "tuple[]"
      },
      { name: "beneficiary", type: "address" }
    ],
    name: "handleOps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "key", type: "uint192" }],
    name: "incrementNonce",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "callData", type: "bytes" },
      {
        components: [
          {
            components: [
              { name: "sender", type: "address" },
              { name: "nonce", type: "uint256" },
              {
                name: "callGasLimit",
                type: "uint256"
              },
              {
                name: "verificationGasLimit",
                type: "uint256"
              },
              {
                name: "preVerificationGas",
                type: "uint256"
              },
              { name: "paymaster", type: "address" },
              {
                name: "maxFeePerGas",
                type: "uint256"
              },
              {
                name: "maxPriorityFeePerGas",
                type: "uint256"
              }
            ],
            name: "mUserOp",
            type: "tuple"
          },
          { name: "userOpHash", type: "bytes32" },
          { name: "prefund", type: "uint256" },
          { name: "contextOffset", type: "uint256" },
          { name: "preOpGas", type: "uint256" }
        ],
        name: "opInfo",
        type: "tuple"
      },
      { name: "context", type: "bytes" }
    ],
    name: "innerHandleOp",
    outputs: [{ name: "actualGasCost", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint192" }
    ],
    name: "nonceSequenceNumber",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { name: "sender", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "initCode", type: "bytes" },
          { name: "callData", type: "bytes" },
          { name: "callGasLimit", type: "uint256" },
          {
            name: "verificationGasLimit",
            type: "uint256"
          },
          {
            name: "preVerificationGas",
            type: "uint256"
          },
          { name: "maxFeePerGas", type: "uint256" },
          {
            name: "maxPriorityFeePerGas",
            type: "uint256"
          },
          { name: "paymasterAndData", type: "bytes" },
          { name: "signature", type: "bytes" }
        ],
        name: "op",
        type: "tuple"
      },
      { name: "target", type: "address" },
      { name: "targetCallData", type: "bytes" }
    ],
    name: "simulateHandleOp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { name: "sender", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "initCode", type: "bytes" },
          { name: "callData", type: "bytes" },
          { name: "callGasLimit", type: "uint256" },
          {
            name: "verificationGasLimit",
            type: "uint256"
          },
          {
            name: "preVerificationGas",
            type: "uint256"
          },
          { name: "maxFeePerGas", type: "uint256" },
          {
            name: "maxPriorityFeePerGas",
            type: "uint256"
          },
          { name: "paymasterAndData", type: "bytes" },
          { name: "signature", type: "bytes" }
        ],
        name: "userOp",
        type: "tuple"
      }
    ],
    name: "simulateValidation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "unlockStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        name: "withdrawAddress",
        type: "address"
      }
    ],
    name: "withdrawStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        name: "withdrawAddress",
        type: "address"
      },
      { name: "withdrawAmount", type: "uint256" }
    ],
    name: "withdrawTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  { stateMutability: "payable", type: "receive" }
];
const entryPoint07Abi = [
  {
    inputs: [
      { name: "success", type: "bool" },
      { name: "ret", type: "bytes" }
    ],
    name: "DelegateAndRevert",
    type: "error"
  },
  {
    inputs: [
      { name: "opIndex", type: "uint256" },
      { name: "reason", type: "string" }
    ],
    name: "FailedOp",
    type: "error"
  },
  {
    inputs: [
      { name: "opIndex", type: "uint256" },
      { name: "reason", type: "string" },
      { name: "inner", type: "bytes" }
    ],
    name: "FailedOpWithRevert",
    type: "error"
  },
  {
    inputs: [{ name: "returnData", type: "bytes" }],
    name: "PostOpReverted",
    type: "error"
  },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  {
    inputs: [{ name: "sender", type: "address" }],
    name: "SenderAddressResult",
    type: "error"
  },
  {
    inputs: [{ name: "aggregator", type: "address" }],
    name: "SignatureValidationFailed",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "userOpHash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        name: "factory",
        type: "address"
      },
      {
        indexed: false,
        name: "paymaster",
        type: "address"
      }
    ],
    name: "AccountDeployed",
    type: "event"
  },
  { anonymous: false, inputs: [], name: "BeforeExecution", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        name: "totalDeposit",
        type: "uint256"
      }
    ],
    name: "Deposited",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "userOpHash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        name: "nonce",
        type: "uint256"
      },
      {
        indexed: false,
        name: "revertReason",
        type: "bytes"
      }
    ],
    name: "PostOpRevertReason",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "aggregator",
        type: "address"
      }
    ],
    name: "SignatureAggregatorChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        name: "totalStaked",
        type: "uint256"
      },
      {
        indexed: false,
        name: "unstakeDelaySec",
        type: "uint256"
      }
    ],
    name: "StakeLocked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        name: "withdrawTime",
        type: "uint256"
      }
    ],
    name: "StakeUnlocked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        name: "withdrawAddress",
        type: "address"
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256"
      }
    ],
    name: "StakeWithdrawn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "userOpHash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "sender",
        type: "address"
      },
      {
        indexed: true,
        name: "paymaster",
        type: "address"
      },
      {
        indexed: false,
        name: "nonce",
        type: "uint256"
      },
      { indexed: false, name: "success", type: "bool" },
      {
        indexed: false,
        name: "actualGasCost",
        type: "uint256"
      },
      {
        indexed: false,
        name: "actualGasUsed",
        type: "uint256"
      }
    ],
    name: "UserOperationEvent",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "userOpHash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        name: "nonce",
        type: "uint256"
      }
    ],
    name: "UserOperationPrefundTooLow",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "userOpHash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        name: "nonce",
        type: "uint256"
      },
      {
        indexed: false,
        name: "revertReason",
        type: "bytes"
      }
    ],
    name: "UserOperationRevertReason",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        name: "withdrawAddress",
        type: "address"
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Withdrawn",
    type: "event"
  },
  {
    inputs: [{ name: "unstakeDelaySec", type: "uint32" }],
    name: "addStake",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "target", type: "address" },
      { name: "data", type: "bytes" }
    ],
    name: "delegateAndRevert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "depositTo",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "deposits",
    outputs: [
      { name: "deposit", type: "uint256" },
      { name: "staked", type: "bool" },
      { name: "stake", type: "uint112" },
      { name: "unstakeDelaySec", type: "uint32" },
      { name: "withdrawTime", type: "uint48" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "getDepositInfo",
    outputs: [
      {
        components: [
          { name: "deposit", type: "uint256" },
          { name: "staked", type: "bool" },
          { name: "stake", type: "uint112" },
          { name: "unstakeDelaySec", type: "uint32" },
          { name: "withdrawTime", type: "uint48" }
        ],
        name: "info",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "sender", type: "address" },
      { name: "key", type: "uint192" }
    ],
    name: "getNonce",
    outputs: [{ name: "nonce", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "initCode", type: "bytes" }],
    name: "getSenderAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { name: "sender", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "initCode", type: "bytes" },
          { name: "callData", type: "bytes" },
          {
            name: "accountGasLimits",
            type: "bytes32"
          },
          {
            name: "preVerificationGas",
            type: "uint256"
          },
          { name: "gasFees", type: "bytes32" },
          { name: "paymasterAndData", type: "bytes" },
          { name: "signature", type: "bytes" }
        ],
        name: "userOp",
        type: "tuple"
      }
    ],
    name: "getUserOpHash",
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { name: "sender", type: "address" },
              { name: "nonce", type: "uint256" },
              { name: "initCode", type: "bytes" },
              { name: "callData", type: "bytes" },
              {
                name: "accountGasLimits",
                type: "bytes32"
              },
              {
                name: "preVerificationGas",
                type: "uint256"
              },
              { name: "gasFees", type: "bytes32" },
              {
                name: "paymasterAndData",
                type: "bytes"
              },
              { name: "signature", type: "bytes" }
            ],
            name: "userOps",
            type: "tuple[]"
          },
          {
            name: "aggregator",
            type: "address"
          },
          { name: "signature", type: "bytes" }
        ],
        name: "opsPerAggregator",
        type: "tuple[]"
      },
      { name: "beneficiary", type: "address" }
    ],
    name: "handleAggregatedOps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { name: "sender", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "initCode", type: "bytes" },
          { name: "callData", type: "bytes" },
          {
            name: "accountGasLimits",
            type: "bytes32"
          },
          {
            name: "preVerificationGas",
            type: "uint256"
          },
          { name: "gasFees", type: "bytes32" },
          { name: "paymasterAndData", type: "bytes" },
          { name: "signature", type: "bytes" }
        ],
        name: "ops",
        type: "tuple[]"
      },
      { name: "beneficiary", type: "address" }
    ],
    name: "handleOps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "key", type: "uint192" }],
    name: "incrementNonce",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "callData", type: "bytes" },
      {
        components: [
          {
            components: [
              { name: "sender", type: "address" },
              { name: "nonce", type: "uint256" },
              {
                name: "verificationGasLimit",
                type: "uint256"
              },
              {
                name: "callGasLimit",
                type: "uint256"
              },
              {
                name: "paymasterVerificationGasLimit",
                type: "uint256"
              },
              {
                name: "paymasterPostOpGasLimit",
                type: "uint256"
              },
              {
                name: "preVerificationGas",
                type: "uint256"
              },
              { name: "paymaster", type: "address" },
              {
                name: "maxFeePerGas",
                type: "uint256"
              },
              {
                name: "maxPriorityFeePerGas",
                type: "uint256"
              }
            ],
            name: "mUserOp",
            type: "tuple"
          },
          { name: "userOpHash", type: "bytes32" },
          { name: "prefund", type: "uint256" },
          { name: "contextOffset", type: "uint256" },
          { name: "preOpGas", type: "uint256" }
        ],
        name: "opInfo",
        type: "tuple"
      },
      { name: "context", type: "bytes" }
    ],
    name: "innerHandleOp",
    outputs: [{ name: "actualGasCost", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint192" }
    ],
    name: "nonceSequenceNumber",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "unlockStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        name: "withdrawAddress",
        type: "address"
      }
    ],
    name: "withdrawStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        name: "withdrawAddress",
        type: "address"
      },
      { name: "withdrawAmount", type: "uint256" }
    ],
    name: "withdrawTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  { stateMutability: "payable", type: "receive" }
];
function publicKeyToAddress(publicKey) {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return checksumAddress(`0x${address}`);
}
function hashAuthorization(parameters) {
  const { chainId, nonce, to } = parameters;
  const address = parameters.contractAddress ?? parameters.address;
  const hash = keccak256(concatHex([
    "0x05",
    toRlp([
      chainId ? numberToHex(chainId) : "0x",
      address,
      nonce ? numberToHex(nonce) : "0x"
    ])
  ]));
  if (to === "bytes")
    return hexToBytes(hash);
  return hash;
}
async function recoverPublicKey({ hash, signature }) {
  const hashHex = isHex(hash) ? hash : toHex(hash);
  const { secp256k1 } = await import("./secp256k1-wXwEifNb.mjs");
  const signature_ = (() => {
    if (typeof signature === "object" && "r" in signature && "s" in signature) {
      const { r, s, v, yParity } = signature;
      const yParityOrV2 = Number(yParity ?? v);
      const recoveryBit2 = toRecoveryBit(yParityOrV2);
      return new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit2);
    }
    const signatureHex = isHex(signature) ? signature : toHex(signature);
    if (size(signatureHex) !== 65)
      throw new Error("invalid signature length");
    const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
    const recoveryBit = toRecoveryBit(yParityOrV);
    return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
  })();
  const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);
  return `0x${publicKey}`;
}
function toRecoveryBit(yParityOrV) {
  if (yParityOrV === 0 || yParityOrV === 1)
    return yParityOrV;
  if (yParityOrV === 27)
    return 0;
  if (yParityOrV === 28)
    return 1;
  throw new Error("Invalid yParityOrV value");
}
async function recoverAddress({ hash, signature }) {
  return publicKeyToAddress(await recoverPublicKey({ hash, signature }));
}
async function recoverAuthorizationAddress(parameters) {
  const { authorization, signature } = parameters;
  return recoverAddress({
    hash: hashAuthorization(authorization),
    signature: signature ?? authorization
  });
}
async function verifyAuthorization({ address, authorization, signature }) {
  return isAddressEqual(getAddress(address), await recoverAuthorizationAddress({
    authorization,
    signature
  }));
}
function createNonceManager(parameters) {
  const { source } = parameters;
  const deltaMap = /* @__PURE__ */ new Map();
  const nonceMap = new LruMap(8192);
  const promiseMap = /* @__PURE__ */ new Map();
  const getKey = ({ address, chainId }) => `${address}.${chainId}`;
  return {
    async consume({ address, chainId, client }) {
      const key = getKey({ address, chainId });
      const promise = this.get({ address, chainId, client });
      this.increment({ address, chainId });
      const nonce = await promise;
      await source.set({ address, chainId }, nonce);
      nonceMap.set(key, nonce);
      return nonce;
    },
    async increment({ address, chainId }) {
      const key = getKey({ address, chainId });
      const delta = deltaMap.get(key) ?? 0;
      deltaMap.set(key, delta + 1);
    },
    async get({ address, chainId, client }) {
      const key = getKey({ address, chainId });
      let promise = promiseMap.get(key);
      if (!promise) {
        promise = (async () => {
          try {
            const nonce = await source.get({ address, chainId, client });
            const previousNonce = nonceMap.get(key) ?? 0;
            if (previousNonce > 0 && nonce <= previousNonce)
              return previousNonce + 1;
            nonceMap.delete(key);
            return nonce;
          } finally {
            this.reset({ address, chainId });
          }
        })();
        promiseMap.set(key, promise);
      }
      const delta = deltaMap.get(key) ?? 0;
      return delta + await promise;
    },
    reset({ address, chainId }) {
      const key = getKey({ address, chainId });
      deltaMap.delete(key);
      promiseMap.delete(key);
    }
  };
}
const erc6492MagicBytes = "0x6492649264926492649264926492649264926492649264926492649264926492";
function serializeErc6492Signature(parameters) {
  const { address, data, signature, to = "hex" } = parameters;
  const signature_ = concatHex([
    encodeAbiParameters([{ type: "address" }, { type: "bytes" }, { type: "bytes" }], [address, data, signature]),
    erc6492MagicBytes
  ]);
  if (to === "hex")
    return signature_;
  return hexToBytes(signature_);
}
async function getCode(client, { address, blockNumber, blockTag = "latest" }) {
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  const hex = await client.request({
    method: "eth_getCode",
    params: [address, blockNumberHex || blockTag]
  }, { dedupe: Boolean(blockNumberHex) });
  if (hex === "0x")
    return void 0;
  return hex;
}
async function toSmartAccount(implementation) {
  const { extend, nonceKeyManager = createNonceManager({
    source: {
      get() {
        return Date.now();
      },
      set() {
      }
    }
  }), ...rest } = implementation;
  let deployed = false;
  const address = await implementation.getAddress();
  return {
    ...extend,
    ...rest,
    address,
    async getFactoryArgs() {
      if ("isDeployed" in this && await this.isDeployed())
        return { factory: void 0, factoryData: void 0 };
      return implementation.getFactoryArgs();
    },
    async getNonce(parameters) {
      const key = parameters?.key ?? BigInt(await nonceKeyManager.consume({
        address,
        chainId: implementation.client.chain.id,
        client: implementation.client
      }));
      if (implementation.getNonce)
        return await implementation.getNonce({ ...parameters, key });
      const nonce = await readContract(implementation.client, {
        abi: parseAbi([
          "function getNonce(address, uint192) pure returns (uint256)"
        ]),
        address: implementation.entryPoint.address,
        functionName: "getNonce",
        args: [address, key]
      });
      return nonce;
    },
    async isDeployed() {
      if (deployed)
        return true;
      const code = await getAction(implementation.client, getCode, "getCode")({
        address
      });
      deployed = Boolean(code);
      return deployed;
    },
    ...implementation.sign ? {
      async sign(parameters) {
        const [{ factory, factoryData }, signature] = await Promise.all([
          this.getFactoryArgs(),
          implementation.sign(parameters)
        ]);
        if (factory && factoryData)
          return serializeErc6492Signature({
            address: factory,
            data: factoryData,
            signature
          });
        return signature;
      }
    } : {},
    async signMessage(parameters) {
      const [{ factory, factoryData }, signature] = await Promise.all([
        this.getFactoryArgs(),
        implementation.signMessage(parameters)
      ]);
      if (factory && factoryData && factory !== "0x7702")
        return serializeErc6492Signature({
          address: factory,
          data: factoryData,
          signature
        });
      return signature;
    },
    async signTypedData(parameters) {
      const [{ factory, factoryData }, signature] = await Promise.all([
        this.getFactoryArgs(),
        implementation.signTypedData(parameters)
      ]);
      if (factory && factoryData && factory !== "0x7702")
        return serializeErc6492Signature({
          address: factory,
          data: factoryData,
          signature
        });
      return signature;
    },
    type: "smart"
  };
}
async function signMessage(client, { account: account_ = client.account, message }) {
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signMessage"
    });
  const account = parseAccount(account_);
  if (account.signMessage)
    return account.signMessage({ message });
  const message_ = (() => {
    if (typeof message === "string")
      return stringToHex(message);
    if (message.raw instanceof Uint8Array)
      return toHex(message.raw);
    return message.raw;
  })();
  return client.request({
    method: "personal_sign",
    params: [message_, account.address]
  }, { retryCount: 0 });
}
async function signTypedData(client, parameters) {
  const { account: account_ = client.account, domain, message, primaryType } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/actions/wallet/signTypedData"
    });
  const account = parseAccount(account_);
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({ domain, message, primaryType, types });
  if (account.signTypedData)
    return account.signTypedData({ domain, message, primaryType, types });
  const typedData = serializeTypedData({ domain, message, primaryType, types });
  return client.request({
    method: "eth_signTypedData_v4",
    params: [account.address, typedData]
  }, { retryCount: 0 });
}
function toAccount(source) {
  if (typeof source === "string") {
    if (!isAddress(source, { strict: false }))
      throw new InvalidAddressError({ address: source });
    return {
      address: source,
      type: "json-rpc"
    };
  }
  if (!isAddress(source.address, { strict: false }))
    throw new InvalidAddressError({ address: source.address });
  return {
    address: source.address,
    nonceManager: source.nonceManager,
    sign: source.sign,
    signAuthorization: source.signAuthorization,
    signMessage: source.signMessage,
    signTransaction: source.signTransaction,
    signTypedData: source.signTypedData,
    source: "custom",
    type: "local"
  };
}
async function simulateContract(client, parameters) {
  const { abi, address, args, dataSuffix, functionName, ...callRequest } = parameters;
  const account = callRequest.account ? parseAccount(callRequest.account) : client.account;
  const calldata = encodeFunctionData({ abi, args, functionName });
  try {
    const { data } = await getAction(client, call, "call")({
      batch: false,
      data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      ...callRequest,
      account
    });
    const result = decodeFunctionResult({
      abi,
      args,
      functionName,
      data: data || "0x"
    });
    const minimizedAbi = abi.filter((abiItem) => "name" in abiItem && abiItem.name === parameters.functionName);
    return {
      result,
      request: {
        abi: minimizedAbi,
        address,
        args,
        dataSuffix,
        functionName,
        ...callRequest,
        account
      }
    };
  } catch (error) {
    throw getContractError(error, {
      abi,
      address,
      args,
      docsPath: "/docs/contract/simulateContract",
      functionName,
      sender: account?.address
    });
  }
}
async function signAuthorization(client, parameters) {
  const { account: account_ = client.account } = parameters;
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: "/docs/eip7702/signAuthorization"
    });
  const account = parseAccount(account_);
  if (!account.signAuthorization)
    throw new AccountTypeNotSupportedError({
      docsPath: "/docs/eip7702/signAuthorization",
      metaMessages: [
        "The `signAuthorization` Action does not support JSON-RPC Accounts."
      ],
      type: account.type
    });
  const authorization = await prepareAuthorization(client, parameters);
  return account.signAuthorization(authorization);
}
var re$2 = { exports: {} };
const SEMVER_SPEC_VERSION = "2.0.0";
const MAX_LENGTH$1 = 256;
const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991;
const MAX_SAFE_COMPONENT_LENGTH = 16;
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH$1 - 6;
const RELEASE_TYPES = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var constants$1 = {
  MAX_LENGTH: MAX_LENGTH$1,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const debug$1 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
};
var debug_1 = debug$1;
(function(module, exports) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: MAX_SAFE_COMPONENT_LENGTH2,
    MAX_SAFE_BUILD_LENGTH: MAX_SAFE_BUILD_LENGTH2,
    MAX_LENGTH: MAX_LENGTH2
  } = constants$1;
  const debug2 = debug_1;
  exports = module.exports = {};
  const re2 = exports.re = [];
  const safeRe = exports.safeRe = [];
  const src = exports.src = [];
  const safeSrc = exports.safeSrc = [];
  const t2 = exports.t = {};
  let R = 0;
  const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
  const safeRegexReplacements = [
    ["\\s", 1],
    ["\\d", MAX_LENGTH2],
    [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH2]
  ];
  const makeSafeRegex = (value) => {
    for (const [token, max] of safeRegexReplacements) {
      value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
    }
    return value;
  };
  const createToken = (name, value, isGlobal) => {
    const safe = makeSafeRegex(value);
    const index = R++;
    debug2(name, index, value);
    t2[name] = index;
    src[index] = value;
    safeSrc[index] = safe;
    re2[index] = new RegExp(value, isGlobal ? "g" : void 0);
    safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
  };
  createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
  createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
  createToken("MAINVERSION", `(${src[t2.NUMERICIDENTIFIER]})\\.(${src[t2.NUMERICIDENTIFIER]})\\.(${src[t2.NUMERICIDENTIFIER]})`);
  createToken("MAINVERSIONLOOSE", `(${src[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src[t2.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASEIDENTIFIER", `(?:${src[t2.NONNUMERICIDENTIFIER]}|${src[t2.NUMERICIDENTIFIER]})`);
  createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t2.NONNUMERICIDENTIFIER]}|${src[t2.NUMERICIDENTIFIERLOOSE]})`);
  createToken("PRERELEASE", `(?:-(${src[t2.PRERELEASEIDENTIFIER]}(?:\\.${src[t2.PRERELEASEIDENTIFIER]})*))`);
  createToken("PRERELEASELOOSE", `(?:-?(${src[t2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t2.PRERELEASEIDENTIFIERLOOSE]})*))`);
  createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
  createToken("BUILD", `(?:\\+(${src[t2.BUILDIDENTIFIER]}(?:\\.${src[t2.BUILDIDENTIFIER]})*))`);
  createToken("FULLPLAIN", `v?${src[t2.MAINVERSION]}${src[t2.PRERELEASE]}?${src[t2.BUILD]}?`);
  createToken("FULL", `^${src[t2.FULLPLAIN]}$`);
  createToken("LOOSEPLAIN", `[v=\\s]*${src[t2.MAINVERSIONLOOSE]}${src[t2.PRERELEASELOOSE]}?${src[t2.BUILD]}?`);
  createToken("LOOSE", `^${src[t2.LOOSEPLAIN]}$`);
  createToken("GTLT", "((?:<|>)?=?)");
  createToken("XRANGEIDENTIFIERLOOSE", `${src[t2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  createToken("XRANGEIDENTIFIER", `${src[t2.NUMERICIDENTIFIER]}|x|X|\\*`);
  createToken("XRANGEPLAIN", `[v=\\s]*(${src[t2.XRANGEIDENTIFIER]})(?:\\.(${src[t2.XRANGEIDENTIFIER]})(?:\\.(${src[t2.XRANGEIDENTIFIER]})(?:${src[t2.PRERELEASE]})?${src[t2.BUILD]}?)?)?`);
  createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:${src[t2.PRERELEASELOOSE]})?${src[t2.BUILD]}?)?)?`);
  createToken("XRANGE", `^${src[t2.GTLT]}\\s*${src[t2.XRANGEPLAIN]}$`);
  createToken("XRANGELOOSE", `^${src[t2.GTLT]}\\s*${src[t2.XRANGEPLAINLOOSE]}$`);
  createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH2}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH2}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH2}}))?`);
  createToken("COERCE", `${src[t2.COERCEPLAIN]}(?:$|[^\\d])`);
  createToken("COERCEFULL", src[t2.COERCEPLAIN] + `(?:${src[t2.PRERELEASE]})?(?:${src[t2.BUILD]})?(?:$|[^\\d])`);
  createToken("COERCERTL", src[t2.COERCE], true);
  createToken("COERCERTLFULL", src[t2.COERCEFULL], true);
  createToken("LONETILDE", "(?:~>?)");
  createToken("TILDETRIM", `(\\s*)${src[t2.LONETILDE]}\\s+`, true);
  exports.tildeTrimReplace = "$1~";
  createToken("TILDE", `^${src[t2.LONETILDE]}${src[t2.XRANGEPLAIN]}$`);
  createToken("TILDELOOSE", `^${src[t2.LONETILDE]}${src[t2.XRANGEPLAINLOOSE]}$`);
  createToken("LONECARET", "(?:\\^)");
  createToken("CARETTRIM", `(\\s*)${src[t2.LONECARET]}\\s+`, true);
  exports.caretTrimReplace = "$1^";
  createToken("CARET", `^${src[t2.LONECARET]}${src[t2.XRANGEPLAIN]}$`);
  createToken("CARETLOOSE", `^${src[t2.LONECARET]}${src[t2.XRANGEPLAINLOOSE]}$`);
  createToken("COMPARATORLOOSE", `^${src[t2.GTLT]}\\s*(${src[t2.LOOSEPLAIN]})$|^$`);
  createToken("COMPARATOR", `^${src[t2.GTLT]}\\s*(${src[t2.FULLPLAIN]})$|^$`);
  createToken("COMPARATORTRIM", `(\\s*)${src[t2.GTLT]}\\s*(${src[t2.LOOSEPLAIN]}|${src[t2.XRANGEPLAIN]})`, true);
  exports.comparatorTrimReplace = "$1$2$3";
  createToken("HYPHENRANGE", `^\\s*(${src[t2.XRANGEPLAIN]})\\s+-\\s+(${src[t2.XRANGEPLAIN]})\\s*$`);
  createToken("HYPHENRANGELOOSE", `^\\s*(${src[t2.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t2.XRANGEPLAINLOOSE]})\\s*$`);
  createToken("STAR", "(<|>)?=?\\s*\\*");
  createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(re$2, re$2.exports);
var reExports = re$2.exports;
const looseOption = Object.freeze({ loose: true });
const emptyOpts = Object.freeze({});
const parseOptions$1 = (options) => {
  if (!options) {
    return emptyOpts;
  }
  if (typeof options !== "object") {
    return looseOption;
  }
  return options;
};
var parseOptions_1 = parseOptions$1;
const numeric = /^[0-9]+$/;
const compareIdentifiers$1 = (a, b) => {
  const anum = numeric.test(a);
  const bnum = numeric.test(b);
  if (anum && bnum) {
    a = +a;
    b = +b;
  }
  return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
const rcompareIdentifiers = (a, b) => compareIdentifiers$1(b, a);
var identifiers$1 = {
  compareIdentifiers: compareIdentifiers$1,
  rcompareIdentifiers
};
const debug = debug_1;
const { MAX_LENGTH, MAX_SAFE_INTEGER } = constants$1;
const { safeRe: re$1, t: t$1 } = reExports;
const parseOptions = parseOptions_1;
const { compareIdentifiers } = identifiers$1;
let SemVer$d = class SemVer {
  constructor(version, options) {
    options = parseOptions(options);
    if (version instanceof SemVer) {
      if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
        return version;
      } else {
        version = version.version;
      }
    } else if (typeof version !== "string") {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
    }
    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      );
    }
    debug("SemVer", version, options);
    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;
    const m = version.trim().match(options.loose ? re$1[t$1.LOOSE] : re$1[t$1.FULL]);
    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`);
    }
    this.raw = version;
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];
    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError("Invalid major version");
    }
    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError("Invalid minor version");
    }
    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError("Invalid patch version");
    }
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split(".").map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num;
          }
        }
        return id;
      });
    }
    this.build = m[5] ? m[5].split(".") : [];
    this.format();
  }
  format() {
    this.version = `${this.major}.${this.minor}.${this.patch}`;
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join(".")}`;
    }
    return this.version;
  }
  toString() {
    return this.version;
  }
  compare(other) {
    debug("SemVer.compare", this.version, this.options, other);
    if (!(other instanceof SemVer)) {
      if (typeof other === "string" && other === this.version) {
        return 0;
      }
      other = new SemVer(other, this.options);
    }
    if (other.version === this.version) {
      return 0;
    }
    return this.compareMain(other) || this.comparePre(other);
  }
  compareMain(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
  }
  comparePre(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    if (this.prerelease.length && !other.prerelease.length) {
      return -1;
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1;
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0;
    }
    let i = 0;
    do {
      const a = this.prerelease[i];
      const b = other.prerelease[i];
      debug("prerelease compare", i, a, b);
      if (a === void 0 && b === void 0) {
        return 0;
      } else if (b === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  }
  compareBuild(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    let i = 0;
    do {
      const a = this.build[i];
      const b = other.build[i];
      debug("build compare", i, a, b);
      if (a === void 0 && b === void 0) {
        return 0;
      } else if (b === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(release, identifier, identifierBase) {
    if (release.startsWith("pre")) {
      if (!identifier && identifierBase === false) {
        throw new Error("invalid increment argument: identifier is empty");
      }
      if (identifier) {
        const match = `-${identifier}`.match(this.options.loose ? re$1[t$1.PRERELEASELOOSE] : re$1[t$1.PRERELEASE]);
        if (!match || match[1] !== identifier) {
          throw new Error(`invalid identifier: ${identifier}`);
        }
      }
    }
    switch (release) {
      case "premajor":
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc("pre", identifier, identifierBase);
        break;
      case "preminor":
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc("pre", identifier, identifierBase);
        break;
      case "prepatch":
        this.prerelease.length = 0;
        this.inc("patch", identifier, identifierBase);
        this.inc("pre", identifier, identifierBase);
        break;
      case "prerelease":
        if (this.prerelease.length === 0) {
          this.inc("patch", identifier, identifierBase);
        }
        this.inc("pre", identifier, identifierBase);
        break;
      case "release":
        if (this.prerelease.length === 0) {
          throw new Error(`version ${this.raw} is not a prerelease`);
        }
        this.prerelease.length = 0;
        break;
      case "major":
        if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
          this.major++;
        }
        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break;
      case "minor":
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++;
        }
        this.patch = 0;
        this.prerelease = [];
        break;
      case "patch":
        if (this.prerelease.length === 0) {
          this.patch++;
        }
        this.prerelease = [];
        break;
      case "pre": {
        const base = Number(identifierBase) ? 1 : 0;
        if (this.prerelease.length === 0) {
          this.prerelease = [base];
        } else {
          let i = this.prerelease.length;
          while (--i >= 0) {
            if (typeof this.prerelease[i] === "number") {
              this.prerelease[i]++;
              i = -2;
            }
          }
          if (i === -1) {
            if (identifier === this.prerelease.join(".") && identifierBase === false) {
              throw new Error("invalid increment argument: identifier already exists");
            }
            this.prerelease.push(base);
          }
        }
        if (identifier) {
          let prerelease2 = [identifier, base];
          if (identifierBase === false) {
            prerelease2 = [identifier];
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease2;
            }
          } else {
            this.prerelease = prerelease2;
          }
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${release}`);
    }
    this.raw = this.format();
    if (this.build.length) {
      this.raw += `+${this.build.join(".")}`;
    }
    return this;
  }
};
var semver$1 = SemVer$d;
const SemVer$c = semver$1;
const parse$6 = (version, options, throwErrors = false) => {
  if (version instanceof SemVer$c) {
    return version;
  }
  try {
    return new SemVer$c(version, options);
  } catch (er) {
    if (!throwErrors) {
      return null;
    }
    throw er;
  }
};
var parse_1 = parse$6;
const parse$5 = parse_1;
const valid$2 = (version, options) => {
  const v = parse$5(version, options);
  return v ? v.version : null;
};
var valid_1 = valid$2;
const parse$4 = parse_1;
const clean$1 = (version, options) => {
  const s = parse$4(version.trim().replace(/^[=v]+/, ""), options);
  return s ? s.version : null;
};
var clean_1 = clean$1;
const SemVer$b = semver$1;
const inc$1 = (version, release, options, identifier, identifierBase) => {
  if (typeof options === "string") {
    identifierBase = identifier;
    identifier = options;
    options = void 0;
  }
  try {
    return new SemVer$b(
      version instanceof SemVer$b ? version.version : version,
      options
    ).inc(release, identifier, identifierBase).version;
  } catch (er) {
    return null;
  }
};
var inc_1 = inc$1;
const parse$3 = parse_1;
const diff$1 = (version1, version2) => {
  const v1 = parse$3(version1, null, true);
  const v2 = parse$3(version2, null, true);
  const comparison = v1.compare(v2);
  if (comparison === 0) {
    return null;
  }
  const v1Higher = comparison > 0;
  const highVersion = v1Higher ? v1 : v2;
  const lowVersion = v1Higher ? v2 : v1;
  const highHasPre = !!highVersion.prerelease.length;
  const lowHasPre = !!lowVersion.prerelease.length;
  if (lowHasPre && !highHasPre) {
    if (!lowVersion.patch && !lowVersion.minor) {
      return "major";
    }
    if (lowVersion.compareMain(highVersion) === 0) {
      if (lowVersion.minor && !lowVersion.patch) {
        return "minor";
      }
      return "patch";
    }
  }
  const prefix = highHasPre ? "pre" : "";
  if (v1.major !== v2.major) {
    return prefix + "major";
  }
  if (v1.minor !== v2.minor) {
    return prefix + "minor";
  }
  if (v1.patch !== v2.patch) {
    return prefix + "patch";
  }
  return "prerelease";
};
var diff_1 = diff$1;
const SemVer$a = semver$1;
const major$1 = (a, loose) => new SemVer$a(a, loose).major;
var major_1 = major$1;
const SemVer$9 = semver$1;
const minor$1 = (a, loose) => new SemVer$9(a, loose).minor;
var minor_1 = minor$1;
const SemVer$8 = semver$1;
const patch$1 = (a, loose) => new SemVer$8(a, loose).patch;
var patch_1 = patch$1;
const parse$2 = parse_1;
const prerelease$1 = (version, options) => {
  const parsed = parse$2(version, options);
  return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
var prerelease_1 = prerelease$1;
const SemVer$7 = semver$1;
const compare$b = (a, b, loose) => new SemVer$7(a, loose).compare(new SemVer$7(b, loose));
var compare_1 = compare$b;
const compare$a = compare_1;
const rcompare$1 = (a, b, loose) => compare$a(b, a, loose);
var rcompare_1 = rcompare$1;
const compare$9 = compare_1;
const compareLoose$1 = (a, b) => compare$9(a, b, true);
var compareLoose_1 = compareLoose$1;
const SemVer$6 = semver$1;
const compareBuild$3 = (a, b, loose) => {
  const versionA = new SemVer$6(a, loose);
  const versionB = new SemVer$6(b, loose);
  return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
var compareBuild_1 = compareBuild$3;
const compareBuild$2 = compareBuild_1;
const sort$1 = (list, loose) => list.sort((a, b) => compareBuild$2(a, b, loose));
var sort_1 = sort$1;
const compareBuild$1 = compareBuild_1;
const rsort$1 = (list, loose) => list.sort((a, b) => compareBuild$1(b, a, loose));
var rsort_1 = rsort$1;
const compare$8 = compare_1;
const gt$4 = (a, b, loose) => compare$8(a, b, loose) > 0;
var gt_1 = gt$4;
const compare$7 = compare_1;
const lt$3 = (a, b, loose) => compare$7(a, b, loose) < 0;
var lt_1 = lt$3;
const compare$6 = compare_1;
const eq$2 = (a, b, loose) => compare$6(a, b, loose) === 0;
var eq_1 = eq$2;
const compare$5 = compare_1;
const neq$2 = (a, b, loose) => compare$5(a, b, loose) !== 0;
var neq_1 = neq$2;
const compare$4 = compare_1;
const gte$3 = (a, b, loose) => compare$4(a, b, loose) >= 0;
var gte_1 = gte$3;
const compare$3 = compare_1;
const lte$3 = (a, b, loose) => compare$3(a, b, loose) <= 0;
var lte_1 = lte$3;
const eq$1 = eq_1;
const neq$1 = neq_1;
const gt$3 = gt_1;
const gte$2 = gte_1;
const lt$2 = lt_1;
const lte$2 = lte_1;
const cmp$1 = (a, op, b, loose) => {
  switch (op) {
    case "===":
      if (typeof a === "object") {
        a = a.version;
      }
      if (typeof b === "object") {
        b = b.version;
      }
      return a === b;
    case "!==":
      if (typeof a === "object") {
        a = a.version;
      }
      if (typeof b === "object") {
        b = b.version;
      }
      return a !== b;
    case "":
    case "=":
    case "==":
      return eq$1(a, b, loose);
    case "!=":
      return neq$1(a, b, loose);
    case ">":
      return gt$3(a, b, loose);
    case ">=":
      return gte$2(a, b, loose);
    case "<":
      return lt$2(a, b, loose);
    case "<=":
      return lte$2(a, b, loose);
    default:
      throw new TypeError(`Invalid operator: ${op}`);
  }
};
var cmp_1 = cmp$1;
const SemVer$5 = semver$1;
const parse$1 = parse_1;
const { safeRe: re, t } = reExports;
const coerce$1 = (version, options) => {
  if (version instanceof SemVer$5) {
    return version;
  }
  if (typeof version === "number") {
    version = String(version);
  }
  if (typeof version !== "string") {
    return null;
  }
  options = options || {};
  let match = null;
  if (!options.rtl) {
    match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
  } else {
    const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
    let next;
    while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
      if (!match || next.index + next[0].length !== match.index + match[0].length) {
        match = next;
      }
      coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
    }
    coerceRtlRegex.lastIndex = -1;
  }
  if (match === null) {
    return null;
  }
  const major2 = match[2];
  const minor2 = match[3] || "0";
  const patch2 = match[4] || "0";
  const prerelease2 = options.includePrerelease && match[5] ? `-${match[5]}` : "";
  const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
  return parse$1(`${major2}.${minor2}.${patch2}${prerelease2}${build}`, options);
};
var coerce_1 = coerce$1;
class LRUCache {
  constructor() {
    this.max = 1e3;
    this.map = /* @__PURE__ */ new Map();
  }
  get(key) {
    const value = this.map.get(key);
    if (value === void 0) {
      return void 0;
    } else {
      this.map.delete(key);
      this.map.set(key, value);
      return value;
    }
  }
  delete(key) {
    return this.map.delete(key);
  }
  set(key, value) {
    const deleted = this.delete(key);
    if (!deleted && value !== void 0) {
      if (this.map.size >= this.max) {
        const firstKey = this.map.keys().next().value;
        this.delete(firstKey);
      }
      this.map.set(key, value);
    }
    return this;
  }
}
var lrucache = LRUCache;
var range;
var hasRequiredRange;
function requireRange() {
  if (hasRequiredRange) return range;
  hasRequiredRange = 1;
  const SPACE_CHARACTERS = /\s+/g;
  class Range2 {
    constructor(range2, options) {
      options = parseOptions2(options);
      if (range2 instanceof Range2) {
        if (range2.loose === !!options.loose && range2.includePrerelease === !!options.includePrerelease) {
          return range2;
        } else {
          return new Range2(range2.raw, options);
        }
      }
      if (range2 instanceof Comparator2) {
        this.raw = range2.value;
        this.set = [[range2]];
        this.formatted = void 0;
        return this;
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range2.trim().replace(SPACE_CHARACTERS, " ");
      this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      }
      if (this.set.length > 1) {
        const first = this.set[0];
        this.set = this.set.filter((c) => !isNullSet(c[0]));
        if (this.set.length === 0) {
          this.set = [first];
        } else if (this.set.length > 1) {
          for (const c of this.set) {
            if (c.length === 1 && isAny(c[0])) {
              this.set = [c];
              break;
            }
          }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let i = 0; i < this.set.length; i++) {
          if (i > 0) {
            this.formatted += "||";
          }
          const comps = this.set[i];
          for (let k = 0; k < comps.length; k++) {
            if (k > 0) {
              this.formatted += " ";
            }
            this.formatted += comps[k].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(range2) {
      const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
      const memoKey = memoOpts + ":" + range2;
      const cached = cache.get(memoKey);
      if (cached) {
        return cached;
      }
      const loose = this.options.loose;
      const hr = loose ? re2[t2.HYPHENRANGELOOSE] : re2[t2.HYPHENRANGE];
      range2 = range2.replace(hr, hyphenReplace(this.options.includePrerelease));
      debug2("hyphen replace", range2);
      range2 = range2.replace(re2[t2.COMPARATORTRIM], comparatorTrimReplace);
      debug2("comparator trim", range2);
      range2 = range2.replace(re2[t2.TILDETRIM], tildeTrimReplace);
      debug2("tilde trim", range2);
      range2 = range2.replace(re2[t2.CARETTRIM], caretTrimReplace);
      debug2("caret trim", range2);
      let rangeList = range2.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
      if (loose) {
        rangeList = rangeList.filter((comp) => {
          debug2("loose invalid filter", comp, this.options);
          return !!comp.match(re2[t2.COMPARATORLOOSE]);
        });
      }
      debug2("range list", rangeList);
      const rangeMap = /* @__PURE__ */ new Map();
      const comparators = rangeList.map((comp) => new Comparator2(comp, this.options));
      for (const comp of comparators) {
        if (isNullSet(comp)) {
          return [comp];
        }
        rangeMap.set(comp.value, comp);
      }
      if (rangeMap.size > 1 && rangeMap.has("")) {
        rangeMap.delete("");
      }
      const result = [...rangeMap.values()];
      cache.set(memoKey, result);
      return result;
    }
    intersects(range2, options) {
      if (!(range2 instanceof Range2)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some((thisComparators) => {
        return isSatisfiable(thisComparators, options) && range2.set.some((rangeComparators) => {
          return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
            return rangeComparators.every((rangeComparator) => {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
      if (!version) {
        return false;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer3(version, this.options);
        } catch (er) {
          return false;
        }
      }
      for (let i = 0; i < this.set.length; i++) {
        if (testSet(this.set[i], version, this.options)) {
          return true;
        }
      }
      return false;
    }
  }
  range = Range2;
  const LRU = lrucache;
  const cache = new LRU();
  const parseOptions2 = parseOptions_1;
  const Comparator2 = requireComparator();
  const debug2 = debug_1;
  const SemVer3 = semver$1;
  const {
    safeRe: re2,
    t: t2,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace
  } = reExports;
  const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = constants$1;
  const isNullSet = (c) => c.value === "<0.0.0-0";
  const isAny = (c) => c.value === "";
  const isSatisfiable = (comparators, options) => {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  };
  const parseComparator = (comp, options) => {
    debug2("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug2("caret", comp);
    comp = replaceTildes(comp, options);
    debug2("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug2("xrange", comp);
    comp = replaceStars(comp, options);
    debug2("stars", comp);
    return comp;
  };
  const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
  const replaceTildes = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
  };
  const replaceTilde = (comp, options) => {
    const r = options.loose ? re2[t2.TILDELOOSE] : re2[t2.TILDE];
    return comp.replace(r, (_, M, m, p, pr) => {
      debug2("tilde", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
      } else if (pr) {
        debug2("replaceTilde pr", pr);
        ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
      }
      debug2("tilde return", ret);
      return ret;
    });
  };
  const replaceCarets = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
  };
  const replaceCaret = (comp, options) => {
    debug2("caret", comp, options);
    const r = options.loose ? re2[t2.CARETLOOSE] : re2[t2.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr) => {
      debug2("caret", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        if (M === "0") {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
        }
      } else if (pr) {
        debug2("replaceCaret pr", pr);
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
        }
      } else {
        debug2("no pr");
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
        }
      }
      debug2("caret return", ret);
      return ret;
    });
  };
  const replaceXRanges = (comp, options) => {
    debug2("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
  };
  const replaceXRange = (comp, options) => {
    comp = comp.trim();
    const r = options.loose ? re2[t2.XRANGELOOSE] : re2[t2.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      debug2("xRange", comp, ret, gtlt, M, m, p, pr);
      const xM = isX(M);
      const xm = xM || isX(m);
      const xp = xm || isX(p);
      const anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      pr = options.includePrerelease ? "-0" : "";
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0";
        } else {
          ret = "*";
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        if (gtlt === "<") {
          pr = "-0";
        }
        ret = `${gtlt + M}.${m}.${p}${pr}`;
      } else if (xm) {
        ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
      } else if (xp) {
        ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
      }
      debug2("xRange return", ret);
      return ret;
    });
  };
  const replaceStars = (comp, options) => {
    debug2("replaceStars", comp, options);
    return comp.trim().replace(re2[t2.STAR], "");
  };
  const replaceGTE0 = (comp, options) => {
    debug2("replaceGTE0", comp, options);
    return comp.trim().replace(re2[options.includePrerelease ? t2.GTE0PRE : t2.GTE0], "");
  };
  const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
    if (isX(fM)) {
      from = "";
    } else if (isX(fm)) {
      from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
    } else if (isX(fp)) {
      from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
    } else if (fpr) {
      from = `>=${from}`;
    } else {
      from = `>=${from}${incPr ? "-0" : ""}`;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = `<${+tM + 1}.0.0-0`;
    } else if (isX(tp)) {
      to = `<${tM}.${+tm + 1}.0-0`;
    } else if (tpr) {
      to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else if (incPr) {
      to = `<${tM}.${tm}.${+tp + 1}-0`;
    } else {
      to = `<=${to}`;
    }
    return `${from} ${to}`.trim();
  };
  const testSet = (set, version, options) => {
    for (let i = 0; i < set.length; i++) {
      if (!set[i].test(version)) {
        return false;
      }
    }
    if (version.prerelease.length && !options.includePrerelease) {
      for (let i = 0; i < set.length; i++) {
        debug2(set[i].semver);
        if (set[i].semver === Comparator2.ANY) {
          continue;
        }
        if (set[i].semver.prerelease.length > 0) {
          const allowed = set[i].semver;
          if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };
  return range;
}
var comparator;
var hasRequiredComparator;
function requireComparator() {
  if (hasRequiredComparator) return comparator;
  hasRequiredComparator = 1;
  const ANY2 = Symbol("SemVer ANY");
  class Comparator2 {
    static get ANY() {
      return ANY2;
    }
    constructor(comp, options) {
      options = parseOptions2(options);
      if (comp instanceof Comparator2) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      comp = comp.trim().split(/\s+/).join(" ");
      debug2("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY2) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug2("comp", this);
    }
    parse(comp) {
      const r = this.options.loose ? re2[t2.COMPARATORLOOSE] : re2[t2.COMPARATOR];
      const m = comp.match(r);
      if (!m) {
        throw new TypeError(`Invalid comparator: ${comp}`);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY2;
      } else {
        this.semver = new SemVer3(m[2], this.options.loose);
      }
    }
    toString() {
      return this.value;
    }
    test(version) {
      debug2("Comparator.test", version, this.options.loose);
      if (this.semver === ANY2 || version === ANY2) {
        return true;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer3(version, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp2(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator2)) {
        throw new TypeError("a Comparator is required");
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new Range2(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        return new Range2(this.value, options).test(comp.semver);
      }
      options = parseOptions2(options);
      if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
        return false;
      }
      if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
        return false;
      }
      if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
        return true;
      }
      if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
        return true;
      }
      if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
        return true;
      }
      if (cmp2(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
        return true;
      }
      if (cmp2(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
        return true;
      }
      return false;
    }
  }
  comparator = Comparator2;
  const parseOptions2 = parseOptions_1;
  const { safeRe: re2, t: t2 } = reExports;
  const cmp2 = cmp_1;
  const debug2 = debug_1;
  const SemVer3 = semver$1;
  const Range2 = requireRange();
  return comparator;
}
const Range$9 = requireRange();
const satisfies$4 = (version, range2, options) => {
  try {
    range2 = new Range$9(range2, options);
  } catch (er) {
    return false;
  }
  return range2.test(version);
};
var satisfies_1 = satisfies$4;
const Range$8 = requireRange();
const toComparators$1 = (range2, options) => new Range$8(range2, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
var toComparators_1 = toComparators$1;
const SemVer$4 = semver$1;
const Range$7 = requireRange();
const maxSatisfying$1 = (versions, range2, options) => {
  let max = null;
  let maxSV = null;
  let rangeObj = null;
  try {
    rangeObj = new Range$7(range2, options);
  } catch (er) {
    return null;
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      if (!max || maxSV.compare(v) === -1) {
        max = v;
        maxSV = new SemVer$4(max, options);
      }
    }
  });
  return max;
};
var maxSatisfying_1 = maxSatisfying$1;
const SemVer$3 = semver$1;
const Range$6 = requireRange();
const minSatisfying$1 = (versions, range2, options) => {
  let min = null;
  let minSV = null;
  let rangeObj = null;
  try {
    rangeObj = new Range$6(range2, options);
  } catch (er) {
    return null;
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      if (!min || minSV.compare(v) === 1) {
        min = v;
        minSV = new SemVer$3(min, options);
      }
    }
  });
  return min;
};
var minSatisfying_1 = minSatisfying$1;
const SemVer$2 = semver$1;
const Range$5 = requireRange();
const gt$2 = gt_1;
const minVersion$1 = (range2, loose) => {
  range2 = new Range$5(range2, loose);
  let minver = new SemVer$2("0.0.0");
  if (range2.test(minver)) {
    return minver;
  }
  minver = new SemVer$2("0.0.0-0");
  if (range2.test(minver)) {
    return minver;
  }
  minver = null;
  for (let i = 0; i < range2.set.length; ++i) {
    const comparators = range2.set[i];
    let setMin = null;
    comparators.forEach((comparator2) => {
      const compver = new SemVer$2(comparator2.semver.version);
      switch (comparator2.operator) {
        case ">":
          if (compver.prerelease.length === 0) {
            compver.patch++;
          } else {
            compver.prerelease.push(0);
          }
          compver.raw = compver.format();
        case "":
        case ">=":
          if (!setMin || gt$2(compver, setMin)) {
            setMin = compver;
          }
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${comparator2.operator}`);
      }
    });
    if (setMin && (!minver || gt$2(minver, setMin))) {
      minver = setMin;
    }
  }
  if (minver && range2.test(minver)) {
    return minver;
  }
  return null;
};
var minVersion_1 = minVersion$1;
const Range$4 = requireRange();
const validRange$1 = (range2, options) => {
  try {
    return new Range$4(range2, options).range || "*";
  } catch (er) {
    return null;
  }
};
var valid$1 = validRange$1;
const SemVer$1 = semver$1;
const Comparator$2 = requireComparator();
const { ANY: ANY$1 } = Comparator$2;
const Range$3 = requireRange();
const satisfies$3 = satisfies_1;
const gt$1 = gt_1;
const lt$1 = lt_1;
const lte$1 = lte_1;
const gte$1 = gte_1;
const outside$3 = (version, range2, hilo, options) => {
  version = new SemVer$1(version, options);
  range2 = new Range$3(range2, options);
  let gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case ">":
      gtfn = gt$1;
      ltefn = lte$1;
      ltfn = lt$1;
      comp = ">";
      ecomp = ">=";
      break;
    case "<":
      gtfn = lt$1;
      ltefn = gte$1;
      ltfn = gt$1;
      comp = "<";
      ecomp = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (satisfies$3(version, range2, options)) {
    return false;
  }
  for (let i = 0; i < range2.set.length; ++i) {
    const comparators = range2.set[i];
    let high = null;
    let low = null;
    comparators.forEach((comparator2) => {
      if (comparator2.semver === ANY$1) {
        comparator2 = new Comparator$2(">=0.0.0");
      }
      high = high || comparator2;
      low = low || comparator2;
      if (gtfn(comparator2.semver, high.semver, options)) {
        high = comparator2;
      } else if (ltfn(comparator2.semver, low.semver, options)) {
        low = comparator2;
      }
    });
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }
    if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }
  return true;
};
var outside_1 = outside$3;
const outside$2 = outside_1;
const gtr$1 = (version, range2, options) => outside$2(version, range2, ">", options);
var gtr_1 = gtr$1;
const outside$1 = outside_1;
const ltr$1 = (version, range2, options) => outside$1(version, range2, "<", options);
var ltr_1 = ltr$1;
const Range$2 = requireRange();
const intersects$1 = (r1, r2, options) => {
  r1 = new Range$2(r1, options);
  r2 = new Range$2(r2, options);
  return r1.intersects(r2, options);
};
var intersects_1 = intersects$1;
const satisfies$2 = satisfies_1;
const compare$2 = compare_1;
var simplify = (versions, range2, options) => {
  const set = [];
  let first = null;
  let prev = null;
  const v = versions.sort((a, b) => compare$2(a, b, options));
  for (const version of v) {
    const included = satisfies$2(version, range2, options);
    if (included) {
      prev = version;
      if (!first) {
        first = version;
      }
    } else {
      if (prev) {
        set.push([first, prev]);
      }
      prev = null;
      first = null;
    }
  }
  if (first) {
    set.push([first, null]);
  }
  const ranges = [];
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min);
    } else if (!max && min === v[0]) {
      ranges.push("*");
    } else if (!max) {
      ranges.push(`>=${min}`);
    } else if (min === v[0]) {
      ranges.push(`<=${max}`);
    } else {
      ranges.push(`${min} - ${max}`);
    }
  }
  const simplified = ranges.join(" || ");
  const original = typeof range2.raw === "string" ? range2.raw : String(range2);
  return simplified.length < original.length ? simplified : range2;
};
const Range$1 = requireRange();
const Comparator$1 = requireComparator();
const { ANY } = Comparator$1;
const satisfies$1 = satisfies_1;
const compare$1 = compare_1;
const subset$1 = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true;
  }
  sub = new Range$1(sub, options);
  dom = new Range$1(dom, options);
  let sawNonNull = false;
  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options);
      sawNonNull = sawNonNull || isSub !== null;
      if (isSub) {
        continue OUTER;
      }
    }
    if (sawNonNull) {
      return false;
    }
  }
  return true;
};
const minimumVersionWithPreRelease = [new Comparator$1(">=0.0.0-0")];
const minimumVersion = [new Comparator$1(">=0.0.0")];
const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true;
  }
  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true;
    } else if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease;
    } else {
      sub = minimumVersion;
    }
  }
  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true;
    } else {
      dom = minimumVersion;
    }
  }
  const eqSet = /* @__PURE__ */ new Set();
  let gt2, lt2;
  for (const c of sub) {
    if (c.operator === ">" || c.operator === ">=") {
      gt2 = higherGT(gt2, c, options);
    } else if (c.operator === "<" || c.operator === "<=") {
      lt2 = lowerLT(lt2, c, options);
    } else {
      eqSet.add(c.semver);
    }
  }
  if (eqSet.size > 1) {
    return null;
  }
  let gtltComp;
  if (gt2 && lt2) {
    gtltComp = compare$1(gt2.semver, lt2.semver, options);
    if (gtltComp > 0) {
      return null;
    } else if (gtltComp === 0 && (gt2.operator !== ">=" || lt2.operator !== "<=")) {
      return null;
    }
  }
  for (const eq2 of eqSet) {
    if (gt2 && !satisfies$1(eq2, String(gt2), options)) {
      return null;
    }
    if (lt2 && !satisfies$1(eq2, String(lt2), options)) {
      return null;
    }
    for (const c of dom) {
      if (!satisfies$1(eq2, String(c), options)) {
        return false;
      }
    }
    return true;
  }
  let higher, lower;
  let hasDomLT, hasDomGT;
  let needDomLTPre = lt2 && !options.includePrerelease && lt2.semver.prerelease.length ? lt2.semver : false;
  let needDomGTPre = gt2 && !options.includePrerelease && gt2.semver.prerelease.length ? gt2.semver : false;
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt2.operator === "<" && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false;
  }
  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
    hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
    if (gt2) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false;
        }
      }
      if (c.operator === ">" || c.operator === ">=") {
        higher = higherGT(gt2, c, options);
        if (higher === c && higher !== gt2) {
          return false;
        }
      } else if (gt2.operator === ">=" && !satisfies$1(gt2.semver, String(c), options)) {
        return false;
      }
    }
    if (lt2) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false;
        }
      }
      if (c.operator === "<" || c.operator === "<=") {
        lower = lowerLT(lt2, c, options);
        if (lower === c && lower !== lt2) {
          return false;
        }
      } else if (lt2.operator === "<=" && !satisfies$1(lt2.semver, String(c), options)) {
        return false;
      }
    }
    if (!c.operator && (lt2 || gt2) && gtltComp !== 0) {
      return false;
    }
  }
  if (gt2 && hasDomLT && !lt2 && gtltComp !== 0) {
    return false;
  }
  if (lt2 && hasDomGT && !gt2 && gtltComp !== 0) {
    return false;
  }
  if (needDomGTPre || needDomLTPre) {
    return false;
  }
  return true;
};
const higherGT = (a, b, options) => {
  if (!a) {
    return b;
  }
  const comp = compare$1(a.semver, b.semver, options);
  return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
};
const lowerLT = (a, b, options) => {
  if (!a) {
    return b;
  }
  const comp = compare$1(a.semver, b.semver, options);
  return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
};
var subset_1 = subset$1;
const internalRe = reExports;
const constants = constants$1;
const SemVer2 = semver$1;
const identifiers = identifiers$1;
const parse = parse_1;
const valid = valid_1;
const clean = clean_1;
const inc = inc_1;
const diff = diff_1;
const major = major_1;
const minor = minor_1;
const patch = patch_1;
const prerelease = prerelease_1;
const compare = compare_1;
const rcompare = rcompare_1;
const compareLoose = compareLoose_1;
const compareBuild = compareBuild_1;
const sort = sort_1;
const rsort = rsort_1;
const gt = gt_1;
const lt = lt_1;
const eq = eq_1;
const neq = neq_1;
const gte = gte_1;
const lte = lte_1;
const cmp = cmp_1;
const coerce = coerce_1;
const Comparator = requireComparator();
const Range = requireRange();
const satisfies = satisfies_1;
const toComparators = toComparators_1;
const maxSatisfying = maxSatisfying_1;
const minSatisfying = minSatisfying_1;
const minVersion = minVersion_1;
const validRange = valid$1;
const outside = outside_1;
const gtr = gtr_1;
const ltr = ltr_1;
const intersects = intersects_1;
const simplifyRange = simplify;
const subset = subset_1;
var semver = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer: SemVer2,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: constants.RELEASE_TYPES,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers
};
const getAccountNonce = async (client, args) => {
  const { address, entryPointAddress, key = BigInt(0) } = args;
  return await getAction(client, readContract, "readContract")({
    address: entryPointAddress,
    abi: [
      {
        inputs: [
          {
            name: "sender",
            type: "address"
          },
          {
            name: "key",
            type: "uint192"
          }
        ],
        name: "getNonce",
        outputs: [
          {
            name: "nonce",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ],
    functionName: "getNonce",
    args: [address, key]
  });
};
class InvalidEntryPointError extends BaseError {
  constructor({ cause, entryPointAddress } = {}) {
    super(`The entry point address (\`entryPoint\`${entryPointAddress ? ` = ${entryPointAddress}` : ""}) is not a valid entry point. getSenderAddress did not revert with a SenderAddressResult error.`, {
      cause
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidEntryPointError"
    });
  }
}
const getSenderAddress = async (client, args) => {
  const { initCode, entryPointAddress, factory, factoryData } = args;
  if (!initCode && !factory && !factoryData) {
    throw new Error("Either `initCode` or `factory` and `factoryData` must be provided");
  }
  try {
    await getAction(client, simulateContract, "simulateContract")({
      address: entryPointAddress,
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address"
            }
          ],
          name: "SenderAddressResult",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "initCode",
              type: "bytes"
            }
          ],
          name: "getSenderAddress",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ],
      functionName: "getSenderAddress",
      args: [initCode || concat([factory, factoryData])]
    });
  } catch (e) {
    const revertError = e.walk((err) => err instanceof ContractFunctionRevertedError || err instanceof RpcRequestError || err instanceof InvalidInputRpcError || err instanceof UnknownRpcError);
    if (!revertError) {
      const cause = e.cause;
      const errorName = cause?.data?.errorName ?? "";
      if (errorName === "SenderAddressResult" && cause?.data?.args && cause?.data?.args[0]) {
        return cause.data?.args[0];
      }
    }
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? "";
      if (errorName === "SenderAddressResult" && revertError.data?.args && revertError.data?.args[0]) {
        return revertError.data?.args[0];
      }
    }
    if (revertError instanceof RpcRequestError) {
      const hexStringRegex = /0x[a-fA-F0-9]+/;
      const match = revertError.cause.data.match(hexStringRegex);
      if (!match) {
        throw new Error("Failed to parse revert bytes from RPC response");
      }
      const data = match[0];
      const error = decodeErrorResult({
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address"
              }
            ],
            name: "SenderAddressResult",
            type: "error"
          }
        ],
        data
      });
      return error.args[0];
    }
    if (revertError instanceof InvalidInputRpcError) {
      const { data: data_ } = e instanceof RawContractError ? e : e instanceof BaseError ? e.walk((err) => "data" in err) || e.walk() : {};
      const data = typeof data_ === "string" ? data_ : data_?.data;
      if (data === void 0) {
        throw new Error("Failed to parse revert bytes from RPC response");
      }
      const error = decodeErrorResult({
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address"
              }
            ],
            name: "SenderAddressResult",
            type: "error"
          }
        ],
        data
      });
      return error.args[0];
    }
    if (revertError instanceof UnknownRpcError) {
      const parsedBody = JSON.parse(
        // biome-ignore lint/suspicious/noExplicitAny:
        revertError.cause.body
      );
      const revertData = parsedBody.error.data;
      const hexStringRegex = /0x[a-fA-F0-9]+/;
      const match = revertData.match(hexStringRegex);
      if (!match) {
        throw new Error("Failed to parse revert bytes from RPC response");
      }
      const data = match[0];
      const error = decodeErrorResult({
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address"
              }
            ],
            name: "SenderAddressResult",
            type: "error"
          }
        ],
        data
      });
      return error.args[0];
    }
    throw e;
  }
  throw new InvalidEntryPointError({ entryPointAddress });
};
const isPluginInstalled = async (client, args) => {
  const { address, plugin } = args;
  const { type, address: pluginAddress, data = "0x" } = plugin;
  try {
    return await getAction(client, readContract, "readContract")({
      address,
      abi: KernelModuleIsModuleInstalledAbi,
      functionName: "isModuleInstalled",
      args: [BigInt(type), pluginAddress, data]
    });
  } catch (error) {
    return false;
  }
};
var KERNEL_FEATURES;
(function(KERNEL_FEATURES2) {
  KERNEL_FEATURES2["ERC1271_SIG_WRAPPER"] = "ERC1271_SIG_WRAPPER";
  KERNEL_FEATURES2["ERC1271_WITH_VALIDATOR"] = "ERC1271_WITH_VALIDATOR";
  KERNEL_FEATURES2["ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH"] = "ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH";
  KERNEL_FEATURES2["ERC1271_REPLAYABLE"] = "ERC1271_REPLAYABLE";
})(KERNEL_FEATURES || (KERNEL_FEATURES = {}));
const KERNEL_FEATURES_BY_VERSION = {
  [KERNEL_FEATURES.ERC1271_SIG_WRAPPER]: ">=0.2.3 || >=0.3.0-beta",
  [KERNEL_FEATURES.ERC1271_WITH_VALIDATOR]: ">=0.3.0-beta",
  [KERNEL_FEATURES.ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH]: ">=0.3.0-beta",
  [KERNEL_FEATURES.ERC1271_REPLAYABLE]: ">=0.3.2"
};
const hasKernelFeature = (feature, version) => {
  if (!(feature in KERNEL_FEATURES_BY_VERSION)) {
    return false;
  }
  return semver.satisfies(version, KERNEL_FEATURES_BY_VERSION[feature]);
};
const getExecMode = ({ callType, execType }) => {
  return concatHex$1([
    callType,
    // 1 byte
    execType,
    // 1 byte
    "0x00000000",
    // 4 bytes
    "0x00000000",
    // 4 bytes
    pad("0x00000000", { size: 22 })
  ]);
};
const validateKernelVersionWithEntryPoint = (entryPointVersion, kernelVersion) => {
  if (entryPointVersion === "0.6" && !semver.satisfies(kernelVersion, ">=0.2.2 || <=0.2.4") || entryPointVersion === "0.7" && !semver.satisfies(kernelVersion, ">=0.3.0")) {
    throw new Error("KernelVersion should be >= 0.2.2 and <= 0.2.4 for EntryPointV0.6 and >= 0.3.0 for EntryPointV0.7");
  }
};
async function toSigner({ signer, address }) {
  if ("type" in signer && (signer.type === "local" || signer.type === "smart")) {
    return signer;
  }
  let walletClient = void 0;
  if ("request" in signer && !signer?.account) {
    if (!address) {
      address = (await Promise.any([
        signer.request({
          method: "eth_requestAccounts"
        }),
        signer.request({
          method: "eth_accounts"
        })
      ]))[0];
    }
    if (!address) {
      throw new Error("address is required");
    }
    walletClient = createWalletClient({
      account: address,
      transport: custom(signer)
    });
  }
  if (!walletClient) {
    walletClient = signer;
  }
  return toAccount({
    address: walletClient.account.address,
    async signMessage({ message }) {
      return signMessage(walletClient, { message });
    },
    async signTypedData(typedData) {
      const { primaryType, domain, message, types } = typedData;
      return signTypedData(walletClient, {
        primaryType,
        domain,
        message,
        types
      });
    },
    async signTransaction(_) {
      throw new Error("Smart account signer doesn't need to sign transactions");
    },
    async signAuthorization(authorization) {
      return signAuthorization(walletClient, authorization);
    }
  });
}
function addressToEmptyAccount(address) {
  const account = toAccount({
    address,
    async signMessage() {
      throw new Error("Method not supported");
    },
    async signTransaction(_transaction) {
      throw new Error("Method not supported");
    },
    async signTypedData(_typedData) {
      throw new Error("Method not supported");
    }
  });
  return {
    ...account,
    publicKey: "0x",
    source: "empty"
  };
}
async function signerTo7702Validator(client, { signer, entryPoint, kernelVersion }) {
  const viemSigner = await toSigner({ signer });
  const chainId = client.chain?.id ?? await getChainId(client);
  const account = toAccount({
    address: viemSigner.address,
    async signMessage({ message }) {
      return signMessage(client, { account: viemSigner, message });
    },
    async signTransaction(_, __) {
      throw new Error("Smart account signer doesn't need to sign transactions");
    },
    async signTypedData(typedData) {
      return viemSigner.signTypedData(typedData);
    }
  });
  return {
    ...account,
    supportedKernelVersions: kernelVersion,
    validatorType: "EIP7702",
    address: viemSigner.address,
    source: "EIP7702Validator",
    getIdentifier() {
      return "0x";
    },
    async getEnableData() {
      return viemSigner.address;
    },
    async getNonceKey(_accountAddress, customNonceKey) {
      if (customNonceKey) {
        return customNonceKey;
      }
      return 0n;
    },
    // Sign a user operation
    async signUserOperation(userOperation) {
      const hash = getUserOperationHash({
        userOperation: {
          ...userOperation,
          signature: "0x"
        },
        entryPointAddress: entryPoint.address,
        entryPointVersion: entryPoint.version,
        chainId
      });
      const signature = await signMessage(client, {
        account: viemSigner,
        message: { raw: hash }
      });
      return signature;
    },
    // Get simple dummy signature
    async getStubSignature() {
      return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
    },
    async isEnabled(_kernelAccountAddress, _selector) {
      return false;
    }
  };
}
const KernelExecuteAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      },
      {
        internalType: "enum Operation",
        name: "",
        type: "uint8"
      }
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        internalType: "struct Call[]",
        name: "calls",
        type: "tuple[]"
      }
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "executeDelegateCall",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];
const KernelInitAbi = [
  {
    inputs: [
      {
        internalType: "contract IKernelValidator",
        name: "_defaultValidator",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];
const KernelAccountAbi = [
  {
    inputs: [
      {
        internalType: "contract IEntryPoint",
        name: "_entryPoint",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "AlreadyInitialized",
    type: "error"
  },
  {
    inputs: [],
    name: "DisabledMode",
    type: "error"
  },
  {
    inputs: [],
    name: "NotAuthorizedCaller",
    type: "error"
  },
  {
    inputs: [],
    name: "NotEntryPoint",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldValidator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newValidator",
        type: "address"
      }
    ],
    name: "DefaultValidatorChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "selector",
        type: "bytes4"
      },
      {
        indexed: true,
        internalType: "address",
        name: "executor",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "validator",
        type: "address"
      }
    ],
    name: "ExecutionChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Received",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newImplementation",
        type: "address"
      }
    ],
    name: "Upgraded",
    type: "event"
  },
  {
    stateMutability: "payable",
    type: "fallback"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_disableFlag",
        type: "bytes4"
      }
    ],
    name: "disableMode",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1"
      },
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "version",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32"
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "entryPoint",
    outputs: [
      {
        internalType: "contract IEntryPoint",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      },
      {
        internalType: "enum Operation",
        name: "",
        type: "uint8"
      }
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        internalType: "struct Call[]",
        name: "calls",
        type: "tuple[]"
      }
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "executeDelegateCall",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "getDefaultValidator",
    outputs: [
      {
        internalType: "contract IKernelValidator",
        name: "validator",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getDisabledMode",
    outputs: [
      {
        internalType: "bytes4",
        name: "disabled",
        type: "bytes4"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_selector",
        type: "bytes4"
      }
    ],
    name: "getExecution",
    outputs: [
      {
        components: [
          {
            internalType: "ValidAfter",
            name: "validAfter",
            type: "uint48"
          },
          {
            internalType: "ValidUntil",
            name: "validUntil",
            type: "uint48"
          },
          {
            internalType: "address",
            name: "executor",
            type: "address"
          },
          {
            internalType: "contract IKernelValidator",
            name: "validator",
            type: "address"
          }
        ],
        internalType: "struct ExecutionDetail",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getLastDisabledTime",
    outputs: [
      {
        internalType: "uint48",
        name: "",
        type: "uint48"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint192",
        name: "key",
        type: "uint192"
      }
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IKernelValidator",
        name: "_defaultValidator",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "isValidSignature",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]"
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]"
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IKernelValidator",
        name: "_defaultValidator",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes"
      }
    ],
    name: "setDefaultValidator",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_selector",
        type: "bytes4"
      },
      {
        internalType: "address",
        name: "_executor",
        type: "address"
      },
      {
        internalType: "contract IKernelValidator",
        name: "_validator",
        type: "address"
      },
      {
        internalType: "ValidUntil",
        name: "_validUntil",
        type: "uint48"
      },
      {
        internalType: "ValidAfter",
        name: "_validAfter",
        type: "uint48"
      },
      {
        internalType: "bytes",
        name: "_enableData",
        type: "bytes"
      }
    ],
    name: "setExecution",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newImplementation",
        type: "address"
      }
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "initCode",
            type: "bytes"
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes"
          },
          {
            internalType: "uint256",
            name: "callGasLimit",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "verificationGasLimit",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "paymasterAndData",
            type: "bytes"
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes"
          }
        ],
        internalType: "struct UserOperation",
        name: "_userOp",
        type: "tuple"
      },
      {
        internalType: "bytes32",
        name: "userOpHash",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "missingAccountFunds",
        type: "uint256"
      }
    ],
    name: "validateUserOp",
    outputs: [
      {
        internalType: "ValidationData",
        name: "validationData",
        type: "uint256"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    stateMutability: "payable",
    type: "receive"
  }
];
const encodeExecuteBatchCall$1 = (args) => {
  return encodeFunctionData$1({
    abi: KernelExecuteAbi,
    functionName: "executeBatch",
    args: [
      args.map((arg) => {
        return {
          to: arg.to,
          value: arg.value || 0n,
          data: arg.data || "0x"
        };
      })
    ]
  });
};
const encodeExecuteDelegateCall$1 = (args) => {
  return encodeFunctionData$1({
    abi: KernelExecuteAbi,
    functionName: "executeDelegateCall",
    args: [args.to, args.data || "0x"]
  });
};
const encodeExecuteSingleCall$1 = (args) => {
  return encodeFunctionData$1({
    abi: KernelExecuteAbi,
    functionName: "execute",
    args: [args.to, args.value || 0n, args.data || "0x", 0]
  });
};
const encodeCallData$1 = async (calls, callType) => {
  if (calls.length > 1) {
    if (callType === "delegatecall") {
      throw new Error("Cannot batch delegatecall");
    }
    return encodeExecuteBatchCall$1(calls);
  }
  const call2 = calls.length === 0 ? void 0 : calls[0];
  if (!call2) {
    throw new Error("No calls to encode");
  }
  if (!callType || callType === "call") {
    return encodeExecuteSingleCall$1(call2);
  }
  if (callType === "delegatecall") {
    return encodeExecuteDelegateCall$1({
      to: call2.to,
      data: call2.data
    });
  }
  throw new Error("Invalid call type");
};
const encodeModuleInstallCallData = async ({ accountAddress, enableData, executor, selector, validAfter, validUntil, validator }) => {
  return encodeCallData$1([
    {
      to: accountAddress,
      value: 0n,
      data: encodeFunctionData$1({
        abi: KernelAccountAbi,
        functionName: "setExecution",
        args: [
          selector,
          executor,
          validator,
          validUntil,
          validAfter,
          enableData
        ]
      })
    }
  ], "call");
};
var ValidatorMode;
(function(ValidatorMode2) {
  ValidatorMode2["sudo"] = "0x00000000";
  ValidatorMode2["plugin"] = "0x00000001";
  ValidatorMode2["enable"] = "0x00000002";
})(ValidatorMode || (ValidatorMode = {}));
const getKernelV3Nonce = async (client, accountAddress) => {
  try {
    const nonce = await getAction(client, readContract, "readContract")({
      abi: KernelV3AccountAbi,
      address: accountAddress,
      functionName: "currentNonce",
      args: []
    });
    return nonce === 0 ? 1 : nonce;
  } catch (error) {
    return 1;
  }
};
const EIP1271Abi = [
  {
    type: "function",
    name: "eip712Domain",
    inputs: [],
    outputs: [
      { name: "fields", type: "bytes1", internalType: "bytes1" },
      { name: "name", type: "string", internalType: "string" },
      { name: "version", type: "string", internalType: "string" },
      { name: "chainId", type: "uint256", internalType: "uint256" },
      {
        name: "verifyingContract",
        type: "address",
        internalType: "address"
      },
      { name: "salt", type: "bytes32", internalType: "bytes32" },
      { name: "extensions", type: "uint256[]", internalType: "uint256[]" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "isValidSignature",
    inputs: [
      { name: "data", type: "bytes32", internalType: "bytes32" },
      { name: "signature", type: "bytes", internalType: "bytes" }
    ],
    outputs: [
      { name: "magicValue", type: "bytes4", internalType: "bytes4" }
    ],
    stateMutability: "view"
  }
];
const accountMetadata = async (client, accountAddress, kernelVersion, chainId) => {
  try {
    const domain = await client.request({
      method: "eth_call",
      params: [
        {
          to: accountAddress,
          data: encodeFunctionData$1({
            abi: EIP1271Abi,
            functionName: "eip712Domain"
          })
        },
        "latest"
      ]
    });
    if (domain !== "0x") {
      const decoded = decodeFunctionResult$1({
        abi: [...EIP1271Abi],
        functionName: "eip712Domain",
        data: domain
      });
      return {
        name: decoded[1],
        version: decoded[2],
        chainId: decoded[3]
      };
    }
  } catch (error) {
  }
  return {
    name: KERNEL_NAME,
    version: kernelVersion === "0.3.0" ? "0.3.0-beta" : kernelVersion,
    chainId: BigInt(chainId ?? (client.chain ? client.chain.id : await client.extend(publicActions).getChainId()))
  };
};
const getActionSelector = (entryPointVersion) => {
  if (entryPointVersion === "0.6") {
    return toFunctionSelector(getAbiItem({ abi: KernelAccountAbi, name: "execute" }));
  } else if (entryPointVersion === "0.7") {
    return toFunctionSelector(getAbiItem({ abi: KernelV3AccountAbi, name: "execute" }));
  } else {
    throw new Error("Unsupported entry point version");
  }
};
const getEncodedPluginsData = async ({ accountAddress, enableSignature, action, validator, validUntil, validAfter }) => {
  const enableData = await validator.getEnableData(accountAddress);
  const enableDataLength = enableData.length / 2 - 1;
  return concat([
    ValidatorMode.enable,
    pad(toHex$1(validUntil, { size: 6 }), { size: 6 }),
    // 6 bytes 4 - 10
    pad(toHex$1(validAfter), { size: 6 }),
    // 6 bytes 10 - 16
    pad(validator.address, { size: 20 }),
    // 20 bytes 16 - 36
    pad(action.address, { size: 20 }),
    // 20 bytes 36 - 56
    pad(toHex$1(enableDataLength), { size: 32 }),
    // 32 bytes 56 - 88
    enableData,
    // 88 - 88 + enableData.length
    pad(toHex$1(enableSignature.length / 2 - 1), { size: 32 }),
    // 32 bytes 88 + enableData.length - 120 + enableData.length
    enableSignature
    // 120 + enableData.length - 120 + enableData.length + enableSignature.length
  ]);
};
const getPluginsEnableTypedData$1 = async ({ accountAddress, chainId, kernelVersion, action, validator, validUntil, validAfter }) => {
  return {
    domain: {
      name: "Kernel",
      version: kernelVersion,
      chainId,
      verifyingContract: accountAddress
    },
    types: {
      ValidatorApproved: [
        { name: "sig", type: "bytes4" },
        { name: "validatorData", type: "uint256" },
        { name: "executor", type: "address" },
        { name: "enableData", type: "bytes" }
      ]
    },
    message: {
      sig: action.selector,
      validatorData: hexToBigInt$1(concatHex$1([
        pad(toHex$1(validUntil ?? 0), {
          size: 6
        }),
        pad(toHex$1(validAfter ?? 0), {
          size: 6
        }),
        validator.address
      ]), { size: 32 }),
      executor: action.address,
      enableData: await validator.getEnableData(accountAddress)
    },
    primaryType: "ValidatorApproved"
  };
};
const getPluginsEnableTypedData = async ({ accountAddress, chainId, kernelVersion, action, hook, validator, validatorNonce }) => {
  return {
    domain: {
      name: "Kernel",
      version: kernelVersion === "0.3.0" ? "0.3.0-beta" : kernelVersion,
      chainId,
      verifyingContract: accountAddress
    },
    types: {
      Enable: [
        { name: "validationId", type: "bytes21" },
        { name: "nonce", type: "uint32" },
        { name: "hook", type: "address" },
        { name: "validatorData", type: "bytes" },
        { name: "hookData", type: "bytes" },
        { name: "selectorData", type: "bytes" }
      ]
    },
    message: {
      validationId: concat([
        VALIDATOR_TYPE[validator.validatorType],
        pad(validator.getIdentifier(), { size: 20, dir: "right" })
      ]),
      nonce: validatorNonce,
      hook: hook?.getIdentifier() ?? zeroAddress,
      validatorData: await validator.getEnableData(accountAddress),
      hookData: await hook?.getEnableData(accountAddress) ?? "0x",
      selectorData: concat([
        action.selector,
        action.address,
        action.hook?.address ?? zeroAddress,
        encodeAbiParameters$1(parseAbiParameters("bytes selectorInitData, bytes hookInitData"), [CALL_TYPE.DELEGATE_CALL, "0x0000"])
      ])
    },
    primaryType: "Enable"
  };
};
function isKernelPluginManager(plugin) {
  return plugin?.getPluginEnableSignature !== void 0;
}
async function toKernelPluginManager(client, { sudo, regular, hook, pluginEnableSignature, validatorInitData, action, validAfter = 0, validUntil = 0, entryPoint, kernelVersion, chainId, isPreInstalled = false }) {
  if (sudo && !semver.satisfies(kernelVersion, sudo?.supportedKernelVersions) || regular && !semver.satisfies(kernelVersion, regular?.supportedKernelVersions)) {
    throw new Error("Either sudo or/and regular validator version mismatch. Update to latest plugin package and use the proper plugin version");
  }
  let pluginEnabled = isPreInstalled;
  const activeValidator = regular || sudo;
  if (!activeValidator) {
    throw new Error("One of `sudo` or `regular` validator must be set");
  }
  action = {
    selector: action?.selector ?? getActionSelector(entryPoint.version),
    address: action?.address ?? zeroAddress
  };
  if (entryPoint.version === "0.7" && (action.address.toLowerCase() !== zeroAddress.toLowerCase() || action.selector.toLowerCase() !== getActionSelector(entryPoint.version).toLowerCase()) && kernelVersion === "0.3.0") ;
  if (!action) {
    throw new Error("Action data must be set");
  }
  const getSignatureData = async (accountAddress, selector, userOpSignature = "0x") => {
    if (!action) {
      throw new Error("Action data must be set");
    }
    if (entryPoint.version === "0.6") {
      if (regular) {
        if (pluginEnabled) {
          return ValidatorMode.plugin;
        }
        if (await isPluginEnabled(accountAddress, selector)) {
          return ValidatorMode.plugin;
        }
        const enableSignature = await getPluginEnableSignature(accountAddress);
        if (!enableSignature) {
          throw new Error("Enable signature not set");
        }
        return getEncodedPluginsData({
          accountAddress,
          enableSignature,
          action,
          validator: regular,
          validUntil,
          validAfter
        });
      } else if (sudo) {
        return ValidatorMode.sudo;
      } else {
        throw new Error("One of `sudo` or `regular` validator must be set");
      }
    }
    if (regular) {
      if (pluginEnabled) {
        return userOpSignature;
      }
      if (await isPluginEnabled(accountAddress, action.selector)) {
        return userOpSignature;
      }
      const enableSignature = await getPluginEnableSignature(accountAddress);
      return getEncodedPluginsData$1({
        enableSignature,
        userOpSignature,
        action,
        enableData: await regular.getEnableData(accountAddress),
        hook
      });
    } else if (sudo) {
      return userOpSignature;
    } else {
      throw new Error("One of `sudo` or `regular` validator must be set");
    }
  };
  const isPluginEnabled = async (accountAddress, selector) => {
    if (isPreInstalled)
      return true;
    if (!action) {
      throw new Error("Action data must be set");
    }
    if (!regular)
      throw new Error("regular validator not set");
    if (entryPoint.version === "0.6") {
      return regular.isEnabled(accountAddress, selector);
    }
    const isEnabled = await regular.isEnabled(accountAddress, action.selector) || await isPluginInitialized(client, accountAddress, regular.address);
    if (isEnabled) {
      pluginEnabled = true;
    }
    return isEnabled;
  };
  const getPluginEnableSignature = async (accountAddress) => {
    if (!action) {
      throw new Error("Action data must be set");
    }
    if (pluginEnableSignature)
      return pluginEnableSignature;
    if (!sudo)
      throw new Error("sudo validator not set -- need it to enable the validator");
    if (!regular)
      throw new Error("regular validator not set");
    const { version } = await accountMetadata(client, accountAddress, kernelVersion);
    if (!chainId) {
      chainId = client.chain?.id ?? await getChainId(client);
    }
    let ownerSig;
    if (entryPoint.version === "0.6") {
      const typeData = await getPluginsEnableTypedData$1({
        accountAddress,
        chainId,
        kernelVersion: version ?? kernelVersion,
        action,
        validator: regular,
        validUntil,
        validAfter
      });
      ownerSig = await sudo.signTypedData(typeData);
      pluginEnableSignature = ownerSig;
      return ownerSig;
    }
    const validatorNonce = await getKernelV3Nonce(client, accountAddress);
    const typedData = await getPluginsEnableTypedData({
      accountAddress,
      chainId,
      kernelVersion: version,
      action,
      hook,
      validator: regular,
      validatorNonce
    });
    ownerSig = await sudo.signTypedData(typedData);
    pluginEnableSignature = ownerSig;
    return ownerSig;
  };
  const getIdentifier = (isSudo = false) => {
    const validator = (isSudo ? sudo : regular) ?? activeValidator;
    return concat([
      VALIDATOR_TYPE[validator.validatorType],
      validator.getIdentifier()
    ]);
  };
  const getPluginsEnableTypedData$2 = async (accountAddress) => {
    if (!action) {
      throw new Error("Action data must be set");
    }
    if (!sudo)
      throw new Error("sudo validator not set -- need it to enable the validator");
    if (!regular)
      throw new Error("regular validator not set");
    const { version } = await accountMetadata(client, accountAddress, kernelVersion);
    const validatorNonce = await getKernelV3Nonce(client, accountAddress);
    if (!chainId) {
      chainId = client.chain?.id ?? await getChainId(client);
    }
    const typedData = await getPluginsEnableTypedData({
      accountAddress,
      chainId,
      kernelVersion: version,
      action,
      validator: regular,
      validatorNonce
    });
    return typedData;
  };
  return {
    sudoValidator: sudo,
    regularValidator: regular,
    activeValidatorMode: sudo && !regular ? "sudo" : "regular",
    ...activeValidator,
    hook,
    getIdentifier,
    encodeModuleInstallCallData: async (accountAddress) => {
      if (!action) {
        throw new Error("Action data must be set");
      }
      if (!regular)
        throw new Error("regular validator not set");
      if (entryPoint.version === "0.6") {
        return await encodeModuleInstallCallData({
          accountAddress,
          selector: action.selector,
          executor: action.address,
          validator: regular?.address,
          validUntil,
          validAfter,
          enableData: await regular.getEnableData(accountAddress)
        });
      }
      throw new Error("EntryPoint v0.7 not supported yet");
    },
    signUserOperation: async (userOperation) => {
      const userOpSig = await activeValidator.signUserOperation(userOperation);
      if (entryPoint.version === "0.6") {
        return concatHex$1([
          await getSignatureData(userOperation.sender, userOperation.callData.toString().slice(0, 10)),
          userOpSig
        ]);
      }
      return await getSignatureData(userOperation.sender, userOperation.callData.toString().slice(0, 10), userOpSig);
    },
    getAction: () => {
      if (!action) {
        throw new Error("Action data must be set");
      }
      return action;
    },
    getValidityData: () => ({
      validAfter,
      validUntil
    }),
    getStubSignature: async (userOperation) => {
      const userOpSig = await activeValidator.getStubSignature(userOperation);
      if (entryPoint.version === "0.6") {
        return concatHex$1([
          await getSignatureData(userOperation.sender, userOperation.callData.toString().slice(0, 10)),
          userOpSig
        ]);
      }
      return await getSignatureData(userOperation.sender, userOperation.callData.toString().slice(0, 10), userOpSig);
    },
    getNonceKey: async (accountAddress = zeroAddress, customNonceKey = 0n) => {
      if (!action) {
        throw new Error("Action data must be set");
      }
      if (entryPoint.version === "0.6") {
        if (customNonceKey > maxUint192) {
          throw new Error("Custom nonce key must be equal or less than maxUint192 for 0.6");
        }
        return await activeValidator.getNonceKey(accountAddress, customNonceKey);
      }
      if (customNonceKey > maxUint16)
        throw new Error("Custom nonce key must be equal or less than 2 bytes(maxUint16) for v0.7");
      const validatorMode = !regular || await isPluginEnabled(accountAddress, action.selector) ? VALIDATOR_MODE.DEFAULT : VALIDATOR_MODE.ENABLE;
      const validatorType = regular ? VALIDATOR_TYPE[regular.validatorType] : VALIDATOR_TYPE.SUDO;
      const encoding = pad(concatHex$1([
        validatorMode,
        // 1 byte
        validatorType,
        // 1 byte
        pad(activeValidator.getIdentifier(), {
          size: 20,
          dir: "right"
        }),
        // 20 bytes
        pad(toHex$1(await activeValidator.getNonceKey(accountAddress, customNonceKey)), {
          size: 2
        })
        // 2 byte
      ]), { size: 24 });
      const encodedNonceKey = BigInt(encoding);
      return encodedNonceKey;
    },
    getPluginEnableSignature,
    getPluginsEnableTypedData: getPluginsEnableTypedData$2,
    getValidatorInitData: async () => {
      if (validatorInitData)
        return validatorInitData;
      return {
        validatorAddress: sudo?.address ?? activeValidator.address,
        enableData: await sudo?.getEnableData() ?? await activeValidator.getEnableData(),
        identifier: pad(getIdentifier(true), { size: 21, dir: "right" })
      };
    },
    signUserOperationWithActiveValidator: async (userOperation) => {
      return activeValidator.signUserOperation(userOperation);
    }
  };
}
const KernelV3FactoryAbi = [
  {
    type: "constructor",
    inputs: [{ name: "_impl", type: "address", internalType: "address" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "createAccount",
    inputs: [
      { name: "data", type: "bytes", internalType: "bytes" },
      { name: "salt", type: "bytes32", internalType: "bytes32" }
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "getAddress",
    inputs: [
      { name: "data", type: "bytes", internalType: "bytes" },
      { name: "salt", type: "bytes32", internalType: "bytes32" }
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "implementation",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  { type: "error", name: "InitializeError", inputs: [] }
];
const KernelFactoryStakerAbi = [
  {
    type: "constructor",
    inputs: [{ name: "_owner", type: "address", internalType: "address" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "approveFactory",
    inputs: [
      {
        name: "factory",
        type: "address",
        internalType: "contract KernelFactory"
      },
      { name: "approval", type: "bool", internalType: "bool" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "approved",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "contract KernelFactory"
      }
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "cancelOwnershipHandover",
    inputs: [],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "completeOwnershipHandover",
    inputs: [
      { name: "pendingOwner", type: "address", internalType: "address" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "deployWithFactory",
    inputs: [
      {
        name: "factory",
        type: "address",
        internalType: "contract KernelFactory"
      },
      { name: "createData", type: "bytes", internalType: "bytes" },
      { name: "salt", type: "bytes32", internalType: "bytes32" }
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "result", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "ownershipHandoverExpiresAt",
    inputs: [
      { name: "pendingOwner", type: "address", internalType: "address" }
    ],
    outputs: [{ name: "result", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "requestOwnershipHandover",
    inputs: [],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "stake",
    inputs: [
      {
        name: "entryPoint",
        type: "address",
        internalType: "contract IEntryPoint"
      },
      { name: "unstakeDelay", type: "uint32", internalType: "uint32" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      { name: "newOwner", type: "address", internalType: "address" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "unlockStake",
    inputs: [
      {
        name: "entryPoint",
        type: "address",
        internalType: "contract IEntryPoint"
      }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "withdrawStake",
    inputs: [
      {
        name: "entryPoint",
        type: "address",
        internalType: "contract IEntryPoint"
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address payable"
      }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "event",
    name: "OwnershipHandoverCanceled",
    inputs: [
      {
        name: "pendingOwner",
        type: "address",
        indexed: true,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "OwnershipHandoverRequested",
    inputs: [
      {
        name: "pendingOwner",
        type: "address",
        indexed: true,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "oldOwner",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  { type: "error", name: "AlreadyInitialized", inputs: [] },
  { type: "error", name: "NewOwnerIsZeroAddress", inputs: [] },
  { type: "error", name: "NoHandoverRequest", inputs: [] },
  { type: "error", name: "NotApprovedFactory", inputs: [] },
  { type: "error", name: "Unauthorized", inputs: [] }
];
const KernelV3_1AccountAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_entrypoint",
        type: "address",
        internalType: "contract IEntryPoint"
      }
    ],
    stateMutability: "nonpayable"
  },
  { type: "fallback", stateMutability: "payable" },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "accountId",
    inputs: [],
    outputs: [
      {
        name: "accountImplementationId",
        type: "string",
        internalType: "string"
      }
    ],
    stateMutability: "pure"
  },
  {
    type: "function",
    name: "changeRootValidator",
    inputs: [
      {
        name: "_rootValidator",
        type: "bytes21",
        internalType: "ValidationId"
      },
      { name: "hook", type: "address", internalType: "contract IHook" },
      { name: "validatorData", type: "bytes", internalType: "bytes" },
      { name: "hookData", type: "bytes", internalType: "bytes" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "currentNonce",
    inputs: [],
    outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "eip712Domain",
    inputs: [],
    outputs: [
      { name: "fields", type: "bytes1", internalType: "bytes1" },
      { name: "name", type: "string", internalType: "string" },
      { name: "version", type: "string", internalType: "string" },
      { name: "chainId", type: "uint256", internalType: "uint256" },
      {
        name: "verifyingContract",
        type: "address",
        internalType: "address"
      },
      { name: "salt", type: "bytes32", internalType: "bytes32" },
      {
        name: "extensions",
        type: "uint256[]",
        internalType: "uint256[]"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "entrypoint",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IEntryPoint"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      { name: "execMode", type: "bytes32", internalType: "ExecMode" },
      {
        name: "executionCalldata",
        type: "bytes",
        internalType: "bytes"
      }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "executeFromExecutor",
    inputs: [
      { name: "execMode", type: "bytes32", internalType: "ExecMode" },
      {
        name: "executionCalldata",
        type: "bytes",
        internalType: "bytes"
      }
    ],
    outputs: [
      { name: "returnData", type: "bytes[]", internalType: "bytes[]" }
    ],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "executeUserOp",
    inputs: [
      {
        name: "userOp",
        type: "tuple",
        internalType: "struct PackedUserOperation",
        components: [
          {
            name: "sender",
            type: "address",
            internalType: "address"
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "initCode", type: "bytes", internalType: "bytes" },
          { name: "callData", type: "bytes", internalType: "bytes" },
          {
            name: "accountGasLimits",
            type: "bytes32",
            internalType: "bytes32"
          },
          {
            name: "preVerificationGas",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "gasFees",
            type: "bytes32",
            internalType: "bytes32"
          },
          {
            name: "paymasterAndData",
            type: "bytes",
            internalType: "bytes"
          },
          { name: "signature", type: "bytes", internalType: "bytes" }
        ]
      },
      { name: "userOpHash", type: "bytes32", internalType: "bytes32" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "executorConfig",
    inputs: [
      {
        name: "executor",
        type: "address",
        internalType: "contract IExecutor"
      }
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ExecutorManager.ExecutorConfig",
        components: [
          {
            name: "hook",
            type: "address",
            internalType: "contract IHook"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "_rootValidator",
        type: "bytes21",
        internalType: "ValidationId"
      },
      { name: "hook", type: "address", internalType: "contract IHook" },
      { name: "validatorData", type: "bytes", internalType: "bytes" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
      { name: "initConfig", type: "bytes[]", internalType: "bytes[]" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "installModule",
    inputs: [
      { name: "moduleType", type: "uint256", internalType: "uint256" },
      { name: "module", type: "address", internalType: "address" },
      { name: "initData", type: "bytes", internalType: "bytes" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "installValidations",
    inputs: [
      {
        name: "vIds",
        type: "bytes21[]",
        internalType: "ValidationId[]"
      },
      {
        name: "configs",
        type: "tuple[]",
        internalType: "struct ValidationManager.ValidationConfig[]",
        components: [
          { name: "nonce", type: "uint32", internalType: "uint32" },
          {
            name: "hook",
            type: "address",
            internalType: "contract IHook"
          }
        ]
      },
      {
        name: "validationData",
        type: "bytes[]",
        internalType: "bytes[]"
      },
      { name: "hookData", type: "bytes[]", internalType: "bytes[]" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "invalidateNonce",
    inputs: [{ name: "nonce", type: "uint32", internalType: "uint32" }],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "isAllowedSelector",
    inputs: [
      { name: "vId", type: "bytes21", internalType: "ValidationId" },
      { name: "selector", type: "bytes4", internalType: "bytes4" }
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "isModuleInstalled",
    inputs: [
      { name: "moduleType", type: "uint256", internalType: "uint256" },
      { name: "module", type: "address", internalType: "address" },
      {
        name: "additionalContext",
        type: "bytes",
        internalType: "bytes"
      }
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "isValidSignature",
    inputs: [
      { name: "hash", type: "bytes32", internalType: "bytes32" },
      { name: "signature", type: "bytes", internalType: "bytes" }
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "onERC1155BatchReceived",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256[]", internalType: "uint256[]" },
      { name: "", type: "uint256[]", internalType: "uint256[]" },
      { name: "", type: "bytes", internalType: "bytes" }
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "pure"
  },
  {
    type: "function",
    name: "onERC1155Received",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "bytes", internalType: "bytes" }
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "pure"
  },
  {
    type: "function",
    name: "onERC721Received",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "bytes", internalType: "bytes" }
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "pure"
  },
  {
    type: "function",
    name: "permissionConfig",
    inputs: [{ name: "pId", type: "bytes4", internalType: "PermissionId" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ValidationManager.PermissionConfig",
        components: [
          {
            name: "permissionFlag",
            type: "bytes2",
            internalType: "PassFlag"
          },
          {
            name: "signer",
            type: "address",
            internalType: "contract ISigner"
          },
          {
            name: "policyData",
            type: "bytes22[]",
            internalType: "PolicyData[]"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "rootValidator",
    inputs: [],
    outputs: [{ name: "", type: "bytes21", internalType: "ValidationId" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "selectorConfig",
    inputs: [{ name: "selector", type: "bytes4", internalType: "bytes4" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct SelectorManager.SelectorConfig",
        components: [
          {
            name: "hook",
            type: "address",
            internalType: "contract IHook"
          },
          {
            name: "target",
            type: "address",
            internalType: "address"
          },
          {
            name: "callType",
            type: "bytes1",
            internalType: "CallType"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "supportsExecutionMode",
    inputs: [{ name: "mode", type: "bytes32", internalType: "ExecMode" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "pure"
  },
  {
    type: "function",
    name: "supportsModule",
    inputs: [
      { name: "moduleTypeId", type: "uint256", internalType: "uint256" }
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "pure"
  },
  {
    type: "function",
    name: "uninstallModule",
    inputs: [
      { name: "moduleType", type: "uint256", internalType: "uint256" },
      { name: "module", type: "address", internalType: "address" },
      { name: "deInitData", type: "bytes", internalType: "bytes" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "uninstallValidation",
    inputs: [
      { name: "vId", type: "bytes21", internalType: "ValidationId" },
      { name: "deinitData", type: "bytes", internalType: "bytes" },
      { name: "hookDeinitData", type: "bytes", internalType: "bytes" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "upgradeTo",
    inputs: [
      {
        name: "_newImplementation",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "validNonceFrom",
    inputs: [],
    outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "validateUserOp",
    inputs: [
      {
        name: "userOp",
        type: "tuple",
        internalType: "struct PackedUserOperation",
        components: [
          {
            name: "sender",
            type: "address",
            internalType: "address"
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "initCode", type: "bytes", internalType: "bytes" },
          { name: "callData", type: "bytes", internalType: "bytes" },
          {
            name: "accountGasLimits",
            type: "bytes32",
            internalType: "bytes32"
          },
          {
            name: "preVerificationGas",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "gasFees",
            type: "bytes32",
            internalType: "bytes32"
          },
          {
            name: "paymasterAndData",
            type: "bytes",
            internalType: "bytes"
          },
          { name: "signature", type: "bytes", internalType: "bytes" }
        ]
      },
      { name: "userOpHash", type: "bytes32", internalType: "bytes32" },
      {
        name: "missingAccountFunds",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "validationData",
        type: "uint256",
        internalType: "ValidationData"
      }
    ],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "validationConfig",
    inputs: [
      { name: "vId", type: "bytes21", internalType: "ValidationId" }
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ValidationManager.ValidationConfig",
        components: [
          { name: "nonce", type: "uint32", internalType: "uint32" },
          {
            name: "hook",
            type: "address",
            internalType: "contract IHook"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "ModuleInstalled",
    inputs: [
      {
        name: "moduleTypeId",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "module",
        type: "address",
        indexed: false,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "ModuleUninstallResult",
    inputs: [
      {
        name: "module",
        type: "address",
        indexed: false,
        internalType: "address"
      },
      {
        name: "result",
        type: "bool",
        indexed: false,
        internalType: "bool"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "ModuleUninstalled",
    inputs: [
      {
        name: "moduleTypeId",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "module",
        type: "address",
        indexed: false,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "NonceInvalidated",
    inputs: [
      {
        name: "nonce",
        type: "uint32",
        indexed: false,
        internalType: "uint32"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "PermissionInstalled",
    inputs: [
      {
        name: "permission",
        type: "bytes4",
        indexed: false,
        internalType: "PermissionId"
      },
      {
        name: "nonce",
        type: "uint32",
        indexed: false,
        internalType: "uint32"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "PermissionUninstalled",
    inputs: [
      {
        name: "permission",
        type: "bytes4",
        indexed: false,
        internalType: "PermissionId"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Received",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: false,
        internalType: "address"
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "RootValidatorUpdated",
    inputs: [
      {
        name: "rootValidator",
        type: "bytes21",
        indexed: false,
        internalType: "ValidationId"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "SelectorSet",
    inputs: [
      {
        name: "selector",
        type: "bytes4",
        indexed: false,
        internalType: "bytes4"
      },
      {
        name: "vId",
        type: "bytes21",
        indexed: false,
        internalType: "ValidationId"
      },
      {
        name: "allowed",
        type: "bool",
        indexed: false,
        internalType: "bool"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "TryExecuteUnsuccessful",
    inputs: [
      {
        name: "batchExecutionindex",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "result",
        type: "bytes",
        indexed: false,
        internalType: "bytes"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "ValidatorInstalled",
    inputs: [
      {
        name: "validator",
        type: "address",
        indexed: false,
        internalType: "contract IValidator"
      },
      {
        name: "nonce",
        type: "uint32",
        indexed: false,
        internalType: "uint32"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "ValidatorUninstalled",
    inputs: [
      {
        name: "validator",
        type: "address",
        indexed: false,
        internalType: "contract IValidator"
      }
    ],
    anonymous: false
  },
  { type: "error", name: "EnableNotApproved", inputs: [] },
  { type: "error", name: "ExecutionReverted", inputs: [] },
  {
    type: "error",
    name: "InitConfigError",
    inputs: [{ name: "idx", type: "uint256", internalType: "uint256" }]
  },
  { type: "error", name: "InvalidCallType", inputs: [] },
  { type: "error", name: "InvalidCaller", inputs: [] },
  { type: "error", name: "InvalidExecutor", inputs: [] },
  { type: "error", name: "InvalidFallback", inputs: [] },
  { type: "error", name: "InvalidMode", inputs: [] },
  { type: "error", name: "InvalidModuleType", inputs: [] },
  { type: "error", name: "InvalidNonce", inputs: [] },
  { type: "error", name: "InvalidSelector", inputs: [] },
  { type: "error", name: "InvalidSignature", inputs: [] },
  { type: "error", name: "InvalidValidationType", inputs: [] },
  { type: "error", name: "InvalidValidator", inputs: [] },
  { type: "error", name: "NonceInvalidationError", inputs: [] },
  { type: "error", name: "NotSupportedCallType", inputs: [] },
  { type: "error", name: "OnlyExecuteUserOp", inputs: [] },
  { type: "error", name: "PermissionDataLengthMismatch", inputs: [] },
  {
    type: "error",
    name: "PermissionNotAlllowedForSignature",
    inputs: []
  },
  { type: "error", name: "PermissionNotAlllowedForUserOp", inputs: [] },
  { type: "error", name: "PolicyDataTooLarge", inputs: [] },
  {
    type: "error",
    name: "PolicyFailed",
    inputs: [{ name: "i", type: "uint256", internalType: "uint256" }]
  },
  { type: "error", name: "PolicySignatureOrderError", inputs: [] },
  { type: "error", name: "RootValidatorCannotBeRemoved", inputs: [] },
  { type: "error", name: "SignerPrefixNotPresent", inputs: [] }
];
const SafeCreateCallAbi = parseAbi$1([
  "function performCreate(uint256 value, bytes memory deploymentData) public returns (address newContract)",
  "function performCreate2(uint256 value, bytes memory deploymentData, bytes32 salt) public returns (address newContract)"
]);
const encodeSafeCreateCall = (args) => {
  return encodeFunctionData$1({
    abi: SafeCreateCallAbi,
    functionName: "performCreate",
    args
  });
};
const encodeDeployCallData$1 = (tx) => {
  const deployCalldataArgs = {
    to: safeCreateCallAddress,
    data: encodeSafeCreateCall([0n, encodeDeployData(tx)])
  };
  return encodeExecuteDelegateCall$1(deployCalldataArgs);
};
const encodeExecuteCall = (args, options, includeHooks = false) => {
  let calldata;
  if ("calldata" in args) {
    calldata = args.calldata;
  } else {
    calldata = concatHex$1([
      args.to,
      options.callType !== CALL_TYPE.DELEGATE_CALL ? toHex$1(args.value || 0n, { size: 32 }) : "0x",
      // No value if delegate call
      args.data || "0x"
    ]);
  }
  const executeUserOpSig = toFunctionSelector(getAbiItem({ abi: KernelV3ExecuteAbi, name: "executeUserOp" }));
  if (includeHooks) {
    return concatHex$1([
      executeUserOpSig,
      encodeFunctionData$1({
        abi: KernelV3ExecuteAbi,
        functionName: "execute",
        args: [getExecMode(options), calldata]
      })
    ]);
  }
  return encodeFunctionData$1({
    abi: KernelV3ExecuteAbi,
    functionName: "execute",
    args: [getExecMode(options), calldata]
  });
};
const encodeExecuteBatchCall = (args, options, includeHooks) => {
  const calldata = encodeAbiParameters$1([
    {
      name: "executionBatch",
      type: "tuple[]",
      components: [
        {
          name: "target",
          type: "address"
        },
        {
          name: "value",
          type: "uint256"
        },
        {
          name: "callData",
          type: "bytes"
        }
      ]
    }
  ], [
    args.map((arg) => {
      return {
        target: arg.to,
        value: arg.value || 0n,
        callData: arg.data || "0x"
      };
    })
  ]);
  return encodeExecuteCall({ calldata }, {
    callType: CALL_TYPE.BATCH,
    execType: options.execType
  }, includeHooks);
};
const encodeExecuteDelegateCall = (args, options, includeHooks) => {
  return encodeExecuteCall(args, {
    callType: CALL_TYPE.DELEGATE_CALL,
    execType: options.execType
  }, includeHooks);
};
const encodeExecuteSingleCall = (args, options, includeHooks) => {
  return encodeExecuteCall(args, {
    callType: CALL_TYPE.SINGLE,
    execType: options.execType
  }, includeHooks);
};
const encodeCallData = async (calls, callType, includeHooks) => {
  if (calls.length > 1) {
    if (callType === "delegatecall") {
      throw new Error("Cannot batch delegatecall");
    }
    return encodeExecuteBatchCall(calls, {
      execType: EXEC_TYPE.DEFAULT
    }, includeHooks);
  }
  const call2 = calls.length === 0 ? void 0 : calls[0];
  if (!call2) {
    throw new Error("No calls to encode");
  }
  if (!callType || callType === "call") {
    return encodeExecuteSingleCall(call2, {
      execType: EXEC_TYPE.DEFAULT
    }, includeHooks);
  }
  if (callType === "delegatecall") {
    return encodeExecuteDelegateCall({ to: call2.to, data: call2.data }, {
      execType: EXEC_TYPE.DEFAULT
    }, includeHooks);
  }
  throw new Error("Invalid call type");
};
const encodeDeployCallData = (tx) => {
  const deployCalldataArgs = {
    to: safeCreateCallAddress,
    data: encodeSafeCreateCall([0n, encodeDeployData(tx)])
  };
  return encodeExecuteDelegateCall(deployCalldataArgs, {
    execType: EXEC_TYPE.DEFAULT
  });
};
const hashKernelMessageHashWrapper = (messageHash) => {
  return keccak256$1(encodeAbiParameters$1([{ type: "bytes32" }, { type: "bytes32" }], [keccak256$1(stringToHex$1("Kernel(bytes32 hash)")), messageHash]));
};
const eip712WrapHash = async (messageHash, domain, useReplayableSignature) => {
  const { name, version, chainId, verifyingContract } = domain;
  if (!hasKernelFeature(KERNEL_FEATURES.ERC1271_SIG_WRAPPER, version)) {
    return messageHash;
  }
  const _chainId = hasKernelFeature(KERNEL_FEATURES.ERC1271_REPLAYABLE, version) && useReplayableSignature ? 0 : chainId;
  const _domainSeparator = domainSeparator({
    domain: {
      name,
      version,
      chainId: _chainId,
      verifyingContract
    }
  });
  let finalMessageHash = messageHash;
  if (hasKernelFeature(KERNEL_FEATURES.ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH, version)) {
    finalMessageHash = hashKernelMessageHashWrapper(finalMessageHash);
  }
  const digest = keccak256$1(concatHex$1(["0x1901", _domainSeparator, finalMessageHash]));
  return digest;
};
const getPluginInstallCallData = (accountAddress, plugin) => {
  const data = encodeFunctionData$1({
    abi: KernelModuleInstallAbi,
    functionName: "installModule",
    args: [plugin.type, plugin.address, plugin.data]
  });
  return {
    to: accountAddress,
    data
  };
};
const createAccountAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_implementation",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes"
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256"
      }
    ],
    name: "createAccount",
    outputs: [
      {
        internalType: "address",
        name: "proxy",
        type: "address"
      }
    ],
    stateMutability: "payable",
    type: "function"
  }
];
const getKernelInitData = async ({ entryPointVersion: _entryPointVersion, kernelPluginManager, initHook, kernelVersion, initConfig }) => {
  const { enableData, identifier, validatorAddress, initConfig: initConfig_ } = await kernelPluginManager.getValidatorInitData();
  if (_entryPointVersion === "0.6") {
    return encodeFunctionData$1({
      abi: KernelInitAbi,
      functionName: "initialize",
      args: [validatorAddress, enableData]
    });
  }
  return encodeFunctionData$1({
    abi: KernelV3_1AccountAbi,
    functionName: "initialize",
    args: [
      identifier,
      initHook && kernelPluginManager.hook ? kernelPluginManager.hook?.getIdentifier() : zeroAddress,
      enableData,
      initHook && kernelPluginManager.hook ? await kernelPluginManager.hook?.getEnableData() : "0x",
      initConfig ?? initConfig_ ?? []
    ]
  });
};
const getAccountInitCode = async ({ index, factoryAddress, accountImplementationAddress, entryPointVersion: _entryPointVersion, kernelPluginManager, initHook, kernelVersion, initConfig, useMetaFactory }) => {
  const initialisationData = await getKernelInitData({
    entryPointVersion: _entryPointVersion,
    kernelPluginManager,
    initHook,
    kernelVersion,
    initConfig
  });
  if (_entryPointVersion === "0.6") {
    return encodeFunctionData$1({
      abi: createAccountAbi,
      functionName: "createAccount",
      args: [accountImplementationAddress, initialisationData, index]
    });
  }
  if (!useMetaFactory) {
    return encodeFunctionData$1({
      abi: KernelV3FactoryAbi,
      functionName: "createAccount",
      args: [initialisationData, toHex$1(index, { size: 32 })]
    });
  }
  return encodeFunctionData$1({
    abi: KernelFactoryStakerAbi,
    functionName: "deployWithFactory",
    args: [factoryAddress, initialisationData, toHex$1(index, { size: 32 })]
  });
};
const getDefaultAddresses = (entryPointVersion, kernelVersion, { accountImplementationAddress, factoryAddress, metaFactoryAddress }) => {
  validateKernelVersionWithEntryPoint(entryPointVersion, kernelVersion);
  const addresses = KernelVersionToAddressesMap[kernelVersion];
  if (!addresses) {
    throw new Error(`No addresses found for kernel version ${kernelVersion}`);
  }
  return {
    accountImplementationAddress: accountImplementationAddress ?? addresses.accountImplementationAddress,
    factoryAddress: factoryAddress ?? addresses.factoryAddress,
    metaFactoryAddress: metaFactoryAddress ?? addresses.metaFactoryAddress ?? zeroAddress
  };
};
async function createKernelAccount(client, { plugins, entryPoint, index = 0n, factoryAddress: _factoryAddress, accountImplementationAddress: _accountImplementationAddress, metaFactoryAddress: _metaFactoryAddress, address, kernelVersion, initConfig, useMetaFactory: _useMetaFactory = true, eip7702Auth, eip7702Account, pluginMigrations }) {
  const isEip7702 = !!eip7702Account || !!eip7702Auth;
  if (isEip7702 && !semver.satisfies(kernelVersion, ">=0.3.3")) {
    throw new Error("EIP-7702 is recommended for kernel version >=0.3.3");
  }
  const localAccount = eip7702Account ? await toSigner({ signer: eip7702Account, address }) : void 0;
  let eip7702Validator;
  if (localAccount) {
    eip7702Validator = await signerTo7702Validator(client, {
      signer: localAccount,
      entryPoint,
      kernelVersion
    });
  }
  let useMetaFactory = _useMetaFactory;
  const { accountImplementationAddress, factoryAddress, metaFactoryAddress } = getDefaultAddresses(entryPoint.version, kernelVersion, {
    accountImplementationAddress: _accountImplementationAddress,
    factoryAddress: _factoryAddress,
    metaFactoryAddress: _metaFactoryAddress
  });
  let chainId;
  let cachedAccountMetadata;
  const getMemoizedChainId = async () => {
    if (chainId)
      return chainId;
    chainId = client.chain ? client.chain.id : await getAction(client, getChainId, "getChainId")({});
    return chainId;
  };
  const getMemoizedAccountMetadata = async () => {
    if (cachedAccountMetadata)
      return cachedAccountMetadata;
    cachedAccountMetadata = await accountMetadata(client, accountAddress, kernelVersion, await getMemoizedChainId());
    return cachedAccountMetadata;
  };
  const kernelPluginManager = isKernelPluginManager(plugins) ? plugins : await toKernelPluginManager(client, {
    sudo: localAccount ? eip7702Validator : plugins?.sudo,
    regular: plugins?.regular,
    hook: plugins?.hook,
    action: plugins?.action,
    pluginEnableSignature: plugins?.pluginEnableSignature,
    entryPoint,
    kernelVersion,
    chainId: await getMemoizedChainId()
  });
  const initHook = Boolean(isKernelPluginManager(plugins) ? plugins.hook && plugins.getIdentifier() === plugins.sudoValidator?.getIdentifier() : plugins?.hook && !plugins?.regular);
  const generateInitCode = async () => {
    if (isEip7702) {
      return "0x";
    }
    if (!accountImplementationAddress || !factoryAddress)
      throw new Error("Missing account logic address or factory address");
    return getAccountInitCode({
      index,
      factoryAddress,
      accountImplementationAddress,
      entryPointVersion: entryPoint.version,
      kernelPluginManager,
      initHook,
      kernelVersion,
      initConfig,
      useMetaFactory
    });
  };
  const getFactoryArgs = async () => {
    if (isEip7702) {
      return {
        factory: void 0,
        factoryData: void 0
      };
    }
    return {
      factory: entryPoint.version === "0.6" || useMetaFactory === false ? factoryAddress : metaFactoryAddress,
      factoryData: await generateInitCode()
    };
  };
  let accountAddress = address ?? (isEip7702 ? localAccount?.address ?? zeroAddress : await (async () => {
    const { factory, factoryData } = await getFactoryArgs();
    if (!factory || !factoryData) {
      throw new Error("Missing factory address or factory data");
    }
    return await getSenderAddress(client, {
      factory,
      factoryData,
      entryPointAddress: entryPoint.address
    });
  })());
  if (isAddressEqual$1(accountAddress, zeroAddress) && useMetaFactory) {
    useMetaFactory = false;
    accountAddress = await getSenderAddress(client, {
      factory: factoryAddress,
      factoryData: await generateInitCode(),
      entryPointAddress: entryPoint.address
    });
    if (isAddressEqual$1(accountAddress, zeroAddress)) {
      useMetaFactory = true;
    }
  }
  const _entryPoint = {
    address: entryPoint?.address ?? entryPoint07Address,
    abi: (entryPoint?.version ?? "0.7") === "0.6" ? entryPoint06Abi : entryPoint07Abi,
    version: entryPoint?.version ?? "0.7"
  };
  const pluginCache = {
    pendingPlugins: pluginMigrations || [],
    allInstalled: false
  };
  const checkPluginInstallationStatus = async () => {
    if (!pluginCache.pendingPlugins.length || pluginCache.allInstalled) {
      pluginCache.allInstalled = true;
      return;
    }
    const installationResults = await Promise.all(pluginCache.pendingPlugins.map((plugin) => isPluginInstalled(client, {
      address: accountAddress,
      plugin
    })));
    pluginCache.pendingPlugins = pluginCache.pendingPlugins.filter((_, index2) => !installationResults[index2]);
    pluginCache.allInstalled = pluginCache.pendingPlugins.length === 0;
  };
  const signAuthorization$1 = async () => {
    const code = await getCode(client, { address: accountAddress });
    if (!code || code.length === 0 || !code.toLowerCase().startsWith(`0xef0100${accountImplementationAddress.slice(2).toLowerCase()}`)) {
      if (eip7702Auth && !isAddressEqual$1(eip7702Auth.address, accountImplementationAddress)) {
        throw new Error("EIP-7702 authorization delegate address does not match account implementation address");
      }
      const auth = eip7702Auth ?? await signAuthorization(client, {
        account: localAccount,
        address: accountImplementationAddress,
        chainId: await getMemoizedChainId()
      });
      const verified = await verifyAuthorization({
        authorization: auth,
        address: accountAddress
      });
      if (!verified) {
        throw new Error("Authorization verification failed");
      }
      return auth;
    }
    return void 0;
  };
  await checkPluginInstallationStatus();
  return toSmartAccount({
    authorization: isEip7702 ? {
      account: localAccount ?? addressToEmptyAccount(accountAddress),
      address: accountImplementationAddress
    } : void 0,
    kernelVersion,
    kernelPluginManager,
    accountImplementationAddress,
    factoryAddress: (await getFactoryArgs()).factory,
    generateInitCode,
    encodeModuleInstallCallData: async () => {
      return await kernelPluginManager.encodeModuleInstallCallData(accountAddress);
    },
    nonceKeyManager: createNonceManager$1({
      source: { get: () => 0, set: () => {
      } }
    }),
    client,
    entryPoint: _entryPoint,
    getFactoryArgs,
    async getAddress() {
      if (accountAddress)
        return accountAddress;
      const { factory, factoryData } = await getFactoryArgs();
      if (!factory || !factoryData) {
        throw new Error("Missing factory address or factory data");
      }
      accountAddress = await getSenderAddress(client, {
        factory,
        factoryData,
        entryPointAddress: entryPoint.address
      });
      return accountAddress;
    },
    // Encode the deploy call data
    async encodeDeployCallData(_tx) {
      if (entryPoint.version === "0.6") {
        return encodeDeployCallData$1(_tx);
      }
      return encodeDeployCallData(_tx);
    },
    async encodeCalls(calls, callType) {
      await checkPluginInstallationStatus();
      if (pluginCache.pendingPlugins.length > 0 && entryPoint.version === "0.7" && kernelPluginManager.activeValidatorMode === "sudo") {
        const pluginInstallCalls = [];
        for (const plugin of pluginCache.pendingPlugins) {
          pluginInstallCalls.push(getPluginInstallCallData(accountAddress, plugin));
        }
        return encodeCallData([...calls, ...pluginInstallCalls], callType, plugins?.hook ? true : void 0);
      }
      if (calls.length === 1 && (!callType || callType === "call") && calls[0].to.toLowerCase() === accountAddress.toLowerCase()) {
        return calls[0].data ?? "0x";
      }
      if (entryPoint.version === "0.6") {
        return encodeCallData$1(calls, callType);
      }
      if (plugins?.hook) {
        return encodeCallData(calls, callType, true);
      }
      return encodeCallData(calls, callType);
    },
    eip7702Authorization: signAuthorization$1,
    async sign({ hash }) {
      return this.signMessage({ message: hash });
    },
    async signMessage({ message, useReplayableSignature }) {
      const messageHash = hashMessage(message);
      const { name, chainId: metadataChainId, version } = await getMemoizedAccountMetadata();
      let signature;
      if (isEip7702) {
        signature = await kernelPluginManager.signTypedData({
          message: { hash: messageHash },
          primaryType: "Kernel",
          types: {
            Kernel: [{ name: "hash", type: "bytes32" }]
          },
          domain: {
            name,
            version,
            chainId: useReplayableSignature ? 0 : Number(metadataChainId),
            verifyingContract: accountAddress
          }
        });
      } else {
        const wrappedMessageHash = await eip712WrapHash(messageHash, {
          name,
          chainId: Number(metadataChainId),
          version,
          verifyingContract: accountAddress
        }, useReplayableSignature);
        signature = await kernelPluginManager.signMessage({
          message: { raw: wrappedMessageHash }
        });
      }
      if (!hasKernelFeature(KERNEL_FEATURES.ERC1271_WITH_VALIDATOR, version)) {
        return signature;
      }
      if (useReplayableSignature && hasKernelFeature(KERNEL_FEATURES.ERC1271_REPLAYABLE, version)) {
        signature = concatHex$1([MAGIC_VALUE_SIG_REPLAYABLE, signature]);
      }
      return concatHex$1([kernelPluginManager.getIdentifier(), signature]);
    },
    async signTypedData(typedData) {
      const { message, primaryType, types: _types, domain } = typedData;
      const types = {
        EIP712Domain: getTypesForEIP712Domain$1({
          domain
        }),
        ..._types
      };
      validateTypedData$1({
        domain,
        message,
        primaryType,
        types
      });
      const typedHash = hashTypedData(typedData);
      const { name, chainId: metadataChainId, version } = await getMemoizedAccountMetadata();
      let signature;
      if (isEip7702) {
        signature = await kernelPluginManager.signTypedData({
          message: { hash: typedHash },
          primaryType: "Kernel",
          types: {
            Kernel: [{ name: "hash", type: "bytes32" }]
          },
          domain: {
            name,
            version,
            chainId: Number(metadataChainId),
            verifyingContract: accountAddress
          }
        });
      } else {
        const wrappedMessageHash = await eip712WrapHash(typedHash, {
          name,
          chainId: Number(metadataChainId),
          version,
          verifyingContract: accountAddress
        });
        signature = await kernelPluginManager.signMessage({
          message: { raw: wrappedMessageHash }
        });
      }
      if (!hasKernelFeature(KERNEL_FEATURES.ERC1271_WITH_VALIDATOR, version)) {
        return signature;
      }
      return concatHex$1([kernelPluginManager.getIdentifier(), signature]);
    },
    // Get the nonce of the smart account
    async getNonce(_args) {
      const key = await kernelPluginManager.getNonceKey(accountAddress, _args?.key);
      return getAccountNonce(client, {
        address: accountAddress,
        entryPointAddress: entryPoint.address,
        key
      });
    },
    async getStubSignature(userOperation) {
      if (!userOperation) {
        throw new Error("No user operation provided");
      }
      return kernelPluginManager.getStubSignature(userOperation);
    },
    // Sign a user operation
    async signUserOperation(parameters) {
      const { chainId: chainId2 = await getMemoizedChainId(), ...userOperation } = parameters;
      return kernelPluginManager.signUserOperation({
        ...userOperation,
        sender: userOperation.sender ?? await this.getAddress(),
        chainId: chainId2
      });
    }
  });
}
const MULTI_CHAIN_ECDSA_VALIDATOR_ADDRESS = "0x5C97aA67Ba578E3c54ec5942A7563Ea9130E4f5F";
const ecdsaGetMultiUserOpDummySignature = (userOperation, numOfUserOps, entryPoint, chainId) => {
  const userOpHash = getUserOperationHash({
    userOperation,
    entryPointAddress: entryPoint.address,
    entryPointVersion: entryPoint.version,
    chainId
  });
  const dummyUserOpHash = `0x${"a".repeat(64)}`;
  const dummyLeaves = Array(numOfUserOps - 1).fill(dummyUserOpHash);
  const leaves = [userOpHash, ...dummyLeaves];
  const merkleTree = new dist.MerkleTree(leaves, keccak256$1, {
    sortPairs: true
  });
  const merkleRoot = merkleTree.getHexRoot();
  const merkleProof = merkleTree.getHexProof(userOpHash);
  const dummyEcdsaSig = "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
  const encodedMerkleProof = encodeAbiParameters$1([
    { name: "dummyUserOpHash", type: "bytes32" },
    { name: "proof", type: "bytes32[]" }
  ], [userOpHash, merkleProof]);
  const finalDummySig = concatHex$1([
    dummyEcdsaSig,
    merkleRoot,
    encodedMerkleProof
  ]);
  return finalDummySig;
};
async function toMultiChainECDSAValidator(client, { signer, entryPoint, kernelVersion: _, validatorAddress: validatorAddress_, multiChainIds }) {
  const validatorAddress = validatorAddress_ ?? MULTI_CHAIN_ECDSA_VALIDATOR_ADDRESS;
  const viemSigner = await toSigner({ signer });
  const chainId = await getChainId(client);
  const account = toAccount({
    address: viemSigner.address,
    async signMessage({ message }) {
      return signMessage(client, { account: viemSigner, message });
    },
    async signTransaction(_2, __) {
      throw new SignTransactionNotSupportedBySmartAccountError();
    },
    async signTypedData(typedData) {
      return viemSigner.signTypedData(typedData);
    }
  });
  return {
    ...account,
    supportedKernelVersions: ">=0.3.0",
    validatorType: "SECONDARY",
    address: validatorAddress,
    source: "MultiChainECDSAValidator",
    getIdentifier() {
      return validatorAddress ?? MULTI_CHAIN_ECDSA_VALIDATOR_ADDRESS;
    },
    async getEnableData() {
      return viemSigner.address;
    },
    async getNonceKey(_accountAddress, customNonceKey) {
      if (customNonceKey) {
        return customNonceKey;
      }
      return 0n;
    },
    async signUserOperation(userOperation) {
      const hash = getUserOperationHash({
        userOperation: {
          ...userOperation,
          signature: "0x"
        },
        entryPointAddress: entryPoint.address,
        entryPointVersion: entryPoint.version,
        chainId
      });
      const signature = await signMessage(client, {
        account: viemSigner,
        message: { raw: hash }
      });
      return signature;
    },
    async getStubSignature(userOperation) {
      if (!multiChainIds)
        return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
      return ecdsaGetMultiUserOpDummySignature({
        ...userOperation,
        callGasLimit: 0n,
        preVerificationGas: 0n,
        verificationGasLimit: 0n
      }, multiChainIds.length, entryPoint, chainId);
    },
    async isEnabled(_kernelAccountAddress, _selector) {
      return false;
    }
  };
}
const ComposeContext = createContext(null);
function ComposeProvider({
  children,
  config
}) {
  return /* @__PURE__ */ jsx(ComposeContext.Provider, { value: config, children });
}
function useComposeConfig() {
  const context = useContext(ComposeContext);
  if (!context) {
    throw new Error("useCompose must be used within a ComposeProvider");
  }
  return context;
}
const useSmartAccount = ({ chainId, multiChainIds = [] }) => {
  const account = useAccount();
  const composeConfig = useComposeConfig();
  const walletClient = useWalletClient();
  const publicClient = usePublicClient({ chainId });
  if (!composeConfig.accountAbstractionContracts?.[chainId]) {
    console.error(`Account abstraction contracts not fou  nd for chain ${chainId}`);
  }
  const smartAccountQuery = useQuery({
    queryKey: ["smart-account", walletClient.data?.account.address, chainId, multiChainIds],
    queryFn: async () => {
      const validator = await toMultiChainECDSAValidator(publicClient, {
        entryPoint: entryPointV07,
        signer: walletClient.data,
        kernelVersion: KERNEL_V3_1,
        validatorAddress: composeConfig.accountAbstractionContracts?.[chainId]?.multichainValidator,
        multiChainIds
      });
      const kernelAccount = await createKernelAccount(publicClient, {
        entryPoint: entryPointV07,
        plugins: { sudo: validator },
        kernelVersion: KERNEL_V3_1,
        accountImplementationAddress: composeConfig.accountAbstractionContracts?.[chainId]?.kernelImpl,
        factoryAddress: composeConfig.accountAbstractionContracts?.[chainId]?.kernelFactory,
        useMetaFactory: false
      });
      return {
        validator,
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
export {
  ComposeProvider,
  useComposeConfig,
  useSmartAccount
};
