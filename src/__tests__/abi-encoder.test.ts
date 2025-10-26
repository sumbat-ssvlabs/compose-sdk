import { createAbiEncoder } from '@/utils/abi';
import type { Abi } from 'abitype';
import { describe, expect, it } from 'vitest';

describe('createAbiEncoder', () => {
  const mockAbi = [
    {
      type: 'function',
      name: 'transfer',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'approve',
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ type: 'bool' }],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'balanceOf',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ type: 'uint256' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'totalSupply',
      inputs: [],
      outputs: [{ type: 'uint256' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'mint',
      inputs: [{ name: 'amount', type: 'uint256' }],
      outputs: [],
      stateMutability: 'payable'
    },
    {
      type: 'function',
      name: 'pureFunction',
      inputs: [],
      outputs: [{ type: 'uint256' }],
      stateMutability: 'pure'
    }
  ] as const;

  it('should create encoder with only write functions (nonpayable and payable)', () => {
    const encoder = createAbiEncoder(mockAbi);

    expect(encoder).toHaveProperty('transfer');
    expect(encoder).toHaveProperty('approve');
    expect(encoder).toHaveProperty('mint');

    // Should not include view or pure functions
    expect(encoder).not.toHaveProperty('balanceOf');
    expect(encoder).not.toHaveProperty('totalSupply');
    expect(encoder).not.toHaveProperty('pureFunction');
  });

  it('should encode function call with parameters', () => {
    const encoder = createAbiEncoder(mockAbi);

    const encoded = encoder.transfer({
      to: '0x1234567890123456789012345678901234567890',
      amount: 1000n
    });

    expect(typeof encoded).toBe('string');
    expect(encoded.startsWith('0x')).toBe(true);
    expect(encoded.length).toBeGreaterThan(2);
  });

  it('should encode function call without parameters', () => {
    const encoder = createAbiEncoder(mockAbi);

    const encoded = encoder.mint({ amount: 500n });

    expect(typeof encoded).toBe('string');
    expect(encoded.startsWith('0x')).toBe(true);
  });

  it('should handle empty ABI', () => {
    const encoder = createAbiEncoder([]);

    expect(encoder).toEqual({});
  });

  it('should handle ABI with only view functions', () => {
    const viewOnlyAbi: Abi = [
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view'
      },
      {
        type: 'function',
        name: 'totalSupply',
        inputs: [],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'pure'
      }
    ];

    const encoder = createAbiEncoder(viewOnlyAbi);

    expect(encoder).toEqual({});
  });

  it('should handle function with no inputs', () => {
    const noInputsAbi = [
      {
        type: 'function',
        name: 'renounceOwnership',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable'
      }
    ] as const;

    const encoder = createAbiEncoder(noInputsAbi);

    const encoded = encoder.renounceOwnership();

    expect(typeof encoded).toBe('string');
    expect(encoded.startsWith('0x')).toBe(true);
  });

  it('should handle complex parameter types', () => {
    const complexAbi = [
      {
        type: 'function',
        name: 'complexFunction',
        inputs: [
          { name: 'addresses', type: 'address[]' },
          { name: 'values', type: 'uint256[]' },
          { name: 'data', type: 'bytes' }
        ],
        outputs: [],
        stateMutability: 'payable'
      }
    ] as const;

    const encoder = createAbiEncoder(complexAbi);

    const encoded = encoder.complexFunction({
      addresses: ['0x1234567890123456789012345678901234567890', '0x0987654321098765432109876543210987654321'],
      values: [100n, 200n],
      data: '0xdeadbeef'
    });

    expect(typeof encoded).toBe('string');
    expect(encoded.startsWith('0x')).toBe(true);
  });
});
