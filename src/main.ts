import { EntryPointAbi } from '@/abi/entrypoint';
import { createAbiEncoder } from '@/utils/abi';
import 'dotenv/config';

const a = createAbiEncoder(EntryPointAbi);
console.log(
  a.delegateAndRevert({
    data: '0x',
    target: '0x'
  })
);
