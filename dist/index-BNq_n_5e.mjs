import { defineChain as defineChain$1, zeroAddress, isHex as isHex$1, concatHex as concatHex$1, toHex as toHex$1, hexToBytes as hexToBytes$1, numberToHex as numberToHex$1, concat as concat$1, encodeAbiParameters as encodeAbiParameters$1, parseAbiParameters, BaseError as BaseError$3, toFunctionSelector as toFunctionSelector$1, getAbiItem as getAbiItem$1, hashTypedData as hashTypedData$1, keccak256 as keccak256$1 } from "viem";
import "@wagmi/core";
function defineChain(chain) {
  return {
    formatters: void 0,
    fees: void 0,
    serializers: void 0,
    ...chain
  };
}
const version$2 = "2.38.4";
let errorConfig = {
  getDocsUrl: ({ docsBaseUrl, docsPath: docsPath2 = "", docsSlug }) => docsPath2 ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath2}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
  version: `viem@${version$2}`
};
let BaseError$2 = class BaseError2 extends Error {
  constructor(shortMessage, args = {}) {
    const details = (() => {
      if (args.cause instanceof BaseError2)
        return args.cause.details;
      if (args.cause?.message)
        return args.cause.message;
      return args.details;
    })();
    const docsPath2 = (() => {
      if (args.cause instanceof BaseError2)
        return args.cause.docsPath || args.docsPath;
      return args.docsPath;
    })();
    const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath: docsPath2 });
    const message2 = [
      shortMessage || "An error occurred.",
      "",
      ...args.metaMessages ? [...args.metaMessages, ""] : [],
      ...docsUrl ? [`Docs: ${docsUrl}`] : [],
      ...details ? [`Details: ${details}`] : [],
      ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
    ].join("\n");
    super(message2, args.cause ? { cause: args.cause } : void 0);
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "docsPath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "metaMessages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "shortMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "version", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "BaseError"
    });
    this.details = details;
    this.docsPath = docsPath2;
    this.metaMessages = args.metaMessages;
    this.name = args.name ?? this.name;
    this.shortMessage = shortMessage;
    this.version = version$2;
  }
  walk(fn) {
    return walk$1(this, fn);
  }
};
function walk$1(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause !== void 0)
    return walk$1(err.cause, fn);
  return fn ? null : err;
}
let IntegerOutOfRangeError$1 = class IntegerOutOfRangeError2 extends BaseError$2 {
  constructor({ max, min, signed, size: size2, value }) {
    super(`Number "${value}" is not in safe ${size2 ? `${size2 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
  }
};
class InvalidBytesBooleanError extends BaseError$2 {
  constructor(bytes) {
    super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
      name: "InvalidBytesBooleanError"
    });
  }
}
class SizeOverflowError extends BaseError$2 {
  constructor({ givenSize, maxSize }) {
    super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
  }
}
function isHex(value, { strict = true } = {}) {
  if (!value)
    return false;
  if (typeof value !== "string")
    return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
function size(value) {
  if (isHex(value, { strict: false }))
    return Math.ceil((value.length - 2) / 2);
  return value.length;
}
function trim$1(hexOrBytes, { dir = "left" } = {}) {
  let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
  let sliceLength = 0;
  for (let i2 = 0; i2 < data.length - 1; i2++) {
    if (data[dir === "left" ? i2 : data.length - i2 - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (typeof hexOrBytes === "string") {
    if (data.length === 1 && dir === "right")
      data = `${data}0`;
    return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
  }
  return data;
}
class SliceOffsetOutOfBoundsError extends BaseError$2 {
  constructor({ offset, position, size: size2 }) {
    super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size2}).`, { name: "SliceOffsetOutOfBoundsError" });
  }
}
let SizeExceedsPaddingSizeError$1 = class SizeExceedsPaddingSizeError2 extends BaseError$2 {
  constructor({ size: size2, targetSize, type: type2 }) {
    super(`${type2.charAt(0).toUpperCase()}${type2.slice(1).toLowerCase()} size (${size2}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
  }
};
class InvalidBytesLengthError extends BaseError$2 {
  constructor({ size: size2, targetSize, type: type2 }) {
    super(`${type2.charAt(0).toUpperCase()}${type2.slice(1).toLowerCase()} is expected to be ${targetSize} ${type2} long, but is ${size2} ${type2} long.`, { name: "InvalidBytesLengthError" });
  }
}
function pad$1(hexOrBytes, { dir, size: size2 = 32 } = {}) {
  if (typeof hexOrBytes === "string")
    return padHex(hexOrBytes, { dir, size: size2 });
  return padBytes(hexOrBytes, { dir, size: size2 });
}
function padHex(hex_, { dir, size: size2 = 32 } = {}) {
  if (size2 === null)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size2 * 2)
    throw new SizeExceedsPaddingSizeError$1({
      size: Math.ceil(hex.length / 2),
      targetSize: size2,
      type: "hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size2 * 2, "0")}`;
}
function padBytes(bytes, { dir, size: size2 = 32 } = {}) {
  if (size2 === null)
    return bytes;
  if (bytes.length > size2)
    throw new SizeExceedsPaddingSizeError$1({
      size: bytes.length,
      targetSize: size2,
      type: "bytes"
    });
  const paddedBytes = new Uint8Array(size2);
  for (let i2 = 0; i2 < size2; i2++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i2 : size2 - i2 - 1] = bytes[padEnd ? i2 : bytes.length - i2 - 1];
  }
  return paddedBytes;
}
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i2) => i2.toString(16).padStart(2, "0"));
function toHex(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToHex(value, opts);
  if (typeof value === "string") {
    return stringToHex(value, opts);
  }
  if (typeof value === "boolean")
    return boolToHex(value, opts);
  return bytesToHex$1(value, opts);
}
function boolToHex(value, opts = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad$1(hex, { size: opts.size });
  }
  return hex;
}
function bytesToHex$1(value, opts = {}) {
  let string = "";
  for (let i2 = 0; i2 < value.length; i2++) {
    string += hexes[value[i2]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad$1(hex, { dir: "right", size: opts.size });
  }
  return hex;
}
function numberToHex(value_, opts = {}) {
  const { signed, size: size2 } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size2) {
    if (signed)
      maxValue = (1n << BigInt(size2) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size2) * 8n) - 1n;
  } else if (typeof value_ === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError$1({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size2,
      value: `${value_}${suffix}`
    });
  }
  const hex = `0x${(signed && value < 0 ? (1n << BigInt(size2 * 8)) + BigInt(value) : value).toString(16)}`;
  if (size2)
    return pad$1(hex, { size: size2 });
  return hex;
}
const encoder$1 = /* @__PURE__ */ new TextEncoder();
function stringToHex(value_, opts = {}) {
  const value = encoder$1.encode(value_);
  return bytesToHex$1(value, opts);
}
const encoder = /* @__PURE__ */ new TextEncoder();
function toBytes$1(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToBytes(value, opts);
  if (typeof value === "boolean")
    return boolToBytes(value, opts);
  if (isHex(value))
    return hexToBytes(value, opts);
  return stringToBytes(value, opts);
}
function boolToBytes(value, opts = {}) {
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad$1(bytes, { size: opts.size });
  }
  return bytes;
}
const charCodeMap = {
  zero: 48,
  nine: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine)
    return char - charCodeMap.zero;
  if (char >= charCodeMap.A && char <= charCodeMap.F)
    return char - (charCodeMap.A - 10);
  if (char >= charCodeMap.a && char <= charCodeMap.f)
    return char - (charCodeMap.a - 10);
  return void 0;
}
function hexToBytes(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = pad$1(hex, { dir: "right", size: opts.size });
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index = 0, j = 0; index < length; index++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === void 0 || nibbleRight === void 0) {
      throw new BaseError$2(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function numberToBytes(value, opts) {
  const hex = numberToHex(value, opts);
  return hexToBytes(hex);
}
function stringToBytes(value, opts = {}) {
  const bytes = encoder.encode(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad$1(bytes, { dir: "right", size: opts.size });
  }
  return bytes;
}
function assertSize(hexOrBytes, { size: size$1 }) {
  if (size(hexOrBytes) > size$1)
    throw new SizeOverflowError({
      givenSize: size(hexOrBytes),
      maxSize: size$1
    });
}
function hexToBigInt(hex, opts = {}) {
  const { signed } = opts;
  if (opts.size)
    assertSize(hex, { size: opts.size });
  const value = BigInt(hex);
  if (!signed)
    return value;
  const size2 = (hex.length - 2) / 2;
  const max = (1n << BigInt(size2) * 8n - 1n) - 1n;
  if (value <= max)
    return value;
  return value - BigInt(`0x${"f".padStart(size2 * 2, "f")}`) - 1n;
}
function hexToNumber(hex, opts = {}) {
  return Number(hexToBigInt(hex, opts));
}
function defineFormatter(type2, format) {
  return ({ exclude, format: overrides }) => {
    return {
      exclude,
      format: (args, action) => {
        const formatted = format(args, action);
        if (exclude) {
          for (const key of exclude) {
            delete formatted[key];
          }
        }
        return {
          ...formatted,
          ...overrides(args, action)
        };
      },
      type: type2
    };
  };
}
const transactionType = {
  "0x0": "legacy",
  "0x1": "eip2930",
  "0x2": "eip1559",
  "0x3": "eip4844",
  "0x4": "eip7702"
};
function formatTransaction(transaction, _) {
  const transaction_ = {
    ...transaction,
    blockHash: transaction.blockHash ? transaction.blockHash : null,
    blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
    chainId: transaction.chainId ? hexToNumber(transaction.chainId) : void 0,
    gas: transaction.gas ? BigInt(transaction.gas) : void 0,
    gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : void 0,
    maxFeePerBlobGas: transaction.maxFeePerBlobGas ? BigInt(transaction.maxFeePerBlobGas) : void 0,
    maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : void 0,
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : void 0,
    nonce: transaction.nonce ? hexToNumber(transaction.nonce) : void 0,
    to: transaction.to ? transaction.to : null,
    transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
    type: transaction.type ? transactionType[transaction.type] : void 0,
    typeHex: transaction.type ? transaction.type : void 0,
    value: transaction.value ? BigInt(transaction.value) : void 0,
    v: transaction.v ? BigInt(transaction.v) : void 0
  };
  if (transaction.authorizationList)
    transaction_.authorizationList = formatAuthorizationList$1(transaction.authorizationList);
  transaction_.yParity = (() => {
    if (transaction.yParity)
      return Number(transaction.yParity);
    if (typeof transaction_.v === "bigint") {
      if (transaction_.v === 0n || transaction_.v === 27n)
        return 0;
      if (transaction_.v === 1n || transaction_.v === 28n)
        return 1;
      if (transaction_.v >= 35n)
        return transaction_.v % 2n === 0n ? 1 : 0;
    }
    return void 0;
  })();
  if (transaction_.type === "legacy") {
    delete transaction_.accessList;
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
    delete transaction_.yParity;
  }
  if (transaction_.type === "eip2930") {
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
  }
  if (transaction_.type === "eip1559") {
    delete transaction_.maxFeePerBlobGas;
  }
  return transaction_;
}
const defineTransaction = /* @__PURE__ */ defineFormatter("transaction", formatTransaction);
function formatAuthorizationList$1(authorizationList) {
  return authorizationList.map((authorization) => ({
    address: authorization.address,
    chainId: Number(authorization.chainId),
    nonce: Number(authorization.nonce),
    r: authorization.r,
    s: authorization.s,
    yParity: Number(authorization.yParity)
  }));
}
function formatBlock(block, _) {
  const transactions = (block.transactions ?? []).map((transaction) => {
    if (typeof transaction === "string")
      return transaction;
    return formatTransaction(transaction);
  });
  return {
    ...block,
    baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
    blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : void 0,
    difficulty: block.difficulty ? BigInt(block.difficulty) : void 0,
    excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : void 0,
    gasLimit: block.gasLimit ? BigInt(block.gasLimit) : void 0,
    gasUsed: block.gasUsed ? BigInt(block.gasUsed) : void 0,
    hash: block.hash ? block.hash : null,
    logsBloom: block.logsBloom ? block.logsBloom : null,
    nonce: block.nonce ? block.nonce : null,
    number: block.number ? BigInt(block.number) : null,
    size: block.size ? BigInt(block.size) : void 0,
    timestamp: block.timestamp ? BigInt(block.timestamp) : void 0,
    transactions,
    totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
  };
}
const defineBlock = /* @__PURE__ */ defineFormatter("block", formatBlock);
function formatLog(log, { args, eventName } = {}) {
  return {
    ...log,
    blockHash: log.blockHash ? log.blockHash : null,
    blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
    logIndex: log.logIndex ? Number(log.logIndex) : null,
    transactionHash: log.transactionHash ? log.transactionHash : null,
    transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
    ...eventName ? { args, eventName } : {}
  };
}
const receiptStatuses = {
  "0x0": "reverted",
  "0x1": "success"
};
function formatTransactionReceipt(transactionReceipt, _) {
  const receipt = {
    ...transactionReceipt,
    blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
    contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
    cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
    effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
    gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
    logs: transactionReceipt.logs ? transactionReceipt.logs.map((log) => formatLog(log)) : null,
    to: transactionReceipt.to ? transactionReceipt.to : null,
    transactionIndex: transactionReceipt.transactionIndex ? hexToNumber(transactionReceipt.transactionIndex) : null,
    status: transactionReceipt.status ? receiptStatuses[transactionReceipt.status] : null,
    type: transactionReceipt.type ? transactionType[transactionReceipt.type] || transactionReceipt.type : null
  };
  if (transactionReceipt.blobGasPrice)
    receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
  if (transactionReceipt.blobGasUsed)
    receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
  return receipt;
}
const defineTransactionReceipt = /* @__PURE__ */ defineFormatter("transactionReceipt", formatTransactionReceipt);
const rpcTransactionType = {
  legacy: "0x0",
  eip2930: "0x1",
  eip1559: "0x2",
  eip4844: "0x3",
  eip7702: "0x4"
};
function formatTransactionRequest(request, _) {
  const rpcRequest = {};
  if (typeof request.authorizationList !== "undefined")
    rpcRequest.authorizationList = formatAuthorizationList(request.authorizationList);
  if (typeof request.accessList !== "undefined")
    rpcRequest.accessList = request.accessList;
  if (typeof request.blobVersionedHashes !== "undefined")
    rpcRequest.blobVersionedHashes = request.blobVersionedHashes;
  if (typeof request.blobs !== "undefined") {
    if (typeof request.blobs[0] !== "string")
      rpcRequest.blobs = request.blobs.map((x) => bytesToHex$1(x));
    else
      rpcRequest.blobs = request.blobs;
  }
  if (typeof request.data !== "undefined")
    rpcRequest.data = request.data;
  if (request.account)
    rpcRequest.from = request.account.address;
  if (typeof request.from !== "undefined")
    rpcRequest.from = request.from;
  if (typeof request.gas !== "undefined")
    rpcRequest.gas = numberToHex(request.gas);
  if (typeof request.gasPrice !== "undefined")
    rpcRequest.gasPrice = numberToHex(request.gasPrice);
  if (typeof request.maxFeePerBlobGas !== "undefined")
    rpcRequest.maxFeePerBlobGas = numberToHex(request.maxFeePerBlobGas);
  if (typeof request.maxFeePerGas !== "undefined")
    rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
  if (typeof request.maxPriorityFeePerGas !== "undefined")
    rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
  if (typeof request.nonce !== "undefined")
    rpcRequest.nonce = numberToHex(request.nonce);
  if (typeof request.to !== "undefined")
    rpcRequest.to = request.to;
  if (typeof request.type !== "undefined")
    rpcRequest.type = rpcTransactionType[request.type];
  if (typeof request.value !== "undefined")
    rpcRequest.value = numberToHex(request.value);
  return rpcRequest;
}
function formatAuthorizationList(authorizationList) {
  return authorizationList.map((authorization) => ({
    address: authorization.address,
    r: authorization.r ? numberToHex(BigInt(authorization.r)) : authorization.r,
    s: authorization.s ? numberToHex(BigInt(authorization.s)) : authorization.s,
    chainId: numberToHex(authorization.chainId),
    nonce: numberToHex(authorization.nonce),
    ...typeof authorization.yParity !== "undefined" ? { yParity: numberToHex(authorization.yParity) } : {},
    ...typeof authorization.v !== "undefined" && typeof authorization.yParity === "undefined" ? { v: numberToHex(authorization.v) } : {}
  }));
}
const maxUint256 = 2n ** 256n - 1n;
function concat(values) {
  if (typeof values[0] === "string")
    return concatHex(values);
  return concatBytes$1(values);
}
function concatBytes$1(values) {
  let length = 0;
  for (const arr of values) {
    length += arr.length;
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of values) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function concatHex(values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
class NegativeOffsetError extends BaseError$2 {
  constructor({ offset }) {
    super(`Offset \`${offset}\` cannot be negative.`, {
      name: "NegativeOffsetError"
    });
  }
}
class PositionOutOfBoundsError extends BaseError$2 {
  constructor({ length, position }) {
    super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
  }
}
class RecursiveReadLimitExceededError extends BaseError$2 {
  constructor({ count, limit }) {
    super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
  }
}
const staticCursor = {
  bytes: new Uint8Array(),
  dataView: new DataView(new ArrayBuffer(0)),
  position: 0,
  positionReadCount: /* @__PURE__ */ new Map(),
  recursiveReadCount: 0,
  recursiveReadLimit: Number.POSITIVE_INFINITY,
  assertReadLimit() {
    if (this.recursiveReadCount >= this.recursiveReadLimit)
      throw new RecursiveReadLimitExceededError({
        count: this.recursiveReadCount + 1,
        limit: this.recursiveReadLimit
      });
  },
  assertPosition(position) {
    if (position < 0 || position > this.bytes.length - 1)
      throw new PositionOutOfBoundsError({
        length: this.bytes.length,
        position
      });
  },
  decrementPosition(offset) {
    if (offset < 0)
      throw new NegativeOffsetError({ offset });
    const position = this.position - offset;
    this.assertPosition(position);
    this.position = position;
  },
  getReadCount(position) {
    return this.positionReadCount.get(position || this.position) || 0;
  },
  incrementPosition(offset) {
    if (offset < 0)
      throw new NegativeOffsetError({ offset });
    const position = this.position + offset;
    this.assertPosition(position);
    this.position = position;
  },
  inspectByte(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position);
    return this.bytes[position];
  },
  inspectBytes(length, position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + length - 1);
    return this.bytes.subarray(position, position + length);
  },
  inspectUint8(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position);
    return this.bytes[position];
  },
  inspectUint16(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 1);
    return this.dataView.getUint16(position);
  },
  inspectUint24(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 2);
    return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
  },
  inspectUint32(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 3);
    return this.dataView.getUint32(position);
  },
  pushByte(byte) {
    this.assertPosition(this.position);
    this.bytes[this.position] = byte;
    this.position++;
  },
  pushBytes(bytes) {
    this.assertPosition(this.position + bytes.length - 1);
    this.bytes.set(bytes, this.position);
    this.position += bytes.length;
  },
  pushUint8(value) {
    this.assertPosition(this.position);
    this.bytes[this.position] = value;
    this.position++;
  },
  pushUint16(value) {
    this.assertPosition(this.position + 1);
    this.dataView.setUint16(this.position, value);
    this.position += 2;
  },
  pushUint24(value) {
    this.assertPosition(this.position + 2);
    this.dataView.setUint16(this.position, value >> 8);
    this.dataView.setUint8(this.position + 2, value & 255);
    this.position += 3;
  },
  pushUint32(value) {
    this.assertPosition(this.position + 3);
    this.dataView.setUint32(this.position, value);
    this.position += 4;
  },
  readByte() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectByte();
    this.position++;
    return value;
  },
  readBytes(length, size2) {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectBytes(length);
    this.position += size2 ?? length;
    return value;
  },
  readUint8() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint8();
    this.position += 1;
    return value;
  },
  readUint16() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint16();
    this.position += 2;
    return value;
  },
  readUint24() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint24();
    this.position += 3;
    return value;
  },
  readUint32() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint32();
    this.position += 4;
    return value;
  },
  get remaining() {
    return this.bytes.length - this.position;
  },
  setPosition(position) {
    const oldPosition = this.position;
    this.assertPosition(position);
    this.position = position;
    return () => this.position = oldPosition;
  },
  _touch() {
    if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
      return;
    const count = this.getReadCount();
    this.positionReadCount.set(this.position, count + 1);
    if (count > 0)
      this.recursiveReadCount++;
  }
};
function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
  const cursor = Object.create(staticCursor);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = /* @__PURE__ */ new Map();
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}
function toRlp(bytes, to = "hex") {
  const encodable = getEncodable(bytes);
  const cursor = createCursor(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (to === "hex")
    return bytesToHex$1(cursor.bytes);
  return cursor.bytes;
}
function getEncodable(bytes) {
  if (Array.isArray(bytes))
    return getEncodableList(bytes.map((x) => getEncodable(x)));
  return getEncodableBytes(bytes);
}
function getEncodableList(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength(bodyLength);
  const length = (() => {
    if (bodyLength <= 55)
      return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(192 + bodyLength);
      } else {
        cursor.pushByte(192 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1)
          cursor.pushUint8(bodyLength);
        else if (sizeOfBodyLength === 2)
          cursor.pushUint16(bodyLength);
        else if (sizeOfBodyLength === 3)
          cursor.pushUint24(bodyLength);
        else
          cursor.pushUint32(bodyLength);
      }
      for (const { encode: encode3 } of list) {
        encode3(cursor);
      }
    }
  };
}
function getEncodableBytes(bytesOrHex) {
  const bytes = typeof bytesOrHex === "string" ? hexToBytes(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 128)
      return 1;
    if (bytes.length <= 55)
      return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 128) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(128 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(128 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1)
          cursor.pushUint8(bytes.length);
        else if (sizeOfBytesLength === 2)
          cursor.pushUint16(bytes.length);
        else if (sizeOfBytesLength === 3)
          cursor.pushUint24(bytes.length);
        else
          cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
function getSizeOfLength(length) {
  if (length < 2 ** 8)
    return 1;
  if (length < 2 ** 16)
    return 2;
  if (length < 2 ** 24)
    return 3;
  if (length < 2 ** 32)
    return 4;
  throw new BaseError$2("Length is too large.");
}
const etherUnits = {
  gwei: 9,
  wei: 18
};
const gweiUnits = {
  ether: -9,
  wei: 9
};
function formatUnits(value, decimals) {
  let display = value.toString();
  const negative = display.startsWith("-");
  if (negative)
    display = display.slice(1);
  display = display.padStart(decimals, "0");
  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals)
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
}
function formatEther(wei, unit = "wei") {
  return formatUnits(wei, etherUnits[unit]);
}
function formatGwei(wei, unit = "wei") {
  return formatUnits(wei, gweiUnits[unit]);
}
function prettyPrint(args) {
  const entries = Object.entries(args).map(([key, value]) => {
    if (value === void 0 || value === false)
      return null;
    return [key, value];
  }).filter(Boolean);
  const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
  return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
}
class FeeConflictError extends BaseError$2 {
  constructor() {
    super([
      "Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.",
      "Use `maxFeePerGas`/`maxPriorityFeePerGas` for EIP-1559 compatible networks, and `gasPrice` for others."
    ].join("\n"), { name: "FeeConflictError" });
  }
}
class InvalidLegacyVError extends BaseError$2 {
  constructor({ v }) {
    super(`Invalid \`v\` value "${v}". Expected 27 or 28.`, {
      name: "InvalidLegacyVError"
    });
  }
}
class InvalidSerializableTransactionError extends BaseError$2 {
  constructor({ transaction }) {
    super("Cannot infer a transaction type from provided transaction.", {
      metaMessages: [
        "Provided Transaction:",
        "{",
        prettyPrint(transaction),
        "}",
        "",
        "To infer the type, either provide:",
        "- a `type` to the Transaction, or",
        "- an EIP-1559 Transaction with `maxFeePerGas`, or",
        "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
        "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
        "- an EIP-7702 Transaction with `authorizationList`, or",
        "- a Legacy Transaction with `gasPrice`"
      ],
      name: "InvalidSerializableTransactionError"
    });
  }
}
class InvalidStorageKeySizeError extends BaseError$2 {
  constructor({ storageKey }) {
    super(`Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor((storageKey.length - 2) / 2)} bytes.`, { name: "InvalidStorageKeySizeError" });
  }
}
function serializeAuthorizationList(authorizationList) {
  if (!authorizationList || authorizationList.length === 0)
    return [];
  const serializedAuthorizationList = [];
  for (const authorization of authorizationList) {
    const { chainId, nonce, ...signature } = authorization;
    const contractAddress = authorization.address;
    serializedAuthorizationList.push([
      chainId ? toHex(chainId) : "0x",
      contractAddress,
      nonce ? toHex(nonce) : "0x",
      ...toYParitySignatureArray({}, signature)
    ]);
  }
  return serializedAuthorizationList;
}
function blobsToCommitments(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = [];
  for (const blob of blobs)
    commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
  return to === "bytes" ? commitments : commitments.map((x) => bytesToHex$1(x));
}
function blobsToProofs(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes(x)) : parameters.commitments;
  const proofs = [];
  for (let i2 = 0; i2 < blobs.length; i2++) {
    const blob = blobs[i2];
    const commitment = commitments[i2];
    proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
  }
  return to === "bytes" ? proofs : proofs.map((x) => bytesToHex$1(x));
}
const crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i2 = 0; i2 < arrays.length; i2++) {
    arrays[i2].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
const isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i2 = 0; i2 < arr.length; i2++) {
    arr[i2] = byteSwap(arr[i2]);
  }
  return arr;
}
const swap32IfBE = isLE ? (u) => u : byteSwap32;
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i2 = 0, pad2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}
class Hash {
}
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto && typeof crypto.getRandomValues === "function") {
    return crypto.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto && typeof crypto.randomBytes === "function") {
    return Uint8Array.from(crypto.randomBytes(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
class HashMD extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    data = toBytes(data);
    abytes(data);
    const { view, buffer: buffer2, blockLen } = this;
    const len2 = data.length;
    for (let pos = 0; pos < len2; ) {
      const take = Math.min(blockLen - this.pos, len2 - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len2 - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer2.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer: buffer2, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer2[pos++] = 128;
    clean(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer2[i2] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len2 = this.outputLen;
    if (len2 % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len2 / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state[i2], isLE2);
  }
  digest() {
    const { buffer: buffer2, outputLen } = this;
    this.digestInto(buffer2);
    const res = buffer2.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen)
      to.buffer.set(buffer2);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
}
const SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len2 = lst.length;
  let Ah = new Uint32Array(len2);
  let Al = new Uint32Array(len2);
  for (let i2 = 0; i2 < len2; i2++) {
    const { h, l } = fromBig(lst[i2], le);
    [Ah[i2], Al[i2]] = [h, l];
  }
  return [Ah, Al];
}
const rotlSH = (h, l, s) => h << s | l >>> 32 - s;
const rotlSL = (h, l, s) => l << s | h >>> 32 - s;
const rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
const rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
const SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
class SHA256 extends HashMD {
  constructor(outputLen = 32) {
    super(64, outputLen, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W[i2 - 15];
      const W2 = SHA256_W[i2 - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i2] = s1 + SHA256_W[i2 - 7] + s0 + SHA256_W[i2 - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i2] + SHA256_W[i2] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
}
const sha256$3 = /* @__PURE__ */ createHasher(() => new SHA256());
const sha256$2 = sha256$3;
function sha256$1(value, to_) {
  const bytes = sha256$2(isHex(value, { strict: false }) ? toBytes$1(value) : value);
  return bytes;
}
function commitmentToVersionedHash(parameters) {
  const { commitment, version: version2 = 1 } = parameters;
  const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
  const versionedHash = sha256$1(commitment);
  versionedHash.set([version2], 0);
  return to === "bytes" ? versionedHash : bytesToHex$1(versionedHash);
}
function commitmentsToVersionedHashes(parameters) {
  const { commitments, version: version2 } = parameters;
  const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
  const hashes = [];
  for (const commitment of commitments) {
    hashes.push(commitmentToVersionedHash({
      commitment,
      to,
      version: version2
    }));
  }
  return hashes;
}
const blobsPerTransaction = 6;
const bytesPerFieldElement = 32;
const fieldElementsPerBlob = 4096;
const bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
const maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - // terminator byte (0x80).
1 - // zero byte (0x00) appended to each field element.
1 * fieldElementsPerBlob * blobsPerTransaction;
const versionedHashVersionKzg = 1;
class BlobSizeTooLargeError extends BaseError$2 {
  constructor({ maxSize, size: size2 }) {
    super("Blob size is too large.", {
      metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size2} bytes`],
      name: "BlobSizeTooLargeError"
    });
  }
}
class EmptyBlobError extends BaseError$2 {
  constructor() {
    super("Blob data must not be empty.", { name: "EmptyBlobError" });
  }
}
class InvalidVersionedHashSizeError extends BaseError$2 {
  constructor({ hash: hash2, size: size2 }) {
    super(`Versioned hash "${hash2}" size is invalid.`, {
      metaMessages: ["Expected: 32", `Received: ${size2}`],
      name: "InvalidVersionedHashSizeError"
    });
  }
}
class InvalidVersionedHashVersionError extends BaseError$2 {
  constructor({ hash: hash2, version: version2 }) {
    super(`Versioned hash "${hash2}" version is invalid.`, {
      metaMessages: [
        `Expected: ${versionedHashVersionKzg}`,
        `Received: ${version2}`
      ],
      name: "InvalidVersionedHashVersionError"
    });
  }
}
function toBlobs(parameters) {
  const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
  const data = typeof parameters.data === "string" ? hexToBytes(parameters.data) : parameters.data;
  const size_ = size(data);
  if (!size_)
    throw new EmptyBlobError();
  if (size_ > maxBytesPerTransaction)
    throw new BlobSizeTooLargeError({
      maxSize: maxBytesPerTransaction,
      size: size_
    });
  const blobs = [];
  let active = true;
  let position = 0;
  while (active) {
    const blob = createCursor(new Uint8Array(bytesPerBlob));
    let size2 = 0;
    while (size2 < fieldElementsPerBlob) {
      const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
      blob.pushByte(0);
      blob.pushBytes(bytes);
      if (bytes.length < 31) {
        blob.pushByte(128);
        active = false;
        break;
      }
      size2++;
      position += 31;
    }
    blobs.push(blob);
  }
  return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex$1(x.bytes));
}
function toBlobSidecars(parameters) {
  const { data, kzg, to } = parameters;
  const blobs = parameters.blobs ?? toBlobs({ data, to });
  const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg, to });
  const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg, to });
  const sidecars = [];
  for (let i2 = 0; i2 < blobs.length; i2++)
    sidecars.push({
      blob: blobs[i2],
      commitment: commitments[i2],
      proof: proofs[i2]
    });
  return sidecars;
}
class InvalidAddressError extends BaseError$2 {
  constructor({ address }) {
    super(`Address "${address}" is invalid.`, {
      metaMessages: [
        "- Address must be a hex value of 20 bytes (40 hex characters).",
        "- Address must match its checksum counterpart."
      ],
      name: "InvalidAddressError"
    });
  }
}
class ChainDoesNotSupportContract extends BaseError$2 {
  constructor({ blockNumber, chain, contract }) {
    super(`Chain "${chain.name}" does not support contract "${contract.name}".`, {
      metaMessages: [
        "This could be due to any of the following:",
        ...blockNumber && contract.blockCreated && contract.blockCreated > blockNumber ? [
          `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`
        ] : [
          `- The chain does not have the contract "${contract.name}" configured.`
        ]
      ],
      name: "ChainDoesNotSupportContract"
    });
  }
}
class ClientChainNotConfiguredError extends BaseError$2 {
  constructor() {
    super("No chain was provided to the Client.", {
      name: "ClientChainNotConfiguredError"
    });
  }
}
class InvalidChainIdError extends BaseError$2 {
  constructor({ chainId }) {
    super(typeof chainId === "number" ? `Chain ID "${chainId}" is invalid.` : "Chain ID is invalid.", { name: "InvalidChainIdError" });
  }
}
let ExecutionRevertedError$1 = class ExecutionRevertedError2 extends BaseError$2 {
  constructor({ cause, message: message2 } = {}) {
    const reason = message2?.replace("execution reverted: ", "")?.replace("execution reverted", "");
    super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
      cause,
      name: "ExecutionRevertedError"
    });
  }
};
Object.defineProperty(ExecutionRevertedError$1, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 3
});
Object.defineProperty(ExecutionRevertedError$1, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /execution reverted/
});
class FeeCapTooHighError extends BaseError$2 {
  constructor({ cause, maxFeePerGas } = {}) {
    super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
      cause,
      name: "FeeCapTooHighError"
    });
  }
}
Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
});
class FeeCapTooLowError extends BaseError$2 {
  constructor({ cause, maxFeePerGas } = {}) {
    super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
      cause,
      name: "FeeCapTooLowError"
    });
  }
}
Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
});
class NonceTooHighError extends BaseError$2 {
  constructor({ cause, nonce } = {}) {
    super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, { cause, name: "NonceTooHighError" });
  }
}
Object.defineProperty(NonceTooHighError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /nonce too high/
});
class NonceTooLowError extends BaseError$2 {
  constructor({ cause, nonce } = {}) {
    super([
      `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
      "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
    ].join("\n"), { cause, name: "NonceTooLowError" });
  }
}
Object.defineProperty(NonceTooLowError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /nonce too low|transaction already imported|already known/
});
class NonceMaxValueError extends BaseError$2 {
  constructor({ cause, nonce } = {}) {
    super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, { cause, name: "NonceMaxValueError" });
  }
}
Object.defineProperty(NonceMaxValueError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /nonce has max value/
});
class InsufficientFundsError extends BaseError$2 {
  constructor({ cause } = {}) {
    super([
      "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
    ].join("\n"), {
      cause,
      metaMessages: [
        "This error could arise when the account does not have enough funds to:",
        " - pay for the total gas fee,",
        " - pay for the value to send.",
        " ",
        "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
        " - `gas` is the amount of gas needed for transaction to execute,",
        " - `gas fee` is the gas fee,",
        " - `value` is the amount of ether to send to the recipient."
      ],
      name: "InsufficientFundsError"
    });
  }
}
Object.defineProperty(InsufficientFundsError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /insufficient funds|exceeds transaction sender account balance/
});
class IntrinsicGasTooHighError extends BaseError$2 {
  constructor({ cause, gas } = {}) {
    super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
      cause,
      name: "IntrinsicGasTooHighError"
    });
  }
}
Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /intrinsic gas too high|gas limit reached/
});
class IntrinsicGasTooLowError extends BaseError$2 {
  constructor({ cause, gas } = {}) {
    super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
      cause,
      name: "IntrinsicGasTooLowError"
    });
  }
}
Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /intrinsic gas too low/
});
class TransactionTypeNotSupportedError extends BaseError$2 {
  constructor({ cause }) {
    super("The transaction type is not supported for this chain.", {
      cause,
      name: "TransactionTypeNotSupportedError"
    });
  }
}
Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /transaction type not valid/
});
class TipAboveFeeCapError extends BaseError$2 {
  constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
    super([
      `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}).`
    ].join("\n"), {
      cause,
      name: "TipAboveFeeCapError"
    });
  }
}
Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
});
class UnknownNodeError extends BaseError$2 {
  constructor({ cause }) {
    super(`An error occurred while executing: ${cause?.shortMessage}`, {
      cause,
      name: "UnknownNodeError"
    });
  }
}
class LruMap extends Map {
  constructor(size2) {
    super();
    Object.defineProperty(this, "maxSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.maxSize = size2;
  }
  get(key) {
    const value = super.get(key);
    if (super.has(key) && value !== void 0) {
      this.delete(key);
      super.set(key, value);
    }
    return value;
  }
  set(key, value) {
    super.set(key, value);
    if (this.maxSize && this.size > this.maxSize) {
      const firstKey = this.keys().next().value;
      if (firstKey)
        this.delete(firstKey);
    }
    return this;
  }
}
const _0n = BigInt(0);
const _1n = BigInt(1);
const _2n = BigInt(2);
const _7n = BigInt(7);
const _256n = BigInt(256);
const _0x71n = BigInt(113);
const SHA3_PI = [];
const SHA3_ROTL = [];
const _SHA3_IOTA = [];
for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
  [x, y] = [y, (2 * x + 3 * y) % 5];
  SHA3_PI.push(2 * (5 * y + x));
  SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
  let t = _0n;
  for (let j = 0; j < 7; j++) {
    R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
    if (R & _2n)
      t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
  }
  _SHA3_IOTA.push(t);
}
const IOTAS = split(_SHA3_IOTA, true);
const SHA3_IOTA_H = IOTAS[0];
const SHA3_IOTA_L = IOTAS[1];
const rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
const rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds; round < 24; round++) {
    for (let x = 0; x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0; y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0; y < 50; y += 10) {
      for (let x = 0; x < 10; x++)
        B[x] = s[y + x];
      for (let x = 0; x < 10; x++)
        s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  clean(B);
}
class Keccak extends Hash {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
    super();
    this.pos = 0;
    this.posOut = 0;
    this.finished = false;
    this.destroyed = false;
    this.enableXOF = false;
    this.blockLen = blockLen;
    this.suffix = suffix;
    this.outputLen = outputLen;
    this.enableXOF = enableXOF;
    this.rounds = rounds;
    anumber(outputLen);
    if (!(0 < blockLen && blockLen < 200))
      throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200);
    this.state32 = u32(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    swap32IfBE(this.state32);
    keccakP(this.state32, this.rounds);
    swap32IfBE(this.state32);
    this.posOut = 0;
    this.pos = 0;
  }
  update(data) {
    aexists(this);
    data = toBytes(data);
    abytes(data);
    const { blockLen, state } = this;
    const len2 = data.length;
    for (let pos = 0; pos < len2; ) {
      const take = Math.min(blockLen - this.pos, len2 - pos);
      for (let i2 = 0; i2 < take; i2++)
        state[this.pos++] ^= data[pos++];
      if (this.pos === blockLen)
        this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = true;
    const { state, suffix, pos, blockLen } = this;
    state[pos] ^= suffix;
    if ((suffix & 128) !== 0 && pos === blockLen - 1)
      this.keccak();
    state[blockLen - 1] ^= 128;
    this.keccak();
  }
  writeInto(out) {
    aexists(this, false);
    abytes(out);
    this.finish();
    const bufferOut = this.state;
    const { blockLen } = this;
    for (let pos = 0, len2 = out.length; pos < len2; ) {
      if (this.posOut >= blockLen)
        this.keccak();
      const take = Math.min(blockLen - this.posOut, len2 - pos);
      out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
      this.posOut += take;
      pos += take;
    }
    return out;
  }
  xofInto(out) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(out);
  }
  xof(bytes) {
    anumber(bytes);
    return this.xofInto(new Uint8Array(bytes));
  }
  digestInto(out) {
    aoutput(out, this);
    if (this.finished)
      throw new Error("digest() was already called");
    this.writeInto(out);
    this.destroy();
    return out;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = true;
    clean(this.state);
  }
  _cloneInto(to) {
    const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
    to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
    to.state32.set(this.state32);
    to.pos = this.pos;
    to.posOut = this.posOut;
    to.finished = this.finished;
    to.rounds = rounds;
    to.suffix = suffix;
    to.outputLen = outputLen;
    to.enableXOF = enableXOF;
    to.destroyed = this.destroyed;
    return to;
  }
}
const gen = (suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen));
const keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();
function keccak256(value, to_) {
  const to = to_ || "hex";
  const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes$1(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}
const checksumAddressCache = /* @__PURE__ */ new LruMap(8192);
function checksumAddress(address_, chainId) {
  if (checksumAddressCache.has(`${address_}.${chainId}`))
    return checksumAddressCache.get(`${address_}.${chainId}`);
  const hexAddress = address_.substring(2).toLowerCase();
  const hash2 = keccak256(stringToBytes(hexAddress), "bytes");
  const address = hexAddress.split("");
  for (let i2 = 0; i2 < 40; i2 += 2) {
    if (hash2[i2 >> 1] >> 4 >= 8 && address[i2]) {
      address[i2] = address[i2].toUpperCase();
    }
    if ((hash2[i2 >> 1] & 15) >= 8 && address[i2 + 1]) {
      address[i2 + 1] = address[i2 + 1].toUpperCase();
    }
  }
  const result = `0x${address.join("")}`;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
  return result;
}
function getAddress(address, chainId) {
  if (!isAddress(address, { strict: false }))
    throw new InvalidAddressError({ address });
  return checksumAddress(address, chainId);
}
const addressRegex = /^0x[a-fA-F0-9]{40}$/;
const isAddressCache = /* @__PURE__ */ new LruMap(8192);
function isAddress(address, options) {
  const { strict = true } = options ?? {};
  const cacheKey = `${address}.${strict}`;
  if (isAddressCache.has(cacheKey))
    return isAddressCache.get(cacheKey);
  const result = (() => {
    if (!addressRegex.test(address))
      return false;
    if (address.toLowerCase() === address)
      return true;
    if (strict)
      return checksumAddress(address) === address;
    return true;
  })();
  isAddressCache.set(cacheKey, result);
  return result;
}
function slice(value, start, end2, { strict } = {}) {
  if (isHex(value, { strict: false }))
    return sliceHex(value, start, end2, {
      strict
    });
  return sliceBytes(value, start, end2, {
    strict
  });
}
function assertStartOffset(value, start) {
  if (typeof start === "number" && start > 0 && start > size(value) - 1)
    throw new SliceOffsetOutOfBoundsError({
      offset: start,
      position: "start",
      size: size(value)
    });
}
function assertEndOffset(value, start, end2) {
  if (typeof start === "number" && typeof end2 === "number" && size(value) !== end2 - start) {
    throw new SliceOffsetOutOfBoundsError({
      offset: end2,
      position: "end",
      size: size(value)
    });
  }
}
function sliceBytes(value_, start, end2, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = value_.slice(start, end2);
  if (strict)
    assertEndOffset(value, start, end2);
  return value;
}
function sliceHex(value_, start, end2, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end2 ?? value_.length) * 2)}`;
  if (strict)
    assertEndOffset(value, start, end2);
  return value;
}
function assertTransactionEIP7702(transaction) {
  const { authorizationList } = transaction;
  if (authorizationList) {
    for (const authorization of authorizationList) {
      const { chainId } = authorization;
      const address = authorization.address;
      if (!isAddress(address))
        throw new InvalidAddressError({ address });
      if (chainId < 0)
        throw new InvalidChainIdError({ chainId });
    }
  }
  assertTransactionEIP1559(transaction);
}
function assertTransactionEIP4844(transaction) {
  const { blobVersionedHashes } = transaction;
  if (blobVersionedHashes) {
    if (blobVersionedHashes.length === 0)
      throw new EmptyBlobError();
    for (const hash2 of blobVersionedHashes) {
      const size_ = size(hash2);
      const version2 = hexToNumber(slice(hash2, 0, 1));
      if (size_ !== 32)
        throw new InvalidVersionedHashSizeError({ hash: hash2, size: size_ });
      if (version2 !== versionedHashVersionKzg)
        throw new InvalidVersionedHashVersionError({
          hash: hash2,
          version: version2
        });
    }
  }
  assertTransactionEIP1559(transaction);
}
function assertTransactionEIP1559(transaction) {
  const { chainId, maxPriorityFeePerGas, maxFeePerGas, to } = transaction;
  if (chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (maxFeePerGas && maxFeePerGas > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
function assertTransactionEIP2930(transaction) {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
  if (chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (maxPriorityFeePerGas || maxFeePerGas)
    throw new BaseError$2("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.");
  if (gasPrice && gasPrice > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}
function assertTransactionLegacy(transaction) {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (typeof chainId !== "undefined" && chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (maxPriorityFeePerGas || maxFeePerGas)
    throw new BaseError$2("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.");
  if (gasPrice && gasPrice > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}
function getTransactionType(transaction) {
  if (transaction.type)
    return transaction.type;
  if (typeof transaction.authorizationList !== "undefined")
    return "eip7702";
  if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined")
    return "eip4844";
  if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") {
    return "eip1559";
  }
  if (typeof transaction.gasPrice !== "undefined") {
    if (typeof transaction.accessList !== "undefined")
      return "eip2930";
    return "legacy";
  }
  throw new InvalidSerializableTransactionError({ transaction });
}
function serializeAccessList(accessList) {
  if (!accessList || accessList.length === 0)
    return [];
  const serializedAccessList = [];
  for (let i2 = 0; i2 < accessList.length; i2++) {
    const { address, storageKeys } = accessList[i2];
    for (let j = 0; j < storageKeys.length; j++) {
      if (storageKeys[j].length - 2 !== 64) {
        throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] });
      }
    }
    if (!isAddress(address, { strict: false })) {
      throw new InvalidAddressError({ address });
    }
    serializedAccessList.push([address, storageKeys]);
  }
  return serializedAccessList;
}
function serializeTransaction$1(transaction, signature) {
  const type2 = getTransactionType(transaction);
  if (type2 === "eip1559")
    return serializeTransactionEIP1559(transaction, signature);
  if (type2 === "eip2930")
    return serializeTransactionEIP2930(transaction, signature);
  if (type2 === "eip4844")
    return serializeTransactionEIP4844(transaction, signature);
  if (type2 === "eip7702")
    return serializeTransactionEIP7702(transaction, signature);
  return serializeTransactionLegacy(transaction, signature);
}
function serializeTransactionEIP7702(transaction, signature) {
  const { authorizationList, chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP7702(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedAuthorizationList = serializeAuthorizationList(authorizationList);
  return concatHex([
    "0x04",
    toRlp([
      numberToHex(chainId),
      nonce ? numberToHex(nonce) : "0x",
      maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
      maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
      gas ? numberToHex(gas) : "0x",
      to ?? "0x",
      value ? numberToHex(value) : "0x",
      data ?? "0x",
      serializedAccessList,
      serializedAuthorizationList,
      ...toYParitySignatureArray(transaction, signature)
    ])
  ]);
}
function serializeTransactionEIP4844(transaction, signature) {
  const { chainId, gas, nonce, to, value, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP4844(transaction);
  let blobVersionedHashes = transaction.blobVersionedHashes;
  let sidecars = transaction.sidecars;
  if (transaction.blobs && (typeof blobVersionedHashes === "undefined" || typeof sidecars === "undefined")) {
    const blobs2 = typeof transaction.blobs[0] === "string" ? transaction.blobs : transaction.blobs.map((x) => bytesToHex$1(x));
    const kzg = transaction.kzg;
    const commitments2 = blobsToCommitments({
      blobs: blobs2,
      kzg
    });
    if (typeof blobVersionedHashes === "undefined")
      blobVersionedHashes = commitmentsToVersionedHashes({
        commitments: commitments2
      });
    if (typeof sidecars === "undefined") {
      const proofs2 = blobsToProofs({ blobs: blobs2, commitments: commitments2, kzg });
      sidecars = toBlobSidecars({ blobs: blobs2, commitments: commitments2, proofs: proofs2 });
    }
  }
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    maxFeePerBlobGas ? numberToHex(maxFeePerBlobGas) : "0x",
    blobVersionedHashes ?? [],
    ...toYParitySignatureArray(transaction, signature)
  ];
  const blobs = [];
  const commitments = [];
  const proofs = [];
  if (sidecars)
    for (let i2 = 0; i2 < sidecars.length; i2++) {
      const { blob, commitment, proof } = sidecars[i2];
      blobs.push(blob);
      commitments.push(commitment);
      proofs.push(proof);
    }
  return concatHex([
    "0x03",
    sidecars ? (
      // If sidecars are enabled, envelope turns into a "wrapper":
      toRlp([serializedTransaction, blobs, commitments, proofs])
    ) : (
      // If sidecars are disabled, standard envelope is used:
      toRlp(serializedTransaction)
    )
  ]);
}
function serializeTransactionEIP1559(transaction, signature) {
  const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP1559(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    ...toYParitySignatureArray(transaction, signature)
  ];
  return concatHex([
    "0x02",
    toRlp(serializedTransaction)
  ]);
}
function serializeTransactionEIP2930(transaction, signature) {
  const { chainId, gas, data, nonce, to, value, accessList, gasPrice } = transaction;
  assertTransactionEIP2930(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    gasPrice ? numberToHex(gasPrice) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    ...toYParitySignatureArray(transaction, signature)
  ];
  return concatHex([
    "0x01",
    toRlp(serializedTransaction)
  ]);
}
function serializeTransactionLegacy(transaction, signature) {
  const { chainId = 0, gas, data, nonce, to, value, gasPrice } = transaction;
  assertTransactionLegacy(transaction);
  let serializedTransaction = [
    nonce ? numberToHex(nonce) : "0x",
    gasPrice ? numberToHex(gasPrice) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x"
  ];
  if (signature) {
    const v = (() => {
      if (signature.v >= 35n) {
        const inferredChainId = (signature.v - 35n) / 2n;
        if (inferredChainId > 0)
          return signature.v;
        return 27n + (signature.v === 35n ? 0n : 1n);
      }
      if (chainId > 0)
        return BigInt(chainId * 2) + BigInt(35n + signature.v - 27n);
      const v2 = 27n + (signature.v === 27n ? 0n : 1n);
      if (signature.v !== v2)
        throw new InvalidLegacyVError({ v: signature.v });
      return v2;
    })();
    const r = trim$1(signature.r);
    const s = trim$1(signature.s);
    serializedTransaction = [
      ...serializedTransaction,
      numberToHex(v),
      r === "0x00" ? "0x" : r,
      s === "0x00" ? "0x" : s
    ];
  } else if (chainId > 0) {
    serializedTransaction = [
      ...serializedTransaction,
      numberToHex(chainId),
      "0x",
      "0x"
    ];
  }
  return toRlp(serializedTransaction);
}
function toYParitySignatureArray(transaction, signature_) {
  const signature = signature_ ?? transaction;
  const { v, yParity } = signature;
  if (typeof signature.r === "undefined")
    return [];
  if (typeof signature.s === "undefined")
    return [];
  if (typeof v === "undefined" && typeof yParity === "undefined")
    return [];
  const r = trim$1(signature.r);
  const s = trim$1(signature.s);
  const yParity_ = (() => {
    if (typeof yParity === "number")
      return yParity ? numberToHex(1) : "0x";
    if (v === 0n)
      return "0x";
    if (v === 1n)
      return numberToHex(1);
    return v === 27n ? "0x" : numberToHex(1);
  })();
  return [yParity_, r === "0x00" ? "0x" : r, s === "0x00" ? "0x" : s];
}
const contracts = {
  gasPriceOracle: { address: "0x420000000000000000000000000000000000000F" },
  l1Block: { address: "0x4200000000000000000000000000000000000015" },
  l2CrossDomainMessenger: {
    address: "0x4200000000000000000000000000000000000007"
  },
  l2Erc721Bridge: { address: "0x4200000000000000000000000000000000000014" },
  l2StandardBridge: { address: "0x4200000000000000000000000000000000000010" },
  l2ToL1MessagePasser: {
    address: "0x4200000000000000000000000000000000000016"
  }
};
const formatters = {
  block: /* @__PURE__ */ defineBlock({
    format(args) {
      const transactions = args.transactions?.map((transaction) => {
        if (typeof transaction === "string")
          return transaction;
        const formatted = formatTransaction(transaction);
        if (formatted.typeHex === "0x7e") {
          formatted.isSystemTx = transaction.isSystemTx;
          formatted.mint = transaction.mint ? hexToBigInt(transaction.mint) : void 0;
          formatted.sourceHash = transaction.sourceHash;
          formatted.type = "deposit";
        }
        return formatted;
      });
      return {
        transactions,
        stateRoot: args.stateRoot
      };
    }
  }),
  transaction: /* @__PURE__ */ defineTransaction({
    format(args) {
      const transaction = {};
      if (args.type === "0x7e") {
        transaction.isSystemTx = args.isSystemTx;
        transaction.mint = args.mint ? hexToBigInt(args.mint) : void 0;
        transaction.sourceHash = args.sourceHash;
        transaction.type = "deposit";
      }
      return transaction;
    }
  }),
  transactionReceipt: /* @__PURE__ */ defineTransactionReceipt({
    format(args) {
      return {
        l1GasPrice: args.l1GasPrice ? hexToBigInt(args.l1GasPrice) : null,
        l1GasUsed: args.l1GasUsed ? hexToBigInt(args.l1GasUsed) : null,
        l1Fee: args.l1Fee ? hexToBigInt(args.l1Fee) : null,
        l1FeeScalar: args.l1FeeScalar ? Number(args.l1FeeScalar) : null
      };
    }
  })
};
function serializeTransaction(transaction, signature) {
  if (isDeposit(transaction))
    return serializeTransactionDeposit(transaction);
  return serializeTransaction$1(transaction, signature);
}
const serializers = {
  transaction: serializeTransaction
};
function serializeTransactionDeposit(transaction) {
  assertTransactionDeposit(transaction);
  const { sourceHash, data, from, gas, isSystemTx, mint, to, value } = transaction;
  const serializedTransaction = [
    sourceHash,
    from,
    to ?? "0x",
    mint ? toHex(mint) : "0x",
    value ? toHex(value) : "0x",
    gas ? toHex(gas) : "0x",
    isSystemTx ? "0x1" : "0x",
    data ?? "0x"
  ];
  return concatHex([
    "0x7e",
    toRlp(serializedTransaction)
  ]);
}
function isDeposit(transaction) {
  if (transaction.type === "deposit")
    return true;
  if (typeof transaction.sourceHash !== "undefined")
    return true;
  return false;
}
function assertTransactionDeposit(transaction) {
  const { from, to } = transaction;
  if (from && !isAddress(from))
    throw new InvalidAddressError({ address: from });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
}
const chainConfig = {
  blockTime: 2e3,
  contracts,
  formatters,
  serializers
};
const arbitrum$1 = /* @__PURE__ */ defineChain({
  id: 42161,
  name: "Arbitrum One",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockTime: 250,
  rpcUrls: {
    default: {
      http: ["https://arb1.arbitrum.io/rpc"]
    }
  },
  blockExplorers: {
    default: {
      name: "Arbiscan",
      url: "https://arbiscan.io",
      apiUrl: "https://api.arbiscan.io/api"
    }
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 7654707
    }
  }
});
const sourceId$1 = 1;
const base$1 = /* @__PURE__ */ defineChain({
  ...chainConfig,
  id: 8453,
  name: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org"]
    }
  },
  blockExplorers: {
    default: {
      name: "Basescan",
      url: "https://basescan.org",
      apiUrl: "https://api.basescan.org/api"
    }
  },
  contracts: {
    ...chainConfig.contracts,
    disputeGameFactory: {
      [sourceId$1]: {
        address: "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e"
      }
    },
    l2OutputOracle: {
      [sourceId$1]: {
        address: "0x56315b90c40730925ec5485cf004d835058518A0"
      }
    },
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 5022
    },
    portal: {
      [sourceId$1]: {
        address: "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e",
        blockCreated: 17482143
      }
    },
    l1StandardBridge: {
      [sourceId$1]: {
        address: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
        blockCreated: 17482143
      }
    }
  },
  sourceId: sourceId$1
});
function getChainContractAddress({ blockNumber, chain, contract: name }) {
  const contract = chain?.contracts?.[name];
  if (!contract)
    throw new ChainDoesNotSupportContract({
      chain,
      contract: { name }
    });
  if (blockNumber && contract.blockCreated && contract.blockCreated > blockNumber)
    throw new ChainDoesNotSupportContract({
      blockNumber,
      chain,
      contract: {
        name,
        blockCreated: contract.blockCreated
      }
    });
  return contract.address;
}
function parseAccount(account) {
  if (typeof account === "string")
    return { address: account, type: "json-rpc" };
  return account;
}
let AccountNotFoundError$1 = class AccountNotFoundError2 extends BaseError$2 {
  constructor({ docsPath: docsPath2 } = {}) {
    super([
      "Could not find an Account to execute with this Action.",
      "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client."
    ].join("\n"), {
      docsPath: docsPath2,
      docsSlug: "account",
      name: "AccountNotFoundError"
    });
  }
};
class AccountTypeNotSupportedError extends BaseError$2 {
  constructor({ docsPath: docsPath2, metaMessages, type: type2 }) {
    super(`Account type "${type2}" is not supported.`, {
      docsPath: docsPath2,
      metaMessages,
      name: "AccountTypeNotSupportedError"
    });
  }
}
const panicReasons = {
  1: "An `assert` condition failed.",
  17: "Arithmetic operation resulted in underflow or overflow.",
  18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
  33: "Attempted to convert to an invalid type.",
  34: "Attempted to access a storage byte array that is incorrectly encoded.",
  49: "Performed `.pop()` on an empty array",
  50: "Array index is out of bounds.",
  65: "Allocated too much memory or created an array which is too large.",
  81: "Attempted to call a zero-initialized variable of internal function type."
};
const solidityError = {
  inputs: [
    {
      name: "message",
      type: "string"
    }
  ],
  name: "Error",
  type: "error"
};
const solidityPanic = {
  inputs: [
    {
      name: "reason",
      type: "uint256"
    }
  ],
  name: "Panic",
  type: "error"
};
function formatAbiItem$1(abiItem, { includeName = false } = {}) {
  if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
    throw new InvalidDefinitionTypeError(abiItem.type);
  return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
  if (!params)
    return "";
  return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
function formatAbiParam(param, { includeName }) {
  if (param.type.startsWith("tuple")) {
    return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
  }
  return param.type + (includeName && param.name ? ` ${param.name}` : "");
}
class AbiConstructorNotFoundError extends BaseError$2 {
  constructor({ docsPath: docsPath2 }) {
    super([
      "A constructor was not found on the ABI.",
      "Make sure you are using the correct ABI and that the constructor exists on it."
    ].join("\n"), {
      docsPath: docsPath2,
      name: "AbiConstructorNotFoundError"
    });
  }
}
class AbiConstructorParamsNotFoundError extends BaseError$2 {
  constructor({ docsPath: docsPath2 }) {
    super([
      "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
      "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
    ].join("\n"), {
      docsPath: docsPath2,
      name: "AbiConstructorParamsNotFoundError"
    });
  }
}
class AbiDecodingDataSizeTooSmallError extends BaseError$2 {
  constructor({ data, params, size: size2 }) {
    super([`Data size of ${size2} bytes is too small for given parameters.`].join("\n"), {
      metaMessages: [
        `Params: (${formatAbiParams(params, { includeName: true })})`,
        `Data:   ${data} (${size2} bytes)`
      ],
      name: "AbiDecodingDataSizeTooSmallError"
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "params", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = data;
    this.params = params;
    this.size = size2;
  }
}
class AbiDecodingZeroDataError extends BaseError$2 {
  constructor() {
    super('Cannot decode zero data ("0x") with ABI parameters.', {
      name: "AbiDecodingZeroDataError"
    });
  }
}
class AbiEncodingArrayLengthMismatchError extends BaseError$2 {
  constructor({ expectedLength, givenLength, type: type2 }) {
    super([
      `ABI encoding array length mismatch for type ${type2}.`,
      `Expected length: ${expectedLength}`,
      `Given length: ${givenLength}`
    ].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
  }
}
class AbiEncodingBytesSizeMismatchError extends BaseError$2 {
  constructor({ expectedSize, value }) {
    super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
  }
}
class AbiEncodingLengthMismatchError extends BaseError$2 {
  constructor({ expectedLength, givenLength }) {
    super([
      "ABI encoding params/values length mismatch.",
      `Expected length (params): ${expectedLength}`,
      `Given length (values): ${givenLength}`
    ].join("\n"), { name: "AbiEncodingLengthMismatchError" });
  }
}
class AbiErrorInputsNotFoundError extends BaseError$2 {
  constructor(errorName, { docsPath: docsPath2 }) {
    super([
      `Arguments (\`args\`) were provided to "${errorName}", but "${errorName}" on the ABI does not contain any parameters (\`inputs\`).`,
      "Cannot encode error result without knowing what the parameter types are.",
      "Make sure you are using the correct ABI and that the inputs exist on it."
    ].join("\n"), {
      docsPath: docsPath2,
      name: "AbiErrorInputsNotFoundError"
    });
  }
}
class AbiErrorNotFoundError extends BaseError$2 {
  constructor(errorName, { docsPath: docsPath2 } = {}) {
    super([
      `Error ${errorName ? `"${errorName}" ` : ""}not found on ABI.`,
      "Make sure you are using the correct ABI and that the error exists on it."
    ].join("\n"), {
      docsPath: docsPath2,
      name: "AbiErrorNotFoundError"
    });
  }
}
class AbiErrorSignatureNotFoundError extends BaseError$2 {
  constructor(signature, { docsPath: docsPath2 }) {
    super([
      `Encoded error signature "${signature}" not found on ABI.`,
      "Make sure you are using the correct ABI and that the error exists on it.",
      `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
    ].join("\n"), {
      docsPath: docsPath2,
      name: "AbiErrorSignatureNotFoundError"
    });
    Object.defineProperty(this, "signature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.signature = signature;
  }
}
class AbiFunctionNotFoundError extends BaseError$2 {
  constructor(functionName, { docsPath: docsPath2 } = {}) {
    super([
      `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
      "Make sure you are using the correct ABI and that the function exists on it."
    ].join("\n"), {
      docsPath: docsPath2,
      name: "AbiFunctionNotFoundError"
    });
  }
}
class AbiFunctionOutputsNotFoundError extends BaseError$2 {
  constructor(functionName, { docsPath: docsPath2 }) {
    super([
      `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
      "Cannot decode function result without knowing what the parameter types are.",
      "Make sure you are using the correct ABI and that the function exists on it."
    ].join("\n"), {
      docsPath: docsPath2,
      name: "AbiFunctionOutputsNotFoundError"
    });
  }
}
class AbiFunctionSignatureNotFoundError extends BaseError$2 {
  constructor(signature, { docsPath: docsPath2 }) {
    super([
      `Encoded function signature "${signature}" not found on ABI.`,
      "Make sure you are using the correct ABI and that the function exists on it.",
      `You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
    ].join("\n"), {
      docsPath: docsPath2,
      name: "AbiFunctionSignatureNotFoundError"
    });
  }
}
class AbiItemAmbiguityError extends BaseError$2 {
  constructor(x, y) {
    super("Found ambiguous types in overloaded ABI items.", {
      metaMessages: [
        `\`${x.type}\` in \`${formatAbiItem$1(x.abiItem)}\`, and`,
        `\`${y.type}\` in \`${formatAbiItem$1(y.abiItem)}\``,
        "",
        "These types encode differently and cannot be distinguished at runtime.",
        "Remove one of the ambiguous items in the ABI."
      ],
      name: "AbiItemAmbiguityError"
    });
  }
}
class BytesSizeMismatchError extends BaseError$2 {
  constructor({ expectedSize, givenSize }) {
    super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
      name: "BytesSizeMismatchError"
    });
  }
}
class InvalidAbiEncodingTypeError extends BaseError$2 {
  constructor(type2, { docsPath: docsPath2 }) {
    super([
      `Type "${type2}" is not a valid encoding type.`,
      "Please provide a valid ABI type."
    ].join("\n"), { docsPath: docsPath2, name: "InvalidAbiEncodingType" });
  }
}
class InvalidAbiDecodingTypeError extends BaseError$2 {
  constructor(type2, { docsPath: docsPath2 }) {
    super([
      `Type "${type2}" is not a valid decoding type.`,
      "Please provide a valid ABI type."
    ].join("\n"), { docsPath: docsPath2, name: "InvalidAbiDecodingType" });
  }
}
class InvalidArrayError extends BaseError$2 {
  constructor(value) {
    super([`Value "${value}" is not a valid array.`].join("\n"), {
      name: "InvalidArrayError"
    });
  }
}
class InvalidDefinitionTypeError extends BaseError$2 {
  constructor(type2) {
    super([
      `"${type2}" is not a valid definition type.`,
      'Valid types: "function", "event", "error"'
    ].join("\n"), { name: "InvalidDefinitionTypeError" });
  }
}
const hash = (value) => keccak256(toBytes$1(value));
function hashSignature(sig) {
  return hash(sig);
}
const version$1 = "1.1.0";
let BaseError$1 = class BaseError3 extends Error {
  constructor(shortMessage, args = {}) {
    const details = args.cause instanceof BaseError3 ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
    const docsPath2 = args.cause instanceof BaseError3 ? args.cause.docsPath || args.docsPath : args.docsPath;
    const message2 = [
      shortMessage || "An error occurred.",
      "",
      ...args.metaMessages ? [...args.metaMessages, ""] : [],
      ...docsPath2 ? [`Docs: https://abitype.dev${docsPath2}`] : [],
      ...details ? [`Details: ${details}`] : [],
      `Version: abitype@${version$1}`
    ].join("\n");
    super(message2);
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "docsPath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "metaMessages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "shortMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiTypeError"
    });
    if (args.cause)
      this.cause = args.cause;
    this.details = details;
    this.docsPath = docsPath2;
    this.metaMessages = args.metaMessages;
    this.shortMessage = shortMessage;
  }
};
function execTyped(regex, string) {
  const match = regex.exec(string);
  return match?.groups;
}
const bytesRegex$1 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
const integerRegex$1 = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
const isTupleRegex = /^\(.+?\).*?$/;
const tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
function formatAbiParameter(abiParameter) {
  let type2 = abiParameter.type;
  if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
    type2 = "(";
    const length = abiParameter.components.length;
    for (let i2 = 0; i2 < length; i2++) {
      const component = abiParameter.components[i2];
      type2 += formatAbiParameter(component);
      if (i2 < length - 1)
        type2 += ", ";
    }
    const result = execTyped(tupleRegex, abiParameter.type);
    type2 += `)${result?.array ?? ""}`;
    return formatAbiParameter({
      ...abiParameter,
      type: type2
    });
  }
  if ("indexed" in abiParameter && abiParameter.indexed)
    type2 = `${type2} indexed`;
  if (abiParameter.name)
    return `${type2} ${abiParameter.name}`;
  return type2;
}
function formatAbiParameters(abiParameters) {
  let params = "";
  const length = abiParameters.length;
  for (let i2 = 0; i2 < length; i2++) {
    const abiParameter = abiParameters[i2];
    params += formatAbiParameter(abiParameter);
    if (i2 !== length - 1)
      params += ", ";
  }
  return params;
}
function formatAbiItem(abiItem) {
  if (abiItem.type === "function")
    return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
  if (abiItem.type === "event")
    return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "error")
    return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "constructor")
    return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  if (abiItem.type === "fallback")
    return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  return "receive() external payable";
}
const errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function isErrorSignature(signature) {
  return errorSignatureRegex.test(signature);
}
function execErrorSignature(signature) {
  return execTyped(errorSignatureRegex, signature);
}
const eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function isEventSignature(signature) {
  return eventSignatureRegex.test(signature);
}
function execEventSignature(signature) {
  return execTyped(eventSignatureRegex, signature);
}
const functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
function isFunctionSignature(signature) {
  return functionSignatureRegex.test(signature);
}
function execFunctionSignature(signature) {
  return execTyped(functionSignatureRegex, signature);
}
const structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
function isStructSignature(signature) {
  return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
  return execTyped(structSignatureRegex, signature);
}
const constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
function isConstructorSignature(signature) {
  return constructorSignatureRegex.test(signature);
}
function execConstructorSignature(signature) {
  return execTyped(constructorSignatureRegex, signature);
}
const fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
function isFallbackSignature(signature) {
  return fallbackSignatureRegex.test(signature);
}
function execFallbackSignature(signature) {
  return execTyped(fallbackSignatureRegex, signature);
}
const receiveSignatureRegex = /^receive\(\) external payable$/;
function isReceiveSignature(signature) {
  return receiveSignatureRegex.test(signature);
}
const eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
const functionModifiers = /* @__PURE__ */ new Set([
  "calldata",
  "memory",
  "storage"
]);
class UnknownTypeError extends BaseError$1 {
  constructor({ type: type2 }) {
    super("Unknown type.", {
      metaMessages: [
        `Type "${type2}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownTypeError"
    });
  }
}
class UnknownSolidityTypeError extends BaseError$1 {
  constructor({ type: type2 }) {
    super("Unknown type.", {
      metaMessages: [`Type "${type2}" is not a valid ABI type.`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownSolidityTypeError"
    });
  }
}
class InvalidParameterError extends BaseError$1 {
  constructor({ param }) {
    super("Invalid ABI parameter.", {
      details: param
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidParameterError"
    });
  }
}
class SolidityProtectedKeywordError extends BaseError$1 {
  constructor({ param, name }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "SolidityProtectedKeywordError"
    });
  }
}
class InvalidModifierError extends BaseError$1 {
  constructor({ param, type: type2, modifier }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `Modifier "${modifier}" not allowed${type2 ? ` in "${type2}" type` : ""}.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidModifierError"
    });
  }
}
class InvalidFunctionModifierError extends BaseError$1 {
  constructor({ param, type: type2, modifier }) {
    super("Invalid ABI parameter.", {
      details: param,
      metaMessages: [
        `Modifier "${modifier}" not allowed${type2 ? ` in "${type2}" type` : ""}.`,
        `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidFunctionModifierError"
    });
  }
}
class InvalidAbiTypeParameterError extends BaseError$1 {
  constructor({ abiParameter }) {
    super("Invalid ABI parameter.", {
      details: JSON.stringify(abiParameter, null, 2),
      metaMessages: ["ABI parameter type is invalid."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidAbiTypeParameterError"
    });
  }
}
class InvalidSignatureError extends BaseError$1 {
  constructor({ signature, type: type2 }) {
    super(`Invalid ${type2} signature.`, {
      details: signature
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidSignatureError"
    });
  }
}
class UnknownSignatureError extends BaseError$1 {
  constructor({ signature }) {
    super("Unknown signature.", {
      details: signature
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "UnknownSignatureError"
    });
  }
}
class InvalidStructSignatureError extends BaseError$1 {
  constructor({ signature }) {
    super("Invalid struct signature.", {
      details: signature,
      metaMessages: ["No properties exist."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidStructSignatureError"
    });
  }
}
class CircularReferenceError extends BaseError$1 {
  constructor({ type: type2 }) {
    super("Circular reference detected.", {
      metaMessages: [`Struct "${type2}" is a circular reference.`]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "CircularReferenceError"
    });
  }
}
class InvalidParenthesisError extends BaseError$1 {
  constructor({ current, depth }) {
    super("Unbalanced parentheses.", {
      metaMessages: [
        `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
      ],
      details: `Depth "${depth}"`
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidParenthesisError"
    });
  }
}
function getParameterCacheKey(param, type2, structs) {
  let structKey = "";
  if (structs)
    for (const struct of Object.entries(structs)) {
      if (!struct)
        continue;
      let propertyKey = "";
      for (const property of struct[1]) {
        propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
      }
      structKey += `(${struct[0]}{${propertyKey}})`;
    }
  if (type2)
    return `${type2}:${param}${structKey}`;
  return param;
}
const parameterCache = /* @__PURE__ */ new Map([
  // Unnamed
  ["address", { type: "address" }],
  ["bool", { type: "bool" }],
  ["bytes", { type: "bytes" }],
  ["bytes32", { type: "bytes32" }],
  ["int", { type: "int256" }],
  ["int256", { type: "int256" }],
  ["string", { type: "string" }],
  ["uint", { type: "uint256" }],
  ["uint8", { type: "uint8" }],
  ["uint16", { type: "uint16" }],
  ["uint24", { type: "uint24" }],
  ["uint32", { type: "uint32" }],
  ["uint64", { type: "uint64" }],
  ["uint96", { type: "uint96" }],
  ["uint112", { type: "uint112" }],
  ["uint160", { type: "uint160" }],
  ["uint192", { type: "uint192" }],
  ["uint256", { type: "uint256" }],
  // Named
  ["address owner", { type: "address", name: "owner" }],
  ["address to", { type: "address", name: "to" }],
  ["bool approved", { type: "bool", name: "approved" }],
  ["bytes _data", { type: "bytes", name: "_data" }],
  ["bytes data", { type: "bytes", name: "data" }],
  ["bytes signature", { type: "bytes", name: "signature" }],
  ["bytes32 hash", { type: "bytes32", name: "hash" }],
  ["bytes32 r", { type: "bytes32", name: "r" }],
  ["bytes32 root", { type: "bytes32", name: "root" }],
  ["bytes32 s", { type: "bytes32", name: "s" }],
  ["string name", { type: "string", name: "name" }],
  ["string symbol", { type: "string", name: "symbol" }],
  ["string tokenURI", { type: "string", name: "tokenURI" }],
  ["uint tokenId", { type: "uint256", name: "tokenId" }],
  ["uint8 v", { type: "uint8", name: "v" }],
  ["uint256 balance", { type: "uint256", name: "balance" }],
  ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
  ["uint256 value", { type: "uint256", name: "value" }],
  // Indexed
  [
    "event:address indexed from",
    { type: "address", name: "from", indexed: true }
  ],
  ["event:address indexed to", { type: "address", name: "to", indexed: true }],
  [
    "event:uint indexed tokenId",
    { type: "uint256", name: "tokenId", indexed: true }
  ],
  [
    "event:uint256 indexed tokenId",
    { type: "uint256", name: "tokenId", indexed: true }
  ]
]);
function parseSignature(signature, structs = {}) {
  if (isFunctionSignature(signature))
    return parseFunctionSignature(signature, structs);
  if (isEventSignature(signature))
    return parseEventSignature(signature, structs);
  if (isErrorSignature(signature))
    return parseErrorSignature(signature, structs);
  if (isConstructorSignature(signature))
    return parseConstructorSignature(signature, structs);
  if (isFallbackSignature(signature))
    return parseFallbackSignature(signature);
  if (isReceiveSignature(signature))
    return {
      type: "receive",
      stateMutability: "payable"
    };
  throw new UnknownSignatureError({ signature });
}
function parseFunctionSignature(signature, structs = {}) {
  const match = execFunctionSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "function" });
  const inputParams = splitParameters(match.parameters);
  const inputs = [];
  const inputLength = inputParams.length;
  for (let i2 = 0; i2 < inputLength; i2++) {
    inputs.push(parseAbiParameter(inputParams[i2], {
      modifiers: functionModifiers,
      structs,
      type: "function"
    }));
  }
  const outputs = [];
  if (match.returns) {
    const outputParams = splitParameters(match.returns);
    const outputLength = outputParams.length;
    for (let i2 = 0; i2 < outputLength; i2++) {
      outputs.push(parseAbiParameter(outputParams[i2], {
        modifiers: functionModifiers,
        structs,
        type: "function"
      }));
    }
  }
  return {
    name: match.name,
    type: "function",
    stateMutability: match.stateMutability ?? "nonpayable",
    inputs,
    outputs
  };
}
function parseEventSignature(signature, structs = {}) {
  const match = execEventSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "event" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i2 = 0; i2 < length; i2++)
    abiParameters.push(parseAbiParameter(params[i2], {
      modifiers: eventModifiers,
      structs,
      type: "event"
    }));
  return { name: match.name, type: "event", inputs: abiParameters };
}
function parseErrorSignature(signature, structs = {}) {
  const match = execErrorSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "error" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i2 = 0; i2 < length; i2++)
    abiParameters.push(parseAbiParameter(params[i2], { structs, type: "error" }));
  return { name: match.name, type: "error", inputs: abiParameters };
}
function parseConstructorSignature(signature, structs = {}) {
  const match = execConstructorSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "constructor" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i2 = 0; i2 < length; i2++)
    abiParameters.push(parseAbiParameter(params[i2], { structs, type: "constructor" }));
  return {
    type: "constructor",
    stateMutability: match.stateMutability ?? "nonpayable",
    inputs: abiParameters
  };
}
function parseFallbackSignature(signature) {
  const match = execFallbackSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "fallback" });
  return {
    type: "fallback",
    stateMutability: match.stateMutability ?? "nonpayable"
  };
}
const abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*(?:\spayable)?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
const abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
const dynamicIntegerRegex = /^u?int$/;
function parseAbiParameter(param, options) {
  const parameterCacheKey = getParameterCacheKey(param, options?.type, options?.structs);
  if (parameterCache.has(parameterCacheKey))
    return parameterCache.get(parameterCacheKey);
  const isTuple = isTupleRegex.test(param);
  const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
  if (!match)
    throw new InvalidParameterError({ param });
  if (match.name && isSolidityKeyword(match.name))
    throw new SolidityProtectedKeywordError({ param, name: match.name });
  const name = match.name ? { name: match.name } : {};
  const indexed = match.modifier === "indexed" ? { indexed: true } : {};
  const structs = options?.structs ?? {};
  let type2;
  let components = {};
  if (isTuple) {
    type2 = "tuple";
    const params = splitParameters(match.type);
    const components_ = [];
    const length = params.length;
    for (let i2 = 0; i2 < length; i2++) {
      components_.push(parseAbiParameter(params[i2], { structs }));
    }
    components = { components: components_ };
  } else if (match.type in structs) {
    type2 = "tuple";
    components = { components: structs[match.type] };
  } else if (dynamicIntegerRegex.test(match.type)) {
    type2 = `${match.type}256`;
  } else if (match.type === "address payable") {
    type2 = "address";
  } else {
    type2 = match.type;
    if (!(options?.type === "struct") && !isSolidityType(type2))
      throw new UnknownSolidityTypeError({ type: type2 });
  }
  if (match.modifier) {
    if (!options?.modifiers?.has?.(match.modifier))
      throw new InvalidModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
    if (functionModifiers.has(match.modifier) && !isValidDataLocation(type2, !!match.array))
      throw new InvalidFunctionModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
  }
  const abiParameter = {
    type: `${type2}${match.array ?? ""}`,
    ...name,
    ...indexed,
    ...components
  };
  parameterCache.set(parameterCacheKey, abiParameter);
  return abiParameter;
}
function splitParameters(params, result = [], current = "", depth = 0) {
  const length = params.trim().length;
  for (let i2 = 0; i2 < length; i2++) {
    const char = params[i2];
    const tail = params.slice(i2 + 1);
    switch (char) {
      case ",":
        return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
      case "(":
        return splitParameters(tail, result, `${current}${char}`, depth + 1);
      case ")":
        return splitParameters(tail, result, `${current}${char}`, depth - 1);
      default:
        return splitParameters(tail, result, `${current}${char}`, depth);
    }
  }
  if (current === "")
    return result;
  if (depth !== 0)
    throw new InvalidParenthesisError({ current, depth });
  result.push(current.trim());
  return result;
}
function isSolidityType(type2) {
  return type2 === "address" || type2 === "bool" || type2 === "function" || type2 === "string" || bytesRegex$1.test(type2) || integerRegex$1.test(type2);
}
const protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
function isSolidityKeyword(name) {
  return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex$1.test(name) || integerRegex$1.test(name) || protectedKeywordsRegex.test(name);
}
function isValidDataLocation(type2, isArray2) {
  return isArray2 || type2 === "bytes" || type2 === "string" || type2 === "tuple";
}
function parseStructs(signatures) {
  const shallowStructs = {};
  const signaturesLength = signatures.length;
  for (let i2 = 0; i2 < signaturesLength; i2++) {
    const signature = signatures[i2];
    if (!isStructSignature(signature))
      continue;
    const match = execStructSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "struct" });
    const properties = match.properties.split(";");
    const components = [];
    const propertiesLength = properties.length;
    for (let k = 0; k < propertiesLength; k++) {
      const property = properties[k];
      const trimmed = property.trim();
      if (!trimmed)
        continue;
      const abiParameter = parseAbiParameter(trimmed, {
        type: "struct"
      });
      components.push(abiParameter);
    }
    if (!components.length)
      throw new InvalidStructSignatureError({ signature });
    shallowStructs[match.name] = components;
  }
  const resolvedStructs = {};
  const entries = Object.entries(shallowStructs);
  const entriesLength = entries.length;
  for (let i2 = 0; i2 < entriesLength; i2++) {
    const [name, parameters] = entries[i2];
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
  }
  return resolvedStructs;
}
const typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
function resolveStructs(abiParameters, structs, ancestors = /* @__PURE__ */ new Set()) {
  const components = [];
  const length = abiParameters.length;
  for (let i2 = 0; i2 < length; i2++) {
    const abiParameter = abiParameters[i2];
    const isTuple = isTupleRegex.test(abiParameter.type);
    if (isTuple)
      components.push(abiParameter);
    else {
      const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
      if (!match?.type)
        throw new InvalidAbiTypeParameterError({ abiParameter });
      const { array, type: type2 } = match;
      if (type2 in structs) {
        if (ancestors.has(type2))
          throw new CircularReferenceError({ type: type2 });
        components.push({
          ...abiParameter,
          type: `tuple${array ?? ""}`,
          components: resolveStructs(structs[type2] ?? [], structs, /* @__PURE__ */ new Set([...ancestors, type2]))
        });
      } else {
        if (isSolidityType(type2))
          components.push(abiParameter);
        else
          throw new UnknownTypeError({ type: type2 });
      }
    }
  }
  return components;
}
function parseAbi(signatures) {
  const structs = parseStructs(signatures);
  const abi = [];
  const length = signatures.length;
  for (let i2 = 0; i2 < length; i2++) {
    const signature = signatures[i2];
    if (isStructSignature(signature))
      continue;
    abi.push(parseSignature(signature, structs));
  }
  return abi;
}
function normalizeSignature(signature) {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;
  for (let i2 = 0; i2 < signature.length; i2++) {
    const char = signature[i2];
    if (["(", ")", ","].includes(char))
      active = true;
    if (char === "(")
      level++;
    if (char === ")")
      level--;
    if (!active)
      continue;
    if (level === 0) {
      if (char === " " && ["event", "function", ""].includes(result))
        result = "";
      else {
        result += char;
        if (char === ")") {
          valid = true;
          break;
        }
      }
      continue;
    }
    if (char === " ") {
      if (signature[i2 - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid)
    throw new BaseError$2("Unable to normalize signature.");
  return result;
}
const toSignature = (def) => {
  const def_ = (() => {
    if (typeof def === "string")
      return def;
    return formatAbiItem(def);
  })();
  return normalizeSignature(def_);
};
function toSignatureHash(fn) {
  return hashSignature(toSignature(fn));
}
const toFunctionSelector = (fn) => slice(toSignatureHash(fn), 0, 4);
function bytesToBigInt(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex$1(bytes, opts);
  return hexToBigInt(hex, opts);
}
function bytesToBool(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim$1(bytes);
  }
  if (bytes.length > 1 || bytes[0] > 1)
    throw new InvalidBytesBooleanError(bytes);
  return Boolean(bytes[0]);
}
function bytesToNumber(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex$1(bytes, opts);
  return hexToNumber(hex, opts);
}
function bytesToString(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim$1(bytes, { dir: "right" });
  }
  return new TextDecoder().decode(bytes);
}
const bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
const integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
function encodeAbiParameters(params, values) {
  if (params.length !== values.length)
    throw new AbiEncodingLengthMismatchError({
      expectedLength: params.length,
      givenLength: values.length
    });
  const preparedParams = prepareParams({
    params,
    values
  });
  const data = encodeParams(preparedParams);
  if (data.length === 0)
    return "0x";
  return data;
}
function prepareParams({ params, values }) {
  const preparedParams = [];
  for (let i2 = 0; i2 < params.length; i2++) {
    preparedParams.push(prepareParam({ param: params[i2], value: values[i2] }));
  }
  return preparedParams;
}
function prepareParam({ param, value }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type2] = arrayComponents;
    return encodeArray(value, { length, param: { ...param, type: type2 } });
  }
  if (param.type === "tuple") {
    return encodeTuple(value, {
      param
    });
  }
  if (param.type === "address") {
    return encodeAddress(value);
  }
  if (param.type === "bool") {
    return encodeBool(value);
  }
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    const signed = param.type.startsWith("int");
    const [, , size2 = "256"] = integerRegex.exec(param.type) ?? [];
    return encodeNumber(value, {
      signed,
      size: Number(size2)
    });
  }
  if (param.type.startsWith("bytes")) {
    return encodeBytes(value, { param });
  }
  if (param.type === "string") {
    return encodeString(value);
  }
  throw new InvalidAbiEncodingTypeError(param.type, {
    docsPath: "/docs/contract/encodeAbiParameters"
  });
}
function encodeParams(preparedParams) {
  let staticSize = 0;
  for (let i2 = 0; i2 < preparedParams.length; i2++) {
    const { dynamic, encoded } = preparedParams[i2];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size(encoded);
  }
  const staticParams = [];
  const dynamicParams = [];
  let dynamicSize = 0;
  for (let i2 = 0; i2 < preparedParams.length; i2++) {
    const { dynamic, encoded } = preparedParams[i2];
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
      dynamicParams.push(encoded);
      dynamicSize += size(encoded);
    } else {
      staticParams.push(encoded);
    }
  }
  return concat([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
  if (!isAddress(value))
    throw new InvalidAddressError({ address: value });
  return { dynamic: false, encoded: padHex(value.toLowerCase()) };
}
function encodeArray(value, { length, param }) {
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length)
    throw new AbiEncodingArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${param.type}[${length}]`
    });
  let dynamicChild = false;
  const preparedParams = [];
  for (let i2 = 0; i2 < value.length; i2++) {
    const preparedParam = prepareParam({ param, value: value[i2] });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParams.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length2 = numberToHex(preparedParams.length, { size: 32 });
      return {
        dynamic: true,
        encoded: preparedParams.length > 0 ? concat([length2, data]) : length2
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concat(preparedParams.map(({ encoded }) => encoded))
  };
}
function encodeBytes(value, { param }) {
  const [, paramSize] = param.type.split("bytes");
  const bytesSize = size(value);
  if (!paramSize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padHex(value_, {
        dir: "right",
        size: Math.ceil((value.length - 2) / 2 / 32) * 32
      });
    return {
      dynamic: true,
      encoded: concat([padHex(numberToHex(bytesSize, { size: 32 })), value_])
    };
  }
  if (bytesSize !== Number.parseInt(paramSize, 10))
    throw new AbiEncodingBytesSizeMismatchError({
      expectedSize: Number.parseInt(paramSize, 10),
      value
    });
  return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
}
function encodeBool(value) {
  if (typeof value !== "boolean")
    throw new BaseError$2(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padHex(boolToHex(value)) };
}
function encodeNumber(value, { signed, size: size2 = 256 }) {
  if (typeof size2 === "number") {
    const max = 2n ** (BigInt(size2) - (signed ? 1n : 0n)) - 1n;
    const min = signed ? -max - 1n : 0n;
    if (value > max || value < min)
      throw new IntegerOutOfRangeError$1({
        max: max.toString(),
        min: min.toString(),
        signed,
        size: size2 / 8,
        value: value.toString()
      });
  }
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(size(hexValue) / 32);
  const parts = [];
  for (let i2 = 0; i2 < partsLength; i2++) {
    parts.push(padHex(slice(hexValue, i2 * 32, (i2 + 1) * 32), {
      dir: "right"
    }));
  }
  return {
    dynamic: true,
    encoded: concat([
      padHex(numberToHex(size(hexValue), { size: 32 })),
      ...parts
    ])
  };
}
function encodeTuple(value, { param }) {
  let dynamic = false;
  const preparedParams = [];
  for (let i2 = 0; i2 < param.components.length; i2++) {
    const param_ = param.components[i2];
    const index = Array.isArray(value) ? i2 : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      value: value[index]
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encodeParams(preparedParams) : concat(preparedParams.map(({ encoded }) => encoded))
  };
}
function getArrayComponents(type2) {
  const matches = type2.match(/^(.*)\[(\d+)?\]$/);
  return matches ? (
    // Return `null` if the array is dynamic.
    [matches[2] ? Number(matches[2]) : null, matches[1]]
  ) : void 0;
}
function decodeAbiParameters(params, data) {
  const bytes = typeof data === "string" ? hexToBytes(data) : data;
  const cursor = createCursor(bytes);
  if (size(bytes) === 0 && params.length > 0)
    throw new AbiDecodingZeroDataError();
  if (size(data) && size(data) < 32)
    throw new AbiDecodingDataSizeTooSmallError({
      data: typeof data === "string" ? data : bytesToHex$1(data),
      params,
      size: size(data)
    });
  let consumed = 0;
  const values = [];
  for (let i2 = 0; i2 < params.length; ++i2) {
    const param = params[i2];
    cursor.setPosition(consumed);
    const [data2, consumed_] = decodeParameter(cursor, param, {
      staticPosition: 0
    });
    consumed += consumed_;
    values.push(data2);
  }
  return values;
}
function decodeParameter(cursor, param, { staticPosition }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type2] = arrayComponents;
    return decodeArray(cursor, { ...param, type: type2 }, { length, staticPosition });
  }
  if (param.type === "tuple")
    return decodeTuple(cursor, param, { staticPosition });
  if (param.type === "address")
    return decodeAddress(cursor);
  if (param.type === "bool")
    return decodeBool(cursor);
  if (param.type.startsWith("bytes"))
    return decodeBytes(cursor, param, { staticPosition });
  if (param.type.startsWith("uint") || param.type.startsWith("int"))
    return decodeNumber(cursor, param);
  if (param.type === "string")
    return decodeString(cursor, { staticPosition });
  throw new InvalidAbiDecodingTypeError(param.type, {
    docsPath: "/docs/contract/decodeAbiParameters"
  });
}
const sizeOfLength = 32;
const sizeOfOffset = 32;
function decodeAddress(cursor) {
  const value = cursor.readBytes(32);
  return [checksumAddress(bytesToHex$1(sliceBytes(value, -20))), 32];
}
function decodeArray(cursor, param, { length, staticPosition }) {
  if (!length) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const startOfData = start + sizeOfLength;
    cursor.setPosition(start);
    const length2 = bytesToNumber(cursor.readBytes(sizeOfLength));
    const dynamicChild = hasDynamicChild(param);
    let consumed2 = 0;
    const value2 = [];
    for (let i2 = 0; i2 < length2; ++i2) {
      cursor.setPosition(startOfData + (dynamicChild ? i2 * 32 : consumed2));
      const [data, consumed_] = decodeParameter(cursor, param, {
        staticPosition: startOfData
      });
      consumed2 += consumed_;
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const value2 = [];
    for (let i2 = 0; i2 < length; ++i2) {
      cursor.setPosition(start + i2 * 32);
      const [data] = decodeParameter(cursor, param, {
        staticPosition: start
      });
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  let consumed = 0;
  const value = [];
  for (let i2 = 0; i2 < length; ++i2) {
    const [data, consumed_] = decodeParameter(cursor, param, {
      staticPosition: staticPosition + consumed
    });
    consumed += consumed_;
    value.push(data);
  }
  return [value, consumed];
}
function decodeBool(cursor) {
  return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes(cursor, param, { staticPosition }) {
  const [_, size2] = param.type.split("bytes");
  if (!size2) {
    const offset = bytesToNumber(cursor.readBytes(32));
    cursor.setPosition(staticPosition + offset);
    const length = bytesToNumber(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["0x", 32];
    }
    const data = cursor.readBytes(length);
    cursor.setPosition(staticPosition + 32);
    return [bytesToHex$1(data), 32];
  }
  const value = bytesToHex$1(cursor.readBytes(Number.parseInt(size2, 10), 32));
  return [value, 32];
}
function decodeNumber(cursor, param) {
  const signed = param.type.startsWith("int");
  const size2 = Number.parseInt(param.type.split("int")[1] || "256", 10);
  const value = cursor.readBytes(32);
  return [
    size2 > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }),
    32
  ];
}
function decodeTuple(cursor, param, { staticPosition }) {
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    for (let i2 = 0; i2 < param.components.length; ++i2) {
      const component = param.components[i2];
      cursor.setPosition(start + consumed);
      const [data, consumed_] = decodeParameter(cursor, component, {
        staticPosition: start
      });
      consumed += consumed_;
      value[hasUnnamedChild ? i2 : component?.name] = data;
    }
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  for (let i2 = 0; i2 < param.components.length; ++i2) {
    const component = param.components[i2];
    const [data, consumed_] = decodeParameter(cursor, component, {
      staticPosition
    });
    value[hasUnnamedChild ? i2 : component?.name] = data;
    consumed += consumed_;
  }
  return [value, consumed];
}
function decodeString(cursor, { staticPosition }) {
  const offset = bytesToNumber(cursor.readBytes(32));
  const start = staticPosition + offset;
  cursor.setPosition(start);
  const length = bytesToNumber(cursor.readBytes(32));
  if (length === 0) {
    cursor.setPosition(staticPosition + 32);
    return ["", 32];
  }
  const data = cursor.readBytes(length, 32);
  const value = bytesToString(trim$1(data));
  cursor.setPosition(staticPosition + 32);
  return [value, 32];
}
function hasDynamicChild(param) {
  const { type: type2 } = param;
  if (type2 === "string")
    return true;
  if (type2 === "bytes")
    return true;
  if (type2.endsWith("[]"))
    return true;
  if (type2 === "tuple")
    return param.components?.some(hasDynamicChild);
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
    return true;
  return false;
}
function decodeErrorResult(parameters) {
  const { abi, data } = parameters;
  const signature = slice(data, 0, 4);
  if (signature === "0x")
    throw new AbiDecodingZeroDataError();
  const abi_ = [...abi || [], solidityError, solidityPanic];
  const abiItem = abi_.find((x) => x.type === "error" && signature === toFunctionSelector(formatAbiItem$1(x)));
  if (!abiItem)
    throw new AbiErrorSignatureNotFoundError(signature, {
      docsPath: "/docs/contract/decodeErrorResult"
    });
  return {
    abiItem,
    args: "inputs" in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? decodeAbiParameters(abiItem.inputs, slice(data, 4)) : void 0,
    errorName: abiItem.name
  };
}
const stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
  const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
  return value2;
}, space);
function formatAbiItemWithArgs({ abiItem, args, includeFunctionName = true, includeName = false }) {
  if (!("name" in abiItem))
    return;
  if (!("inputs" in abiItem))
    return;
  if (!abiItem.inputs)
    return;
  return `${includeFunctionName ? abiItem.name : ""}(${abiItem.inputs.map((input, i2) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i2] === "object" ? stringify(args[i2]) : args[i2]}`).join(", ")})`;
}
const toEventSelector = toSignatureHash;
function getAbiItem(parameters) {
  const { abi, args = [], name } = parameters;
  const isSelector = isHex(name, { strict: false });
  const abiItems = abi.filter((abiItem) => {
    if (isSelector) {
      if (abiItem.type === "function")
        return toFunctionSelector(abiItem) === name;
      if (abiItem.type === "event")
        return toEventSelector(abiItem) === name;
      return false;
    }
    return "name" in abiItem && abiItem.name === name;
  });
  if (abiItems.length === 0)
    return void 0;
  if (abiItems.length === 1)
    return abiItems[0];
  let matchedAbiItem;
  for (const abiItem of abiItems) {
    if (!("inputs" in abiItem))
      continue;
    if (!args || args.length === 0) {
      if (!abiItem.inputs || abiItem.inputs.length === 0)
        return abiItem;
      continue;
    }
    if (!abiItem.inputs)
      continue;
    if (abiItem.inputs.length === 0)
      continue;
    if (abiItem.inputs.length !== args.length)
      continue;
    const matched = args.every((arg, index) => {
      const abiParameter = "inputs" in abiItem && abiItem.inputs[index];
      if (!abiParameter)
        return false;
      return isArgOfType(arg, abiParameter);
    });
    if (matched) {
      if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes)
          throw new AbiItemAmbiguityError({
            abiItem,
            type: ambiguousTypes[0]
          }, {
            abiItem: matchedAbiItem,
            type: ambiguousTypes[1]
          });
      }
      matchedAbiItem = abiItem;
    }
  }
  if (matchedAbiItem)
    return matchedAbiItem;
  return abiItems[0];
}
function isArgOfType(arg, abiParameter) {
  const argType = typeof arg;
  const abiParameterType = abiParameter.type;
  switch (abiParameterType) {
    case "address":
      return isAddress(arg, { strict: false });
    case "bool":
      return argType === "boolean";
    case "function":
      return argType === "string";
    case "string":
      return argType === "string";
    default: {
      if (abiParameterType === "tuple" && "components" in abiParameter)
        return Object.values(abiParameter.components).every((component, index) => {
          return isArgOfType(Object.values(arg)[index], component);
        });
      if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
        return argType === "number" || argType === "bigint";
      if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
        return argType === "string" || arg instanceof Uint8Array;
      if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
        return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
          ...abiParameter,
          // Pop off `[]` or `[M]` from end of type
          type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
        }));
      }
      return false;
    }
  }
}
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
      return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types2 = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types2.includes("address") && types2.includes("bytes20"))
        return true;
      if (types2.includes("address") && types2.includes("string"))
        return isAddress(args[parameterIndex], { strict: false });
      if (types2.includes("address") && types2.includes("bytes"))
        return isAddress(args[parameterIndex], { strict: false });
      return false;
    })();
    if (ambiguous)
      return types2;
  }
  return;
}
class AccountStateConflictError extends BaseError$2 {
  constructor({ address }) {
    super(`State for account "${address}" is set multiple times.`, {
      name: "AccountStateConflictError"
    });
  }
}
class StateAssignmentConflictError extends BaseError$2 {
  constructor() {
    super("state and stateDiff are set on the same account.", {
      name: "StateAssignmentConflictError"
    });
  }
}
function prettyStateMapping(stateMapping) {
  return stateMapping.reduce((pretty, { slot, value }) => {
    return `${pretty}        ${slot}: ${value}
`;
  }, "");
}
function prettyStateOverride(stateOverride) {
  return stateOverride.reduce((pretty, { address, ...state }) => {
    let val = `${pretty}    ${address}:
`;
    if (state.nonce)
      val += `      nonce: ${state.nonce}
`;
    if (state.balance)
      val += `      balance: ${state.balance}
`;
    if (state.code)
      val += `      code: ${state.code}
`;
    if (state.state) {
      val += "      state:\n";
      val += prettyStateMapping(state.state);
    }
    if (state.stateDiff) {
      val += "      stateDiff:\n";
      val += prettyStateMapping(state.stateDiff);
    }
    return val;
  }, "  State Override:\n").slice(0, -1);
}
const getContractAddress = (address) => address;
const getUrl = (url) => url;
class CallExecutionError extends BaseError$2 {
  constructor(cause, { account: account_, docsPath: docsPath2, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride }) {
    const account = account_ ? parseAccount(account_) : void 0;
    let prettyArgs = prettyPrint({
      from: account?.address,
      to,
      value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
      data,
      gas,
      gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
      maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce
    });
    if (stateOverride) {
      prettyArgs += `
${prettyStateOverride(stateOverride)}`;
    }
    super(cause.shortMessage, {
      cause,
      docsPath: docsPath2,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        "Raw Call Arguments:",
        prettyArgs
      ].filter(Boolean),
      name: "CallExecutionError"
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.cause = cause;
  }
}
class ContractFunctionExecutionError extends BaseError$2 {
  constructor(cause, { abi, args, contractAddress, docsPath: docsPath2, functionName, sender }) {
    const abiItem = getAbiItem({ abi, args, name: functionName });
    const formattedArgs = abiItem ? formatAbiItemWithArgs({
      abiItem,
      args,
      includeFunctionName: false,
      includeName: false
    }) : void 0;
    const functionWithParams = abiItem ? formatAbiItem$1(abiItem, { includeName: true }) : void 0;
    const prettyArgs = prettyPrint({
      address: contractAddress && getContractAddress(contractAddress),
      function: functionWithParams,
      args: formattedArgs && formattedArgs !== "()" && `${[...Array(functionName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
      sender
    });
    super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
      cause,
      docsPath: docsPath2,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        prettyArgs && "Contract Call:",
        prettyArgs
      ].filter(Boolean),
      name: "ContractFunctionExecutionError"
    });
    Object.defineProperty(this, "abi", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "args", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "contractAddress", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "formattedArgs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "functionName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "sender", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.abi = abi;
    this.args = args;
    this.cause = cause;
    this.contractAddress = contractAddress;
    this.functionName = functionName;
    this.sender = sender;
  }
}
class ContractFunctionRevertedError extends BaseError$2 {
  constructor({ abi, data, functionName, message: message2 }) {
    let cause;
    let decodedData;
    let metaMessages;
    let reason;
    if (data && data !== "0x") {
      try {
        decodedData = decodeErrorResult({ abi, data });
        const { abiItem, errorName, args: errorArgs } = decodedData;
        if (errorName === "Error") {
          reason = errorArgs[0];
        } else if (errorName === "Panic") {
          const [firstArg] = errorArgs;
          reason = panicReasons[firstArg];
        } else {
          const errorWithParams = abiItem ? formatAbiItem$1(abiItem, { includeName: true }) : void 0;
          const formattedArgs = abiItem && errorArgs ? formatAbiItemWithArgs({
            abiItem,
            args: errorArgs,
            includeFunctionName: false,
            includeName: false
          }) : void 0;
          metaMessages = [
            errorWithParams ? `Error: ${errorWithParams}` : "",
            formattedArgs && formattedArgs !== "()" ? `       ${[...Array(errorName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""
          ];
        }
      } catch (err) {
        cause = err;
      }
    } else if (message2)
      reason = message2;
    let signature;
    if (cause instanceof AbiErrorSignatureNotFoundError) {
      signature = cause.signature;
      metaMessages = [
        `Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
        "Make sure you are using the correct ABI and that the error exists on it.",
        `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
      ];
    }
    super(reason && reason !== "execution reverted" || signature ? [
      `The contract function "${functionName}" reverted with the following ${signature ? "signature" : "reason"}:`,
      reason || signature
    ].join("\n") : `The contract function "${functionName}" reverted.`, {
      cause,
      metaMessages,
      name: "ContractFunctionRevertedError"
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "raw", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "reason", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "signature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = decodedData;
    this.raw = data;
    this.reason = reason;
    this.signature = signature;
  }
}
class ContractFunctionZeroDataError extends BaseError$2 {
  constructor({ functionName }) {
    super(`The contract function "${functionName}" returned no data ("0x").`, {
      metaMessages: [
        "This could be due to any of the following:",
        `  - The contract does not have the function "${functionName}",`,
        "  - The parameters passed to the contract function may be invalid, or",
        "  - The address is not a contract."
      ],
      name: "ContractFunctionZeroDataError"
    });
  }
}
class CounterfactualDeploymentFailedError extends BaseError$2 {
  constructor({ factory: factory2 }) {
    super(`Deployment for counterfactual contract call failed${factory2 ? ` for factory "${factory2}".` : ""}`, {
      metaMessages: [
        "Please ensure:",
        "- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
        "- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
      ],
      name: "CounterfactualDeploymentFailedError"
    });
  }
}
class RawContractError extends BaseError$2 {
  constructor({ data, message: message2 }) {
    super(message2 || "", { name: "RawContractError" });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = data;
  }
}
class HttpRequestError extends BaseError$2 {
  constructor({ body, cause, details, headers, status, url }) {
    super("HTTP request failed.", {
      cause,
      details,
      metaMessages: [
        status && `Status: ${status}`,
        `URL: ${getUrl(url)}`,
        body && `Request body: ${stringify(body)}`
      ].filter(Boolean),
      name: "HttpRequestError"
    });
    Object.defineProperty(this, "body", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "headers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "status", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "url", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.body = body;
    this.headers = headers;
    this.status = status;
    this.url = url;
  }
}
class RpcRequestError extends BaseError$2 {
  constructor({ body, error, url }) {
    super("RPC Request failed.", {
      cause: error,
      details: error.message,
      metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
      name: "RpcRequestError"
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.code = error.code;
    this.data = error.data;
  }
}
const unknownErrorCode = -1;
class RpcError extends BaseError$2 {
  constructor(cause, { code: code2, docsPath: docsPath2, metaMessages, name, shortMessage }) {
    super(shortMessage, {
      cause,
      docsPath: docsPath2,
      metaMessages: metaMessages || cause?.metaMessages,
      name: name || "RpcError"
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = name || cause.name;
    this.code = cause instanceof RpcRequestError ? cause.code : code2 ?? unknownErrorCode;
  }
}
class InternalRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InternalRpcError.code,
      name: "InternalRpcError",
      shortMessage: "An internal error was received."
    });
  }
}
Object.defineProperty(InternalRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32603
});
function getNodeError(err, args) {
  const message2 = (err.details || "").toLowerCase();
  const executionRevertedError = err instanceof BaseError$2 ? err.walk((e) => e?.code === ExecutionRevertedError$1.code) : err;
  if (executionRevertedError instanceof BaseError$2)
    return new ExecutionRevertedError$1({
      cause: err,
      message: executionRevertedError.details
    });
  if (ExecutionRevertedError$1.nodeMessage.test(message2))
    return new ExecutionRevertedError$1({
      cause: err,
      message: err.details
    });
  if (FeeCapTooHighError.nodeMessage.test(message2))
    return new FeeCapTooHighError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas
    });
  if (FeeCapTooLowError.nodeMessage.test(message2))
    return new FeeCapTooLowError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas
    });
  if (NonceTooHighError.nodeMessage.test(message2))
    return new NonceTooHighError({ cause: err, nonce: args?.nonce });
  if (NonceTooLowError.nodeMessage.test(message2))
    return new NonceTooLowError({ cause: err, nonce: args?.nonce });
  if (NonceMaxValueError.nodeMessage.test(message2))
    return new NonceMaxValueError({ cause: err, nonce: args?.nonce });
  if (InsufficientFundsError.nodeMessage.test(message2))
    return new InsufficientFundsError({ cause: err });
  if (IntrinsicGasTooHighError.nodeMessage.test(message2))
    return new IntrinsicGasTooHighError({ cause: err, gas: args?.gas });
  if (IntrinsicGasTooLowError.nodeMessage.test(message2))
    return new IntrinsicGasTooLowError({ cause: err, gas: args?.gas });
  if (TransactionTypeNotSupportedError.nodeMessage.test(message2))
    return new TransactionTypeNotSupportedError({ cause: err });
  if (TipAboveFeeCapError.nodeMessage.test(message2))
    return new TipAboveFeeCapError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas,
      maxPriorityFeePerGas: args?.maxPriorityFeePerGas
    });
  return new UnknownNodeError({
    cause: err
  });
}
function getCallError(err, { docsPath: docsPath2, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new CallExecutionError(cause, {
    docsPath: docsPath2,
    ...args
  });
}
function extract(value_, { format }) {
  if (!format)
    return {};
  const value = {};
  function extract_(formatted2) {
    const keys = Object.keys(formatted2);
    for (const key of keys) {
      if (key in value_)
        value[key] = value_[key];
      if (formatted2[key] && typeof formatted2[key] === "object" && !Array.isArray(formatted2[key]))
        extract_(formatted2[key]);
    }
  }
  const formatted = format(value_ || {});
  extract_(formatted);
  return value;
}
function assertRequest(args) {
  const { account: account_, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  if (account && !isAddress(account.address))
    throw new InvalidAddressError({ address: account.address });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (typeof gasPrice !== "undefined" && (typeof maxFeePerGas !== "undefined" || typeof maxPriorityFeePerGas !== "undefined"))
    throw new FeeConflictError();
  if (maxFeePerGas && maxFeePerGas > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
const mainnet$1 = /* @__PURE__ */ defineChain({
  id: 1,
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockTime: 12e3,
  rpcUrls: {
    default: {
      http: ["https://eth.merkle.io"]
    }
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
      apiUrl: "https://api.etherscan.io/api"
    }
  },
  contracts: {
    ensUniversalResolver: {
      address: "0xeeeeeeee14d718c2b47d9923deab1335e144eeee",
      blockCreated: 23085558
    },
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 14353601
    }
  }
});
const sourceId = 1;
const optimism$1 = /* @__PURE__ */ defineChain({
  ...chainConfig,
  id: 10,
  name: "OP Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://mainnet.optimism.io"]
    }
  },
  blockExplorers: {
    default: {
      name: "Optimism Explorer",
      url: "https://optimistic.etherscan.io",
      apiUrl: "https://api-optimistic.etherscan.io/api"
    }
  },
  contracts: {
    ...chainConfig.contracts,
    disputeGameFactory: {
      [sourceId]: {
        address: "0xe5965Ab5962eDc7477C8520243A95517CD252fA9"
      }
    },
    l2OutputOracle: {
      [sourceId]: {
        address: "0xdfe97868233d1aa22e815a266982f2cf17685a27"
      }
    },
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 4286263
    },
    portal: {
      [sourceId]: {
        address: "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      }
    },
    l1StandardBridge: {
      [sourceId]: {
        address: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      }
    }
  },
  sourceId
});
const polygon$1 = /* @__PURE__ */ defineChain({
  id: 137,
  name: "Polygon",
  blockTime: 2e3,
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://polygon-rpc.com"]
    }
  },
  blockExplorers: {
    default: {
      name: "PolygonScan",
      url: "https://polygonscan.com",
      apiUrl: "https://api.polygonscan.com/api"
    }
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 25770160
    }
  }
});
const hoodi = defineChain$1({
  id: 560048,
  name: "Hoodi",
  network: "hoodi",
  nativeCurrency: {
    name: "Hoodi",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [
        "https://ethereum-hoodi-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27"
      ]
    }
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://hoodi.etherscan.io"
    }
  },
  iconBackground: "none",
  iconUrl: "/images/networks/light.svg",
  testnet: true
});
const rollupA = defineChain$1({
  id: 11113,
  name: "Rollup A",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-a.testnet.compose.network"]
    }
  },
  blockExplorers: {
    default: {
      name: "Rollup A",
      url: "https://rollup-a.explorer.testnet.compose.network"
    }
  },
  iconBackground: "none",
  iconUrl: "/images/networks/light.svg",
  testnet: true
});
const rollupB = defineChain$1({
  id: 22224,
  name: "Rollup B",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-b.testnet.compose.network"]
    }
  },
  blockExplorers: {
    default: {
      name: "Rollup B",
      url: "https://rollup-b.explorer.testnet.compose.network"
    }
  },
  iconBackground: "none",
  iconUrl: "/images/networks/light.svg",
  testnet: true
});
const polygon = {
  ...polygon$1,
  rpcUrls: {
    default: {
      http: ["https://polygon-rpc.com"]
    }
  }
};
const mainnet = {
  ...mainnet$1,
  rpcUrls: {
    default: {
      http: ["https://eth.llamarpc.com"]
    }
  }
};
const base = {
  ...base$1,
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org"]
    }
  }
};
const arbitrum = {
  ...arbitrum$1,
  rpcUrls: {
    default: {
      http: ["https://arb1.arbitrum.io/rpc"]
    }
  }
};
const optimism = {
  ...optimism$1,
  rpcUrls: {
    default: {
      http: ["https://mainnet.optimism.io"]
    }
  }
};
const version = "0.1.1";
function getVersion() {
  return version;
}
class BaseError extends Error {
  constructor(shortMessage, options = {}) {
    const details = (() => {
      if (options.cause instanceof BaseError) {
        if (options.cause.details)
          return options.cause.details;
        if (options.cause.shortMessage)
          return options.cause.shortMessage;
      }
      if (options.cause && "details" in options.cause && typeof options.cause.details === "string")
        return options.cause.details;
      if (options.cause?.message)
        return options.cause.message;
      return options.details;
    })();
    const docsPath2 = (() => {
      if (options.cause instanceof BaseError)
        return options.cause.docsPath || options.docsPath;
      return options.docsPath;
    })();
    const docsBaseUrl = "https://oxlib.sh";
    const docs = `${docsBaseUrl}${docsPath2 ?? ""}`;
    const message2 = [
      shortMessage || "An error occurred.",
      ...options.metaMessages ? ["", ...options.metaMessages] : [],
      ...details || docsPath2 ? [
        "",
        details ? `Details: ${details}` : void 0,
        docsPath2 ? `See: ${docs}` : void 0
      ] : []
    ].filter((x) => typeof x === "string").join("\n");
    super(message2, options.cause ? { cause: options.cause } : void 0);
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "docs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "docsPath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "shortMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "BaseError"
    });
    Object.defineProperty(this, "version", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: `ox@${getVersion()}`
    });
    this.cause = options.cause;
    this.details = details;
    this.docs = docs;
    this.docsPath = docsPath2;
    this.shortMessage = shortMessage;
  }
  walk(fn) {
    return walk(this, fn);
  }
}
function walk(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause)
    return walk(err.cause, fn);
  return fn ? null : err;
}
function pad(hex_, options = {}) {
  const { dir, size: size2 = 32 } = options;
  if (size2 === 0)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size2 * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size2,
      type: "Hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size2 * 2, "0")}`;
}
function fromNumber(value, options = {}) {
  const { signed, size: size2 } = options;
  const value_ = BigInt(value);
  let maxValue;
  if (size2) {
    if (signed)
      maxValue = (1n << BigInt(size2) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size2) * 8n) - 1n;
  } else if (typeof value === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value_ > maxValue || value_ < minValue) {
    const suffix = typeof value === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size2,
      value: `${value}${suffix}`
    });
  }
  const stringValue = (signed && value_ < 0 ? (1n << BigInt(size2 * 8)) + BigInt(value_) : value_).toString(16);
  const hex = `0x${stringValue}`;
  if (size2)
    return padLeft(hex, size2);
  return hex;
}
function padLeft(value, size2) {
  return pad(value, { dir: "left", size: size2 });
}
class IntegerOutOfRangeError extends BaseError {
  constructor({ max, min, signed, size: size2, value }) {
    super(`Number \`${value}\` is not in safe${size2 ? ` ${size2 * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.IntegerOutOfRangeError"
    });
  }
}
class SizeExceedsPaddingSizeError extends BaseError {
  constructor({ size: size2, targetSize, type: type2 }) {
    super(`${type2.charAt(0).toUpperCase()}${type2.slice(1).toLowerCase()} size (\`${size2}\`) exceeds padding size (\`${targetSize}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.SizeExceedsPaddingSizeError"
    });
  }
}
const docsPath$2 = "/docs/contract/decodeFunctionResult";
function decodeFunctionResult(parameters) {
  const { abi, args, functionName, data } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({ abi, args, name: functionName });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath$2 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath$2 });
  if (!abiItem.outputs)
    throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath$2 });
  const values = decodeAbiParameters(abiItem.outputs, data);
  if (values && values.length > 1)
    return values;
  if (values && values.length === 1)
    return values[0];
  return void 0;
}
const docsPath$1 = "/docs/contract/encodeFunctionData";
function prepareEncodeFunctionData(parameters) {
  const { abi, args, functionName } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({
      abi,
      args,
      name: functionName
    });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath$1 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath$1 });
  return {
    abi: [abiItem],
    functionName: toFunctionSelector(formatAbiItem$1(abiItem))
  };
}
function encodeFunctionData(parameters) {
  const { args } = parameters;
  const { abi, functionName } = (() => {
    if (parameters.abi.length === 1 && parameters.functionName?.startsWith("0x"))
      return parameters;
    return prepareEncodeFunctionData(parameters);
  })();
  const abiItem = abi[0];
  const signature = functionName;
  const data = "inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : void 0;
  return concatHex([signature, data ?? "0x"]);
}
const EXECUTION_REVERTED_ERROR_CODE = 3;
function getContractError$1(err, { abi, address, args, docsPath: docsPath2, functionName, sender }) {
  const error = err instanceof RawContractError ? err : err instanceof BaseError$2 ? err.walk((err2) => "data" in err2) || err.walk() : {};
  const { code: code2, data, details, message: message2, shortMessage } = error;
  const cause = (() => {
    if (err instanceof AbiDecodingZeroDataError)
      return new ContractFunctionZeroDataError({ functionName });
    if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code2) && (data || details || message2 || shortMessage)) {
      return new ContractFunctionRevertedError({
        abi,
        data: typeof data === "object" ? data.data : data,
        functionName,
        message: error instanceof RpcRequestError ? details : shortMessage ?? message2
      });
    }
    return err;
  })();
  return new ContractFunctionExecutionError(cause, {
    abi,
    args,
    contractAddress: address,
    docsPath: docsPath2,
    functionName,
    sender
  });
}
function getAction(client, actionFn, name) {
  const action_implicit = client[actionFn.name];
  if (typeof action_implicit === "function")
    return action_implicit;
  const action_explicit = client[name];
  if (typeof action_explicit === "function")
    return action_explicit;
  return (params) => actionFn(client, params);
}
function toRpc$1(withdrawal) {
  return {
    address: withdrawal.address,
    amount: fromNumber(withdrawal.amount),
    index: fromNumber(withdrawal.index),
    validatorIndex: fromNumber(withdrawal.validatorIndex)
  };
}
function toRpc(blockOverrides) {
  return {
    ...typeof blockOverrides.baseFeePerGas === "bigint" && {
      baseFeePerGas: fromNumber(blockOverrides.baseFeePerGas)
    },
    ...typeof blockOverrides.blobBaseFee === "bigint" && {
      blobBaseFee: fromNumber(blockOverrides.blobBaseFee)
    },
    ...typeof blockOverrides.feeRecipient === "string" && {
      feeRecipient: blockOverrides.feeRecipient
    },
    ...typeof blockOverrides.gasLimit === "bigint" && {
      gasLimit: fromNumber(blockOverrides.gasLimit)
    },
    ...typeof blockOverrides.number === "bigint" && {
      number: fromNumber(blockOverrides.number)
    },
    ...typeof blockOverrides.prevRandao === "bigint" && {
      prevRandao: fromNumber(blockOverrides.prevRandao)
    },
    ...typeof blockOverrides.time === "bigint" && {
      time: fromNumber(blockOverrides.time)
    },
    ...blockOverrides.withdrawals && {
      withdrawals: blockOverrides.withdrawals.map(toRpc$1)
    }
  };
}
const multicall3Abi = [
  {
    inputs: [
      {
        components: [
          {
            name: "target",
            type: "address"
          },
          {
            name: "allowFailure",
            type: "bool"
          },
          {
            name: "callData",
            type: "bytes"
          }
        ],
        name: "calls",
        type: "tuple[]"
      }
    ],
    name: "aggregate3",
    outputs: [
      {
        components: [
          {
            name: "success",
            type: "bool"
          },
          {
            name: "returnData",
            type: "bytes"
          }
        ],
        name: "returnData",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCurrentBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
const batchGatewayAbi = [
  {
    name: "query",
    type: "function",
    stateMutability: "view",
    inputs: [
      {
        type: "tuple[]",
        name: "queries",
        components: [
          {
            type: "address",
            name: "sender"
          },
          {
            type: "string[]",
            name: "urls"
          },
          {
            type: "bytes",
            name: "data"
          }
        ]
      }
    ],
    outputs: [
      {
        type: "bool[]",
        name: "failures"
      },
      {
        type: "bytes[]",
        name: "responses"
      }
    ]
  },
  {
    name: "HttpError",
    type: "error",
    inputs: [
      {
        type: "uint16",
        name: "status"
      },
      {
        type: "string",
        name: "message"
      }
    ]
  }
];
const aggregate3Signature = "0x82ad56cb";
const deploylessCallViaBytecodeBytecode = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe";
const deploylessCallViaFactoryBytecode = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe";
const multicall3Bytecode = "0x608060405234801561001057600080fd5b506115b9806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e14610325578063bce38bd714610350578063c3077fa914610380578063ee82ac5e146103b2576100f3565b80634d2301cc1461026257806372425d9d1461029f57806382ad56cb146102ca57806386d516e8146102fa576100f3565b80633408e470116100c65780633408e470146101af578063399542e9146101da5780633e64a6961461020c57806342cbb15c14610237576100f3565b80630f28c97d146100f8578063174dea7114610123578063252dba421461015357806327e86d6e14610184575b600080fd5b34801561010457600080fd5b5061010d6103ef565b60405161011a9190610c0a565b60405180910390f35b61013d60048036038101906101389190610c94565b6103f7565b60405161014a9190610e94565b60405180910390f35b61016d60048036038101906101689190610f0c565b610615565b60405161017b92919061101b565b60405180910390f35b34801561019057600080fd5b506101996107ab565b6040516101a69190611064565b60405180910390f35b3480156101bb57600080fd5b506101c46107b7565b6040516101d19190610c0a565b60405180910390f35b6101f460048036038101906101ef91906110ab565b6107bf565b6040516102039392919061110b565b60405180910390f35b34801561021857600080fd5b506102216107e1565b60405161022e9190610c0a565b60405180910390f35b34801561024357600080fd5b5061024c6107e9565b6040516102599190610c0a565b60405180910390f35b34801561026e57600080fd5b50610289600480360381019061028491906111a7565b6107f1565b6040516102969190610c0a565b60405180910390f35b3480156102ab57600080fd5b506102b4610812565b6040516102c19190610c0a565b60405180910390f35b6102e460048036038101906102df919061122a565b61081a565b6040516102f19190610e94565b60405180910390f35b34801561030657600080fd5b5061030f6109e4565b60405161031c9190610c0a565b60405180910390f35b34801561033157600080fd5b5061033a6109ec565b6040516103479190611286565b60405180910390f35b61036a600480360381019061036591906110ab565b6109f4565b6040516103779190610e94565b60405180910390f35b61039a60048036038101906103959190610f0c565b610ba6565b6040516103a99392919061110b565b60405180910390f35b3480156103be57600080fd5b506103d960048036038101906103d491906112cd565b610bca565b6040516103e69190611064565b60405180910390f35b600042905090565b60606000808484905090508067ffffffffffffffff81111561041c5761041b6112fa565b5b60405190808252806020026020018201604052801561045557816020015b610442610bd5565b81526020019060019003908161043a5790505b5092503660005b828110156105c957600085828151811061047957610478611329565b5b6020026020010151905087878381811061049657610495611329565b5b90506020028101906104a89190611367565b925060008360400135905080860195508360000160208101906104cb91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16818580606001906104f2919061138f565b604051610500929190611431565b60006040518083038185875af1925050503d806000811461053d576040519150601f19603f3d011682016040523d82523d6000602084013e610542565b606091505b5083600001846020018290528215151515815250505081516020850135176105bc577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b826001019250505061045c565b5082341461060c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610603906114a7565b60405180910390fd5b50505092915050565b6000606043915060008484905090508067ffffffffffffffff81111561063e5761063d6112fa565b5b60405190808252806020026020018201604052801561067157816020015b606081526020019060019003908161065c5790505b5091503660005b828110156107a157600087878381811061069557610694611329565b5b90506020028101906106a791906114c7565b92508260000160208101906106bc91906111a7565b73ffffffffffffffffffffffffffffffffffffffff168380602001906106e2919061138f565b6040516106f0929190611431565b6000604051808303816000865af19150503d806000811461072d576040519150601f19603f3d011682016040523d82523d6000602084013e610732565b606091505b5086848151811061074657610745611329565b5b60200260200101819052819250505080610795576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078c9061153b565b60405180910390fd5b81600101915050610678565b5050509250929050565b60006001430340905090565b600046905090565b6000806060439250434091506107d68686866109f4565b905093509350939050565b600048905090565b600043905090565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b600044905090565b606060008383905090508067ffffffffffffffff81111561083e5761083d6112fa565b5b60405190808252806020026020018201604052801561087757816020015b610864610bd5565b81526020019060019003908161085c5790505b5091503660005b828110156109db57600084828151811061089b5761089a611329565b5b602002602001015190508686838181106108b8576108b7611329565b5b90506020028101906108ca919061155b565b92508260000160208101906108df91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060400190610905919061138f565b604051610913929190611431565b6000604051808303816000865af19150503d8060008114610950576040519150601f19603f3d011682016040523d82523d6000602084013e610955565b606091505b5082600001836020018290528215151515815250505080516020840135176109cf577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b8160010191505061087e565b50505092915050565b600045905090565b600041905090565b606060008383905090508067ffffffffffffffff811115610a1857610a176112fa565b5b604051908082528060200260200182016040528015610a5157816020015b610a3e610bd5565b815260200190600190039081610a365790505b5091503660005b82811015610b9c576000848281518110610a7557610a74611329565b5b60200260200101519050868683818110610a9257610a91611329565b5b9050602002810190610aa491906114c7565b9250826000016020810190610ab991906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060200190610adf919061138f565b604051610aed929190611431565b6000604051808303816000865af19150503d8060008114610b2a576040519150601f19603f3d011682016040523d82523d6000602084013e610b2f565b606091505b508260000183602001829052821515151581525050508715610b90578060000151610b8f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b869061153b565b60405180910390fd5b5b81600101915050610a58565b5050509392505050565b6000806060610bb7600186866107bf565b8093508194508295505050509250925092565b600081409050919050565b6040518060400160405280600015158152602001606081525090565b6000819050919050565b610c0481610bf1565b82525050565b6000602082019050610c1f6000830184610bfb565b92915050565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f840112610c5457610c53610c2f565b5b8235905067ffffffffffffffff811115610c7157610c70610c34565b5b602083019150836020820283011115610c8d57610c8c610c39565b5b9250929050565b60008060208385031215610cab57610caa610c25565b5b600083013567ffffffffffffffff811115610cc957610cc8610c2a565b5b610cd585828601610c3e565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b60008115159050919050565b610d2281610d0d565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610d62578082015181840152602081019050610d47565b83811115610d71576000848401525b50505050565b6000601f19601f8301169050919050565b6000610d9382610d28565b610d9d8185610d33565b9350610dad818560208601610d44565b610db681610d77565b840191505092915050565b6000604083016000830151610dd96000860182610d19565b5060208301518482036020860152610df18282610d88565b9150508091505092915050565b6000610e0a8383610dc1565b905092915050565b6000602082019050919050565b6000610e2a82610ce1565b610e348185610cec565b935083602082028501610e4685610cfd565b8060005b85811015610e825784840389528151610e638582610dfe565b9450610e6e83610e12565b925060208a01995050600181019050610e4a565b50829750879550505050505092915050565b60006020820190508181036000830152610eae8184610e1f565b905092915050565b60008083601f840112610ecc57610ecb610c2f565b5b8235905067ffffffffffffffff811115610ee957610ee8610c34565b5b602083019150836020820283011115610f0557610f04610c39565b5b9250929050565b60008060208385031215610f2357610f22610c25565b5b600083013567ffffffffffffffff811115610f4157610f40610c2a565b5b610f4d85828601610eb6565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000610f918383610d88565b905092915050565b6000602082019050919050565b6000610fb182610f59565b610fbb8185610f64565b935083602082028501610fcd85610f75565b8060005b858110156110095784840389528151610fea8582610f85565b9450610ff583610f99565b925060208a01995050600181019050610fd1565b50829750879550505050505092915050565b60006040820190506110306000830185610bfb565b81810360208301526110428184610fa6565b90509392505050565b6000819050919050565b61105e8161104b565b82525050565b60006020820190506110796000830184611055565b92915050565b61108881610d0d565b811461109357600080fd5b50565b6000813590506110a58161107f565b92915050565b6000806000604084860312156110c4576110c3610c25565b5b60006110d286828701611096565b935050602084013567ffffffffffffffff8111156110f3576110f2610c2a565b5b6110ff86828701610eb6565b92509250509250925092565b60006060820190506111206000830186610bfb565b61112d6020830185611055565b818103604083015261113f8184610e1f565b9050949350505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061117482611149565b9050919050565b61118481611169565b811461118f57600080fd5b50565b6000813590506111a18161117b565b92915050565b6000602082840312156111bd576111bc610c25565b5b60006111cb84828501611192565b91505092915050565b60008083601f8401126111ea576111e9610c2f565b5b8235905067ffffffffffffffff81111561120757611206610c34565b5b60208301915083602082028301111561122357611222610c39565b5b9250929050565b6000806020838503121561124157611240610c25565b5b600083013567ffffffffffffffff81111561125f5761125e610c2a565b5b61126b858286016111d4565b92509250509250929050565b61128081611169565b82525050565b600060208201905061129b6000830184611277565b92915050565b6112aa81610bf1565b81146112b557600080fd5b50565b6000813590506112c7816112a1565b92915050565b6000602082840312156112e3576112e2610c25565b5b60006112f1848285016112b8565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b600080fd5b600080fd5b60008235600160800383360303811261138357611382611358565b5b80830191505092915050565b600080833560016020038436030381126113ac576113ab611358565b5b80840192508235915067ffffffffffffffff8211156113ce576113cd61135d565b5b6020830192506001820236038313156113ea576113e9611362565b5b509250929050565b600081905092915050565b82818337600083830152505050565b600061141883856113f2565b93506114258385846113fd565b82840190509392505050565b600061143e82848661140c565b91508190509392505050565b600082825260208201905092915050565b7f4d756c746963616c6c333a2076616c7565206d69736d61746368000000000000600082015250565b6000611491601a8361144a565b915061149c8261145b565b602082019050919050565b600060208201905081810360008301526114c081611484565b9050919050565b6000823560016040038336030381126114e3576114e2611358565b5b80830191505092915050565b7f4d756c746963616c6c333a2063616c6c206661696c6564000000000000000000600082015250565b600061152560178361144a565b9150611530826114ef565b602082019050919050565b6000602082019050818103600083015261155481611518565b9050919050565b60008235600160600383360303811261157757611576611358565b5b8083019150509291505056fea264697066735822122020c1bc9aacf8e4a6507193432a895a8e77094f45a1395583f07b24e860ef06cd64736f6c634300080c0033";
const docsPath = "/docs/contract/encodeDeployData";
function encodeDeployData(parameters) {
  const { abi, args, bytecode } = parameters;
  if (!args || args.length === 0)
    return bytecode;
  const description = abi.find((x) => "type" in x && x.type === "constructor");
  if (!description)
    throw new AbiConstructorNotFoundError({ docsPath });
  if (!("inputs" in description))
    throw new AbiConstructorParamsNotFoundError({ docsPath });
  if (!description.inputs || description.inputs.length === 0)
    throw new AbiConstructorParamsNotFoundError({ docsPath });
  const data = encodeAbiParameters(description.inputs, args);
  return concatHex([bytecode, data]);
}
function withResolvers() {
  let resolve = () => void 0;
  let reject = () => void 0;
  const promise = new Promise((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });
  return { promise, resolve, reject };
}
const schedulerCache = /* @__PURE__ */ new Map();
function createBatchScheduler({ fn, id, shouldSplitBatch, wait = 0, sort }) {
  const exec = async () => {
    const scheduler = getScheduler();
    flush();
    const args = scheduler.map(({ args: args2 }) => args2);
    if (args.length === 0)
      return;
    fn(args).then((data) => {
      if (sort && Array.isArray(data))
        data.sort(sort);
      for (let i2 = 0; i2 < scheduler.length; i2++) {
        const { resolve } = scheduler[i2];
        resolve?.([data[i2], data]);
      }
    }).catch((err) => {
      for (let i2 = 0; i2 < scheduler.length; i2++) {
        const { reject } = scheduler[i2];
        reject?.(err);
      }
    });
  };
  const flush = () => schedulerCache.delete(id);
  const getBatchedArgs = () => getScheduler().map(({ args }) => args);
  const getScheduler = () => schedulerCache.get(id) || [];
  const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
  return {
    flush,
    async schedule(args) {
      const { promise, resolve, reject } = withResolvers();
      const split2 = shouldSplitBatch?.([...getBatchedArgs(), args]);
      if (split2)
        exec();
      const hasActiveScheduler = getScheduler().length > 0;
      if (hasActiveScheduler) {
        setScheduler({ args, resolve, reject });
        return promise;
      }
      setScheduler({ args, resolve, reject });
      setTimeout(exec, wait);
      return promise;
    }
  };
}
function serializeStateMapping(stateMapping) {
  if (!stateMapping || stateMapping.length === 0)
    return void 0;
  return stateMapping.reduce((acc, { slot, value }) => {
    if (slot.length !== 66)
      throw new InvalidBytesLengthError({
        size: slot.length,
        targetSize: 66,
        type: "hex"
      });
    if (value.length !== 66)
      throw new InvalidBytesLengthError({
        size: value.length,
        targetSize: 66,
        type: "hex"
      });
    acc[slot] = value;
    return acc;
  }, {});
}
function serializeAccountStateOverride(parameters) {
  const { balance, nonce, state, stateDiff, code: code2 } = parameters;
  const rpcAccountStateOverride = {};
  if (code2 !== void 0)
    rpcAccountStateOverride.code = code2;
  if (balance !== void 0)
    rpcAccountStateOverride.balance = numberToHex(balance);
  if (nonce !== void 0)
    rpcAccountStateOverride.nonce = numberToHex(nonce);
  if (state !== void 0)
    rpcAccountStateOverride.state = serializeStateMapping(state);
  if (stateDiff !== void 0) {
    if (rpcAccountStateOverride.state)
      throw new StateAssignmentConflictError();
    rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
  }
  return rpcAccountStateOverride;
}
function serializeStateOverride(parameters) {
  if (!parameters)
    return void 0;
  const rpcStateOverride = {};
  for (const { address, ...accountState } of parameters) {
    if (!isAddress(address, { strict: false }))
      throw new InvalidAddressError({ address });
    if (rpcStateOverride[address])
      throw new AccountStateConflictError({ address });
    rpcStateOverride[address] = serializeAccountStateOverride(accountState);
  }
  return rpcStateOverride;
}
async function call(client, args) {
  const { account: account_ = client.account, authorizationList, batch = Boolean(client.batch?.multicall), blockNumber, blockTag = client.experimental_blockTag ?? "latest", accessList, blobs, blockOverrides, code: code2, data: data_, factory: factory2, factoryData, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride, ...rest } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  if (code2 && (factory2 || factoryData))
    throw new BaseError$2("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
  if (code2 && to)
    throw new BaseError$2("Cannot provide both `code` & `to` as parameters.");
  const deploylessCallViaBytecode = code2 && data_;
  const deploylessCallViaFactory = factory2 && factoryData && to && data_;
  const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;
  const data = (() => {
    if (deploylessCallViaBytecode)
      return toDeploylessCallViaBytecodeData({
        code: code2,
        data: data_
      });
    if (deploylessCallViaFactory)
      return toDeploylessCallViaFactoryData({
        data: data_,
        factory: factory2,
        factoryData,
        to
      });
    return data_;
  })();
  try {
    assertRequest(args);
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const block = blockNumberHex || blockTag;
    const rpcBlockOverrides = blockOverrides ? toRpc(blockOverrides) : void 0;
    const rpcStateOverride = serializeStateOverride(stateOverride);
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      accessList,
      account,
      authorizationList,
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to: deploylessCall ? void 0 : to,
      value
    }, "call");
    if (batch && shouldPerformMulticall({ request }) && !rpcStateOverride && !rpcBlockOverrides) {
      try {
        return await scheduleMulticall(client, {
          ...request,
          blockNumber,
          blockTag
        });
      } catch (err) {
        if (!(err instanceof ClientChainNotConfiguredError) && !(err instanceof ChainDoesNotSupportContract))
          throw err;
      }
    }
    const params = (() => {
      const base2 = [
        request,
        block
      ];
      if (rpcStateOverride && rpcBlockOverrides)
        return [...base2, rpcStateOverride, rpcBlockOverrides];
      if (rpcStateOverride)
        return [...base2, rpcStateOverride];
      if (rpcBlockOverrides)
        return [...base2, {}, rpcBlockOverrides];
      return base2;
    })();
    const response = await client.request({
      method: "eth_call",
      params
    });
    if (response === "0x")
      return { data: void 0 };
    return { data: response };
  } catch (err) {
    const data2 = getRevertErrorData(err);
    const { offchainLookup, offchainLookupSignature } = await import("./ccip-9JMIjS27.mjs");
    if (client.ccipRead !== false && data2?.slice(0, 10) === offchainLookupSignature && to)
      return { data: await offchainLookup(client, { data: data2, to }) };
    if (deploylessCall && data2?.slice(0, 10) === "0x101bb98d")
      throw new CounterfactualDeploymentFailedError({ factory: factory2 });
    throw getCallError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}
function shouldPerformMulticall({ request }) {
  const { data, to, ...request_ } = request;
  if (!data)
    return false;
  if (data.startsWith(aggregate3Signature))
    return false;
  if (!to)
    return false;
  if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0)
    return false;
  return true;
}
async function scheduleMulticall(client, args) {
  const { batchSize = 1024, deployless = false, wait = 0 } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
  const { blockNumber, blockTag = client.experimental_blockTag ?? "latest", data, to } = args;
  const multicallAddress = (() => {
    if (deployless)
      return null;
    if (args.multicallAddress)
      return args.multicallAddress;
    if (client.chain) {
      return getChainContractAddress({
        blockNumber,
        chain: client.chain,
        contract: "multicall3"
      });
    }
    throw new ClientChainNotConfiguredError();
  })();
  const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
  const block = blockNumberHex || blockTag;
  const { schedule } = createBatchScheduler({
    id: `${client.uid}.${block}`,
    wait,
    shouldSplitBatch(args2) {
      const size2 = args2.reduce((size3, { data: data2 }) => size3 + (data2.length - 2), 0);
      return size2 > batchSize * 2;
    },
    fn: async (requests) => {
      const calls = requests.map((request) => ({
        allowFailure: true,
        callData: request.data,
        target: request.to
      }));
      const calldata = encodeFunctionData({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3"
      });
      const data2 = await client.request({
        method: "eth_call",
        params: [
          {
            ...multicallAddress === null ? {
              data: toDeploylessCallViaBytecodeData({
                code: multicall3Bytecode,
                data: calldata
              })
            } : { to: multicallAddress, data: calldata }
          },
          block
        ]
      });
      return decodeFunctionResult({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3",
        data: data2 || "0x"
      });
    }
  });
  const [{ returnData, success }] = await schedule({ data, to });
  if (!success)
    throw new RawContractError({ data: returnData });
  if (returnData === "0x")
    return { data: void 0 };
  return { data: returnData };
}
function toDeploylessCallViaBytecodeData(parameters) {
  const { code: code2, data } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(bytes, bytes)"]),
    bytecode: deploylessCallViaBytecodeBytecode,
    args: [code2, data]
  });
}
function toDeploylessCallViaFactoryData(parameters) {
  const { data, factory: factory2, factoryData, to } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(address, bytes, address, bytes)"]),
    bytecode: deploylessCallViaFactoryBytecode,
    args: [to, data, factory2, factoryData]
  });
}
function getRevertErrorData(err) {
  if (!(err instanceof BaseError$2))
    return void 0;
  const error = err.walk();
  return typeof error?.data === "object" ? error.data?.data : error.data;
}
async function readContract(client, parameters) {
  const { abi, address, args, functionName, ...rest } = parameters;
  const calldata = encodeFunctionData({
    abi,
    args,
    functionName
  });
  try {
    const { data } = await getAction(client, call, "call")({
      ...rest,
      data: calldata,
      to: address
    });
    return decodeFunctionResult({
      abi,
      args,
      functionName,
      data: data || "0x"
    });
  } catch (error) {
    throw getContractError$1(error, {
      abi,
      address,
      args,
      docsPath: "/docs/contract/readContract",
      functionName
    });
  }
}
class InvalidDomainError extends BaseError$2 {
  constructor({ domain }) {
    super(`Invalid domain "${stringify(domain)}".`, {
      metaMessages: ["Must be a valid EIP-712 domain."]
    });
  }
}
class InvalidPrimaryTypeError extends BaseError$2 {
  constructor({ primaryType, types: types2 }) {
    super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types2))}\`.`, {
      docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
      metaMessages: ["Check that the primary type is a key in `types`."]
    });
  }
}
class InvalidStructTypeError extends BaseError$2 {
  constructor({ type: type2 }) {
    super(`Struct type "${type2}" is invalid.`, {
      metaMessages: ["Struct type must not be a Solidity type."],
      name: "InvalidStructTypeError"
    });
  }
}
function serializeTypedData(parameters) {
  const { domain: domain_, message: message_, primaryType, types: types2 } = parameters;
  const normalizeData = (struct, data_) => {
    const data = { ...data_ };
    for (const param of struct) {
      const { name, type: type2 } = param;
      if (type2 === "address")
        data[name] = data[name].toLowerCase();
    }
    return data;
  };
  const domain = (() => {
    if (!types2.EIP712Domain)
      return {};
    if (!domain_)
      return {};
    return normalizeData(types2.EIP712Domain, domain_);
  })();
  const message2 = (() => {
    if (primaryType === "EIP712Domain")
      return void 0;
    return normalizeData(types2[primaryType], message_);
  })();
  return stringify({ domain, message: message2, primaryType, types: types2 });
}
function validateTypedData(parameters) {
  const { domain, message: message2, primaryType, types: types2 } = parameters;
  const validateData = (struct, data) => {
    for (const param of struct) {
      const { name, type: type2 } = param;
      const value = data[name];
      const integerMatch = type2.match(integerRegex);
      if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
        const [_type, base2, size_] = integerMatch;
        numberToHex(value, {
          signed: base2 === "int",
          size: Number.parseInt(size_, 10) / 8
        });
      }
      if (type2 === "address" && typeof value === "string" && !isAddress(value))
        throw new InvalidAddressError({ address: value });
      const bytesMatch = type2.match(bytesRegex);
      if (bytesMatch) {
        const [_type, size_] = bytesMatch;
        if (size_ && size(value) !== Number.parseInt(size_, 10))
          throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(size_, 10),
            givenSize: size(value)
          });
      }
      const struct2 = types2[type2];
      if (struct2) {
        validateReference(type2);
        validateData(struct2, value);
      }
    }
  };
  if (types2.EIP712Domain && domain) {
    if (typeof domain !== "object")
      throw new InvalidDomainError({ domain });
    validateData(types2.EIP712Domain, domain);
  }
  if (primaryType !== "EIP712Domain") {
    if (types2[primaryType])
      validateData(types2[primaryType], message2);
    else
      throw new InvalidPrimaryTypeError({ primaryType, types: types2 });
  }
}
function getTypesForEIP712Domain({ domain }) {
  return [
    typeof domain?.name === "string" && { name: "name", type: "string" },
    domain?.version && { name: "version", type: "string" },
    (typeof domain?.chainId === "number" || typeof domain?.chainId === "bigint") && {
      name: "chainId",
      type: "uint256"
    },
    domain?.verifyingContract && {
      name: "verifyingContract",
      type: "address"
    },
    domain?.salt && { name: "salt", type: "bytes32" }
  ].filter(Boolean);
}
function validateReference(type2) {
  if (type2 === "address" || type2 === "bool" || type2 === "string" || type2.startsWith("bytes") || type2.startsWith("uint") || type2.startsWith("int"))
    throw new InvalidStructTypeError({ type: type2 });
}
function hashTypedData(parameters) {
  const { domain = {}, message: message2, primaryType } = parameters;
  const types2 = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({
    domain,
    message: message2,
    primaryType,
    types: types2
  });
  const parts = ["0x1901"];
  if (domain)
    parts.push(hashDomain({
      domain,
      types: types2
    }));
  if (primaryType !== "EIP712Domain")
    parts.push(hashStruct({
      data: message2,
      primaryType,
      types: types2
    }));
  return keccak256(concat(parts));
}
function hashDomain({ domain, types: types2 }) {
  return hashStruct({
    data: domain,
    primaryType: "EIP712Domain",
    types: types2
  });
}
function hashStruct({ data, primaryType, types: types2 }) {
  const encoded = encodeData({
    data,
    primaryType,
    types: types2
  });
  return keccak256(encoded);
}
function encodeData({ data, primaryType, types: types2 }) {
  const encodedTypes = [{ type: "bytes32" }];
  const encodedValues = [hashType({ primaryType, types: types2 })];
  for (const field2 of types2[primaryType]) {
    const [type2, value] = encodeField({
      types: types2,
      name: field2.name,
      type: field2.type,
      value: data[field2.name]
    });
    encodedTypes.push(type2);
    encodedValues.push(value);
  }
  return encodeAbiParameters(encodedTypes, encodedValues);
}
function hashType({ primaryType, types: types2 }) {
  const encodedHashType = toHex(encodeType({ primaryType, types: types2 }));
  return keccak256(encodedHashType);
}
function encodeType({ primaryType, types: types2 }) {
  let result = "";
  const unsortedDeps = findTypeDependencies({ primaryType, types: types2 });
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type2 of deps) {
    result += `${type2}(${types2[type2].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
  }
  return result;
}
function findTypeDependencies({ primaryType: primaryType_, types: types2 }, results = /* @__PURE__ */ new Set()) {
  const match = primaryType_.match(/^\w*/u);
  const primaryType = match?.[0];
  if (results.has(primaryType) || types2[primaryType] === void 0) {
    return results;
  }
  results.add(primaryType);
  for (const field2 of types2[primaryType]) {
    findTypeDependencies({ primaryType: field2.type, types: types2 }, results);
  }
  return results;
}
function encodeField({ types: types2, name, type: type2, value }) {
  if (types2[type2] !== void 0) {
    return [
      { type: "bytes32" },
      keccak256(encodeData({ data: value, primaryType: type2, types: types2 }))
    ];
  }
  if (type2 === "bytes") {
    const prepend = value.length % 2 ? "0" : "";
    value = `0x${prepend + value.slice(2)}`;
    return [{ type: "bytes32" }, keccak256(value)];
  }
  if (type2 === "string")
    return [{ type: "bytes32" }, keccak256(toHex(value))];
  if (type2.lastIndexOf("]") === type2.length - 1) {
    const parsedType = type2.slice(0, type2.lastIndexOf("["));
    const typeValuePairs = value.map((item) => encodeField({
      name,
      type: parsedType,
      types: types2,
      value: item
    }));
    return [
      { type: "bytes32" },
      keccak256(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
    ];
  }
  return [{ type: type2 }, value];
}
function getInitCode(userOperation) {
  const { authorization, factory: factory2, factoryData } = userOperation;
  if (factory2 === "0x7702" || factory2 === "0x7702000000000000000000000000000000000000") {
    if (!authorization)
      return "0x7702000000000000000000000000000000000000";
    const delegation = authorization.address;
    return concat([delegation, factoryData ?? "0x"]);
  }
  if (!factory2)
    return "0x";
  return concat([factory2, factoryData ?? "0x"]);
}
function isAddressEqual(a, b) {
  if (!isAddress(a, { strict: false }))
    throw new InvalidAddressError({ address: a });
  if (!isAddress(b, { strict: false }))
    throw new InvalidAddressError({ address: b });
  return a.toLowerCase() === b.toLowerCase();
}
async function getTransactionCount(client, { address, blockTag = "latest", blockNumber }) {
  const count = await client.request({
    method: "eth_getTransactionCount",
    params: [
      address,
      typeof blockNumber === "bigint" ? numberToHex(blockNumber) : blockTag
    ]
  }, {
    dedupe: Boolean(blockNumber)
  });
  return hexToNumber(count);
}
function toPackedUserOperation(userOperation) {
  const { callGasLimit, callData, maxPriorityFeePerGas, maxFeePerGas, paymaster, paymasterData, paymasterPostOpGasLimit, paymasterVerificationGasLimit, sender, signature = "0x", verificationGasLimit } = userOperation;
  const accountGasLimits = concat([
    pad$1(numberToHex(verificationGasLimit || 0n), { size: 16 }),
    pad$1(numberToHex(callGasLimit || 0n), { size: 16 })
  ]);
  const initCode = getInitCode(userOperation);
  const gasFees = concat([
    pad$1(numberToHex(maxPriorityFeePerGas || 0n), { size: 16 }),
    pad$1(numberToHex(maxFeePerGas || 0n), { size: 16 })
  ]);
  const nonce = userOperation.nonce ?? 0n;
  const paymasterAndData = paymaster ? concat([
    paymaster,
    pad$1(numberToHex(paymasterVerificationGasLimit || 0n), {
      size: 16
    }),
    pad$1(numberToHex(paymasterPostOpGasLimit || 0n), {
      size: 16
    }),
    paymasterData || "0x"
  ]) : "0x";
  const preVerificationGas = userOperation.preVerificationGas ?? 0n;
  return {
    accountGasLimits,
    callData,
    initCode,
    gasFees,
    nonce,
    paymasterAndData,
    preVerificationGas,
    sender,
    signature
  };
}
const types$1 = {
  PackedUserOperation: [
    { type: "address", name: "sender" },
    { type: "uint256", name: "nonce" },
    { type: "bytes", name: "initCode" },
    { type: "bytes", name: "callData" },
    { type: "bytes32", name: "accountGasLimits" },
    { type: "uint256", name: "preVerificationGas" },
    { type: "bytes32", name: "gasFees" },
    { type: "bytes", name: "paymasterAndData" }
  ]
};
function getUserOperationTypedData(parameters) {
  const { chainId, entryPointAddress, userOperation } = parameters;
  const packedUserOp = toPackedUserOperation(userOperation);
  return {
    types: types$1,
    primaryType: "PackedUserOperation",
    domain: {
      name: "ERC4337",
      version: "1",
      chainId,
      verifyingContract: entryPointAddress
    },
    message: packedUserOp
  };
}
function getUserOperationHash(parameters) {
  const { chainId, entryPointAddress, entryPointVersion } = parameters;
  const userOperation = parameters.userOperation;
  const { authorization, callData = "0x", callGasLimit, maxFeePerGas, maxPriorityFeePerGas, nonce, paymasterAndData = "0x", preVerificationGas, sender, verificationGasLimit } = userOperation;
  if (entryPointVersion === "0.8")
    return hashTypedData(getUserOperationTypedData({
      chainId,
      entryPointAddress,
      userOperation
    }));
  const packedUserOp = (() => {
    if (entryPointVersion === "0.6") {
      const factory2 = userOperation.initCode?.slice(0, 42);
      const factoryData = userOperation.initCode?.slice(42);
      const initCode = getInitCode({
        authorization,
        factory: factory2,
        factoryData
      });
      return encodeAbiParameters([
        { type: "address" },
        { type: "uint256" },
        { type: "bytes32" },
        { type: "bytes32" },
        { type: "uint256" },
        { type: "uint256" },
        { type: "uint256" },
        { type: "uint256" },
        { type: "uint256" },
        { type: "bytes32" }
      ], [
        sender,
        nonce,
        keccak256(initCode),
        keccak256(callData),
        callGasLimit,
        verificationGasLimit,
        preVerificationGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        keccak256(paymasterAndData)
      ]);
    }
    if (entryPointVersion === "0.7") {
      const packedUserOp2 = toPackedUserOperation(userOperation);
      return encodeAbiParameters([
        { type: "address" },
        { type: "uint256" },
        { type: "bytes32" },
        { type: "bytes32" },
        { type: "bytes32" },
        { type: "uint256" },
        { type: "bytes32" },
        { type: "bytes32" }
      ], [
        packedUserOp2.sender,
        packedUserOp2.nonce,
        keccak256(packedUserOp2.initCode),
        keccak256(packedUserOp2.callData),
        packedUserOp2.accountGasLimits,
        packedUserOp2.preVerificationGas,
        packedUserOp2.gasFees,
        keccak256(packedUserOp2.paymasterAndData)
      ]);
    }
    throw new Error(`entryPointVersion "${entryPointVersion}" not supported.`);
  })();
  return keccak256(encodeAbiParameters([{ type: "bytes32" }, { type: "address" }, { type: "uint256" }], [keccak256(packedUserOp), entryPointAddress, BigInt(chainId)]));
}
class AccountNotDeployedError extends BaseError$2 {
  constructor({ cause }) {
    super("Smart Account is not deployed.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- No `factory`/`factoryData` or `initCode` properties are provided for Smart Account deployment.",
        "- An incorrect `sender` address is provided."
      ],
      name: "AccountNotDeployedError"
    });
  }
}
Object.defineProperty(AccountNotDeployedError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa20/
});
class ExecutionRevertedError extends BaseError$2 {
  constructor({ cause, data, message: message2 } = {}) {
    const reason = message2?.replace("execution reverted: ", "")?.replace("execution reverted", "");
    super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
      cause,
      name: "ExecutionRevertedError"
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = data;
  }
}
Object.defineProperty(ExecutionRevertedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32521
});
Object.defineProperty(ExecutionRevertedError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /execution reverted/
});
class FailedToSendToBeneficiaryError extends BaseError$2 {
  constructor({ cause }) {
    super("Failed to send funds to beneficiary.", {
      cause,
      name: "FailedToSendToBeneficiaryError"
    });
  }
}
Object.defineProperty(FailedToSendToBeneficiaryError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa91/
});
class GasValuesOverflowError extends BaseError$2 {
  constructor({ cause }) {
    super("Gas value overflowed.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- one of the gas values exceeded 2**120 (uint120)"
      ].filter(Boolean),
      name: "GasValuesOverflowError"
    });
  }
}
Object.defineProperty(GasValuesOverflowError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa94/
});
class HandleOpsOutOfGasError extends BaseError$2 {
  constructor({ cause }) {
    super("The `handleOps` function was called by the Bundler with a gas limit too low.", {
      cause,
      name: "HandleOpsOutOfGasError"
    });
  }
}
Object.defineProperty(HandleOpsOutOfGasError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa95/
});
class InitCodeFailedError extends BaseError$2 {
  constructor({ cause, factory: factory2, factoryData, initCode }) {
    super("Failed to simulate deployment for Smart Account.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- Invalid `factory`/`factoryData` or `initCode` properties are present",
        "- Smart Account deployment execution ran out of gas (low `verificationGasLimit` value)",
        "- Smart Account deployment execution reverted with an error\n",
        factory2 && `factory: ${factory2}`,
        factoryData && `factoryData: ${factoryData}`,
        initCode && `initCode: ${initCode}`
      ].filter(Boolean),
      name: "InitCodeFailedError"
    });
  }
}
Object.defineProperty(InitCodeFailedError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa13/
});
class InitCodeMustCreateSenderError extends BaseError$2 {
  constructor({ cause, factory: factory2, factoryData, initCode }) {
    super("Smart Account initialization implementation did not create an account.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- `factory`/`factoryData` or `initCode` properties are invalid",
        "- Smart Account initialization implementation is incorrect\n",
        factory2 && `factory: ${factory2}`,
        factoryData && `factoryData: ${factoryData}`,
        initCode && `initCode: ${initCode}`
      ].filter(Boolean),
      name: "InitCodeMustCreateSenderError"
    });
  }
}
Object.defineProperty(InitCodeMustCreateSenderError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa15/
});
class InitCodeMustReturnSenderError extends BaseError$2 {
  constructor({ cause, factory: factory2, factoryData, initCode, sender }) {
    super("Smart Account initialization implementation does not return the expected sender.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "Smart Account initialization implementation does not return a sender address\n",
        factory2 && `factory: ${factory2}`,
        factoryData && `factoryData: ${factoryData}`,
        initCode && `initCode: ${initCode}`,
        sender && `sender: ${sender}`
      ].filter(Boolean),
      name: "InitCodeMustReturnSenderError"
    });
  }
}
Object.defineProperty(InitCodeMustReturnSenderError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa14/
});
class InsufficientPrefundError extends BaseError$2 {
  constructor({ cause }) {
    super("Smart Account does not have sufficient funds to execute the User Operation.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- the Smart Account does not have sufficient funds to cover the required prefund, or",
        "- a Paymaster was not provided"
      ].filter(Boolean),
      name: "InsufficientPrefundError"
    });
  }
}
Object.defineProperty(InsufficientPrefundError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa21/
});
class InternalCallOnlyError extends BaseError$2 {
  constructor({ cause }) {
    super("Bundler attempted to call an invalid function on the EntryPoint.", {
      cause,
      name: "InternalCallOnlyError"
    });
  }
}
Object.defineProperty(InternalCallOnlyError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa92/
});
class InvalidAggregatorError extends BaseError$2 {
  constructor({ cause }) {
    super("Bundler used an invalid aggregator for handling aggregated User Operations.", {
      cause,
      name: "InvalidAggregatorError"
    });
  }
}
Object.defineProperty(InvalidAggregatorError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa96/
});
class InvalidAccountNonceError extends BaseError$2 {
  constructor({ cause, nonce }) {
    super("Invalid Smart Account nonce used for User Operation.", {
      cause,
      metaMessages: [nonce && `nonce: ${nonce}`].filter(Boolean),
      name: "InvalidAccountNonceError"
    });
  }
}
Object.defineProperty(InvalidAccountNonceError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa25/
});
class InvalidBeneficiaryError extends BaseError$2 {
  constructor({ cause }) {
    super("Bundler has not set a beneficiary address.", {
      cause,
      name: "InvalidBeneficiaryError"
    });
  }
}
Object.defineProperty(InvalidBeneficiaryError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa90/
});
class InvalidFieldsError extends BaseError$2 {
  constructor({ cause }) {
    super("Invalid fields set on User Operation.", {
      cause,
      name: "InvalidFieldsError"
    });
  }
}
Object.defineProperty(InvalidFieldsError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32602
});
class InvalidPaymasterAndDataError extends BaseError$2 {
  constructor({ cause, paymasterAndData }) {
    super("Paymaster properties provided are invalid.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- the `paymasterAndData` property is of an incorrect length\n",
        paymasterAndData && `paymasterAndData: ${paymasterAndData}`
      ].filter(Boolean),
      name: "InvalidPaymasterAndDataError"
    });
  }
}
Object.defineProperty(InvalidPaymasterAndDataError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa93/
});
class PaymasterDepositTooLowError extends BaseError$2 {
  constructor({ cause }) {
    super("Paymaster deposit for the User Operation is too low.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- the Paymaster has deposited less than the expected amount via the `deposit` function"
      ].filter(Boolean),
      name: "PaymasterDepositTooLowError"
    });
  }
}
Object.defineProperty(PaymasterDepositTooLowError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32508
});
Object.defineProperty(PaymasterDepositTooLowError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa31/
});
class PaymasterFunctionRevertedError extends BaseError$2 {
  constructor({ cause }) {
    super("The `validatePaymasterUserOp` function on the Paymaster reverted.", {
      cause,
      name: "PaymasterFunctionRevertedError"
    });
  }
}
Object.defineProperty(PaymasterFunctionRevertedError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa33/
});
class PaymasterNotDeployedError extends BaseError$2 {
  constructor({ cause }) {
    super("The Paymaster contract has not been deployed.", {
      cause,
      name: "PaymasterNotDeployedError"
    });
  }
}
Object.defineProperty(PaymasterNotDeployedError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa30/
});
class PaymasterRateLimitError extends BaseError$2 {
  constructor({ cause }) {
    super("UserOperation rejected because paymaster (or signature aggregator) is throttled/banned.", {
      cause,
      name: "PaymasterRateLimitError"
    });
  }
}
Object.defineProperty(PaymasterRateLimitError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32504
});
class PaymasterStakeTooLowError extends BaseError$2 {
  constructor({ cause }) {
    super("UserOperation rejected because paymaster (or signature aggregator) is throttled/banned.", {
      cause,
      name: "PaymasterStakeTooLowError"
    });
  }
}
Object.defineProperty(PaymasterStakeTooLowError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32505
});
class PaymasterPostOpFunctionRevertedError extends BaseError$2 {
  constructor({ cause }) {
    super("Paymaster `postOp` function reverted.", {
      cause,
      name: "PaymasterPostOpFunctionRevertedError"
    });
  }
}
Object.defineProperty(PaymasterPostOpFunctionRevertedError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa50/
});
class SenderAlreadyConstructedError extends BaseError$2 {
  constructor({ cause, factory: factory2, factoryData, initCode }) {
    super("Smart Account has already been deployed.", {
      cause,
      metaMessages: [
        "Remove the following properties and try again:",
        factory2 && "`factory`",
        factoryData && "`factoryData`",
        initCode && "`initCode`"
      ].filter(Boolean),
      name: "SenderAlreadyConstructedError"
    });
  }
}
Object.defineProperty(SenderAlreadyConstructedError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa10/
});
class SignatureCheckFailedError extends BaseError$2 {
  constructor({ cause }) {
    super("UserOperation rejected because account signature check failed (or paymaster signature, if the paymaster uses its data as signature).", {
      cause,
      name: "SignatureCheckFailedError"
    });
  }
}
Object.defineProperty(SignatureCheckFailedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32507
});
class SmartAccountFunctionRevertedError extends BaseError$2 {
  constructor({ cause }) {
    super("The `validateUserOp` function on the Smart Account reverted.", {
      cause,
      name: "SmartAccountFunctionRevertedError"
    });
  }
}
Object.defineProperty(SmartAccountFunctionRevertedError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa23/
});
class UnsupportedSignatureAggregatorError extends BaseError$2 {
  constructor({ cause }) {
    super("UserOperation rejected because account specified unsupported signature aggregator.", {
      cause,
      name: "UnsupportedSignatureAggregatorError"
    });
  }
}
Object.defineProperty(UnsupportedSignatureAggregatorError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32506
});
class UserOperationExpiredError extends BaseError$2 {
  constructor({ cause }) {
    super("User Operation expired.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- the `validAfter` or `validUntil` values returned from `validateUserOp` on the Smart Account are not satisfied"
      ].filter(Boolean),
      name: "UserOperationExpiredError"
    });
  }
}
Object.defineProperty(UserOperationExpiredError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa22/
});
class UserOperationPaymasterExpiredError extends BaseError$2 {
  constructor({ cause }) {
    super("Paymaster for User Operation expired.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- the `validAfter` or `validUntil` values returned from `validatePaymasterUserOp` on the Paymaster are not satisfied"
      ].filter(Boolean),
      name: "UserOperationPaymasterExpiredError"
    });
  }
}
Object.defineProperty(UserOperationPaymasterExpiredError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa32/
});
class UserOperationSignatureError extends BaseError$2 {
  constructor({ cause }) {
    super("Signature provided for the User Operation is invalid.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- the `signature` for the User Operation is incorrectly computed, and unable to be verified by the Smart Account"
      ].filter(Boolean),
      name: "UserOperationSignatureError"
    });
  }
}
Object.defineProperty(UserOperationSignatureError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa24/
});
class UserOperationPaymasterSignatureError extends BaseError$2 {
  constructor({ cause }) {
    super("Signature provided for the User Operation is invalid.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- the `signature` for the User Operation is incorrectly computed, and unable to be verified by the Paymaster"
      ].filter(Boolean),
      name: "UserOperationPaymasterSignatureError"
    });
  }
}
Object.defineProperty(UserOperationPaymasterSignatureError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa34/
});
class UserOperationRejectedByEntryPointError extends BaseError$2 {
  constructor({ cause }) {
    super("User Operation rejected by EntryPoint's `simulateValidation` during account creation or validation.", {
      cause,
      name: "UserOperationRejectedByEntryPointError"
    });
  }
}
Object.defineProperty(UserOperationRejectedByEntryPointError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32500
});
class UserOperationRejectedByPaymasterError extends BaseError$2 {
  constructor({ cause }) {
    super("User Operation rejected by Paymaster's `validatePaymasterUserOp`.", {
      cause,
      name: "UserOperationRejectedByPaymasterError"
    });
  }
}
Object.defineProperty(UserOperationRejectedByPaymasterError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32501
});
class UserOperationRejectedByOpCodeError extends BaseError$2 {
  constructor({ cause }) {
    super("User Operation rejected with op code validation error.", {
      cause,
      name: "UserOperationRejectedByOpCodeError"
    });
  }
}
Object.defineProperty(UserOperationRejectedByOpCodeError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32502
});
class UserOperationOutOfTimeRangeError extends BaseError$2 {
  constructor({ cause }) {
    super("UserOperation out of time-range: either wallet or paymaster returned a time-range, and it is already expired (or will expire soon).", {
      cause,
      name: "UserOperationOutOfTimeRangeError"
    });
  }
}
Object.defineProperty(UserOperationOutOfTimeRangeError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32503
});
class UnknownBundlerError extends BaseError$2 {
  constructor({ cause }) {
    super(`An error occurred while executing user operation: ${cause?.shortMessage}`, {
      cause,
      name: "UnknownBundlerError"
    });
  }
}
class VerificationGasLimitExceededError extends BaseError$2 {
  constructor({ cause }) {
    super("User Operation verification gas limit exceeded.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- the gas used for verification exceeded the `verificationGasLimit`"
      ].filter(Boolean),
      name: "VerificationGasLimitExceededError"
    });
  }
}
Object.defineProperty(VerificationGasLimitExceededError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa40/
});
class VerificationGasLimitTooLowError extends BaseError$2 {
  constructor({ cause }) {
    super("User Operation verification gas limit is too low.", {
      cause,
      metaMessages: [
        "This could arise when:",
        "- the `verificationGasLimit` is too low to verify the User Operation"
      ].filter(Boolean),
      name: "VerificationGasLimitTooLowError"
    });
  }
}
Object.defineProperty(VerificationGasLimitTooLowError, "message", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /aa41/
});
class UserOperationExecutionError extends BaseError$2 {
  constructor(cause, { callData, callGasLimit, docsPath: docsPath2, factory: factory2, factoryData, initCode, maxFeePerGas, maxPriorityFeePerGas, nonce, paymaster, paymasterAndData, paymasterData, paymasterPostOpGasLimit, paymasterVerificationGasLimit, preVerificationGas, sender, signature, verificationGasLimit }) {
    const prettyArgs = prettyPrint({
      callData,
      callGasLimit,
      factory: factory2,
      factoryData,
      initCode,
      maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce,
      paymaster,
      paymasterAndData,
      paymasterData,
      paymasterPostOpGasLimit,
      paymasterVerificationGasLimit,
      preVerificationGas,
      sender,
      signature,
      verificationGasLimit
    });
    super(cause.shortMessage, {
      cause,
      docsPath: docsPath2,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        "Request Arguments:",
        prettyArgs
      ].filter(Boolean),
      name: "UserOperationExecutionError"
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.cause = cause;
  }
}
const bundlerErrors = [
  ExecutionRevertedError,
  InvalidFieldsError,
  PaymasterDepositTooLowError,
  PaymasterRateLimitError,
  PaymasterStakeTooLowError,
  SignatureCheckFailedError,
  UnsupportedSignatureAggregatorError,
  UserOperationOutOfTimeRangeError,
  UserOperationRejectedByEntryPointError,
  UserOperationRejectedByPaymasterError,
  UserOperationRejectedByOpCodeError
];
function getBundlerError(err, args) {
  const message2 = (err.details || "").toLowerCase();
  if (AccountNotDeployedError.message.test(message2))
    return new AccountNotDeployedError({
      cause: err
    });
  if (FailedToSendToBeneficiaryError.message.test(message2))
    return new FailedToSendToBeneficiaryError({
      cause: err
    });
  if (GasValuesOverflowError.message.test(message2))
    return new GasValuesOverflowError({
      cause: err
    });
  if (HandleOpsOutOfGasError.message.test(message2))
    return new HandleOpsOutOfGasError({
      cause: err
    });
  if (InitCodeFailedError.message.test(message2))
    return new InitCodeFailedError({
      cause: err,
      factory: args.factory,
      factoryData: args.factoryData,
      initCode: args.initCode
    });
  if (InitCodeMustCreateSenderError.message.test(message2))
    return new InitCodeMustCreateSenderError({
      cause: err,
      factory: args.factory,
      factoryData: args.factoryData,
      initCode: args.initCode
    });
  if (InitCodeMustReturnSenderError.message.test(message2))
    return new InitCodeMustReturnSenderError({
      cause: err,
      factory: args.factory,
      factoryData: args.factoryData,
      initCode: args.initCode,
      sender: args.sender
    });
  if (InsufficientPrefundError.message.test(message2))
    return new InsufficientPrefundError({
      cause: err
    });
  if (InternalCallOnlyError.message.test(message2))
    return new InternalCallOnlyError({
      cause: err
    });
  if (InvalidAccountNonceError.message.test(message2))
    return new InvalidAccountNonceError({
      cause: err,
      nonce: args.nonce
    });
  if (InvalidAggregatorError.message.test(message2))
    return new InvalidAggregatorError({
      cause: err
    });
  if (InvalidBeneficiaryError.message.test(message2))
    return new InvalidBeneficiaryError({
      cause: err
    });
  if (InvalidPaymasterAndDataError.message.test(message2))
    return new InvalidPaymasterAndDataError({
      cause: err
    });
  if (PaymasterDepositTooLowError.message.test(message2))
    return new PaymasterDepositTooLowError({
      cause: err
    });
  if (PaymasterFunctionRevertedError.message.test(message2))
    return new PaymasterFunctionRevertedError({
      cause: err
    });
  if (PaymasterNotDeployedError.message.test(message2))
    return new PaymasterNotDeployedError({
      cause: err
    });
  if (PaymasterPostOpFunctionRevertedError.message.test(message2))
    return new PaymasterPostOpFunctionRevertedError({
      cause: err
    });
  if (SmartAccountFunctionRevertedError.message.test(message2))
    return new SmartAccountFunctionRevertedError({
      cause: err
    });
  if (SenderAlreadyConstructedError.message.test(message2))
    return new SenderAlreadyConstructedError({
      cause: err,
      factory: args.factory,
      factoryData: args.factoryData,
      initCode: args.initCode
    });
  if (UserOperationExpiredError.message.test(message2))
    return new UserOperationExpiredError({
      cause: err
    });
  if (UserOperationPaymasterExpiredError.message.test(message2))
    return new UserOperationPaymasterExpiredError({
      cause: err
    });
  if (UserOperationPaymasterSignatureError.message.test(message2))
    return new UserOperationPaymasterSignatureError({
      cause: err
    });
  if (UserOperationSignatureError.message.test(message2))
    return new UserOperationSignatureError({
      cause: err
    });
  if (VerificationGasLimitExceededError.message.test(message2))
    return new VerificationGasLimitExceededError({
      cause: err
    });
  if (VerificationGasLimitTooLowError.message.test(message2))
    return new VerificationGasLimitTooLowError({
      cause: err
    });
  const error = err.walk((e) => bundlerErrors.some((error2) => error2.code === e.code));
  if (error) {
    if (error.code === ExecutionRevertedError.code)
      return new ExecutionRevertedError({
        cause: err,
        data: error.data,
        message: error.details
      });
    if (error.code === InvalidFieldsError.code)
      return new InvalidFieldsError({
        cause: err
      });
    if (error.code === PaymasterDepositTooLowError.code)
      return new PaymasterDepositTooLowError({
        cause: err
      });
    if (error.code === PaymasterRateLimitError.code)
      return new PaymasterRateLimitError({
        cause: err
      });
    if (error.code === PaymasterStakeTooLowError.code)
      return new PaymasterStakeTooLowError({
        cause: err
      });
    if (error.code === SignatureCheckFailedError.code)
      return new SignatureCheckFailedError({
        cause: err
      });
    if (error.code === UnsupportedSignatureAggregatorError.code)
      return new UnsupportedSignatureAggregatorError({
        cause: err
      });
    if (error.code === UserOperationOutOfTimeRangeError.code)
      return new UserOperationOutOfTimeRangeError({
        cause: err
      });
    if (error.code === UserOperationRejectedByEntryPointError.code)
      return new UserOperationRejectedByEntryPointError({
        cause: err
      });
    if (error.code === UserOperationRejectedByPaymasterError.code)
      return new UserOperationRejectedByPaymasterError({
        cause: err
      });
    if (error.code === UserOperationRejectedByOpCodeError.code)
      return new UserOperationRejectedByOpCodeError({
        cause: err
      });
  }
  return new UnknownBundlerError({
    cause: err
  });
}
function getUserOperationError(err, { calls, docsPath: docsPath2, ...args }) {
  const cause = (() => {
    const cause2 = getBundlerError(err, args);
    if (calls && cause2 instanceof ExecutionRevertedError) {
      const revertData = getRevertData(cause2);
      const contractCalls = calls?.filter((call2) => call2.abi);
      if (revertData && contractCalls.length > 0)
        return getContractError({ calls: contractCalls, revertData });
    }
    return cause2;
  })();
  return new UserOperationExecutionError(cause, {
    docsPath: docsPath2,
    ...args
  });
}
function getRevertData(error) {
  let revertData;
  error.walk((e) => {
    const error2 = e;
    if (typeof error2.data === "string" || typeof error2.data?.revertData === "string" || !(error2 instanceof BaseError$2) && typeof error2.message === "string") {
      const match = (error2.data?.revertData || error2.data || error2.message).match?.(/(0x[A-Za-z0-9]*)/);
      if (match) {
        revertData = match[1];
        return true;
      }
    }
    return false;
  });
  return revertData;
}
function getContractError(parameters) {
  const { calls, revertData } = parameters;
  const { abi, functionName, args, to } = (() => {
    const contractCalls = calls?.filter((call2) => Boolean(call2.abi));
    if (contractCalls.length === 1)
      return contractCalls[0];
    const compatContractCalls = contractCalls.filter((call2) => {
      try {
        return Boolean(decodeErrorResult({
          abi: call2.abi,
          data: revertData
        }));
      } catch {
        return false;
      }
    });
    if (compatContractCalls.length === 1)
      return compatContractCalls[0];
    return {
      abi: [],
      functionName: contractCalls.reduce((acc, call2) => `${acc ? `${acc} | ` : ""}${call2.functionName}`, ""),
      args: void 0,
      to: void 0
    };
  })();
  const cause = (() => {
    if (revertData === "0x")
      return new ContractFunctionZeroDataError({ functionName });
    return new ContractFunctionRevertedError({
      abi,
      data: revertData,
      functionName
    });
  })();
  return new ContractFunctionExecutionError(cause, {
    abi,
    args,
    contractAddress: to,
    functionName
  });
}
function formatUserOperationGas(parameters) {
  const gas = {};
  if (parameters.callGasLimit)
    gas.callGasLimit = BigInt(parameters.callGasLimit);
  if (parameters.preVerificationGas)
    gas.preVerificationGas = BigInt(parameters.preVerificationGas);
  if (parameters.verificationGasLimit)
    gas.verificationGasLimit = BigInt(parameters.verificationGasLimit);
  if (parameters.paymasterPostOpGasLimit)
    gas.paymasterPostOpGasLimit = BigInt(parameters.paymasterPostOpGasLimit);
  if (parameters.paymasterVerificationGasLimit)
    gas.paymasterVerificationGasLimit = BigInt(parameters.paymasterVerificationGasLimit);
  return gas;
}
function formatUserOperationRequest(request) {
  const rpcRequest = {};
  if (typeof request.callData !== "undefined")
    rpcRequest.callData = request.callData;
  if (typeof request.callGasLimit !== "undefined")
    rpcRequest.callGasLimit = numberToHex(request.callGasLimit);
  if (typeof request.factory !== "undefined")
    rpcRequest.factory = request.factory;
  if (typeof request.factoryData !== "undefined")
    rpcRequest.factoryData = request.factoryData;
  if (typeof request.initCode !== "undefined")
    rpcRequest.initCode = request.initCode;
  if (typeof request.maxFeePerGas !== "undefined")
    rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
  if (typeof request.maxPriorityFeePerGas !== "undefined")
    rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
  if (typeof request.nonce !== "undefined")
    rpcRequest.nonce = numberToHex(request.nonce);
  if (typeof request.paymaster !== "undefined")
    rpcRequest.paymaster = request.paymaster;
  if (typeof request.paymasterAndData !== "undefined")
    rpcRequest.paymasterAndData = request.paymasterAndData || "0x";
  if (typeof request.paymasterData !== "undefined")
    rpcRequest.paymasterData = request.paymasterData;
  if (typeof request.paymasterPostOpGasLimit !== "undefined")
    rpcRequest.paymasterPostOpGasLimit = numberToHex(request.paymasterPostOpGasLimit);
  if (typeof request.paymasterVerificationGasLimit !== "undefined")
    rpcRequest.paymasterVerificationGasLimit = numberToHex(request.paymasterVerificationGasLimit);
  if (typeof request.preVerificationGas !== "undefined")
    rpcRequest.preVerificationGas = numberToHex(request.preVerificationGas);
  if (typeof request.sender !== "undefined")
    rpcRequest.sender = request.sender;
  if (typeof request.signature !== "undefined")
    rpcRequest.signature = request.signature;
  if (typeof request.verificationGasLimit !== "undefined")
    rpcRequest.verificationGasLimit = numberToHex(request.verificationGasLimit);
  if (typeof request.authorization !== "undefined")
    rpcRequest.eip7702Auth = formatAuthorization(request.authorization);
  return rpcRequest;
}
function formatAuthorization(authorization) {
  return {
    address: authorization.address,
    chainId: numberToHex(authorization.chainId),
    nonce: numberToHex(authorization.nonce),
    r: authorization.r ? numberToHex(BigInt(authorization.r), { size: 32 }) : pad$1("0x", { size: 32 }),
    s: authorization.s ? numberToHex(BigInt(authorization.s), { size: 32 }) : pad$1("0x", { size: 32 }),
    yParity: authorization.yParity ? numberToHex(authorization.yParity, { size: 1 }) : pad$1("0x", { size: 32 })
  };
}
class BaseFeeScalarError extends BaseError$2 {
  constructor() {
    super("`baseFeeMultiplier` must be greater than 1.", {
      name: "BaseFeeScalarError"
    });
  }
}
class Eip1559FeesNotSupportedError extends BaseError$2 {
  constructor() {
    super("Chain does not support EIP-1559 fees.", {
      name: "Eip1559FeesNotSupportedError"
    });
  }
}
class BlockNotFoundError extends BaseError$2 {
  constructor({ blockHash, blockNumber }) {
    let identifier = "Block";
    if (blockHash)
      identifier = `Block at hash "${blockHash}"`;
    if (blockNumber)
      identifier = `Block at number "${blockNumber}"`;
    super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
  }
}
async function getBlock(client, { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", includeTransactions: includeTransactions_ } = {}) {
  const includeTransactions = includeTransactions_ ?? false;
  const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
  let block = null;
  if (blockHash) {
    block = await client.request({
      method: "eth_getBlockByHash",
      params: [blockHash, includeTransactions]
    }, { dedupe: true });
  } else {
    block = await client.request({
      method: "eth_getBlockByNumber",
      params: [blockNumberHex || blockTag, includeTransactions]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  if (!block)
    throw new BlockNotFoundError({ blockHash, blockNumber });
  const format = client.chain?.formatters?.block?.format || formatBlock;
  return format(block, "getBlock");
}
async function getGasPrice(client) {
  const gasPrice = await client.request({
    method: "eth_gasPrice"
  });
  return BigInt(gasPrice);
}
async function internal_estimateMaxPriorityFeePerGas(client, args) {
  const { block: block_, chain = client.chain, request } = args || {};
  try {
    const maxPriorityFeePerGas = chain?.fees?.maxPriorityFeePerGas ?? chain?.fees?.defaultPriorityFee;
    if (typeof maxPriorityFeePerGas === "function") {
      const block = block_ || await getAction(client, getBlock, "getBlock")({});
      const maxPriorityFeePerGas_ = await maxPriorityFeePerGas({
        block,
        client,
        request
      });
      if (maxPriorityFeePerGas_ === null)
        throw new Error();
      return maxPriorityFeePerGas_;
    }
    if (typeof maxPriorityFeePerGas !== "undefined")
      return maxPriorityFeePerGas;
    const maxPriorityFeePerGasHex = await client.request({
      method: "eth_maxPriorityFeePerGas"
    });
    return hexToBigInt(maxPriorityFeePerGasHex);
  } catch {
    const [block, gasPrice] = await Promise.all([
      block_ ? Promise.resolve(block_) : getAction(client, getBlock, "getBlock")({}),
      getAction(client, getGasPrice, "getGasPrice")({})
    ]);
    if (typeof block.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError();
    const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
    if (maxPriorityFeePerGas < 0n)
      return 0n;
    return maxPriorityFeePerGas;
  }
}
async function estimateFeesPerGas(client, args) {
  return internal_estimateFeesPerGas(client, args);
}
async function internal_estimateFeesPerGas(client, args) {
  const { block: block_, chain = client.chain, request, type: type2 = "eip1559" } = args || {};
  const baseFeeMultiplier = await (async () => {
    if (typeof chain?.fees?.baseFeeMultiplier === "function")
      return chain.fees.baseFeeMultiplier({
        block: block_,
        client,
        request
      });
    return chain?.fees?.baseFeeMultiplier ?? 1.2;
  })();
  if (baseFeeMultiplier < 1)
    throw new BaseFeeScalarError();
  const decimals = baseFeeMultiplier.toString().split(".")[1]?.length ?? 0;
  const denominator = 10 ** decimals;
  const multiply = (base2) => base2 * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
  const block = block_ ? block_ : await getAction(client, getBlock, "getBlock")({});
  if (typeof chain?.fees?.estimateFeesPerGas === "function") {
    const fees = await chain.fees.estimateFeesPerGas({
      block: block_,
      client,
      multiply,
      request,
      type: type2
    });
    if (fees !== null)
      return fees;
  }
  if (type2 === "eip1559") {
    if (typeof block.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError();
    const maxPriorityFeePerGas = typeof request?.maxPriorityFeePerGas === "bigint" ? request.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(client, {
      block,
      chain,
      request
    });
    const baseFeePerGas = multiply(block.baseFeePerGas);
    const maxFeePerGas = request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
    return {
      maxFeePerGas,
      maxPriorityFeePerGas
    };
  }
  const gasPrice = request?.gasPrice ?? multiply(await getAction(client, getGasPrice, "getGasPrice")({}));
  return {
    gasPrice
  };
}
async function getChainId(client) {
  const chainIdHex = await client.request({
    method: "eth_chainId"
  }, { dedupe: true });
  return hexToNumber(chainIdHex);
}
async function prepareAuthorization(client, parameters) {
  const { account: account_ = client.account, chainId, nonce } = parameters;
  if (!account_)
    throw new AccountNotFoundError$1({
      docsPath: "/docs/eip7702/prepareAuthorization"
    });
  const account = parseAccount(account_);
  const executor = (() => {
    if (!parameters.executor)
      return void 0;
    if (parameters.executor === "self")
      return parameters.executor;
    return parseAccount(parameters.executor);
  })();
  const authorization = {
    address: parameters.contractAddress ?? parameters.address,
    chainId,
    nonce
  };
  if (typeof authorization.chainId === "undefined")
    authorization.chainId = client.chain?.id ?? await getAction(client, getChainId, "getChainId")({});
  if (typeof authorization.nonce === "undefined") {
    authorization.nonce = await getAction(client, getTransactionCount, "getTransactionCount")({
      address: account.address,
      blockTag: "pending"
    });
    if (executor === "self" || executor?.address && isAddressEqual(executor.address, account.address))
      authorization.nonce += 1;
  }
  return authorization;
}
async function getPaymasterData(client, parameters) {
  const { chainId, entryPointAddress, context, ...userOperation } = parameters;
  const request = formatUserOperationRequest(userOperation);
  const { paymasterPostOpGasLimit, paymasterVerificationGasLimit, ...rest } = await client.request({
    method: "pm_getPaymasterData",
    params: [
      {
        ...request,
        callGasLimit: request.callGasLimit ?? "0x0",
        verificationGasLimit: request.verificationGasLimit ?? "0x0",
        preVerificationGas: request.preVerificationGas ?? "0x0"
      },
      entryPointAddress,
      numberToHex(chainId),
      context
    ]
  });
  return {
    ...rest,
    ...paymasterPostOpGasLimit && {
      paymasterPostOpGasLimit: hexToBigInt(paymasterPostOpGasLimit)
    },
    ...paymasterVerificationGasLimit && {
      paymasterVerificationGasLimit: hexToBigInt(paymasterVerificationGasLimit)
    }
  };
}
async function getPaymasterStubData(client, parameters) {
  const { chainId, entryPointAddress, context, ...userOperation } = parameters;
  const request = formatUserOperationRequest(userOperation);
  const { paymasterPostOpGasLimit, paymasterVerificationGasLimit, ...rest } = await client.request({
    method: "pm_getPaymasterStubData",
    params: [
      {
        ...request,
        callGasLimit: request.callGasLimit ?? "0x0",
        verificationGasLimit: request.verificationGasLimit ?? "0x0",
        preVerificationGas: request.preVerificationGas ?? "0x0"
      },
      entryPointAddress,
      numberToHex(chainId),
      context
    ]
  });
  return {
    ...rest,
    ...paymasterPostOpGasLimit && {
      paymasterPostOpGasLimit: hexToBigInt(paymasterPostOpGasLimit)
    },
    ...paymasterVerificationGasLimit && {
      paymasterVerificationGasLimit: hexToBigInt(paymasterVerificationGasLimit)
    }
  };
}
const defaultParameters = [
  "factory",
  "fees",
  "gas",
  "paymaster",
  "nonce",
  "signature",
  "authorization"
];
async function prepareUserOperation(client, parameters_) {
  const parameters = parameters_;
  const { account: account_ = client.account, parameters: properties = defaultParameters, stateOverride } = parameters;
  if (!account_)
    throw new AccountNotFoundError$1();
  const account = parseAccount(account_);
  const bundlerClient = client;
  const paymaster = parameters.paymaster ?? bundlerClient?.paymaster;
  const paymasterAddress = typeof paymaster === "string" ? paymaster : void 0;
  const { getPaymasterStubData: getPaymasterStubData$1, getPaymasterData: getPaymasterData$1 } = (() => {
    if (paymaster === true)
      return {
        getPaymasterStubData: (parameters2) => getAction(bundlerClient, getPaymasterStubData, "getPaymasterStubData")(parameters2),
        getPaymasterData: (parameters2) => getAction(bundlerClient, getPaymasterData, "getPaymasterData")(parameters2)
      };
    if (typeof paymaster === "object") {
      const { getPaymasterStubData: getPaymasterStubData2, getPaymasterData: getPaymasterData2 } = paymaster;
      return {
        getPaymasterStubData: getPaymasterData2 && getPaymasterStubData2 ? getPaymasterStubData2 : getPaymasterData2,
        getPaymasterData: getPaymasterData2 && getPaymasterStubData2 ? getPaymasterData2 : void 0
      };
    }
    return {
      getPaymasterStubData: void 0,
      getPaymasterData: void 0
    };
  })();
  const paymasterContext = parameters.paymasterContext ? parameters.paymasterContext : bundlerClient?.paymasterContext;
  let request = {
    ...parameters,
    paymaster: paymasterAddress,
    sender: account.address
  };
  const [callData, factory2, fees, nonce, authorization] = await Promise.all([
    (async () => {
      if (parameters.calls)
        return account.encodeCalls(parameters.calls.map((call_) => {
          const call2 = call_;
          if (call2.abi)
            return {
              data: encodeFunctionData(call2),
              to: call2.to,
              value: call2.value
            };
          return call2;
        }));
      return parameters.callData;
    })(),
    (async () => {
      if (!properties.includes("factory"))
        return void 0;
      if (parameters.initCode)
        return { initCode: parameters.initCode };
      if (parameters.factory && parameters.factoryData) {
        return {
          factory: parameters.factory,
          factoryData: parameters.factoryData
        };
      }
      const { factory: factory3, factoryData } = await account.getFactoryArgs();
      if (account.entryPoint.version === "0.6")
        return {
          initCode: factory3 && factoryData ? concat([factory3, factoryData]) : void 0
        };
      return {
        factory: factory3,
        factoryData
      };
    })(),
    (async () => {
      if (!properties.includes("fees"))
        return void 0;
      if (typeof parameters.maxFeePerGas === "bigint" && typeof parameters.maxPriorityFeePerGas === "bigint")
        return request;
      if (bundlerClient?.userOperation?.estimateFeesPerGas) {
        const fees2 = await bundlerClient.userOperation.estimateFeesPerGas({
          account,
          bundlerClient,
          userOperation: request
        });
        return {
          ...request,
          ...fees2
        };
      }
      try {
        const client_ = bundlerClient.client ?? client;
        const fees2 = await getAction(client_, estimateFeesPerGas, "estimateFeesPerGas")({
          chain: client_.chain,
          type: "eip1559"
        });
        return {
          maxFeePerGas: typeof parameters.maxFeePerGas === "bigint" ? parameters.maxFeePerGas : BigInt(
            // Bundlers unfortunately have strict rules on fee prechecks – we will need to set a generous buffer.
            2n * fees2.maxFeePerGas
          ),
          maxPriorityFeePerGas: typeof parameters.maxPriorityFeePerGas === "bigint" ? parameters.maxPriorityFeePerGas : BigInt(
            // Bundlers unfortunately have strict rules on fee prechecks – we will need to set a generous buffer.
            2n * fees2.maxPriorityFeePerGas
          )
        };
      } catch {
        return void 0;
      }
    })(),
    (async () => {
      if (!properties.includes("nonce"))
        return void 0;
      if (typeof parameters.nonce === "bigint")
        return parameters.nonce;
      return account.getNonce();
    })(),
    (async () => {
      if (!properties.includes("authorization"))
        return void 0;
      if (typeof parameters.authorization === "object")
        return parameters.authorization;
      if (account.authorization && !await account.isDeployed()) {
        const authorization2 = await prepareAuthorization(account.client, account.authorization);
        return {
          ...authorization2,
          r: "0xfffffffffffffffffffffffffffffff000000000000000000000000000000000",
          s: "0x7aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          yParity: 1
        };
      }
      return void 0;
    })()
  ]);
  if (typeof callData !== "undefined")
    request.callData = callData;
  if (typeof factory2 !== "undefined")
    request = { ...request, ...factory2 };
  if (typeof fees !== "undefined")
    request = { ...request, ...fees };
  if (typeof nonce !== "undefined")
    request.nonce = nonce;
  if (typeof authorization !== "undefined")
    request.authorization = authorization;
  if (properties.includes("signature")) {
    if (typeof parameters.signature !== "undefined")
      request.signature = parameters.signature;
    else
      request.signature = await account.getStubSignature(request);
  }
  if (account.entryPoint.version === "0.6" && !request.initCode)
    request.initCode = "0x";
  let chainId;
  async function getChainId$1() {
    if (chainId)
      return chainId;
    if (client.chain)
      return client.chain.id;
    const chainId_ = await getAction(client, getChainId, "getChainId")({});
    chainId = chainId_;
    return chainId;
  }
  let isPaymasterPopulated = false;
  if (properties.includes("paymaster") && getPaymasterStubData$1 && !paymasterAddress && !parameters.paymasterAndData) {
    const { isFinal = false, sponsor: _, ...paymasterArgs } = await getPaymasterStubData$1({
      chainId: await getChainId$1(),
      entryPointAddress: account.entryPoint.address,
      context: paymasterContext,
      ...request
    });
    isPaymasterPopulated = isFinal;
    request = {
      ...request,
      ...paymasterArgs
    };
  }
  if (account.entryPoint.version === "0.6" && !request.paymasterAndData)
    request.paymasterAndData = "0x";
  if (properties.includes("gas")) {
    if (account.userOperation?.estimateGas) {
      const gas = await account.userOperation.estimateGas(request);
      request = {
        ...request,
        ...gas
      };
    }
    if (typeof request.callGasLimit === "undefined" || typeof request.preVerificationGas === "undefined" || typeof request.verificationGasLimit === "undefined" || request.paymaster && typeof request.paymasterPostOpGasLimit === "undefined" || request.paymaster && typeof request.paymasterVerificationGasLimit === "undefined") {
      const gas = await getAction(bundlerClient, estimateUserOperationGas, "estimateUserOperationGas")({
        account,
        // Some Bundlers fail if nullish gas values are provided for gas estimation :') –
        // so we will need to set a default zeroish value.
        callGasLimit: 0n,
        preVerificationGas: 0n,
        verificationGasLimit: 0n,
        stateOverride,
        ...request.paymaster ? {
          paymasterPostOpGasLimit: 0n,
          paymasterVerificationGasLimit: 0n
        } : {},
        ...request
      });
      request = {
        ...request,
        callGasLimit: request.callGasLimit ?? gas.callGasLimit,
        preVerificationGas: request.preVerificationGas ?? gas.preVerificationGas,
        verificationGasLimit: request.verificationGasLimit ?? gas.verificationGasLimit,
        paymasterPostOpGasLimit: request.paymasterPostOpGasLimit ?? gas.paymasterPostOpGasLimit,
        paymasterVerificationGasLimit: request.paymasterVerificationGasLimit ?? gas.paymasterVerificationGasLimit
      };
    }
  }
  if (properties.includes("paymaster") && getPaymasterData$1 && !paymasterAddress && !parameters.paymasterAndData && !isPaymasterPopulated) {
    const paymaster2 = await getPaymasterData$1({
      chainId: await getChainId$1(),
      entryPointAddress: account.entryPoint.address,
      context: paymasterContext,
      ...request
    });
    request = {
      ...request,
      ...paymaster2
    };
  }
  delete request.calls;
  delete request.parameters;
  delete request.paymasterContext;
  if (typeof request.paymaster !== "string")
    delete request.paymaster;
  return request;
}
async function estimateUserOperationGas(client, parameters) {
  const { account: account_ = client.account, entryPointAddress, stateOverride } = parameters;
  if (!account_ && !parameters.sender)
    throw new AccountNotFoundError$1();
  const account = account_ ? parseAccount(account_) : void 0;
  const rpcStateOverride = serializeStateOverride(stateOverride);
  const request = account ? await getAction(client, prepareUserOperation, "prepareUserOperation")({
    ...parameters,
    parameters: [
      "authorization",
      "factory",
      "nonce",
      "paymaster",
      "signature"
    ]
  }) : parameters;
  try {
    const params = [
      formatUserOperationRequest(request),
      entryPointAddress ?? account?.entryPoint?.address
    ];
    const result = await client.request({
      method: "eth_estimateUserOperationGas",
      params: rpcStateOverride ? [...params, rpcStateOverride] : [...params]
    });
    return formatUserOperationGas(result);
  } catch (error) {
    const calls = parameters.calls;
    throw getUserOperationError(error, {
      ...request,
      ...calls ? { calls } : {}
    });
  }
}
const entryPoint07Address = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
const MAGIC_VALUE_SIG_REPLAYABLE = "0x0555ad2729e8da1777a4e5020806f8bf7601c3db6bfe402f410a34958363a95a";
const FACTORY_ADDRESS_V0_6 = "0x5de4839a76cf55d0c90e2061ef4386d962E15ae3";
const FACTORY_ADDRESS_V0_6_INIT_CODE_HASH = "0xee9d8350bd899dd261db689aafd87eb8a30f085adbaff48152399438ff4eed73";
const KernelVersionToAddressesMap = {
  "0.0.2": {
    accountImplementationAddress: zeroAddress,
    factoryAddress: "0xaee9762ce625e0a8f7b184670fb57c37bfe1d0f1"
  },
  "0.2.2": {
    accountImplementationAddress: "0x0DA6a956B9488eD4dd761E59f52FDc6c8068E6B5",
    factoryAddress: FACTORY_ADDRESS_V0_6,
    initCodeHash: FACTORY_ADDRESS_V0_6_INIT_CODE_HASH
  },
  "0.2.3": {
    accountImplementationAddress: "0xD3F582F6B4814E989Ee8E96bc3175320B5A540ab",
    factoryAddress: FACTORY_ADDRESS_V0_6,
    initCodeHash: FACTORY_ADDRESS_V0_6_INIT_CODE_HASH
  },
  "0.2.4": {
    accountImplementationAddress: "0xd3082872F8B06073A021b4602e022d5A070d7cfC",
    factoryAddress: FACTORY_ADDRESS_V0_6,
    initCodeHash: FACTORY_ADDRESS_V0_6_INIT_CODE_HASH
  },
  "0.3.0": {
    accountImplementationAddress: "0x94F097E1ebEB4ecA3AAE54cabb08905B239A7D27",
    factoryAddress: "0x6723b44Abeec4E71eBE3232BD5B455805baDD22f",
    metaFactoryAddress: "0xd703aaE79538628d27099B8c4f621bE4CCd142d5",
    initCodeHash: "0x6fe6e6ea30eddce942b9618033ab8429f9ddac594053bec8a6744fffc71976e2"
  },
  "0.3.1": {
    accountImplementationAddress: "0xBAC849bB641841b44E965fB01A4Bf5F074f84b4D",
    factoryAddress: "0xaac5D4240AF87249B3f71BC8E4A2cae074A3E419",
    metaFactoryAddress: "0xd703aaE79538628d27099B8c4f621bE4CCd142d5",
    initCodeHash: "0x85d96aa1c9a65886d094915d76ccae85f14027a02c1647dde659f869460f03e6"
  },
  "0.3.2": {
    accountImplementationAddress: "0xD830D15D3dc0C269F3dBAa0F3e8626d33CFdaBe1",
    factoryAddress: "0x7a1dBAB750f12a90EB1B60D2Ae3aD17D4D81EfFe",
    metaFactoryAddress: "0xd703aaE79538628d27099B8c4f621bE4CCd142d5",
    initCodeHash: "0xc7c48c9dd12de68b8a4689b6f8c8c07b61d4d6fa4ddecdd86a6980d045fa67eb"
  },
  "0.3.3": {
    accountImplementationAddress: "0xd6CEDDe84be40893d153Be9d467CD6aD37875b28",
    factoryAddress: "0x2577507b78c2008Ff367261CB6285d44ba5eF2E9",
    metaFactoryAddress: "0xd703aaE79538628d27099B8c4f621bE4CCd142d5",
    initCodeHash: "0xc452397f1e7518f8cea0566ac057e243bb1643f6298aba8eec8cdee78ee3b3dd"
    //"0x1fefe62c5b9c14c4661af2e04e4a2fa10205066cae5f629d304d483f5fa9e5fc"
  }
};
const KERNEL_V3_1 = "0.3.1";
const KERNEL_NAME = "Kernel";
const VALIDATOR_TYPE = {
  SUDO: "0x00",
  SECONDARY: "0x01",
  PERMISSION: "0x02",
  EIP7702: "0x00"
};
var VALIDATOR_MODE;
(function(VALIDATOR_MODE2) {
  VALIDATOR_MODE2["DEFAULT"] = "0x00";
  VALIDATOR_MODE2["ENABLE"] = "0x01";
})(VALIDATOR_MODE || (VALIDATOR_MODE = {}));
var CALL_TYPE;
(function(CALL_TYPE2) {
  CALL_TYPE2["SINGLE"] = "0x00";
  CALL_TYPE2["BATCH"] = "0x01";
  CALL_TYPE2["DELEGATE_CALL"] = "0xFF";
})(CALL_TYPE || (CALL_TYPE = {}));
var EXEC_TYPE;
(function(EXEC_TYPE2) {
  EXEC_TYPE2["DEFAULT"] = "0x00";
  EXEC_TYPE2["TRY_EXEC"] = "0x01";
})(EXEC_TYPE || (EXEC_TYPE = {}));
const safeCreateCallAddress = "0x9b35Af71d77eaf8d7e40252370304687390A1A52";
const getEntryPoint = (entryPointVersion) => {
  return {
    address: entryPoint07Address,
    version: entryPointVersion
  };
};
const entryPointV07 = getEntryPoint("0.7");
const rollupsAccountAbstractionContracts = {
  kernelImpl: "0x317A2D4564778A585BAd21376dC1ca65b75ccC6a",
  kernelFactory: "0xdEF4343958B5dE047bddEFaB5Fa8F9Ff898890e5",
  multichainValidator: "0x8aB3f6935399e1c10419cA2C93d60901a256b7e3",
  metaFactory: "0x54db674c515e5fdec3f91345bc2fdafafd8b3b8a"
};
const composeRollupsContracts = {
  tokens: {
    WETH: "0x29dDf1a92069c4c170A63032C93c2aE66C359Bf9",
    USDC: "0x0F5808d4776E7fB10293f2DCd6dA3073b8Dad970",
    SSV: "0x969b0ad5ffa2376E8C0f5e413D510a056416D627"
  },
  bridge: "0x1388C9619aCCcd1dfff0234626EDDA61413Be74e"
};
function toRpcUserOpCanonical(op) {
  const hx = (v) => typeof v === "string" && isHex$1(v) ? v : toHex$1(BigInt(v || "0"));
  const initCode = op.initCode && isHex$1(op.initCode) && op.initCode !== "0x" ? op.initCode : op.factory && op.factory !== zeroAddress && op.factoryData ? concatHex$1([
    op.factory.toLowerCase().startsWith("0x") ? op.factory : "0x" + op.factory,
    op.factoryData
  ]) : "0x";
  console.log("initCode:", initCode);
  return {
    sender: op.sender,
    nonce: hx(op.nonce),
    initCode,
    factory: op.factory,
    factoryData: op.factoryData,
    callData: op.callData,
    callGasLimit: hx(op.callGasLimit),
    verificationGasLimit: hx(op.verificationGasLimit),
    preVerificationGas: hx(op.preVerificationGas),
    maxFeePerGas: hx(op.maxFeePerGas),
    maxPriorityFeePerGas: hx(op.maxPriorityFeePerGas),
    paymaster: op.paymaster,
    paymasterData: op.paymasterData,
    paymasterVerificationGasLimit: hx(op.paymasterVerificationGasLimit),
    paymasterPostOpGasLimit: hx(op.paymasterPostOpGasLimit),
    signature: op.signature ?? "0x"
  };
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var indexLight = { exports: {} };
var indexMinimal = {};
var minimal = {};
var aspromise = asPromise$1;
function asPromise$1(fn, ctx) {
  var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
  while (index < arguments.length)
    params[offset++] = arguments[index++];
  return new Promise(function executor(resolve, reject) {
    params[offset] = function callback(err) {
      if (pending) {
        pending = false;
        if (err)
          reject(err);
        else {
          var params2 = new Array(arguments.length - 1), offset2 = 0;
          while (offset2 < params2.length)
            params2[offset2++] = arguments[offset2];
          resolve.apply(null, params2);
        }
      }
    };
    try {
      fn.apply(ctx || null, params);
    } catch (err) {
      if (pending) {
        pending = false;
        reject(err);
      }
    }
  });
}
var base64$1 = {};
(function(exports) {
  var base642 = exports;
  base642.length = function length(string) {
    var p = string.length;
    if (!p)
      return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
      ++n;
    return Math.ceil(string.length * 3) / 4 - n;
  };
  var b64 = new Array(64);
  var s64 = new Array(123);
  for (var i2 = 0; i2 < 64; )
    s64[b64[i2] = i2 < 26 ? i2 + 65 : i2 < 52 ? i2 + 71 : i2 < 62 ? i2 - 4 : i2 - 59 | 43] = i2++;
  base642.encode = function encode3(buffer2, start, end2) {
    var parts = null, chunk = [];
    var i3 = 0, j = 0, t;
    while (start < end2) {
      var b = buffer2[start++];
      switch (j) {
        case 0:
          chunk[i3++] = b64[b >> 2];
          t = (b & 3) << 4;
          j = 1;
          break;
        case 1:
          chunk[i3++] = b64[t | b >> 4];
          t = (b & 15) << 2;
          j = 2;
          break;
        case 2:
          chunk[i3++] = b64[t | b >> 6];
          chunk[i3++] = b64[b & 63];
          j = 0;
          break;
      }
      if (i3 > 8191) {
        (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
        i3 = 0;
      }
    }
    if (j) {
      chunk[i3++] = b64[t];
      chunk[i3++] = 61;
      if (j === 1)
        chunk[i3++] = 61;
    }
    if (parts) {
      if (i3)
        parts.push(String.fromCharCode.apply(String, chunk.slice(0, i3)));
      return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i3));
  };
  var invalidEncoding = "invalid encoding";
  base642.decode = function decode2(string, buffer2, offset) {
    var start = offset;
    var j = 0, t;
    for (var i3 = 0; i3 < string.length; ) {
      var c = string.charCodeAt(i3++);
      if (c === 61 && j > 1)
        break;
      if ((c = s64[c]) === void 0)
        throw Error(invalidEncoding);
      switch (j) {
        case 0:
          t = c;
          j = 1;
          break;
        case 1:
          buffer2[offset++] = t << 2 | (c & 48) >> 4;
          t = c;
          j = 2;
          break;
        case 2:
          buffer2[offset++] = (t & 15) << 4 | (c & 60) >> 2;
          t = c;
          j = 3;
          break;
        case 3:
          buffer2[offset++] = (t & 3) << 6 | c;
          j = 0;
          break;
      }
    }
    if (j === 1)
      throw Error(invalidEncoding);
    return offset - start;
  };
  base642.test = function test2(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
  };
})(base64$1);
var eventemitter = EventEmitter;
function EventEmitter() {
  this._listeners = {};
}
EventEmitter.prototype.on = function on(evt, fn, ctx) {
  (this._listeners[evt] || (this._listeners[evt] = [])).push({
    fn,
    ctx: ctx || this
  });
  return this;
};
EventEmitter.prototype.off = function off(evt, fn) {
  if (evt === void 0)
    this._listeners = {};
  else {
    if (fn === void 0)
      this._listeners[evt] = [];
    else {
      var listeners = this._listeners[evt];
      for (var i2 = 0; i2 < listeners.length; )
        if (listeners[i2].fn === fn)
          listeners.splice(i2, 1);
        else
          ++i2;
    }
  }
  return this;
};
EventEmitter.prototype.emit = function emit(evt) {
  var listeners = this._listeners[evt];
  if (listeners) {
    var args = [], i2 = 1;
    for (; i2 < arguments.length; )
      args.push(arguments[i2++]);
    for (i2 = 0; i2 < listeners.length; )
      listeners[i2].fn.apply(listeners[i2++].ctx, args);
  }
  return this;
};
var float = factory$1(factory$1);
function factory$1(exports) {
  if (typeof Float32Array !== "undefined") (function() {
    var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
    function writeFloat_f32_cpy(val, buf, pos) {
      f32[0] = val;
      buf[pos] = f8b[0];
      buf[pos + 1] = f8b[1];
      buf[pos + 2] = f8b[2];
      buf[pos + 3] = f8b[3];
    }
    function writeFloat_f32_rev(val, buf, pos) {
      f32[0] = val;
      buf[pos] = f8b[3];
      buf[pos + 1] = f8b[2];
      buf[pos + 2] = f8b[1];
      buf[pos + 3] = f8b[0];
    }
    exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
    exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
    function readFloat_f32_cpy(buf, pos) {
      f8b[0] = buf[pos];
      f8b[1] = buf[pos + 1];
      f8b[2] = buf[pos + 2];
      f8b[3] = buf[pos + 3];
      return f32[0];
    }
    function readFloat_f32_rev(buf, pos) {
      f8b[3] = buf[pos];
      f8b[2] = buf[pos + 1];
      f8b[1] = buf[pos + 2];
      f8b[0] = buf[pos + 3];
      return f32[0];
    }
    exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
    exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
  })();
  else (function() {
    function writeFloat_ieee754(writeUint, val, buf, pos) {
      var sign = val < 0 ? 1 : 0;
      if (sign)
        val = -val;
      if (val === 0)
        writeUint(1 / val > 0 ? (
          /* positive */
          0
        ) : (
          /* negative 0 */
          2147483648
        ), buf, pos);
      else if (isNaN(val))
        writeUint(2143289344, buf, pos);
      else if (val > 34028234663852886e22)
        writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
      else if (val < 11754943508222875e-54)
        writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
      else {
        var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
        writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
      }
    }
    exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
    exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
    function readFloat_ieee754(readUint, buf, pos) {
      var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
      return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
    }
    exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
    exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
  })();
  if (typeof Float64Array !== "undefined") (function() {
    var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
    function writeDouble_f64_cpy(val, buf, pos) {
      f64[0] = val;
      buf[pos] = f8b[0];
      buf[pos + 1] = f8b[1];
      buf[pos + 2] = f8b[2];
      buf[pos + 3] = f8b[3];
      buf[pos + 4] = f8b[4];
      buf[pos + 5] = f8b[5];
      buf[pos + 6] = f8b[6];
      buf[pos + 7] = f8b[7];
    }
    function writeDouble_f64_rev(val, buf, pos) {
      f64[0] = val;
      buf[pos] = f8b[7];
      buf[pos + 1] = f8b[6];
      buf[pos + 2] = f8b[5];
      buf[pos + 3] = f8b[4];
      buf[pos + 4] = f8b[3];
      buf[pos + 5] = f8b[2];
      buf[pos + 6] = f8b[1];
      buf[pos + 7] = f8b[0];
    }
    exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
    exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
    function readDouble_f64_cpy(buf, pos) {
      f8b[0] = buf[pos];
      f8b[1] = buf[pos + 1];
      f8b[2] = buf[pos + 2];
      f8b[3] = buf[pos + 3];
      f8b[4] = buf[pos + 4];
      f8b[5] = buf[pos + 5];
      f8b[6] = buf[pos + 6];
      f8b[7] = buf[pos + 7];
      return f64[0];
    }
    function readDouble_f64_rev(buf, pos) {
      f8b[7] = buf[pos];
      f8b[6] = buf[pos + 1];
      f8b[5] = buf[pos + 2];
      f8b[4] = buf[pos + 3];
      f8b[3] = buf[pos + 4];
      f8b[2] = buf[pos + 5];
      f8b[1] = buf[pos + 6];
      f8b[0] = buf[pos + 7];
      return f64[0];
    }
    exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
    exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
  })();
  else (function() {
    function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
      var sign = val < 0 ? 1 : 0;
      if (sign)
        val = -val;
      if (val === 0) {
        writeUint(0, buf, pos + off0);
        writeUint(1 / val > 0 ? (
          /* positive */
          0
        ) : (
          /* negative 0 */
          2147483648
        ), buf, pos + off1);
      } else if (isNaN(val)) {
        writeUint(0, buf, pos + off0);
        writeUint(2146959360, buf, pos + off1);
      } else if (val > 17976931348623157e292) {
        writeUint(0, buf, pos + off0);
        writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
      } else {
        var mantissa;
        if (val < 22250738585072014e-324) {
          mantissa = val / 5e-324;
          writeUint(mantissa >>> 0, buf, pos + off0);
          writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
        } else {
          var exponent = Math.floor(Math.log(val) / Math.LN2);
          if (exponent === 1024)
            exponent = 1023;
          mantissa = val * Math.pow(2, -exponent);
          writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
          writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
        }
      }
    }
    exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
    exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
    function readDouble_ieee754(readUint, off0, off1, buf, pos) {
      var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
      var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
      return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
    }
    exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
    exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
  })();
  return exports;
}
function writeUintLE(val, buf, pos) {
  buf[pos] = val & 255;
  buf[pos + 1] = val >>> 8 & 255;
  buf[pos + 2] = val >>> 16 & 255;
  buf[pos + 3] = val >>> 24;
}
function writeUintBE(val, buf, pos) {
  buf[pos] = val >>> 24;
  buf[pos + 1] = val >>> 16 & 255;
  buf[pos + 2] = val >>> 8 & 255;
  buf[pos + 3] = val & 255;
}
function readUintLE(buf, pos) {
  return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
}
function readUintBE(buf, pos) {
  return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
}
var inquire_1 = inquire$1;
function inquire$1(moduleName) {
  try {
    var mod = eval("quire".replace(/^/, "re"))(moduleName);
    if (mod && (mod.length || Object.keys(mod).length))
      return mod;
  } catch (e) {
  }
  return null;
}
var utf8$2 = {};
(function(exports) {
  var utf82 = exports;
  utf82.length = function utf8_length(string) {
    var len2 = 0, c = 0;
    for (var i2 = 0; i2 < string.length; ++i2) {
      c = string.charCodeAt(i2);
      if (c < 128)
        len2 += 1;
      else if (c < 2048)
        len2 += 2;
      else if ((c & 64512) === 55296 && (string.charCodeAt(i2 + 1) & 64512) === 56320) {
        ++i2;
        len2 += 4;
      } else
        len2 += 3;
    }
    return len2;
  };
  utf82.read = function utf8_read(buffer2, start, end2) {
    var len2 = end2 - start;
    if (len2 < 1)
      return "";
    var parts = null, chunk = [], i2 = 0, t;
    while (start < end2) {
      t = buffer2[start++];
      if (t < 128)
        chunk[i2++] = t;
      else if (t > 191 && t < 224)
        chunk[i2++] = (t & 31) << 6 | buffer2[start++] & 63;
      else if (t > 239 && t < 365) {
        t = ((t & 7) << 18 | (buffer2[start++] & 63) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63) - 65536;
        chunk[i2++] = 55296 + (t >> 10);
        chunk[i2++] = 56320 + (t & 1023);
      } else
        chunk[i2++] = (t & 15) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63;
      if (i2 > 8191) {
        (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
        i2 = 0;
      }
    }
    if (parts) {
      if (i2)
        parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
      return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i2));
  };
  utf82.write = function utf8_write(string, buffer2, offset) {
    var start = offset, c1, c2;
    for (var i2 = 0; i2 < string.length; ++i2) {
      c1 = string.charCodeAt(i2);
      if (c1 < 128) {
        buffer2[offset++] = c1;
      } else if (c1 < 2048) {
        buffer2[offset++] = c1 >> 6 | 192;
        buffer2[offset++] = c1 & 63 | 128;
      } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i2 + 1)) & 64512) === 56320) {
        c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
        ++i2;
        buffer2[offset++] = c1 >> 18 | 240;
        buffer2[offset++] = c1 >> 12 & 63 | 128;
        buffer2[offset++] = c1 >> 6 & 63 | 128;
        buffer2[offset++] = c1 & 63 | 128;
      } else {
        buffer2[offset++] = c1 >> 12 | 224;
        buffer2[offset++] = c1 >> 6 & 63 | 128;
        buffer2[offset++] = c1 & 63 | 128;
      }
    }
    return offset - start;
  };
})(utf8$2);
var pool_1 = pool;
function pool(alloc2, slice2, size2) {
  var SIZE = size2 || 8192;
  var MAX = SIZE >>> 1;
  var slab = null;
  var offset = SIZE;
  return function pool_alloc(size3) {
    if (size3 < 1 || size3 > MAX)
      return alloc2(size3);
    if (offset + size3 > SIZE) {
      slab = alloc2(SIZE);
      offset = 0;
    }
    var buf = slice2.call(slab, offset, offset += size3);
    if (offset & 7)
      offset = (offset | 7) + 1;
    return buf;
  };
}
var longbits;
var hasRequiredLongbits;
function requireLongbits() {
  if (hasRequiredLongbits) return longbits;
  hasRequiredLongbits = 1;
  longbits = LongBits2;
  var util2 = requireMinimal();
  function LongBits2(lo, hi) {
    this.lo = lo >>> 0;
    this.hi = hi >>> 0;
  }
  var zero = LongBits2.zero = new LongBits2(0, 0);
  zero.toNumber = function() {
    return 0;
  };
  zero.zzEncode = zero.zzDecode = function() {
    return this;
  };
  zero.length = function() {
    return 1;
  };
  var zeroHash = LongBits2.zeroHash = "\0\0\0\0\0\0\0\0";
  LongBits2.fromNumber = function fromNumber2(value) {
    if (value === 0)
      return zero;
    var sign = value < 0;
    if (sign)
      value = -value;
    var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
      hi = ~hi >>> 0;
      lo = ~lo >>> 0;
      if (++lo > 4294967295) {
        lo = 0;
        if (++hi > 4294967295)
          hi = 0;
      }
    }
    return new LongBits2(lo, hi);
  };
  LongBits2.from = function from(value) {
    if (typeof value === "number")
      return LongBits2.fromNumber(value);
    if (util2.isString(value)) {
      if (util2.Long)
        value = util2.Long.fromString(value);
      else
        return LongBits2.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits2(value.low >>> 0, value.high >>> 0) : zero;
  };
  LongBits2.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
      var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
      if (!lo)
        hi = hi + 1 >>> 0;
      return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
  };
  LongBits2.prototype.toLong = function toLong(unsigned) {
    return util2.Long ? new util2.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
  };
  var charCodeAt = String.prototype.charCodeAt;
  LongBits2.fromHash = function fromHash(hash2) {
    if (hash2 === zeroHash)
      return zero;
    return new LongBits2(
      (charCodeAt.call(hash2, 0) | charCodeAt.call(hash2, 1) << 8 | charCodeAt.call(hash2, 2) << 16 | charCodeAt.call(hash2, 3) << 24) >>> 0,
      (charCodeAt.call(hash2, 4) | charCodeAt.call(hash2, 5) << 8 | charCodeAt.call(hash2, 6) << 16 | charCodeAt.call(hash2, 7) << 24) >>> 0
    );
  };
  LongBits2.prototype.toHash = function toHash() {
    return String.fromCharCode(
      this.lo & 255,
      this.lo >>> 8 & 255,
      this.lo >>> 16 & 255,
      this.lo >>> 24,
      this.hi & 255,
      this.hi >>> 8 & 255,
      this.hi >>> 16 & 255,
      this.hi >>> 24
    );
  };
  LongBits2.prototype.zzEncode = function zzEncode() {
    var mask = this.hi >> 31;
    this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo = (this.lo << 1 ^ mask) >>> 0;
    return this;
  };
  LongBits2.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi = (this.hi >>> 1 ^ mask) >>> 0;
    return this;
  };
  LongBits2.prototype.length = function length() {
    var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
    return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
  };
  return longbits;
}
var hasRequiredMinimal;
function requireMinimal() {
  if (hasRequiredMinimal) return minimal;
  hasRequiredMinimal = 1;
  (function(exports) {
    var util2 = exports;
    util2.asPromise = aspromise;
    util2.base64 = base64$1;
    util2.EventEmitter = eventemitter;
    util2.float = float;
    util2.inquire = inquire_1;
    util2.utf8 = utf8$2;
    util2.pool = pool_1;
    util2.LongBits = requireLongbits();
    util2.isNode = Boolean(typeof commonjsGlobal !== "undefined" && commonjsGlobal && commonjsGlobal.process && commonjsGlobal.process.versions && commonjsGlobal.process.versions.node);
    util2.global = util2.isNode && commonjsGlobal || typeof window !== "undefined" && window || typeof self !== "undefined" && self || commonjsGlobal;
    util2.emptyArray = Object.freeze ? Object.freeze([]) : (
      /* istanbul ignore next */
      []
    );
    util2.emptyObject = Object.freeze ? Object.freeze({}) : (
      /* istanbul ignore next */
      {}
    );
    util2.isInteger = Number.isInteger || /* istanbul ignore next */
    function isInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
    util2.isString = function isString2(value) {
      return typeof value === "string" || value instanceof String;
    };
    util2.isObject = function isObject2(value) {
      return value && typeof value === "object";
    };
    util2.isset = /**
     * Checks if a property on a message is considered to be present.
     * @param {Object} obj Plain object or message instance
     * @param {string} prop Property name
     * @returns {boolean} `true` if considered to be present, otherwise `false`
     */
    util2.isSet = function isSet(obj, prop) {
      var value = obj[prop];
      if (value != null && obj.hasOwnProperty(prop))
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
      return false;
    };
    util2.Buffer = function() {
      try {
        var Buffer2 = util2.inquire("buffer").Buffer;
        return Buffer2.prototype.utf8Write ? Buffer2 : (
          /* istanbul ignore next */
          null
        );
      } catch (e) {
        return null;
      }
    }();
    util2._Buffer_from = null;
    util2._Buffer_allocUnsafe = null;
    util2.newBuffer = function newBuffer(sizeOrArray) {
      return typeof sizeOrArray === "number" ? util2.Buffer ? util2._Buffer_allocUnsafe(sizeOrArray) : new util2.Array(sizeOrArray) : util2.Buffer ? util2._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
    };
    util2.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    util2.Long = /* istanbul ignore next */
    util2.global.dcodeIO && /* istanbul ignore next */
    util2.global.dcodeIO.Long || /* istanbul ignore next */
    util2.global.Long || util2.inquire("long");
    util2.key2Re = /^true|false|0|1$/;
    util2.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    util2.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    util2.longToHash = function longToHash(value) {
      return value ? util2.LongBits.from(value).toHash() : util2.LongBits.zeroHash;
    };
    util2.longFromHash = function longFromHash(hash2, unsigned) {
      var bits = util2.LongBits.fromHash(hash2);
      if (util2.Long)
        return util2.Long.fromBits(bits.lo, bits.hi, unsigned);
      return bits.toNumber(Boolean(unsigned));
    };
    function merge2(dst, src, ifNotSet) {
      for (var keys = Object.keys(src), i2 = 0; i2 < keys.length; ++i2)
        if (dst[keys[i2]] === void 0 || !ifNotSet)
          dst[keys[i2]] = src[keys[i2]];
      return dst;
    }
    util2.merge = merge2;
    util2.lcFirst = function lcFirst(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    };
    function newError(name) {
      function CustomError(message2, properties) {
        if (!(this instanceof CustomError))
          return new CustomError(message2, properties);
        Object.defineProperty(this, "message", { get: function() {
          return message2;
        } });
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, CustomError);
        else
          Object.defineProperty(this, "stack", { value: new Error().stack || "" });
        if (properties)
          merge2(this, properties);
      }
      CustomError.prototype = Object.create(Error.prototype, {
        constructor: {
          value: CustomError,
          writable: true,
          enumerable: false,
          configurable: true
        },
        name: {
          get: function get() {
            return name;
          },
          set: void 0,
          enumerable: false,
          // configurable: false would accurately preserve the behavior of
          // the original, but I'm guessing that was not intentional.
          // For an actual error subclass, this property would
          // be configurable.
          configurable: true
        },
        toString: {
          value: function value() {
            return this.name + ": " + this.message;
          },
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      return CustomError;
    }
    util2.newError = newError;
    util2.ProtocolError = newError("ProtocolError");
    util2.oneOfGetter = function getOneOf(fieldNames) {
      var fieldMap = {};
      for (var i2 = 0; i2 < fieldNames.length; ++i2)
        fieldMap[fieldNames[i2]] = 1;
      return function() {
        for (var keys = Object.keys(this), i3 = keys.length - 1; i3 > -1; --i3)
          if (fieldMap[keys[i3]] === 1 && this[keys[i3]] !== void 0 && this[keys[i3]] !== null)
            return keys[i3];
      };
    };
    util2.oneOfSetter = function setOneOf(fieldNames) {
      return function(name) {
        for (var i2 = 0; i2 < fieldNames.length; ++i2)
          if (fieldNames[i2] !== name)
            delete this[fieldNames[i2]];
      };
    };
    util2.toJSONOptions = {
      longs: String,
      enums: String,
      bytes: String,
      json: true
    };
    util2._configure = function() {
      var Buffer2 = util2.Buffer;
      if (!Buffer2) {
        util2._Buffer_from = util2._Buffer_allocUnsafe = null;
        return;
      }
      util2._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || /* istanbul ignore next */
      function Buffer_from(value, encoding) {
        return new Buffer2(value, encoding);
      };
      util2._Buffer_allocUnsafe = Buffer2.allocUnsafe || /* istanbul ignore next */
      function Buffer_allocUnsafe(size2) {
        return new Buffer2(size2);
      };
    };
  })(minimal);
  return minimal;
}
var writer = Writer$1;
var util$6 = requireMinimal();
var BufferWriter$1;
var LongBits$1 = util$6.LongBits, base64 = util$6.base64, utf8$1 = util$6.utf8;
function Op(fn, len2, val) {
  this.fn = fn;
  this.len = len2;
  this.next = void 0;
  this.val = val;
}
function noop$1() {
}
function State(writer2) {
  this.head = writer2.head;
  this.tail = writer2.tail;
  this.len = writer2.len;
  this.next = writer2.states;
}
function Writer$1() {
  this.len = 0;
  this.head = new Op(noop$1, 0, 0);
  this.tail = this.head;
  this.states = null;
}
var create$1 = function create2() {
  return util$6.Buffer ? function create_buffer_setup() {
    return (Writer$1.create = function create_buffer() {
      return new BufferWriter$1();
    })();
  } : function create_array3() {
    return new Writer$1();
  };
};
Writer$1.create = create$1();
Writer$1.alloc = function alloc(size2) {
  return new util$6.Array(size2);
};
if (util$6.Array !== Array)
  Writer$1.alloc = util$6.pool(Writer$1.alloc, util$6.Array.prototype.subarray);
Writer$1.prototype._push = function push(fn, len2, val) {
  this.tail = this.tail.next = new Op(fn, len2, val);
  this.len += len2;
  return this;
};
function writeByte(val, buf, pos) {
  buf[pos] = val & 255;
}
function writeVarint32(val, buf, pos) {
  while (val > 127) {
    buf[pos++] = val & 127 | 128;
    val >>>= 7;
  }
  buf[pos] = val;
}
function VarintOp(len2, val) {
  this.len = len2;
  this.next = void 0;
  this.val = val;
}
VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;
Writer$1.prototype.uint32 = function write_uint32(value) {
  this.len += (this.tail = this.tail.next = new VarintOp(
    (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
    value
  )).len;
  return this;
};
Writer$1.prototype.int32 = function write_int32(value) {
  return value < 0 ? this._push(writeVarint64, 10, LongBits$1.fromNumber(value)) : this.uint32(value);
};
Writer$1.prototype.sint32 = function write_sint32(value) {
  return this.uint32((value << 1 ^ value >> 31) >>> 0);
};
function writeVarint64(val, buf, pos) {
  while (val.hi) {
    buf[pos++] = val.lo & 127 | 128;
    val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
    val.hi >>>= 7;
  }
  while (val.lo > 127) {
    buf[pos++] = val.lo & 127 | 128;
    val.lo = val.lo >>> 7;
  }
  buf[pos++] = val.lo;
}
Writer$1.prototype.uint64 = function write_uint64(value) {
  var bits = LongBits$1.from(value);
  return this._push(writeVarint64, bits.length(), bits);
};
Writer$1.prototype.int64 = Writer$1.prototype.uint64;
Writer$1.prototype.sint64 = function write_sint64(value) {
  var bits = LongBits$1.from(value).zzEncode();
  return this._push(writeVarint64, bits.length(), bits);
};
Writer$1.prototype.bool = function write_bool(value) {
  return this._push(writeByte, 1, value ? 1 : 0);
};
function writeFixed32(val, buf, pos) {
  buf[pos] = val & 255;
  buf[pos + 1] = val >>> 8 & 255;
  buf[pos + 2] = val >>> 16 & 255;
  buf[pos + 3] = val >>> 24;
}
Writer$1.prototype.fixed32 = function write_fixed32(value) {
  return this._push(writeFixed32, 4, value >>> 0);
};
Writer$1.prototype.sfixed32 = Writer$1.prototype.fixed32;
Writer$1.prototype.fixed64 = function write_fixed64(value) {
  var bits = LongBits$1.from(value);
  return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};
Writer$1.prototype.sfixed64 = Writer$1.prototype.fixed64;
Writer$1.prototype.float = function write_float(value) {
  return this._push(util$6.float.writeFloatLE, 4, value);
};
Writer$1.prototype.double = function write_double(value) {
  return this._push(util$6.float.writeDoubleLE, 8, value);
};
var writeBytes = util$6.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
  buf.set(val, pos);
} : function writeBytes_for(val, buf, pos) {
  for (var i2 = 0; i2 < val.length; ++i2)
    buf[pos + i2] = val[i2];
};
Writer$1.prototype.bytes = function write_bytes(value) {
  var len2 = value.length >>> 0;
  if (!len2)
    return this._push(writeByte, 1, 0);
  if (util$6.isString(value)) {
    var buf = Writer$1.alloc(len2 = base64.length(value));
    base64.decode(value, buf, 0);
    value = buf;
  }
  return this.uint32(len2)._push(writeBytes, len2, value);
};
Writer$1.prototype.string = function write_string(value) {
  var len2 = utf8$1.length(value);
  return len2 ? this.uint32(len2)._push(utf8$1.write, len2, value) : this._push(writeByte, 1, 0);
};
Writer$1.prototype.fork = function fork() {
  this.states = new State(this);
  this.head = this.tail = new Op(noop$1, 0, 0);
  this.len = 0;
  return this;
};
Writer$1.prototype.reset = function reset() {
  if (this.states) {
    this.head = this.states.head;
    this.tail = this.states.tail;
    this.len = this.states.len;
    this.states = this.states.next;
  } else {
    this.head = this.tail = new Op(noop$1, 0, 0);
    this.len = 0;
  }
  return this;
};
Writer$1.prototype.ldelim = function ldelim() {
  var head = this.head, tail = this.tail, len2 = this.len;
  this.reset().uint32(len2);
  if (len2) {
    this.tail.next = head.next;
    this.tail = tail;
    this.len += len2;
  }
  return this;
};
Writer$1.prototype.finish = function finish() {
  var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
  while (head) {
    head.fn(head.val, buf, pos);
    pos += head.len;
    head = head.next;
  }
  return buf;
};
Writer$1._configure = function(BufferWriter_) {
  BufferWriter$1 = BufferWriter_;
  Writer$1.create = create$1();
  BufferWriter$1._configure();
};
var writer_buffer = BufferWriter;
var Writer = writer;
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
var util$5 = requireMinimal();
function BufferWriter() {
  Writer.call(this);
}
BufferWriter._configure = function() {
  BufferWriter.alloc = util$5._Buffer_allocUnsafe;
  BufferWriter.writeBytesBuffer = util$5.Buffer && util$5.Buffer.prototype instanceof Uint8Array && util$5.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
    buf.set(val, pos);
  } : function writeBytesBuffer_copy(val, buf, pos) {
    if (val.copy)
      val.copy(buf, pos, 0, val.length);
    else for (var i2 = 0; i2 < val.length; )
      buf[pos++] = val[i2++];
  };
};
BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
  if (util$5.isString(value))
    value = util$5._Buffer_from(value, "base64");
  var len2 = value.length >>> 0;
  this.uint32(len2);
  if (len2)
    this._push(BufferWriter.writeBytesBuffer, len2, value);
  return this;
};
function writeStringBuffer(val, buf, pos) {
  if (val.length < 40)
    util$5.utf8.write(val, buf, pos);
  else if (buf.utf8Write)
    buf.utf8Write(val, pos);
  else
    buf.write(val, pos);
}
BufferWriter.prototype.string = function write_string_buffer(value) {
  var len2 = util$5.Buffer.byteLength(value);
  this.uint32(len2);
  if (len2)
    this._push(writeStringBuffer, len2, value);
  return this;
};
BufferWriter._configure();
var reader = Reader$1;
var util$4 = requireMinimal();
var BufferReader$1;
var LongBits = util$4.LongBits, utf8 = util$4.utf8;
function indexOutOfRange(reader2, writeLength) {
  return RangeError("index out of range: " + reader2.pos + " + " + (writeLength || 1) + " > " + reader2.len);
}
function Reader$1(buffer2) {
  this.buf = buffer2;
  this.pos = 0;
  this.len = buffer2.length;
}
var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer2) {
  if (buffer2 instanceof Uint8Array || Array.isArray(buffer2))
    return new Reader$1(buffer2);
  throw Error("illegal buffer");
} : function create_array2(buffer2) {
  if (Array.isArray(buffer2))
    return new Reader$1(buffer2);
  throw Error("illegal buffer");
};
var create = function create3() {
  return util$4.Buffer ? function create_buffer_setup(buffer2) {
    return (Reader$1.create = function create_buffer(buffer3) {
      return util$4.Buffer.isBuffer(buffer3) ? new BufferReader$1(buffer3) : create_array(buffer3);
    })(buffer2);
  } : create_array;
};
Reader$1.create = create();
Reader$1.prototype._slice = util$4.Array.prototype.subarray || /* istanbul ignore next */
util$4.Array.prototype.slice;
Reader$1.prototype.uint32 = /* @__PURE__ */ function read_uint32_setup() {
  var value = 4294967295;
  return function read_uint32() {
    value = (this.buf[this.pos] & 127) >>> 0;
    if (this.buf[this.pos++] < 128) return value;
    value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
    if (this.buf[this.pos++] < 128) return value;
    value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
    if (this.buf[this.pos++] < 128) return value;
    value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
    if (this.buf[this.pos++] < 128) return value;
    value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
    if (this.buf[this.pos++] < 128) return value;
    if ((this.pos += 5) > this.len) {
      this.pos = this.len;
      throw indexOutOfRange(this, 10);
    }
    return value;
  };
}();
Reader$1.prototype.int32 = function read_int32() {
  return this.uint32() | 0;
};
Reader$1.prototype.sint32 = function read_sint32() {
  var value = this.uint32();
  return value >>> 1 ^ -(value & 1) | 0;
};
function readLongVarint() {
  var bits = new LongBits(0, 0);
  var i2 = 0;
  if (this.len - this.pos > 4) {
    for (; i2 < 4; ++i2) {
      bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i2 * 7) >>> 0;
      if (this.buf[this.pos++] < 128)
        return bits;
    }
    bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
    bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
    if (this.buf[this.pos++] < 128)
      return bits;
    i2 = 0;
  } else {
    for (; i2 < 3; ++i2) {
      if (this.pos >= this.len)
        throw indexOutOfRange(this);
      bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i2 * 7) >>> 0;
      if (this.buf[this.pos++] < 128)
        return bits;
    }
    bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i2 * 7) >>> 0;
    return bits;
  }
  if (this.len - this.pos > 4) {
    for (; i2 < 5; ++i2) {
      bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i2 * 7 + 3) >>> 0;
      if (this.buf[this.pos++] < 128)
        return bits;
    }
  } else {
    for (; i2 < 5; ++i2) {
      if (this.pos >= this.len)
        throw indexOutOfRange(this);
      bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i2 * 7 + 3) >>> 0;
      if (this.buf[this.pos++] < 128)
        return bits;
    }
  }
  throw Error("invalid varint encoding");
}
Reader$1.prototype.bool = function read_bool() {
  return this.uint32() !== 0;
};
function readFixed32_end(buf, end2) {
  return (buf[end2 - 4] | buf[end2 - 3] << 8 | buf[end2 - 2] << 16 | buf[end2 - 1] << 24) >>> 0;
}
Reader$1.prototype.fixed32 = function read_fixed32() {
  if (this.pos + 4 > this.len)
    throw indexOutOfRange(this, 4);
  return readFixed32_end(this.buf, this.pos += 4);
};
Reader$1.prototype.sfixed32 = function read_sfixed32() {
  if (this.pos + 4 > this.len)
    throw indexOutOfRange(this, 4);
  return readFixed32_end(this.buf, this.pos += 4) | 0;
};
function readFixed64() {
  if (this.pos + 8 > this.len)
    throw indexOutOfRange(this, 8);
  return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}
Reader$1.prototype.float = function read_float() {
  if (this.pos + 4 > this.len)
    throw indexOutOfRange(this, 4);
  var value = util$4.float.readFloatLE(this.buf, this.pos);
  this.pos += 4;
  return value;
};
Reader$1.prototype.double = function read_double() {
  if (this.pos + 8 > this.len)
    throw indexOutOfRange(this, 4);
  var value = util$4.float.readDoubleLE(this.buf, this.pos);
  this.pos += 8;
  return value;
};
Reader$1.prototype.bytes = function read_bytes() {
  var length = this.uint32(), start = this.pos, end2 = this.pos + length;
  if (end2 > this.len)
    throw indexOutOfRange(this, length);
  this.pos += length;
  if (Array.isArray(this.buf))
    return this.buf.slice(start, end2);
  if (start === end2) {
    var nativeBuffer = util$4.Buffer;
    return nativeBuffer ? nativeBuffer.alloc(0) : new this.buf.constructor(0);
  }
  return this._slice.call(this.buf, start, end2);
};
Reader$1.prototype.string = function read_string() {
  var bytes = this.bytes();
  return utf8.read(bytes, 0, bytes.length);
};
Reader$1.prototype.skip = function skip(length) {
  if (typeof length === "number") {
    if (this.pos + length > this.len)
      throw indexOutOfRange(this, length);
    this.pos += length;
  } else {
    do {
      if (this.pos >= this.len)
        throw indexOutOfRange(this);
    } while (this.buf[this.pos++] & 128);
  }
  return this;
};
Reader$1.prototype.skipType = function(wireType) {
  switch (wireType) {
    case 0:
      this.skip();
      break;
    case 1:
      this.skip(8);
      break;
    case 2:
      this.skip(this.uint32());
      break;
    case 3:
      while ((wireType = this.uint32() & 7) !== 4) {
        this.skipType(wireType);
      }
      break;
    case 5:
      this.skip(4);
      break;
    default:
      throw Error("invalid wire type " + wireType + " at offset " + this.pos);
  }
  return this;
};
Reader$1._configure = function(BufferReader_) {
  BufferReader$1 = BufferReader_;
  Reader$1.create = create();
  BufferReader$1._configure();
  var fn = util$4.Long ? "toLong" : (
    /* istanbul ignore next */
    "toNumber"
  );
  util$4.merge(Reader$1.prototype, {
    int64: function read_int64() {
      return readLongVarint.call(this)[fn](false);
    },
    uint64: function read_uint64() {
      return readLongVarint.call(this)[fn](true);
    },
    sint64: function read_sint64() {
      return readLongVarint.call(this).zzDecode()[fn](false);
    },
    fixed64: function read_fixed64() {
      return readFixed64.call(this)[fn](true);
    },
    sfixed64: function read_sfixed64() {
      return readFixed64.call(this)[fn](false);
    }
  });
};
var reader_buffer = BufferReader;
var Reader = reader;
(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
var util$3 = requireMinimal();
function BufferReader(buffer2) {
  Reader.call(this, buffer2);
}
BufferReader._configure = function() {
  if (util$3.Buffer)
    BufferReader.prototype._slice = util$3.Buffer.prototype.slice;
};
BufferReader.prototype.string = function read_string_buffer() {
  var len2 = this.uint32();
  return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len2, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len2, this.len));
};
BufferReader._configure();
var rpc = {};
var service$1 = Service;
var util$2 = requireMinimal();
(Service.prototype = Object.create(util$2.EventEmitter.prototype)).constructor = Service;
function Service(rpcImpl, requestDelimited, responseDelimited) {
  if (typeof rpcImpl !== "function")
    throw TypeError("rpcImpl must be a function");
  util$2.EventEmitter.call(this);
  this.rpcImpl = rpcImpl;
  this.requestDelimited = Boolean(requestDelimited);
  this.responseDelimited = Boolean(responseDelimited);
}
Service.prototype.rpcCall = function rpcCall(method2, requestCtor, responseCtor, request, callback) {
  if (!request)
    throw TypeError("request must be specified");
  var self2 = this;
  if (!callback)
    return util$2.asPromise(rpcCall, self2, method2, requestCtor, responseCtor, request);
  if (!self2.rpcImpl) {
    setTimeout(function() {
      callback(Error("already ended"));
    }, 0);
    return void 0;
  }
  try {
    return self2.rpcImpl(
      method2,
      requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
      function rpcCallback(err, response) {
        if (err) {
          self2.emit("error", err, method2);
          return callback(err);
        }
        if (response === null) {
          self2.end(
            /* endedByRPC */
            true
          );
          return void 0;
        }
        if (!(response instanceof responseCtor)) {
          try {
            response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
          } catch (err2) {
            self2.emit("error", err2, method2);
            return callback(err2);
          }
        }
        self2.emit("data", response, method2);
        return callback(null, response);
      }
    );
  } catch (err) {
    self2.emit("error", err, method2);
    setTimeout(function() {
      callback(err);
    }, 0);
    return void 0;
  }
};
Service.prototype.end = function end(endedByRPC) {
  if (this.rpcImpl) {
    if (!endedByRPC)
      this.rpcImpl(null, null, null);
    this.rpcImpl = null;
    this.emit("end").off();
  }
  return this;
};
(function(exports) {
  var rpc2 = exports;
  rpc2.Service = service$1;
})(rpc);
var roots = {};
(function(exports) {
  var protobuf2 = exports;
  protobuf2.build = "minimal";
  protobuf2.Writer = writer;
  protobuf2.BufferWriter = writer_buffer;
  protobuf2.Reader = reader;
  protobuf2.BufferReader = reader_buffer;
  protobuf2.util = requireMinimal();
  protobuf2.rpc = rpc;
  protobuf2.roots = roots;
  protobuf2.configure = configure;
  function configure() {
    protobuf2.util._configure();
    protobuf2.Writer._configure(protobuf2.BufferWriter);
    protobuf2.Reader._configure(protobuf2.BufferReader);
  }
  configure();
})(indexMinimal);
var types = {};
var util$1 = { exports: {} };
var codegen_1 = codegen;
function codegen(functionParams, functionName) {
  if (typeof functionParams === "string") {
    functionName = functionParams;
    functionParams = void 0;
  }
  var body = [];
  function Codegen(formatStringOrScope) {
    if (typeof formatStringOrScope !== "string") {
      var source = toString3();
      if (codegen.verbose)
        console.log("codegen: " + source);
      source = "return " + source;
      if (formatStringOrScope) {
        var scopeKeys = Object.keys(formatStringOrScope), scopeParams = new Array(scopeKeys.length + 1), scopeValues = new Array(scopeKeys.length), scopeOffset = 0;
        while (scopeOffset < scopeKeys.length) {
          scopeParams[scopeOffset] = scopeKeys[scopeOffset];
          scopeValues[scopeOffset] = formatStringOrScope[scopeKeys[scopeOffset++]];
        }
        scopeParams[scopeOffset] = source;
        return Function.apply(null, scopeParams).apply(null, scopeValues);
      }
      return Function(source)();
    }
    var formatParams = new Array(arguments.length - 1), formatOffset = 0;
    while (formatOffset < formatParams.length)
      formatParams[formatOffset] = arguments[++formatOffset];
    formatOffset = 0;
    formatStringOrScope = formatStringOrScope.replace(/%([%dfijs])/g, function replace($0, $1) {
      var value = formatParams[formatOffset++];
      switch ($1) {
        case "d":
        case "f":
          return String(Number(value));
        case "i":
          return String(Math.floor(value));
        case "j":
          return JSON.stringify(value);
        case "s":
          return String(value);
      }
      return "%";
    });
    if (formatOffset !== formatParams.length)
      throw Error("parameter count mismatch");
    body.push(formatStringOrScope);
    return Codegen;
  }
  function toString3(functionNameOverride) {
    return "function " + (functionNameOverride || functionName || "") + "(" + (functionParams && functionParams.join(",") || "") + "){\n  " + body.join("\n  ") + "\n}";
  }
  Codegen.toString = toString3;
  return Codegen;
}
codegen.verbose = false;
var fetch_1 = fetch$1;
var asPromise = aspromise, inquire = inquire_1;
var fs = inquire("fs");
function fetch$1(filename, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  } else if (!options)
    options = {};
  if (!callback)
    return asPromise(fetch$1, this, filename, options);
  if (!options.xhr && fs && fs.readFile)
    return fs.readFile(filename, function fetchReadFileCallback(err, contents) {
      return err && typeof XMLHttpRequest !== "undefined" ? fetch$1.xhr(filename, options, callback) : err ? callback(err) : callback(null, options.binary ? contents : contents.toString("utf8"));
    });
  return fetch$1.xhr(filename, options, callback);
}
fetch$1.xhr = function fetch_xhr(filename, options, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function fetchOnReadyStateChange() {
    if (xhr.readyState !== 4)
      return void 0;
    if (xhr.status !== 0 && xhr.status !== 200)
      return callback(Error("status " + xhr.status));
    if (options.binary) {
      var buffer2 = xhr.response;
      if (!buffer2) {
        buffer2 = [];
        for (var i2 = 0; i2 < xhr.responseText.length; ++i2)
          buffer2.push(xhr.responseText.charCodeAt(i2) & 255);
      }
      return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer2) : buffer2);
    }
    return callback(null, xhr.responseText);
  };
  if (options.binary) {
    if ("overrideMimeType" in xhr)
      xhr.overrideMimeType("text/plain; charset=x-user-defined");
    xhr.responseType = "arraybuffer";
  }
  xhr.open("GET", filename);
  xhr.send();
};
var path = {};
(function(exports) {
  var path2 = exports;
  var isAbsolute = (
    /**
     * Tests if the specified path is absolute.
     * @param {string} path Path to test
     * @returns {boolean} `true` if path is absolute
     */
    path2.isAbsolute = function isAbsolute2(path3) {
      return /^(?:\/|\w+:)/.test(path3);
    }
  );
  var normalize = (
    /**
     * Normalizes the specified path.
     * @param {string} path Path to normalize
     * @returns {string} Normalized path
     */
    path2.normalize = function normalize2(path3) {
      path3 = path3.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
      var parts = path3.split("/"), absolute = isAbsolute(path3), prefix = "";
      if (absolute)
        prefix = parts.shift() + "/";
      for (var i2 = 0; i2 < parts.length; ) {
        if (parts[i2] === "..") {
          if (i2 > 0 && parts[i2 - 1] !== "..")
            parts.splice(--i2, 2);
          else if (absolute)
            parts.splice(i2, 1);
          else
            ++i2;
        } else if (parts[i2] === ".")
          parts.splice(i2, 1);
        else
          ++i2;
      }
      return prefix + parts.join("/");
    }
  );
  path2.resolve = function resolve(originPath, includePath, alreadyNormalized) {
    if (!alreadyNormalized)
      includePath = normalize(includePath);
    if (isAbsolute(includePath))
      return includePath;
    if (!alreadyNormalized)
      originPath = normalize(originPath);
    return (originPath = originPath.replace(/(?:\/|^)[^/]+$/, "")).length ? normalize(originPath + "/" + includePath) : includePath;
  };
})(path);
var namespace;
var hasRequiredNamespace;
function requireNamespace() {
  if (hasRequiredNamespace) return namespace;
  hasRequiredNamespace = 1;
  namespace = Namespace;
  var ReflectionObject = requireObject();
  ((Namespace.prototype = Object.create(ReflectionObject.prototype)).constructor = Namespace).className = "Namespace";
  var Field = requireField(), util2 = requireUtil(), OneOf = requireOneof();
  var Type, Service2, Enum;
  Namespace.fromJSON = function fromJSON(name, json) {
    return new Namespace(name, json.options).addJSON(json.nested);
  };
  function arrayToJSON(array, toJSONOptions) {
    if (!(array && array.length))
      return void 0;
    var obj = {};
    for (var i2 = 0; i2 < array.length; ++i2)
      obj[array[i2].name] = array[i2].toJSON(toJSONOptions);
    return obj;
  }
  Namespace.arrayToJSON = arrayToJSON;
  Namespace.isReservedId = function isReservedId(reserved, id) {
    if (reserved) {
      for (var i2 = 0; i2 < reserved.length; ++i2)
        if (typeof reserved[i2] !== "string" && reserved[i2][0] <= id && reserved[i2][1] > id)
          return true;
    }
    return false;
  };
  Namespace.isReservedName = function isReservedName(reserved, name) {
    if (reserved) {
      for (var i2 = 0; i2 < reserved.length; ++i2)
        if (reserved[i2] === name)
          return true;
    }
    return false;
  };
  function Namespace(name, options) {
    ReflectionObject.call(this, name, options);
    this.nested = void 0;
    this._nestedArray = null;
    this._lookupCache = {};
    this._needsRecursiveFeatureResolution = true;
    this._needsRecursiveResolve = true;
  }
  function clearCache(namespace2) {
    namespace2._nestedArray = null;
    namespace2._lookupCache = {};
    var parent = namespace2;
    while (parent = parent.parent) {
      parent._lookupCache = {};
    }
    return namespace2;
  }
  Object.defineProperty(Namespace.prototype, "nestedArray", {
    get: function() {
      return this._nestedArray || (this._nestedArray = util2.toArray(this.nested));
    }
  });
  Namespace.prototype.toJSON = function toJSON3(toJSONOptions) {
    return util2.toObject([
      "options",
      this.options,
      "nested",
      arrayToJSON(this.nestedArray, toJSONOptions)
    ]);
  };
  Namespace.prototype.addJSON = function addJSON(nestedJson) {
    var ns = this;
    if (nestedJson) {
      for (var names = Object.keys(nestedJson), i2 = 0, nested; i2 < names.length; ++i2) {
        nested = nestedJson[names[i2]];
        ns.add(
          // most to least likely
          (nested.fields !== void 0 ? Type.fromJSON : nested.values !== void 0 ? Enum.fromJSON : nested.methods !== void 0 ? Service2.fromJSON : nested.id !== void 0 ? Field.fromJSON : Namespace.fromJSON)(names[i2], nested)
        );
      }
    }
    return this;
  };
  Namespace.prototype.get = function get(name) {
    return this.nested && this.nested[name] || null;
  };
  Namespace.prototype.getEnum = function getEnum(name) {
    if (this.nested && this.nested[name] instanceof Enum)
      return this.nested[name].values;
    throw Error("no such enum: " + name);
  };
  Namespace.prototype.add = function add(object2) {
    if (!(object2 instanceof Field && object2.extend !== void 0 || object2 instanceof Type || object2 instanceof OneOf || object2 instanceof Enum || object2 instanceof Service2 || object2 instanceof Namespace))
      throw TypeError("object must be a valid nested object");
    if (!this.nested)
      this.nested = {};
    else {
      var prev = this.get(object2.name);
      if (prev) {
        if (prev instanceof Namespace && object2 instanceof Namespace && !(prev instanceof Type || prev instanceof Service2)) {
          var nested = prev.nestedArray;
          for (var i2 = 0; i2 < nested.length; ++i2)
            object2.add(nested[i2]);
          this.remove(prev);
          if (!this.nested)
            this.nested = {};
          object2.setOptions(prev.options, true);
        } else
          throw Error("duplicate name '" + object2.name + "' in " + this);
      }
    }
    this.nested[object2.name] = object2;
    if (!(this instanceof Type || this instanceof Service2 || this instanceof Enum || this instanceof Field)) {
      if (!object2._edition) {
        object2._edition = object2._defaultEdition;
      }
    }
    this._needsRecursiveFeatureResolution = true;
    this._needsRecursiveResolve = true;
    var parent = this;
    while (parent = parent.parent) {
      parent._needsRecursiveFeatureResolution = true;
      parent._needsRecursiveResolve = true;
    }
    object2.onAdd(this);
    return clearCache(this);
  };
  Namespace.prototype.remove = function remove(object2) {
    if (!(object2 instanceof ReflectionObject))
      throw TypeError("object must be a ReflectionObject");
    if (object2.parent !== this)
      throw Error(object2 + " is not a member of " + this);
    delete this.nested[object2.name];
    if (!Object.keys(this.nested).length)
      this.nested = void 0;
    object2.onRemove(this);
    return clearCache(this);
  };
  Namespace.prototype.define = function define(path2, json) {
    if (util2.isString(path2))
      path2 = path2.split(".");
    else if (!Array.isArray(path2))
      throw TypeError("illegal path");
    if (path2 && path2.length && path2[0] === "")
      throw Error("path must be relative");
    var ptr = this;
    while (path2.length > 0) {
      var part = path2.shift();
      if (ptr.nested && ptr.nested[part]) {
        ptr = ptr.nested[part];
        if (!(ptr instanceof Namespace))
          throw Error("path conflicts with non-namespace objects");
      } else
        ptr.add(ptr = new Namespace(part));
    }
    if (json)
      ptr.addJSON(json);
    return ptr;
  };
  Namespace.prototype.resolveAll = function resolveAll() {
    if (!this._needsRecursiveResolve) return this;
    this._resolveFeaturesRecursive(this._edition);
    var nested = this.nestedArray, i2 = 0;
    this.resolve();
    while (i2 < nested.length)
      if (nested[i2] instanceof Namespace)
        nested[i2++].resolveAll();
      else
        nested[i2++].resolve();
    this._needsRecursiveResolve = false;
    return this;
  };
  Namespace.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
    if (!this._needsRecursiveFeatureResolution) return this;
    this._needsRecursiveFeatureResolution = false;
    edition = this._edition || edition;
    ReflectionObject.prototype._resolveFeaturesRecursive.call(this, edition);
    this.nestedArray.forEach((nested) => {
      nested._resolveFeaturesRecursive(edition);
    });
    return this;
  };
  Namespace.prototype.lookup = function lookup2(path2, filterTypes, parentAlreadyChecked) {
    if (typeof filterTypes === "boolean") {
      parentAlreadyChecked = filterTypes;
      filterTypes = void 0;
    } else if (filterTypes && !Array.isArray(filterTypes))
      filterTypes = [filterTypes];
    if (util2.isString(path2) && path2.length) {
      if (path2 === ".")
        return this.root;
      path2 = path2.split(".");
    } else if (!path2.length)
      return this;
    var flatPath = path2.join(".");
    if (path2[0] === "")
      return this.root.lookup(path2.slice(1), filterTypes);
    var found = this.root._fullyQualifiedObjects && this.root._fullyQualifiedObjects["." + flatPath];
    if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
      return found;
    }
    found = this._lookupImpl(path2, flatPath);
    if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
      return found;
    }
    if (parentAlreadyChecked)
      return null;
    var current = this;
    while (current.parent) {
      found = current.parent._lookupImpl(path2, flatPath);
      if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
        return found;
      }
      current = current.parent;
    }
    return null;
  };
  Namespace.prototype._lookupImpl = function lookup2(path2, flatPath) {
    if (Object.prototype.hasOwnProperty.call(this._lookupCache, flatPath)) {
      return this._lookupCache[flatPath];
    }
    var found = this.get(path2[0]);
    var exact = null;
    if (found) {
      if (path2.length === 1) {
        exact = found;
      } else if (found instanceof Namespace) {
        path2 = path2.slice(1);
        exact = found._lookupImpl(path2, path2.join("."));
      }
    } else {
      for (var i2 = 0; i2 < this.nestedArray.length; ++i2)
        if (this._nestedArray[i2] instanceof Namespace && (found = this._nestedArray[i2]._lookupImpl(path2, flatPath)))
          exact = found;
    }
    this._lookupCache[flatPath] = exact;
    return exact;
  };
  Namespace.prototype.lookupType = function lookupType(path2) {
    var found = this.lookup(path2, [Type]);
    if (!found)
      throw Error("no such type: " + path2);
    return found;
  };
  Namespace.prototype.lookupEnum = function lookupEnum(path2) {
    var found = this.lookup(path2, [Enum]);
    if (!found)
      throw Error("no such Enum '" + path2 + "' in " + this);
    return found;
  };
  Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path2) {
    var found = this.lookup(path2, [Type, Enum]);
    if (!found)
      throw Error("no such Type or Enum '" + path2 + "' in " + this);
    return found;
  };
  Namespace.prototype.lookupService = function lookupService(path2) {
    var found = this.lookup(path2, [Service2]);
    if (!found)
      throw Error("no such Service '" + path2 + "' in " + this);
    return found;
  };
  Namespace._configure = function(Type_, Service_, Enum_) {
    Type = Type_;
    Service2 = Service_;
    Enum = Enum_;
  };
  return namespace;
}
var mapfield;
var hasRequiredMapfield;
function requireMapfield() {
  if (hasRequiredMapfield) return mapfield;
  hasRequiredMapfield = 1;
  mapfield = MapField;
  var Field = requireField();
  ((MapField.prototype = Object.create(Field.prototype)).constructor = MapField).className = "MapField";
  var types2 = requireTypes(), util2 = requireUtil();
  function MapField(name, id, keyType, type2, options, comment) {
    Field.call(this, name, id, type2, void 0, void 0, options, comment);
    if (!util2.isString(keyType))
      throw TypeError("keyType must be a string");
    this.keyType = keyType;
    this.resolvedKeyType = null;
    this.map = true;
  }
  MapField.fromJSON = function fromJSON(name, json) {
    return new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
  };
  MapField.prototype.toJSON = function toJSON3(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "keyType",
      this.keyType,
      "type",
      this.type,
      "id",
      this.id,
      "extend",
      this.extend,
      "options",
      this.options,
      "comment",
      keepComments ? this.comment : void 0
    ]);
  };
  MapField.prototype.resolve = function resolve() {
    if (this.resolved)
      return this;
    if (types2.mapKey[this.keyType] === void 0)
      throw Error("invalid key type: " + this.keyType);
    return Field.prototype.resolve.call(this);
  };
  MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {
    if (typeof fieldValueType === "function")
      fieldValueType = util2.decorateType(fieldValueType).name;
    else if (fieldValueType && typeof fieldValueType === "object")
      fieldValueType = util2.decorateEnum(fieldValueType).name;
    return function mapFieldDecorator(prototype2, fieldName) {
      util2.decorateType(prototype2.constructor).add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
    };
  };
  return mapfield;
}
var method;
var hasRequiredMethod;
function requireMethod() {
  if (hasRequiredMethod) return method;
  hasRequiredMethod = 1;
  method = Method;
  var ReflectionObject = requireObject();
  ((Method.prototype = Object.create(ReflectionObject.prototype)).constructor = Method).className = "Method";
  var util2 = requireUtil();
  function Method(name, type2, requestType, responseType, requestStream, responseStream, options, comment, parsedOptions) {
    if (util2.isObject(requestStream)) {
      options = requestStream;
      requestStream = responseStream = void 0;
    } else if (util2.isObject(responseStream)) {
      options = responseStream;
      responseStream = void 0;
    }
    if (!(type2 === void 0 || util2.isString(type2)))
      throw TypeError("type must be a string");
    if (!util2.isString(requestType))
      throw TypeError("requestType must be a string");
    if (!util2.isString(responseType))
      throw TypeError("responseType must be a string");
    ReflectionObject.call(this, name, options);
    this.type = type2 || "rpc";
    this.requestType = requestType;
    this.requestStream = requestStream ? true : void 0;
    this.responseType = responseType;
    this.responseStream = responseStream ? true : void 0;
    this.resolvedRequestType = null;
    this.resolvedResponseType = null;
    this.comment = comment;
    this.parsedOptions = parsedOptions;
  }
  Method.fromJSON = function fromJSON(name, json) {
    return new Method(name, json.type, json.requestType, json.responseType, json.requestStream, json.responseStream, json.options, json.comment, json.parsedOptions);
  };
  Method.prototype.toJSON = function toJSON3(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "type",
      this.type !== "rpc" && /* istanbul ignore next */
      this.type || void 0,
      "requestType",
      this.requestType,
      "requestStream",
      this.requestStream,
      "responseType",
      this.responseType,
      "responseStream",
      this.responseStream,
      "options",
      this.options,
      "comment",
      keepComments ? this.comment : void 0,
      "parsedOptions",
      this.parsedOptions
    ]);
  };
  Method.prototype.resolve = function resolve() {
    if (this.resolved)
      return this;
    this.resolvedRequestType = this.parent.lookupType(this.requestType);
    this.resolvedResponseType = this.parent.lookupType(this.responseType);
    return ReflectionObject.prototype.resolve.call(this);
  };
  return method;
}
var service;
var hasRequiredService;
function requireService() {
  if (hasRequiredService) return service;
  hasRequiredService = 1;
  service = Service2;
  var Namespace = requireNamespace();
  ((Service2.prototype = Object.create(Namespace.prototype)).constructor = Service2).className = "Service";
  var Method = requireMethod(), util2 = requireUtil(), rpc$1 = rpc;
  function Service2(name, options) {
    Namespace.call(this, name, options);
    this.methods = {};
    this._methodsArray = null;
  }
  Service2.fromJSON = function fromJSON(name, json) {
    var service2 = new Service2(name, json.options);
    if (json.methods)
      for (var names = Object.keys(json.methods), i2 = 0; i2 < names.length; ++i2)
        service2.add(Method.fromJSON(names[i2], json.methods[names[i2]]));
    if (json.nested)
      service2.addJSON(json.nested);
    if (json.edition)
      service2._edition = json.edition;
    service2.comment = json.comment;
    service2._defaultEdition = "proto3";
    return service2;
  };
  Service2.prototype.toJSON = function toJSON3(toJSONOptions) {
    var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "edition",
      this._editionToJSON(),
      "options",
      inherited && inherited.options || void 0,
      "methods",
      Namespace.arrayToJSON(this.methodsArray, toJSONOptions) || /* istanbul ignore next */
      {},
      "nested",
      inherited && inherited.nested || void 0,
      "comment",
      keepComments ? this.comment : void 0
    ]);
  };
  Object.defineProperty(Service2.prototype, "methodsArray", {
    get: function() {
      return this._methodsArray || (this._methodsArray = util2.toArray(this.methods));
    }
  });
  function clearCache(service2) {
    service2._methodsArray = null;
    return service2;
  }
  Service2.prototype.get = function get(name) {
    return this.methods[name] || Namespace.prototype.get.call(this, name);
  };
  Service2.prototype.resolveAll = function resolveAll() {
    if (!this._needsRecursiveResolve) return this;
    Namespace.prototype.resolve.call(this);
    var methods = this.methodsArray;
    for (var i2 = 0; i2 < methods.length; ++i2)
      methods[i2].resolve();
    return this;
  };
  Service2.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
    if (!this._needsRecursiveFeatureResolution) return this;
    edition = this._edition || edition;
    Namespace.prototype._resolveFeaturesRecursive.call(this, edition);
    this.methodsArray.forEach((method2) => {
      method2._resolveFeaturesRecursive(edition);
    });
    return this;
  };
  Service2.prototype.add = function add(object2) {
    if (this.get(object2.name))
      throw Error("duplicate name '" + object2.name + "' in " + this);
    if (object2 instanceof Method) {
      this.methods[object2.name] = object2;
      object2.parent = this;
      return clearCache(this);
    }
    return Namespace.prototype.add.call(this, object2);
  };
  Service2.prototype.remove = function remove(object2) {
    if (object2 instanceof Method) {
      if (this.methods[object2.name] !== object2)
        throw Error(object2 + " is not a member of " + this);
      delete this.methods[object2.name];
      object2.parent = null;
      return clearCache(this);
    }
    return Namespace.prototype.remove.call(this, object2);
  };
  Service2.prototype.create = function create5(rpcImpl, requestDelimited, responseDelimited) {
    var rpcService = new rpc$1.Service(rpcImpl, requestDelimited, responseDelimited);
    for (var i2 = 0, method2; i2 < /* initializes */
    this.methodsArray.length; ++i2) {
      var methodName = util2.lcFirst((method2 = this._methodsArray[i2]).resolve().name).replace(/[^$\w_]/g, "");
      rpcService[methodName] = util2.codegen(["r", "c"], util2.isReserved(methodName) ? methodName + "_" : methodName)("return this.rpcCall(m,q,s,r,c)")({
        m: method2,
        q: method2.resolvedRequestType.ctor,
        s: method2.resolvedResponseType.ctor
      });
    }
    return rpcService;
  };
  return service;
}
var message = Message$1;
var util = requireMinimal();
function Message$1(properties) {
  if (properties)
    for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
      this[keys[i2]] = properties[keys[i2]];
}
Message$1.create = function create4(properties) {
  return this.$type.create(properties);
};
Message$1.encode = function encode2(message2, writer2) {
  return this.$type.encode(message2, writer2);
};
Message$1.encodeDelimited = function encodeDelimited(message2, writer2) {
  return this.$type.encodeDelimited(message2, writer2);
};
Message$1.decode = function decode(reader2) {
  return this.$type.decode(reader2);
};
Message$1.decodeDelimited = function decodeDelimited(reader2) {
  return this.$type.decodeDelimited(reader2);
};
Message$1.verify = function verify(message2) {
  return this.$type.verify(message2);
};
Message$1.fromObject = function fromObject(object2) {
  return this.$type.fromObject(object2);
};
Message$1.toObject = function toObject(message2, options) {
  return this.$type.toObject(message2, options);
};
Message$1.prototype.toJSON = function toJSON() {
  return this.$type.toObject(this, util.toJSONOptions);
};
var decoder_1;
var hasRequiredDecoder;
function requireDecoder() {
  if (hasRequiredDecoder) return decoder_1;
  hasRequiredDecoder = 1;
  decoder_1 = decoder;
  var Enum = require_enum(), types2 = requireTypes(), util2 = requireUtil();
  function missing(field2) {
    return "missing required '" + field2.name + "'";
  }
  function decoder(mtype) {
    var gen2 = util2.codegen(["r", "l", "e"], mtype.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (mtype.fieldsArray.filter(function(field3) {
      return field3.map;
    }).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()")("if(t===e)")("break")("switch(t>>>3){");
    var i2 = 0;
    for (; i2 < /* initializes */
    mtype.fieldsArray.length; ++i2) {
      var field2 = mtype._fieldsArray[i2].resolve(), type2 = field2.resolvedType instanceof Enum ? "int32" : field2.type, ref = "m" + util2.safeProp(field2.name);
      gen2("case %i: {", field2.id);
      if (field2.map) {
        gen2("if(%s===util.emptyObject)", ref)("%s={}", ref)("var c2 = r.uint32()+r.pos");
        if (types2.defaults[field2.keyType] !== void 0) gen2("k=%j", types2.defaults[field2.keyType]);
        else gen2("k=null");
        if (types2.defaults[type2] !== void 0) gen2("value=%j", types2.defaults[type2]);
        else gen2("value=null");
        gen2("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", field2.keyType)("case 2:");
        if (types2.basic[type2] === void 0) gen2("value=types[%i].decode(r,r.uint32())", i2);
        else gen2("value=r.%s()", type2);
        gen2("break")("default:")("r.skipType(tag2&7)")("break")("}")("}");
        if (types2.long[field2.keyType] !== void 0) gen2('%s[typeof k==="object"?util.longToHash(k):k]=value', ref);
        else gen2("%s[k]=value", ref);
      } else if (field2.repeated) {
        gen2("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref);
        if (types2.packed[type2] !== void 0) gen2("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", ref, type2)("}else");
        if (types2.basic[type2] === void 0) gen2(field2.delimited ? "%s.push(types[%i].decode(r,undefined,((t&~7)|4)))" : "%s.push(types[%i].decode(r,r.uint32()))", ref, i2);
        else gen2("%s.push(r.%s())", ref, type2);
      } else if (types2.basic[type2] === void 0) gen2(field2.delimited ? "%s=types[%i].decode(r,undefined,((t&~7)|4))" : "%s=types[%i].decode(r,r.uint32())", ref, i2);
      else gen2("%s=r.%s()", ref, type2);
      gen2("break")("}");
    }
    gen2("default:")("r.skipType(t&7)")("break")("}")("}");
    for (i2 = 0; i2 < mtype._fieldsArray.length; ++i2) {
      var rfield = mtype._fieldsArray[i2];
      if (rfield.required) gen2("if(!m.hasOwnProperty(%j))", rfield.name)("throw util.ProtocolError(%j,{instance:m})", missing(rfield));
    }
    return gen2("return m");
  }
  return decoder_1;
}
var verifier_1;
var hasRequiredVerifier;
function requireVerifier() {
  if (hasRequiredVerifier) return verifier_1;
  hasRequiredVerifier = 1;
  verifier_1 = verifier;
  var Enum = require_enum(), util2 = requireUtil();
  function invalid(field2, expected) {
    return field2.name + ": " + expected + (field2.repeated && expected !== "array" ? "[]" : field2.map && expected !== "object" ? "{k:" + field2.keyType + "}" : "") + " expected";
  }
  function genVerifyValue(gen2, field2, fieldIndex, ref) {
    if (field2.resolvedType) {
      if (field2.resolvedType instanceof Enum) {
        gen2("switch(%s){", ref)("default:")("return%j", invalid(field2, "enum value"));
        for (var keys = Object.keys(field2.resolvedType.values), j = 0; j < keys.length; ++j) gen2("case %i:", field2.resolvedType.values[keys[j]]);
        gen2("break")("}");
      } else {
        gen2("{")("var e=types[%i].verify(%s);", fieldIndex, ref)("if(e)")("return%j+e", field2.name + ".")("}");
      }
    } else {
      switch (field2.type) {
        case "int32":
        case "uint32":
        case "sint32":
        case "fixed32":
        case "sfixed32":
          gen2("if(!util.isInteger(%s))", ref)("return%j", invalid(field2, "integer"));
          break;
        case "int64":
        case "uint64":
        case "sint64":
        case "fixed64":
        case "sfixed64":
          gen2("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", ref, ref, ref, ref)("return%j", invalid(field2, "integer|Long"));
          break;
        case "float":
        case "double":
          gen2('if(typeof %s!=="number")', ref)("return%j", invalid(field2, "number"));
          break;
        case "bool":
          gen2('if(typeof %s!=="boolean")', ref)("return%j", invalid(field2, "boolean"));
          break;
        case "string":
          gen2("if(!util.isString(%s))", ref)("return%j", invalid(field2, "string"));
          break;
        case "bytes":
          gen2('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', ref, ref, ref)("return%j", invalid(field2, "buffer"));
          break;
      }
    }
    return gen2;
  }
  function genVerifyKey(gen2, field2, ref) {
    switch (field2.keyType) {
      case "int32":
      case "uint32":
      case "sint32":
      case "fixed32":
      case "sfixed32":
        gen2("if(!util.key32Re.test(%s))", ref)("return%j", invalid(field2, "integer key"));
        break;
      case "int64":
      case "uint64":
      case "sint64":
      case "fixed64":
      case "sfixed64":
        gen2("if(!util.key64Re.test(%s))", ref)("return%j", invalid(field2, "integer|Long key"));
        break;
      case "bool":
        gen2("if(!util.key2Re.test(%s))", ref)("return%j", invalid(field2, "boolean key"));
        break;
    }
    return gen2;
  }
  function verifier(mtype) {
    var gen2 = util2.codegen(["m"], mtype.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected");
    var oneofs = mtype.oneofsArray, seenFirstField = {};
    if (oneofs.length) gen2("var p={}");
    for (var i2 = 0; i2 < /* initializes */
    mtype.fieldsArray.length; ++i2) {
      var field2 = mtype._fieldsArray[i2].resolve(), ref = "m" + util2.safeProp(field2.name);
      if (field2.optional) gen2("if(%s!=null&&m.hasOwnProperty(%j)){", ref, field2.name);
      if (field2.map) {
        gen2("if(!util.isObject(%s))", ref)("return%j", invalid(field2, "object"))("var k=Object.keys(%s)", ref)("for(var i=0;i<k.length;++i){");
        genVerifyKey(gen2, field2, "k[i]");
        genVerifyValue(gen2, field2, i2, ref + "[k[i]]")("}");
      } else if (field2.repeated) {
        gen2("if(!Array.isArray(%s))", ref)("return%j", invalid(field2, "array"))("for(var i=0;i<%s.length;++i){", ref);
        genVerifyValue(gen2, field2, i2, ref + "[i]")("}");
      } else {
        if (field2.partOf) {
          var oneofProp = util2.safeProp(field2.partOf.name);
          if (seenFirstField[field2.partOf.name] === 1) gen2("if(p%s===1)", oneofProp)("return%j", field2.partOf.name + ": multiple values");
          seenFirstField[field2.partOf.name] = 1;
          gen2("p%s=1", oneofProp);
        }
        genVerifyValue(gen2, field2, i2, ref);
      }
      if (field2.optional) gen2("}");
    }
    return gen2("return null");
  }
  return verifier_1;
}
var converter = {};
var hasRequiredConverter;
function requireConverter() {
  if (hasRequiredConverter) return converter;
  hasRequiredConverter = 1;
  (function(exports) {
    var converter2 = exports;
    var Enum = require_enum(), util2 = requireUtil();
    function genValuePartial_fromObject(gen2, field2, fieldIndex, prop) {
      var defaultAlreadyEmitted = false;
      if (field2.resolvedType) {
        if (field2.resolvedType instanceof Enum) {
          gen2("switch(d%s){", prop);
          for (var values = field2.resolvedType.values, keys = Object.keys(values), i2 = 0; i2 < keys.length; ++i2) {
            if (values[keys[i2]] === field2.typeDefault && !defaultAlreadyEmitted) {
              gen2("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}', prop, prop, prop);
              if (!field2.repeated) gen2("break");
              defaultAlreadyEmitted = true;
            }
            gen2("case%j:", keys[i2])("case %i:", values[keys[i2]])("m%s=%j", prop, values[keys[i2]])("break");
          }
          gen2("}");
        } else gen2('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field2.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", prop, fieldIndex, prop);
      } else {
        var isUnsigned = false;
        switch (field2.type) {
          case "double":
          case "float":
            gen2("m%s=Number(d%s)", prop, prop);
            break;
          case "uint32":
          case "fixed32":
            gen2("m%s=d%s>>>0", prop, prop);
            break;
          case "int32":
          case "sint32":
          case "sfixed32":
            gen2("m%s=d%s|0", prop, prop);
            break;
          case "uint64":
            isUnsigned = true;
          case "int64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            gen2("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", prop, prop, isUnsigned)('else if(typeof d%s==="string")', prop)("m%s=parseInt(d%s,10)", prop, prop)('else if(typeof d%s==="number")', prop)("m%s=d%s", prop, prop)('else if(typeof d%s==="object")', prop)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", prop, prop, prop, isUnsigned ? "true" : "");
            break;
          case "bytes":
            gen2('if(typeof d%s==="string")', prop)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)("else if(d%s.length >= 0)", prop)("m%s=d%s", prop, prop);
            break;
          case "string":
            gen2("m%s=String(d%s)", prop, prop);
            break;
          case "bool":
            gen2("m%s=Boolean(d%s)", prop, prop);
            break;
        }
      }
      return gen2;
    }
    converter2.fromObject = function fromObject2(mtype) {
      var fields = mtype.fieldsArray;
      var gen2 = util2.codegen(["d"], mtype.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
      if (!fields.length) return gen2("return new this.ctor");
      gen2("var m=new this.ctor");
      for (var i2 = 0; i2 < fields.length; ++i2) {
        var field2 = fields[i2].resolve(), prop = util2.safeProp(field2.name);
        if (field2.map) {
          gen2("if(d%s){", prop)('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field2.fullName + ": object expected")("m%s={}", prop)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", prop);
          genValuePartial_fromObject(
            gen2,
            field2,
            /* not sorted */
            i2,
            prop + "[ks[i]]"
          )("}")("}");
        } else if (field2.repeated) {
          gen2("if(d%s){", prop)("if(!Array.isArray(d%s))", prop)("throw TypeError(%j)", field2.fullName + ": array expected")("m%s=[]", prop)("for(var i=0;i<d%s.length;++i){", prop);
          genValuePartial_fromObject(
            gen2,
            field2,
            /* not sorted */
            i2,
            prop + "[i]"
          )("}")("}");
        } else {
          if (!(field2.resolvedType instanceof Enum)) gen2("if(d%s!=null){", prop);
          genValuePartial_fromObject(
            gen2,
            field2,
            /* not sorted */
            i2,
            prop
          );
          if (!(field2.resolvedType instanceof Enum)) gen2("}");
        }
      }
      return gen2("return m");
    };
    function genValuePartial_toObject(gen2, field2, fieldIndex, prop) {
      if (field2.resolvedType) {
        if (field2.resolvedType instanceof Enum) gen2("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", prop, fieldIndex, prop, prop, fieldIndex, prop, prop);
        else gen2("d%s=types[%i].toObject(m%s,o)", prop, fieldIndex, prop);
      } else {
        var isUnsigned = false;
        switch (field2.type) {
          case "double":
          case "float":
            gen2("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", prop, prop, prop, prop);
            break;
          case "uint64":
            isUnsigned = true;
          case "int64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            gen2('if(typeof m%s==="number")', prop)("d%s=o.longs===String?String(m%s):m%s", prop, prop, prop)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", prop, prop, prop, prop, isUnsigned ? "true" : "", prop);
            break;
          case "bytes":
            gen2("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", prop, prop, prop, prop, prop);
            break;
          default:
            gen2("d%s=m%s", prop, prop);
            break;
        }
      }
      return gen2;
    }
    converter2.toObject = function toObject2(mtype) {
      var fields = mtype.fieldsArray.slice().sort(util2.compareFieldsById);
      if (!fields.length)
        return util2.codegen()("return {}");
      var gen2 = util2.codegen(["m", "o"], mtype.name + "$toObject")("if(!o)")("o={}")("var d={}");
      var repeatedFields = [], mapFields = [], normalFields = [], i2 = 0;
      for (; i2 < fields.length; ++i2)
        if (!fields[i2].partOf)
          (fields[i2].resolve().repeated ? repeatedFields : fields[i2].map ? mapFields : normalFields).push(fields[i2]);
      if (repeatedFields.length) {
        gen2("if(o.arrays||o.defaults){");
        for (i2 = 0; i2 < repeatedFields.length; ++i2) gen2("d%s=[]", util2.safeProp(repeatedFields[i2].name));
        gen2("}");
      }
      if (mapFields.length) {
        gen2("if(o.objects||o.defaults){");
        for (i2 = 0; i2 < mapFields.length; ++i2) gen2("d%s={}", util2.safeProp(mapFields[i2].name));
        gen2("}");
      }
      if (normalFields.length) {
        gen2("if(o.defaults){");
        for (i2 = 0; i2 < normalFields.length; ++i2) {
          var field2 = normalFields[i2], prop = util2.safeProp(field2.name);
          if (field2.resolvedType instanceof Enum) gen2("d%s=o.enums===String?%j:%j", prop, field2.resolvedType.valuesById[field2.typeDefault], field2.typeDefault);
          else if (field2.long) gen2("if(util.Long){")("var n=new util.Long(%i,%i,%j)", field2.typeDefault.low, field2.typeDefault.high, field2.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", prop)("}else")("d%s=o.longs===String?%j:%i", prop, field2.typeDefault.toString(), field2.typeDefault.toNumber());
          else if (field2.bytes) {
            var arrayDefault = "[" + Array.prototype.slice.call(field2.typeDefault).join(",") + "]";
            gen2("if(o.bytes===String)d%s=%j", prop, String.fromCharCode.apply(String, field2.typeDefault))("else{")("d%s=%s", prop, arrayDefault)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", prop, prop)("}");
          } else gen2("d%s=%j", prop, field2.typeDefault);
        }
        gen2("}");
      }
      var hasKs2 = false;
      for (i2 = 0; i2 < fields.length; ++i2) {
        var field2 = fields[i2], index = mtype._fieldsArray.indexOf(field2), prop = util2.safeProp(field2.name);
        if (field2.map) {
          if (!hasKs2) {
            hasKs2 = true;
            gen2("var ks2");
          }
          gen2("if(m%s&&(ks2=Object.keys(m%s)).length){", prop, prop)("d%s={}", prop)("for(var j=0;j<ks2.length;++j){");
          genValuePartial_toObject(
            gen2,
            field2,
            /* sorted */
            index,
            prop + "[ks2[j]]"
          )("}");
        } else if (field2.repeated) {
          gen2("if(m%s&&m%s.length){", prop, prop)("d%s=[]", prop)("for(var j=0;j<m%s.length;++j){", prop);
          genValuePartial_toObject(
            gen2,
            field2,
            /* sorted */
            index,
            prop + "[j]"
          )("}");
        } else {
          gen2("if(m%s!=null&&m.hasOwnProperty(%j)){", prop, field2.name);
          genValuePartial_toObject(
            gen2,
            field2,
            /* sorted */
            index,
            prop
          );
          if (field2.partOf) gen2("if(o.oneofs)")("d%s=%j", util2.safeProp(field2.partOf.name), field2.name);
        }
        gen2("}");
      }
      return gen2("return d");
    };
  })(converter);
  return converter;
}
var wrappers = {};
(function(exports) {
  var wrappers2 = exports;
  var Message2 = message;
  wrappers2[".google.protobuf.Any"] = {
    fromObject: function(object2) {
      if (object2 && object2["@type"]) {
        var name = object2["@type"].substring(object2["@type"].lastIndexOf("/") + 1);
        var type2 = this.lookup(name);
        if (type2) {
          var type_url = object2["@type"].charAt(0) === "." ? object2["@type"].slice(1) : object2["@type"];
          if (type_url.indexOf("/") === -1) {
            type_url = "/" + type_url;
          }
          return this.create({
            type_url,
            value: type2.encode(type2.fromObject(object2)).finish()
          });
        }
      }
      return this.fromObject(object2);
    },
    toObject: function(message2, options) {
      var googleApi = "type.googleapis.com/";
      var prefix = "";
      var name = "";
      if (options && options.json && message2.type_url && message2.value) {
        name = message2.type_url.substring(message2.type_url.lastIndexOf("/") + 1);
        prefix = message2.type_url.substring(0, message2.type_url.lastIndexOf("/") + 1);
        var type2 = this.lookup(name);
        if (type2)
          message2 = type2.decode(message2.value);
      }
      if (!(message2 instanceof this.ctor) && message2 instanceof Message2) {
        var object2 = message2.$type.toObject(message2, options);
        var messageName = message2.$type.fullName[0] === "." ? message2.$type.fullName.slice(1) : message2.$type.fullName;
        if (prefix === "") {
          prefix = googleApi;
        }
        name = prefix + messageName;
        object2["@type"] = name;
        return object2;
      }
      return this.toObject(message2, options);
    }
  };
})(wrappers);
var type;
var hasRequiredType;
function requireType() {
  if (hasRequiredType) return type;
  hasRequiredType = 1;
  type = Type;
  var Namespace = requireNamespace();
  ((Type.prototype = Object.create(Namespace.prototype)).constructor = Type).className = "Type";
  var Enum = require_enum(), OneOf = requireOneof(), Field = requireField(), MapField = requireMapfield(), Service2 = requireService(), Message2 = message, Reader2 = reader, Writer2 = writer, util2 = requireUtil(), encoder2 = requireEncoder(), decoder = requireDecoder(), verifier = requireVerifier(), converter2 = requireConverter(), wrappers$1 = wrappers;
  function Type(name, options) {
    Namespace.call(this, name, options);
    this.fields = {};
    this.oneofs = void 0;
    this.extensions = void 0;
    this.reserved = void 0;
    this.group = void 0;
    this._fieldsById = null;
    this._fieldsArray = null;
    this._oneofsArray = null;
    this._ctor = null;
  }
  Object.defineProperties(Type.prototype, {
    /**
     * Message fields by id.
     * @name Type#fieldsById
     * @type {Object.<number,Field>}
     * @readonly
     */
    fieldsById: {
      get: function() {
        if (this._fieldsById)
          return this._fieldsById;
        this._fieldsById = {};
        for (var names = Object.keys(this.fields), i2 = 0; i2 < names.length; ++i2) {
          var field2 = this.fields[names[i2]], id = field2.id;
          if (this._fieldsById[id])
            throw Error("duplicate id " + id + " in " + this);
          this._fieldsById[id] = field2;
        }
        return this._fieldsById;
      }
    },
    /**
     * Fields of this message as an array for iteration.
     * @name Type#fieldsArray
     * @type {Field[]}
     * @readonly
     */
    fieldsArray: {
      get: function() {
        return this._fieldsArray || (this._fieldsArray = util2.toArray(this.fields));
      }
    },
    /**
     * Oneofs of this message as an array for iteration.
     * @name Type#oneofsArray
     * @type {OneOf[]}
     * @readonly
     */
    oneofsArray: {
      get: function() {
        return this._oneofsArray || (this._oneofsArray = util2.toArray(this.oneofs));
      }
    },
    /**
     * The registered constructor, if any registered, otherwise a generic constructor.
     * Assigning a function replaces the internal constructor. If the function does not extend {@link Message} yet, its prototype will be setup accordingly and static methods will be populated. If it already extends {@link Message}, it will just replace the internal constructor.
     * @name Type#ctor
     * @type {Constructor<{}>}
     */
    ctor: {
      get: function() {
        return this._ctor || (this.ctor = Type.generateConstructor(this)());
      },
      set: function(ctor) {
        var prototype2 = ctor.prototype;
        if (!(prototype2 instanceof Message2)) {
          (ctor.prototype = new Message2()).constructor = ctor;
          util2.merge(ctor.prototype, prototype2);
        }
        ctor.$type = ctor.prototype.$type = this;
        util2.merge(ctor, Message2, true);
        this._ctor = ctor;
        var i2 = 0;
        for (; i2 < /* initializes */
        this.fieldsArray.length; ++i2)
          this._fieldsArray[i2].resolve();
        var ctorProperties = {};
        for (i2 = 0; i2 < /* initializes */
        this.oneofsArray.length; ++i2)
          ctorProperties[this._oneofsArray[i2].resolve().name] = {
            get: util2.oneOfGetter(this._oneofsArray[i2].oneof),
            set: util2.oneOfSetter(this._oneofsArray[i2].oneof)
          };
        if (i2)
          Object.defineProperties(ctor.prototype, ctorProperties);
      }
    }
  });
  Type.generateConstructor = function generateConstructor(mtype) {
    var gen2 = util2.codegen(["p"], mtype.name);
    for (var i2 = 0, field2; i2 < mtype.fieldsArray.length; ++i2)
      if ((field2 = mtype._fieldsArray[i2]).map) gen2("this%s={}", util2.safeProp(field2.name));
      else if (field2.repeated) gen2("this%s=[]", util2.safeProp(field2.name));
    return gen2("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]");
  };
  function clearCache(type2) {
    type2._fieldsById = type2._fieldsArray = type2._oneofsArray = null;
    delete type2.encode;
    delete type2.decode;
    delete type2.verify;
    return type2;
  }
  Type.fromJSON = function fromJSON(name, json) {
    var type2 = new Type(name, json.options);
    type2.extensions = json.extensions;
    type2.reserved = json.reserved;
    var names = Object.keys(json.fields), i2 = 0;
    for (; i2 < names.length; ++i2)
      type2.add(
        (typeof json.fields[names[i2]].keyType !== "undefined" ? MapField.fromJSON : Field.fromJSON)(names[i2], json.fields[names[i2]])
      );
    if (json.oneofs)
      for (names = Object.keys(json.oneofs), i2 = 0; i2 < names.length; ++i2)
        type2.add(OneOf.fromJSON(names[i2], json.oneofs[names[i2]]));
    if (json.nested)
      for (names = Object.keys(json.nested), i2 = 0; i2 < names.length; ++i2) {
        var nested = json.nested[names[i2]];
        type2.add(
          // most to least likely
          (nested.id !== void 0 ? Field.fromJSON : nested.fields !== void 0 ? Type.fromJSON : nested.values !== void 0 ? Enum.fromJSON : nested.methods !== void 0 ? Service2.fromJSON : Namespace.fromJSON)(names[i2], nested)
        );
      }
    if (json.extensions && json.extensions.length)
      type2.extensions = json.extensions;
    if (json.reserved && json.reserved.length)
      type2.reserved = json.reserved;
    if (json.group)
      type2.group = true;
    if (json.comment)
      type2.comment = json.comment;
    if (json.edition)
      type2._edition = json.edition;
    type2._defaultEdition = "proto3";
    return type2;
  };
  Type.prototype.toJSON = function toJSON3(toJSONOptions) {
    var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "edition",
      this._editionToJSON(),
      "options",
      inherited && inherited.options || void 0,
      "oneofs",
      Namespace.arrayToJSON(this.oneofsArray, toJSONOptions),
      "fields",
      Namespace.arrayToJSON(this.fieldsArray.filter(function(obj) {
        return !obj.declaringField;
      }), toJSONOptions) || {},
      "extensions",
      this.extensions && this.extensions.length ? this.extensions : void 0,
      "reserved",
      this.reserved && this.reserved.length ? this.reserved : void 0,
      "group",
      this.group || void 0,
      "nested",
      inherited && inherited.nested || void 0,
      "comment",
      keepComments ? this.comment : void 0
    ]);
  };
  Type.prototype.resolveAll = function resolveAll() {
    if (!this._needsRecursiveResolve) return this;
    Namespace.prototype.resolveAll.call(this);
    var oneofs = this.oneofsArray;
    i2 = 0;
    while (i2 < oneofs.length)
      oneofs[i2++].resolve();
    var fields = this.fieldsArray, i2 = 0;
    while (i2 < fields.length)
      fields[i2++].resolve();
    return this;
  };
  Type.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
    if (!this._needsRecursiveFeatureResolution) return this;
    edition = this._edition || edition;
    Namespace.prototype._resolveFeaturesRecursive.call(this, edition);
    this.oneofsArray.forEach((oneof2) => {
      oneof2._resolveFeatures(edition);
    });
    this.fieldsArray.forEach((field2) => {
      field2._resolveFeatures(edition);
    });
    return this;
  };
  Type.prototype.get = function get(name) {
    return this.fields[name] || this.oneofs && this.oneofs[name] || this.nested && this.nested[name] || null;
  };
  Type.prototype.add = function add(object2) {
    if (this.get(object2.name))
      throw Error("duplicate name '" + object2.name + "' in " + this);
    if (object2 instanceof Field && object2.extend === void 0) {
      if (this._fieldsById ? (
        /* istanbul ignore next */
        this._fieldsById[object2.id]
      ) : this.fieldsById[object2.id])
        throw Error("duplicate id " + object2.id + " in " + this);
      if (this.isReservedId(object2.id))
        throw Error("id " + object2.id + " is reserved in " + this);
      if (this.isReservedName(object2.name))
        throw Error("name '" + object2.name + "' is reserved in " + this);
      if (object2.parent)
        object2.parent.remove(object2);
      this.fields[object2.name] = object2;
      object2.message = this;
      object2.onAdd(this);
      return clearCache(this);
    }
    if (object2 instanceof OneOf) {
      if (!this.oneofs)
        this.oneofs = {};
      this.oneofs[object2.name] = object2;
      object2.onAdd(this);
      return clearCache(this);
    }
    return Namespace.prototype.add.call(this, object2);
  };
  Type.prototype.remove = function remove(object2) {
    if (object2 instanceof Field && object2.extend === void 0) {
      if (!this.fields || this.fields[object2.name] !== object2)
        throw Error(object2 + " is not a member of " + this);
      delete this.fields[object2.name];
      object2.parent = null;
      object2.onRemove(this);
      return clearCache(this);
    }
    if (object2 instanceof OneOf) {
      if (!this.oneofs || this.oneofs[object2.name] !== object2)
        throw Error(object2 + " is not a member of " + this);
      delete this.oneofs[object2.name];
      object2.parent = null;
      object2.onRemove(this);
      return clearCache(this);
    }
    return Namespace.prototype.remove.call(this, object2);
  };
  Type.prototype.isReservedId = function isReservedId(id) {
    return Namespace.isReservedId(this.reserved, id);
  };
  Type.prototype.isReservedName = function isReservedName(name) {
    return Namespace.isReservedName(this.reserved, name);
  };
  Type.prototype.create = function create5(properties) {
    return new this.ctor(properties);
  };
  Type.prototype.setup = function setup() {
    var fullName = this.fullName, types2 = [];
    for (var i2 = 0; i2 < /* initializes */
    this.fieldsArray.length; ++i2)
      types2.push(this._fieldsArray[i2].resolve().resolvedType);
    this.encode = encoder2(this)({
      Writer: Writer2,
      types: types2,
      util: util2
    });
    this.decode = decoder(this)({
      Reader: Reader2,
      types: types2,
      util: util2
    });
    this.verify = verifier(this)({
      types: types2,
      util: util2
    });
    this.fromObject = converter2.fromObject(this)({
      types: types2,
      util: util2
    });
    this.toObject = converter2.toObject(this)({
      types: types2,
      util: util2
    });
    var wrapper = wrappers$1[fullName];
    if (wrapper) {
      var originalThis = Object.create(this);
      originalThis.fromObject = this.fromObject;
      this.fromObject = wrapper.fromObject.bind(originalThis);
      originalThis.toObject = this.toObject;
      this.toObject = wrapper.toObject.bind(originalThis);
    }
    return this;
  };
  Type.prototype.encode = function encode_setup(message2, writer2) {
    return this.setup().encode(message2, writer2);
  };
  Type.prototype.encodeDelimited = function encodeDelimited2(message2, writer2) {
    return this.encode(message2, writer2 && writer2.len ? writer2.fork() : writer2).ldelim();
  };
  Type.prototype.decode = function decode_setup(reader2, length) {
    return this.setup().decode(reader2, length);
  };
  Type.prototype.decodeDelimited = function decodeDelimited2(reader2) {
    if (!(reader2 instanceof Reader2))
      reader2 = Reader2.create(reader2);
    return this.decode(reader2, reader2.uint32());
  };
  Type.prototype.verify = function verify_setup(message2) {
    return this.setup().verify(message2);
  };
  Type.prototype.fromObject = function fromObject2(object2) {
    return this.setup().fromObject(object2);
  };
  Type.prototype.toObject = function toObject2(message2, options) {
    return this.setup().toObject(message2, options);
  };
  Type.d = function decorateType(typeName) {
    return function typeDecorator(target) {
      util2.decorateType(target, typeName);
    };
  };
  return type;
}
var root$1;
var hasRequiredRoot;
function requireRoot() {
  if (hasRequiredRoot) return root$1;
  hasRequiredRoot = 1;
  root$1 = Root;
  var Namespace = requireNamespace();
  ((Root.prototype = Object.create(Namespace.prototype)).constructor = Root).className = "Root";
  var Field = requireField(), Enum = require_enum(), OneOf = requireOneof(), util2 = requireUtil();
  var Type, parse, common;
  function Root(options) {
    Namespace.call(this, "", options);
    this.deferred = [];
    this.files = [];
    this._edition = "proto2";
    this._fullyQualifiedObjects = {};
  }
  Root.fromJSON = function fromJSON(json, root2) {
    if (!root2)
      root2 = new Root();
    if (json.options)
      root2.setOptions(json.options);
    return root2.addJSON(json.nested).resolveAll();
  };
  Root.prototype.resolvePath = util2.path.resolve;
  Root.prototype.fetch = util2.fetch;
  function SYNC() {
  }
  Root.prototype.load = function load2(filename, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = void 0;
    }
    var self2 = this;
    if (!callback) {
      return util2.asPromise(load2, self2, filename, options);
    }
    var sync = callback === SYNC;
    function finish2(err, root2) {
      if (!callback) {
        return;
      }
      if (sync) {
        throw err;
      }
      if (root2) {
        root2.resolveAll();
      }
      var cb = callback;
      callback = null;
      cb(err, root2);
    }
    function getBundledFileName(filename2) {
      var idx = filename2.lastIndexOf("google/protobuf/");
      if (idx > -1) {
        var altname = filename2.substring(idx);
        if (altname in common) return altname;
      }
      return null;
    }
    function process2(filename2, source) {
      try {
        if (util2.isString(source) && source.charAt(0) === "{")
          source = JSON.parse(source);
        if (!util2.isString(source))
          self2.setOptions(source.options).addJSON(source.nested);
        else {
          parse.filename = filename2;
          var parsed = parse(source, self2, options), resolved2, i3 = 0;
          if (parsed.imports) {
            for (; i3 < parsed.imports.length; ++i3)
              if (resolved2 = getBundledFileName(parsed.imports[i3]) || self2.resolvePath(filename2, parsed.imports[i3]))
                fetch2(resolved2);
          }
          if (parsed.weakImports) {
            for (i3 = 0; i3 < parsed.weakImports.length; ++i3)
              if (resolved2 = getBundledFileName(parsed.weakImports[i3]) || self2.resolvePath(filename2, parsed.weakImports[i3]))
                fetch2(resolved2, true);
          }
        }
      } catch (err) {
        finish2(err);
      }
      if (!sync && !queued) {
        finish2(null, self2);
      }
    }
    function fetch2(filename2, weak) {
      filename2 = getBundledFileName(filename2) || filename2;
      if (self2.files.indexOf(filename2) > -1) {
        return;
      }
      self2.files.push(filename2);
      if (filename2 in common) {
        if (sync) {
          process2(filename2, common[filename2]);
        } else {
          ++queued;
          setTimeout(function() {
            --queued;
            process2(filename2, common[filename2]);
          });
        }
        return;
      }
      if (sync) {
        var source;
        try {
          source = util2.fs.readFileSync(filename2).toString("utf8");
        } catch (err) {
          if (!weak)
            finish2(err);
          return;
        }
        process2(filename2, source);
      } else {
        ++queued;
        self2.fetch(filename2, function(err, source2) {
          --queued;
          if (!callback) {
            return;
          }
          if (err) {
            if (!weak)
              finish2(err);
            else if (!queued)
              finish2(null, self2);
            return;
          }
          process2(filename2, source2);
        });
      }
    }
    var queued = 0;
    if (util2.isString(filename)) {
      filename = [filename];
    }
    for (var i2 = 0, resolved; i2 < filename.length; ++i2)
      if (resolved = self2.resolvePath("", filename[i2]))
        fetch2(resolved);
    if (sync) {
      self2.resolveAll();
      return self2;
    }
    if (!queued) {
      finish2(null, self2);
    }
    return self2;
  };
  Root.prototype.loadSync = function loadSync2(filename, options) {
    if (!util2.isNode)
      throw Error("not supported");
    return this.load(filename, options, SYNC);
  };
  Root.prototype.resolveAll = function resolveAll() {
    if (!this._needsRecursiveResolve) return this;
    if (this.deferred.length)
      throw Error("unresolvable extensions: " + this.deferred.map(function(field2) {
        return "'extend " + field2.extend + "' in " + field2.parent.fullName;
      }).join(", "));
    return Namespace.prototype.resolveAll.call(this);
  };
  var exposeRe = /^[A-Z]/;
  function tryHandleExtension(root2, field2) {
    var extendedType = field2.parent.lookup(field2.extend);
    if (extendedType) {
      var sisterField = new Field(field2.fullName, field2.id, field2.type, field2.rule, void 0, field2.options);
      if (extendedType.get(sisterField.name)) {
        return true;
      }
      sisterField.declaringField = field2;
      field2.extensionField = sisterField;
      extendedType.add(sisterField);
      return true;
    }
    return false;
  }
  Root.prototype._handleAdd = function _handleAdd(object2) {
    if (object2 instanceof Field) {
      if (
        /* an extension field (implies not part of a oneof) */
        object2.extend !== void 0 && /* not already handled */
        !object2.extensionField
      ) {
        if (!tryHandleExtension(this, object2))
          this.deferred.push(object2);
      }
    } else if (object2 instanceof Enum) {
      if (exposeRe.test(object2.name))
        object2.parent[object2.name] = object2.values;
    } else if (!(object2 instanceof OneOf)) {
      if (object2 instanceof Type)
        for (var i2 = 0; i2 < this.deferred.length; )
          if (tryHandleExtension(this, this.deferred[i2]))
            this.deferred.splice(i2, 1);
          else
            ++i2;
      for (var j = 0; j < /* initializes */
      object2.nestedArray.length; ++j)
        this._handleAdd(object2._nestedArray[j]);
      if (exposeRe.test(object2.name))
        object2.parent[object2.name] = object2;
    }
    if (object2 instanceof Type || object2 instanceof Enum || object2 instanceof Field) {
      this._fullyQualifiedObjects[object2.fullName] = object2;
    }
  };
  Root.prototype._handleRemove = function _handleRemove(object2) {
    if (object2 instanceof Field) {
      if (
        /* an extension field */
        object2.extend !== void 0
      ) {
        if (
          /* already handled */
          object2.extensionField
        ) {
          object2.extensionField.parent.remove(object2.extensionField);
          object2.extensionField = null;
        } else {
          var index = this.deferred.indexOf(object2);
          if (index > -1)
            this.deferred.splice(index, 1);
        }
      }
    } else if (object2 instanceof Enum) {
      if (exposeRe.test(object2.name))
        delete object2.parent[object2.name];
    } else if (object2 instanceof Namespace) {
      for (var i2 = 0; i2 < /* initializes */
      object2.nestedArray.length; ++i2)
        this._handleRemove(object2._nestedArray[i2]);
      if (exposeRe.test(object2.name))
        delete object2.parent[object2.name];
    }
    delete this._fullyQualifiedObjects[object2.fullName];
  };
  Root._configure = function(Type_, parse_, common_) {
    Type = Type_;
    parse = parse_;
    common = common_;
  };
  return root$1;
}
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util$1.exports;
  hasRequiredUtil = 1;
  var util2 = util$1.exports = requireMinimal();
  var roots$1 = roots;
  var Type, Enum;
  util2.codegen = codegen_1;
  util2.fetch = fetch_1;
  util2.path = path;
  util2.fs = util2.inquire("fs");
  util2.toArray = function toArray2(object2) {
    if (object2) {
      var keys = Object.keys(object2), array = new Array(keys.length), index = 0;
      while (index < keys.length)
        array[index] = object2[keys[index++]];
      return array;
    }
    return [];
  };
  util2.toObject = function toObject2(array) {
    var object2 = {}, index = 0;
    while (index < array.length) {
      var key = array[index++], val = array[index++];
      if (val !== void 0)
        object2[key] = val;
    }
    return object2;
  };
  var safePropBackslashRe = /\\/g, safePropQuoteRe = /"/g;
  util2.isReserved = function isReserved(name) {
    return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(name);
  };
  util2.safeProp = function safeProp(prop) {
    if (!/^[$\w_]+$/.test(prop) || util2.isReserved(prop))
      return '["' + prop.replace(safePropBackslashRe, "\\\\").replace(safePropQuoteRe, '\\"') + '"]';
    return "." + prop;
  };
  util2.ucFirst = function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  };
  var camelCaseRe = /_([a-z])/g;
  util2.camelCase = function camelCase(str) {
    return str.substring(0, 1) + str.substring(1).replace(camelCaseRe, function($0, $1) {
      return $1.toUpperCase();
    });
  };
  util2.compareFieldsById = function compareFieldsById(a, b) {
    return a.id - b.id;
  };
  util2.decorateType = function decorateType(ctor, typeName) {
    if (ctor.$type) {
      if (typeName && ctor.$type.name !== typeName) {
        util2.decorateRoot.remove(ctor.$type);
        ctor.$type.name = typeName;
        util2.decorateRoot.add(ctor.$type);
      }
      return ctor.$type;
    }
    if (!Type)
      Type = requireType();
    var type2 = new Type(typeName || ctor.name);
    util2.decorateRoot.add(type2);
    type2.ctor = ctor;
    Object.defineProperty(ctor, "$type", { value: type2, enumerable: false });
    Object.defineProperty(ctor.prototype, "$type", { value: type2, enumerable: false });
    return type2;
  };
  var decorateEnumIndex = 0;
  util2.decorateEnum = function decorateEnum(object2) {
    if (object2.$type)
      return object2.$type;
    if (!Enum)
      Enum = require_enum();
    var enm = new Enum("Enum" + decorateEnumIndex++, object2);
    util2.decorateRoot.add(enm);
    Object.defineProperty(object2, "$type", { value: enm, enumerable: false });
    return enm;
  };
  util2.setProperty = function setProperty(dst, path2, value, ifNotSet) {
    function setProp(dst2, path3, value2) {
      var part = path3.shift();
      if (part === "__proto__" || part === "prototype") {
        return dst2;
      }
      if (path3.length > 0) {
        dst2[part] = setProp(dst2[part] || {}, path3, value2);
      } else {
        var prevValue = dst2[part];
        if (prevValue && ifNotSet)
          return dst2;
        if (prevValue)
          value2 = [].concat(prevValue).concat(value2);
        dst2[part] = value2;
      }
      return dst2;
    }
    if (typeof dst !== "object")
      throw TypeError("dst must be an object");
    if (!path2)
      throw TypeError("path must be specified");
    path2 = path2.split(".");
    return setProp(dst, path2, value);
  };
  Object.defineProperty(util2, "decorateRoot", {
    get: function() {
      return roots$1["decorated"] || (roots$1["decorated"] = new (requireRoot())());
    }
  });
  return util$1.exports;
}
var hasRequiredTypes;
function requireTypes() {
  if (hasRequiredTypes) return types;
  hasRequiredTypes = 1;
  (function(exports) {
    var types2 = exports;
    var util2 = requireUtil();
    var s = [
      "double",
      // 0
      "float",
      // 1
      "int32",
      // 2
      "uint32",
      // 3
      "sint32",
      // 4
      "fixed32",
      // 5
      "sfixed32",
      // 6
      "int64",
      // 7
      "uint64",
      // 8
      "sint64",
      // 9
      "fixed64",
      // 10
      "sfixed64",
      // 11
      "bool",
      // 12
      "string",
      // 13
      "bytes"
      // 14
    ];
    function bake(values, offset) {
      var i2 = 0, o = {};
      offset |= 0;
      while (i2 < values.length) o[s[i2 + offset]] = values[i2++];
      return o;
    }
    types2.basic = bake([
      /* double   */
      1,
      /* float    */
      5,
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      5,
      /* sfixed32 */
      5,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1,
      /* bool     */
      0,
      /* string   */
      2,
      /* bytes    */
      2
    ]);
    types2.defaults = bake([
      /* double   */
      0,
      /* float    */
      0,
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      0,
      /* sfixed32 */
      0,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      0,
      /* sfixed64 */
      0,
      /* bool     */
      false,
      /* string   */
      "",
      /* bytes    */
      util2.emptyArray,
      /* message  */
      null
    ]);
    types2.long = bake([
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1
    ], 7);
    types2.mapKey = bake([
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      5,
      /* sfixed32 */
      5,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1,
      /* bool     */
      0,
      /* string   */
      2
    ], 2);
    types2.packed = bake([
      /* double   */
      1,
      /* float    */
      5,
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      5,
      /* sfixed32 */
      5,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1,
      /* bool     */
      0
    ]);
  })(types);
  return types;
}
var field;
var hasRequiredField;
function requireField() {
  if (hasRequiredField) return field;
  hasRequiredField = 1;
  field = Field;
  var ReflectionObject = requireObject();
  ((Field.prototype = Object.create(ReflectionObject.prototype)).constructor = Field).className = "Field";
  var Enum = require_enum(), types2 = requireTypes(), util2 = requireUtil();
  var Type;
  var ruleRe = /^required|optional|repeated$/;
  Field.fromJSON = function fromJSON(name, json) {
    var field2 = new Field(name, json.id, json.type, json.rule, json.extend, json.options, json.comment);
    if (json.edition)
      field2._edition = json.edition;
    field2._defaultEdition = "proto3";
    return field2;
  };
  function Field(name, id, type2, rule, extend2, options, comment) {
    if (util2.isObject(rule)) {
      comment = extend2;
      options = rule;
      rule = extend2 = void 0;
    } else if (util2.isObject(extend2)) {
      comment = options;
      options = extend2;
      extend2 = void 0;
    }
    ReflectionObject.call(this, name, options);
    if (!util2.isInteger(id) || id < 0)
      throw TypeError("id must be a non-negative integer");
    if (!util2.isString(type2))
      throw TypeError("type must be a string");
    if (rule !== void 0 && !ruleRe.test(rule = rule.toString().toLowerCase()))
      throw TypeError("rule must be a string rule");
    if (extend2 !== void 0 && !util2.isString(extend2))
      throw TypeError("extend must be a string");
    if (rule === "proto3_optional") {
      rule = "optional";
    }
    this.rule = rule && rule !== "optional" ? rule : void 0;
    this.type = type2;
    this.id = id;
    this.extend = extend2 || void 0;
    this.repeated = rule === "repeated";
    this.map = false;
    this.message = null;
    this.partOf = null;
    this.typeDefault = null;
    this.defaultValue = null;
    this.long = util2.Long ? types2.long[type2] !== void 0 : (
      /* istanbul ignore next */
      false
    );
    this.bytes = type2 === "bytes";
    this.resolvedType = null;
    this.extensionField = null;
    this.declaringField = null;
    this.comment = comment;
  }
  Object.defineProperty(Field.prototype, "required", {
    get: function() {
      return this._features.field_presence === "LEGACY_REQUIRED";
    }
  });
  Object.defineProperty(Field.prototype, "optional", {
    get: function() {
      return !this.required;
    }
  });
  Object.defineProperty(Field.prototype, "delimited", {
    get: function() {
      return this.resolvedType instanceof Type && this._features.message_encoding === "DELIMITED";
    }
  });
  Object.defineProperty(Field.prototype, "packed", {
    get: function() {
      return this._features.repeated_field_encoding === "PACKED";
    }
  });
  Object.defineProperty(Field.prototype, "hasPresence", {
    get: function() {
      if (this.repeated || this.map) {
        return false;
      }
      return this.partOf || // oneofs
      this.declaringField || this.extensionField || // extensions
      this._features.field_presence !== "IMPLICIT";
    }
  });
  Field.prototype.setOption = function setOption(name, value, ifNotSet) {
    return ReflectionObject.prototype.setOption.call(this, name, value, ifNotSet);
  };
  Field.prototype.toJSON = function toJSON3(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "edition",
      this._editionToJSON(),
      "rule",
      this.rule !== "optional" && this.rule || void 0,
      "type",
      this.type,
      "id",
      this.id,
      "extend",
      this.extend,
      "options",
      this.options,
      "comment",
      keepComments ? this.comment : void 0
    ]);
  };
  Field.prototype.resolve = function resolve() {
    if (this.resolved)
      return this;
    if ((this.typeDefault = types2.defaults[this.type]) === void 0) {
      this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type);
      if (this.resolvedType instanceof Type)
        this.typeDefault = null;
      else
        this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
    } else if (this.options && this.options.proto3_optional) {
      this.typeDefault = null;
    }
    if (this.options && this.options["default"] != null) {
      this.typeDefault = this.options["default"];
      if (this.resolvedType instanceof Enum && typeof this.typeDefault === "string")
        this.typeDefault = this.resolvedType.values[this.typeDefault];
    }
    if (this.options) {
      if (this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof Enum))
        delete this.options.packed;
      if (!Object.keys(this.options).length)
        this.options = void 0;
    }
    if (this.long) {
      this.typeDefault = util2.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u");
      if (Object.freeze)
        Object.freeze(this.typeDefault);
    } else if (this.bytes && typeof this.typeDefault === "string") {
      var buf;
      if (util2.base64.test(this.typeDefault))
        util2.base64.decode(this.typeDefault, buf = util2.newBuffer(util2.base64.length(this.typeDefault)), 0);
      else
        util2.utf8.write(this.typeDefault, buf = util2.newBuffer(util2.utf8.length(this.typeDefault)), 0);
      this.typeDefault = buf;
    }
    if (this.map)
      this.defaultValue = util2.emptyObject;
    else if (this.repeated)
      this.defaultValue = util2.emptyArray;
    else
      this.defaultValue = this.typeDefault;
    if (this.parent instanceof Type)
      this.parent.ctor.prototype[this.name] = this.defaultValue;
    return ReflectionObject.prototype.resolve.call(this);
  };
  Field.prototype._inferLegacyProtoFeatures = function _inferLegacyProtoFeatures(edition) {
    if (edition !== "proto2" && edition !== "proto3") {
      return {};
    }
    var features = {};
    if (this.rule === "required") {
      features.field_presence = "LEGACY_REQUIRED";
    }
    if (this.parent && types2.defaults[this.type] === void 0) {
      var type2 = this.parent.get(this.type.split(".").pop());
      if (type2 && type2 instanceof Type && type2.group) {
        features.message_encoding = "DELIMITED";
      }
    }
    if (this.getOption("packed") === true) {
      features.repeated_field_encoding = "PACKED";
    } else if (this.getOption("packed") === false) {
      features.repeated_field_encoding = "EXPANDED";
    }
    return features;
  };
  Field.prototype._resolveFeatures = function _resolveFeatures(edition) {
    return ReflectionObject.prototype._resolveFeatures.call(this, this._edition || edition);
  };
  Field.d = function decorateField(fieldId, fieldType, fieldRule, defaultValue) {
    if (typeof fieldType === "function")
      fieldType = util2.decorateType(fieldType).name;
    else if (fieldType && typeof fieldType === "object")
      fieldType = util2.decorateEnum(fieldType).name;
    return function fieldDecorator(prototype2, fieldName) {
      util2.decorateType(prototype2.constructor).add(new Field(fieldName, fieldId, fieldType, fieldRule, { "default": defaultValue }));
    };
  };
  Field._configure = function configure(Type_) {
    Type = Type_;
  };
  return field;
}
var oneof;
var hasRequiredOneof;
function requireOneof() {
  if (hasRequiredOneof) return oneof;
  hasRequiredOneof = 1;
  oneof = OneOf;
  var ReflectionObject = requireObject();
  ((OneOf.prototype = Object.create(ReflectionObject.prototype)).constructor = OneOf).className = "OneOf";
  var Field = requireField(), util2 = requireUtil();
  function OneOf(name, fieldNames, options, comment) {
    if (!Array.isArray(fieldNames)) {
      options = fieldNames;
      fieldNames = void 0;
    }
    ReflectionObject.call(this, name, options);
    if (!(fieldNames === void 0 || Array.isArray(fieldNames)))
      throw TypeError("fieldNames must be an Array");
    this.oneof = fieldNames || [];
    this.fieldsArray = [];
    this.comment = comment;
  }
  OneOf.fromJSON = function fromJSON(name, json) {
    return new OneOf(name, json.oneof, json.options, json.comment);
  };
  OneOf.prototype.toJSON = function toJSON3(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "options",
      this.options,
      "oneof",
      this.oneof,
      "comment",
      keepComments ? this.comment : void 0
    ]);
  };
  function addFieldsToParent(oneof2) {
    if (oneof2.parent) {
      for (var i2 = 0; i2 < oneof2.fieldsArray.length; ++i2)
        if (!oneof2.fieldsArray[i2].parent)
          oneof2.parent.add(oneof2.fieldsArray[i2]);
    }
  }
  OneOf.prototype.add = function add(field2) {
    if (!(field2 instanceof Field))
      throw TypeError("field must be a Field");
    if (field2.parent && field2.parent !== this.parent)
      field2.parent.remove(field2);
    this.oneof.push(field2.name);
    this.fieldsArray.push(field2);
    field2.partOf = this;
    addFieldsToParent(this);
    return this;
  };
  OneOf.prototype.remove = function remove(field2) {
    if (!(field2 instanceof Field))
      throw TypeError("field must be a Field");
    var index = this.fieldsArray.indexOf(field2);
    if (index < 0)
      throw Error(field2 + " is not a member of " + this);
    this.fieldsArray.splice(index, 1);
    index = this.oneof.indexOf(field2.name);
    if (index > -1)
      this.oneof.splice(index, 1);
    field2.partOf = null;
    return this;
  };
  OneOf.prototype.onAdd = function onAdd(parent) {
    ReflectionObject.prototype.onAdd.call(this, parent);
    var self2 = this;
    for (var i2 = 0; i2 < this.oneof.length; ++i2) {
      var field2 = parent.get(this.oneof[i2]);
      if (field2 && !field2.partOf) {
        field2.partOf = self2;
        self2.fieldsArray.push(field2);
      }
    }
    addFieldsToParent(this);
  };
  OneOf.prototype.onRemove = function onRemove(parent) {
    for (var i2 = 0, field2; i2 < this.fieldsArray.length; ++i2)
      if ((field2 = this.fieldsArray[i2]).parent)
        field2.parent.remove(field2);
    ReflectionObject.prototype.onRemove.call(this, parent);
  };
  Object.defineProperty(OneOf.prototype, "isProto3Optional", {
    get: function() {
      if (this.fieldsArray == null || this.fieldsArray.length !== 1) {
        return false;
      }
      var field2 = this.fieldsArray[0];
      return field2.options != null && field2.options["proto3_optional"] === true;
    }
  });
  OneOf.d = function decorateOneOf() {
    var fieldNames = new Array(arguments.length), index = 0;
    while (index < arguments.length)
      fieldNames[index] = arguments[index++];
    return function oneOfDecorator(prototype2, oneofName) {
      util2.decorateType(prototype2.constructor).add(new OneOf(oneofName, fieldNames));
      Object.defineProperty(prototype2, oneofName, {
        get: util2.oneOfGetter(fieldNames),
        set: util2.oneOfSetter(fieldNames)
      });
    };
  };
  return oneof;
}
var object;
var hasRequiredObject;
function requireObject() {
  if (hasRequiredObject) return object;
  hasRequiredObject = 1;
  object = ReflectionObject;
  ReflectionObject.className = "ReflectionObject";
  const OneOf = requireOneof();
  var util2 = requireUtil();
  var Root;
  var editions2023Defaults = { enum_type: "OPEN", field_presence: "EXPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY" };
  var proto2Defaults = { enum_type: "CLOSED", field_presence: "EXPLICIT", json_format: "LEGACY_BEST_EFFORT", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "EXPANDED", utf8_validation: "NONE" };
  var proto3Defaults = { enum_type: "OPEN", field_presence: "IMPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY" };
  function ReflectionObject(name, options) {
    if (!util2.isString(name))
      throw TypeError("name must be a string");
    if (options && !util2.isObject(options))
      throw TypeError("options must be an object");
    this.options = options;
    this.parsedOptions = null;
    this.name = name;
    this._edition = null;
    this._defaultEdition = "proto2";
    this._features = {};
    this._featuresResolved = false;
    this.parent = null;
    this.resolved = false;
    this.comment = null;
    this.filename = null;
  }
  Object.defineProperties(ReflectionObject.prototype, {
    /**
     * Reference to the root namespace.
     * @name ReflectionObject#root
     * @type {Root}
     * @readonly
     */
    root: {
      get: function() {
        var ptr = this;
        while (ptr.parent !== null)
          ptr = ptr.parent;
        return ptr;
      }
    },
    /**
     * Full name including leading dot.
     * @name ReflectionObject#fullName
     * @type {string}
     * @readonly
     */
    fullName: {
      get: function() {
        var path2 = [this.name], ptr = this.parent;
        while (ptr) {
          path2.unshift(ptr.name);
          ptr = ptr.parent;
        }
        return path2.join(".");
      }
    }
  });
  ReflectionObject.prototype.toJSON = /* istanbul ignore next */
  function toJSON3() {
    throw Error();
  };
  ReflectionObject.prototype.onAdd = function onAdd(parent) {
    if (this.parent && this.parent !== parent)
      this.parent.remove(this);
    this.parent = parent;
    this.resolved = false;
    var root2 = parent.root;
    if (root2 instanceof Root)
      root2._handleAdd(this);
  };
  ReflectionObject.prototype.onRemove = function onRemove(parent) {
    var root2 = parent.root;
    if (root2 instanceof Root)
      root2._handleRemove(this);
    this.parent = null;
    this.resolved = false;
  };
  ReflectionObject.prototype.resolve = function resolve() {
    if (this.resolved)
      return this;
    if (this.root instanceof Root)
      this.resolved = true;
    return this;
  };
  ReflectionObject.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
    return this._resolveFeatures(this._edition || edition);
  };
  ReflectionObject.prototype._resolveFeatures = function _resolveFeatures(edition) {
    if (this._featuresResolved) {
      return;
    }
    var defaults2 = {};
    if (!edition) {
      throw new Error("Unknown edition for " + this.fullName);
    }
    var protoFeatures = Object.assign(
      this.options ? Object.assign({}, this.options.features) : {},
      this._inferLegacyProtoFeatures(edition)
    );
    if (this._edition) {
      if (edition === "proto2") {
        defaults2 = Object.assign({}, proto2Defaults);
      } else if (edition === "proto3") {
        defaults2 = Object.assign({}, proto3Defaults);
      } else if (edition === "2023") {
        defaults2 = Object.assign({}, editions2023Defaults);
      } else {
        throw new Error("Unknown edition: " + edition);
      }
      this._features = Object.assign(defaults2, protoFeatures || {});
      this._featuresResolved = true;
      return;
    }
    if (this.partOf instanceof OneOf) {
      var lexicalParentFeaturesCopy = Object.assign({}, this.partOf._features);
      this._features = Object.assign(lexicalParentFeaturesCopy, protoFeatures || {});
    } else if (this.declaringField) ;
    else if (this.parent) {
      var parentFeaturesCopy = Object.assign({}, this.parent._features);
      this._features = Object.assign(parentFeaturesCopy, protoFeatures || {});
    } else {
      throw new Error("Unable to find a parent for " + this.fullName);
    }
    if (this.extensionField) {
      this.extensionField._features = this._features;
    }
    this._featuresResolved = true;
  };
  ReflectionObject.prototype._inferLegacyProtoFeatures = function _inferLegacyProtoFeatures() {
    return {};
  };
  ReflectionObject.prototype.getOption = function getOption(name) {
    if (this.options)
      return this.options[name];
    return void 0;
  };
  ReflectionObject.prototype.setOption = function setOption(name, value, ifNotSet) {
    if (!this.options)
      this.options = {};
    if (/^features\./.test(name)) {
      util2.setProperty(this.options, name, value, ifNotSet);
    } else if (!ifNotSet || this.options[name] === void 0) {
      if (this.getOption(name) !== value) this.resolved = false;
      this.options[name] = value;
    }
    return this;
  };
  ReflectionObject.prototype.setParsedOption = function setParsedOption(name, value, propName) {
    if (!this.parsedOptions) {
      this.parsedOptions = [];
    }
    var parsedOptions = this.parsedOptions;
    if (propName) {
      var opt = parsedOptions.find(function(opt2) {
        return Object.prototype.hasOwnProperty.call(opt2, name);
      });
      if (opt) {
        var newValue = opt[name];
        util2.setProperty(newValue, propName, value);
      } else {
        opt = {};
        opt[name] = util2.setProperty({}, propName, value);
        parsedOptions.push(opt);
      }
    } else {
      var newOpt = {};
      newOpt[name] = value;
      parsedOptions.push(newOpt);
    }
    return this;
  };
  ReflectionObject.prototype.setOptions = function setOptions(options, ifNotSet) {
    if (options)
      for (var keys = Object.keys(options), i2 = 0; i2 < keys.length; ++i2)
        this.setOption(keys[i2], options[keys[i2]], ifNotSet);
    return this;
  };
  ReflectionObject.prototype.toString = function toString3() {
    var className = this.constructor.className, fullName = this.fullName;
    if (fullName.length)
      return className + " " + fullName;
    return className;
  };
  ReflectionObject.prototype._editionToJSON = function _editionToJSON() {
    if (!this._edition || this._edition === "proto3") {
      return void 0;
    }
    return this._edition;
  };
  ReflectionObject._configure = function(Root_) {
    Root = Root_;
  };
  return object;
}
var _enum;
var hasRequired_enum;
function require_enum() {
  if (hasRequired_enum) return _enum;
  hasRequired_enum = 1;
  _enum = Enum;
  var ReflectionObject = requireObject();
  ((Enum.prototype = Object.create(ReflectionObject.prototype)).constructor = Enum).className = "Enum";
  var Namespace = requireNamespace(), util2 = requireUtil();
  function Enum(name, values, options, comment, comments, valuesOptions) {
    ReflectionObject.call(this, name, options);
    if (values && typeof values !== "object")
      throw TypeError("values must be an object");
    this.valuesById = {};
    this.values = Object.create(this.valuesById);
    this.comment = comment;
    this.comments = comments || {};
    this.valuesOptions = valuesOptions;
    this._valuesFeatures = {};
    this.reserved = void 0;
    if (values) {
      for (var keys = Object.keys(values), i2 = 0; i2 < keys.length; ++i2)
        if (typeof values[keys[i2]] === "number")
          this.valuesById[this.values[keys[i2]] = values[keys[i2]]] = keys[i2];
    }
  }
  Enum.prototype._resolveFeatures = function _resolveFeatures(edition) {
    edition = this._edition || edition;
    ReflectionObject.prototype._resolveFeatures.call(this, edition);
    Object.keys(this.values).forEach((key) => {
      var parentFeaturesCopy = Object.assign({}, this._features);
      this._valuesFeatures[key] = Object.assign(parentFeaturesCopy, this.valuesOptions && this.valuesOptions[key] && this.valuesOptions[key].features);
    });
    return this;
  };
  Enum.fromJSON = function fromJSON(name, json) {
    var enm = new Enum(name, json.values, json.options, json.comment, json.comments);
    enm.reserved = json.reserved;
    if (json.edition)
      enm._edition = json.edition;
    enm._defaultEdition = "proto3";
    return enm;
  };
  Enum.prototype.toJSON = function toJSON3(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util2.toObject([
      "edition",
      this._editionToJSON(),
      "options",
      this.options,
      "valuesOptions",
      this.valuesOptions,
      "values",
      this.values,
      "reserved",
      this.reserved && this.reserved.length ? this.reserved : void 0,
      "comment",
      keepComments ? this.comment : void 0,
      "comments",
      keepComments ? this.comments : void 0
    ]);
  };
  Enum.prototype.add = function add(name, id, comment, options) {
    if (!util2.isString(name))
      throw TypeError("name must be a string");
    if (!util2.isInteger(id))
      throw TypeError("id must be an integer");
    if (this.values[name] !== void 0)
      throw Error("duplicate name '" + name + "' in " + this);
    if (this.isReservedId(id))
      throw Error("id " + id + " is reserved in " + this);
    if (this.isReservedName(name))
      throw Error("name '" + name + "' is reserved in " + this);
    if (this.valuesById[id] !== void 0) {
      if (!(this.options && this.options.allow_alias))
        throw Error("duplicate id " + id + " in " + this);
      this.values[name] = id;
    } else
      this.valuesById[this.values[name] = id] = name;
    if (options) {
      if (this.valuesOptions === void 0)
        this.valuesOptions = {};
      this.valuesOptions[name] = options || null;
    }
    this.comments[name] = comment || null;
    return this;
  };
  Enum.prototype.remove = function remove(name) {
    if (!util2.isString(name))
      throw TypeError("name must be a string");
    var val = this.values[name];
    if (val == null)
      throw Error("name '" + name + "' does not exist in " + this);
    delete this.valuesById[val];
    delete this.values[name];
    delete this.comments[name];
    if (this.valuesOptions)
      delete this.valuesOptions[name];
    return this;
  };
  Enum.prototype.isReservedId = function isReservedId(id) {
    return Namespace.isReservedId(this.reserved, id);
  };
  Enum.prototype.isReservedName = function isReservedName(name) {
    return Namespace.isReservedName(this.reserved, name);
  };
  return _enum;
}
var encoder_1;
var hasRequiredEncoder;
function requireEncoder() {
  if (hasRequiredEncoder) return encoder_1;
  hasRequiredEncoder = 1;
  encoder_1 = encoder2;
  var Enum = require_enum(), types2 = requireTypes(), util2 = requireUtil();
  function genTypePartial(gen2, field2, fieldIndex, ref) {
    return field2.delimited ? gen2("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", fieldIndex, ref, (field2.id << 3 | 3) >>> 0, (field2.id << 3 | 4) >>> 0) : gen2("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", fieldIndex, ref, (field2.id << 3 | 2) >>> 0);
  }
  function encoder2(mtype) {
    var gen2 = util2.codegen(["m", "w"], mtype.name + "$encode")("if(!w)")("w=Writer.create()");
    var i2, ref;
    var fields = (
      /* initializes */
      mtype.fieldsArray.slice().sort(util2.compareFieldsById)
    );
    for (var i2 = 0; i2 < fields.length; ++i2) {
      var field2 = fields[i2].resolve(), index = mtype._fieldsArray.indexOf(field2), type2 = field2.resolvedType instanceof Enum ? "int32" : field2.type, wireType = types2.basic[type2];
      ref = "m" + util2.safeProp(field2.name);
      if (field2.map) {
        gen2("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field2.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field2.id << 3 | 2) >>> 0, 8 | types2.mapKey[field2.keyType], field2.keyType);
        if (wireType === void 0) gen2("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", index, ref);
        else gen2(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type2, ref);
        gen2("}")("}");
      } else if (field2.repeated) {
        gen2("if(%s!=null&&%s.length){", ref, ref);
        if (field2.packed && types2.packed[type2] !== void 0) {
          gen2("w.uint32(%i).fork()", (field2.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", ref)("w.%s(%s[i])", type2, ref)("w.ldelim()");
        } else {
          gen2("for(var i=0;i<%s.length;++i)", ref);
          if (wireType === void 0)
            genTypePartial(gen2, field2, index, ref + "[i]");
          else gen2("w.uint32(%i).%s(%s[i])", (field2.id << 3 | wireType) >>> 0, type2, ref);
        }
        gen2("}");
      } else {
        if (field2.optional) gen2("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", ref, field2.name);
        if (wireType === void 0)
          genTypePartial(gen2, field2, index, ref);
        else gen2("w.uint32(%i).%s(%s)", (field2.id << 3 | wireType) >>> 0, type2, ref);
      }
    }
    return gen2("return w");
  }
  return encoder_1;
}
var protobuf$1 = indexLight.exports = indexMinimal;
protobuf$1.build = "light";
function load(filename, root2, callback) {
  if (typeof root2 === "function") {
    callback = root2;
    root2 = new protobuf$1.Root();
  } else if (!root2)
    root2 = new protobuf$1.Root();
  return root2.load(filename, callback);
}
protobuf$1.load = load;
function loadSync(filename, root2) {
  if (!root2)
    root2 = new protobuf$1.Root();
  return root2.loadSync(filename);
}
protobuf$1.loadSync = loadSync;
protobuf$1.encoder = requireEncoder();
protobuf$1.decoder = requireDecoder();
protobuf$1.verifier = requireVerifier();
protobuf$1.converter = requireConverter();
protobuf$1.ReflectionObject = requireObject();
protobuf$1.Namespace = requireNamespace();
protobuf$1.Root = requireRoot();
protobuf$1.Enum = require_enum();
protobuf$1.Type = requireType();
protobuf$1.Field = requireField();
protobuf$1.OneOf = requireOneof();
protobuf$1.MapField = requireMapfield();
protobuf$1.Service = requireService();
protobuf$1.Method = requireMethod();
protobuf$1.Message = message;
protobuf$1.wrappers = wrappers;
protobuf$1.types = requireTypes();
protobuf$1.util = requireUtil();
protobuf$1.ReflectionObject._configure(protobuf$1.Root);
protobuf$1.Namespace._configure(protobuf$1.Type, protobuf$1.Service, protobuf$1.Enum);
protobuf$1.Root._configure(protobuf$1.Type);
protobuf$1.Field._configure(protobuf$1.Type);
var indexLightExports = indexLight.exports;
var light = indexLightExports;
const protobuf = /* @__PURE__ */ getDefaultExportFromCjs(light);
const rootJson = {
  nested: {
    rollup: {
      nested: {
        v1: {
          nested: {
            TransactionRequest: {
              fields: {
                chain_id: { type: "bytes", id: 1 },
                transaction: { rule: "repeated", type: "bytes", id: 2 }
              }
            },
            XTRequest: {
              fields: {
                transactions: {
                  rule: "repeated",
                  type: "TransactionRequest",
                  id: 1
                }
              }
            },
            Message: {
              fields: {
                sender_id: { type: "string", id: 1 },
                xt_request: { type: "XTRequest", id: 2 }
              },
              oneofs: {
                payload: { oneof: ["xt_request"] }
              }
            }
          }
        }
      }
    }
  }
};
const root = protobuf.Root.fromJSON(rootJson);
const Message = root.lookupType("rollup.v1.Message");
const XTRequest = root.lookupType("rollup.v1.XTRequest");
const TransactionRequest = root.lookupType("rollup.v1.TransactionRequest");
function encodeXtMessage(params) {
  const txs = params.entries.map(({ chainId, rawTx }) => {
    const chainBytes = toBigEndianBytes(chainId);
    const txBytes = hexToBytes$1(rawTx);
    return TransactionRequest.create({
      chain_id: chainBytes,
      transaction: [txBytes]
    });
  });
  const xt = XTRequest.create({ transactions: txs });
  const msg = Message.create({
    sender_id: params.senderId ?? "client",
    xt_request: xt
  });
  console.log("msg:", msg);
  const bytes = Message.encode(msg).finish();
  return "0x" + bytesToHex(bytes);
}
function toBigEndianBytes(id) {
  let v = BigInt(id);
  if (v === 0n) return new Uint8Array([0]);
  const out = [];
  while (v > 0n) {
    out.push(Number(v & 0xffn));
    v >>= 8n;
  }
  out.reverse();
  return Uint8Array.from(out);
}
function bytesToHex(u8) {
  const hex = new Array(u8.length);
  for (let i2 = 0; i2 < u8.length; i2++) {
    const h = u8[i2].toString(16).padStart(2, "0");
    hex[i2] = h;
  }
  return hex.join("");
}
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const { iterator, toStringTag } = Symbol;
const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
const kindOfTest = (type2) => {
  type2 = type2.toLowerCase();
  return (thing) => kindOf(thing) === type2;
};
const typeOfTest = (type2) => (thing) => typeof thing === type2;
const { isArray } = Array;
const isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
const isString = typeOfTest("string");
const isFunction$1 = typeOfTest("function");
const isNumber = typeOfTest("number");
const isObject = (thing) => thing !== null && typeof thing === "object";
const isBoolean = (thing) => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype2 = getPrototypeOf(val);
  return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
};
const isEmptyObject = (val) => {
  if (!isObject(val) || isBuffer(val)) {
    return false;
  }
  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e) {
    return false;
  }
};
const isDate = kindOfTest("Date");
const isFile = kindOfTest("File");
const isBlob = kindOfTest("Blob");
const isFileList = kindOfTest("FileList");
const isStream = (val) => isObject(val) && isFunction$1(val.pipe);
const isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
};
const isURLSearchParams = kindOfTest("URLSearchParams");
const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i2;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i2 = 0, l = obj.length; i2 < l; i2++) {
      fn.call(null, obj[i2], i2, obj);
    }
  } else {
    if (isBuffer(obj)) {
      return;
    }
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len2 = keys.length;
    let key;
    for (i2 = 0; i2 < len2; i2++) {
      key = keys[i2];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  if (isBuffer(obj)) {
    return null;
  }
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i2 = keys.length;
  let _key;
  while (i2-- > 0) {
    _key = keys[i2];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
const isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless, skipUndefined } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else if (!skipUndefined || !isUndefined(val)) {
      result[targetKey] = val;
    }
  };
  for (let i2 = 0, l = arguments.length; i2 < l; i2++) {
    arguments[i2] && forEach(arguments[i2], assignValue);
  }
  return result;
}
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction$1(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
const inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i2;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i2 = props.length;
    while (i2-- > 0) {
      prop = props[i2];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i2 = thing.length;
  if (!isNumber(i2)) return null;
  const arr = new Array(i2);
  while (i2-- > 0) {
    arr[i2] = thing[i2];
  }
  return arr;
};
const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];
  const _iterator = generator.call(obj);
  let result;
  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction$1(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction$1(value)) return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop = () => {
};
const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
const toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i2) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (isBuffer(source)) {
        return source;
      }
      if (!("toJSON" in source)) {
        stack[i2] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i2 + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i2] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }
  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({ source, data }) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);
    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    };
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === "function",
  isFunction$1(_global.postMessage)
);
const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
const isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
const utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isEmptyObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction: isFunction$1,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};
function AxiosError$1(message2, code2, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message2;
  this.name = "AxiosError";
  code2 && (this.code = code2);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}
utils$1.inherits(AxiosError$1, Error, {
  toJSON: function toJSON2() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const prototype$1 = AxiosError$1.prototype;
const descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code2) => {
  descriptors[code2] = { value: code2 };
});
Object.defineProperties(AxiosError$1, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", { value: true });
AxiosError$1.from = (error, code2, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);
  utils$1.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  const msg = error && error.message ? error.message : "Error";
  const errCode = code2 == null && error ? error.code : code2;
  AxiosError$1.call(axiosError, msg, errCode, config, request, response);
  if (error && axiosError.cause == null) {
    Object.defineProperty(axiosError, "cause", { value: error, configurable: true });
  }
  axiosError.name = error && error.name || "Error";
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
const httpAdapter = null;
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}
function removeBrackets(key) {
  return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path2, key, dots) {
  if (!path2) return key;
  return path2.concat(key).map(function each(token, i2) {
    token = removeBrackets(token);
    return !dots && i2 ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData$1(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new FormData();
  options = utils$1.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils$1.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
  if (!utils$1.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null) return "";
    if (utils$1.isDate(value)) {
      return value.toISOString();
    }
    if (utils$1.isBoolean(value)) {
      return value.toString();
    }
    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError$1("Blob is not supported. Use a Buffer instead.");
    }
    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path2) {
    let arr = value;
    if (value && !path2 && typeof value === "object") {
      if (utils$1.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path2, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path2) {
    if (utils$1.isUndefined(value)) return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path2.join("."));
    }
    stack.push(value);
    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils$1.isString(key) ? key.trim() : key,
        path2,
        exposedHelpers
      );
      if (result === true) {
        build(el, path2 ? path2.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils$1.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
function encode$1(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData$1(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString2(encoder2) {
  const _encode = encoder2 ? function(value) {
    return encoder2.call(this, value, encode$1);
  } : encode$1;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode;
  if (utils$1.isFunction(options)) {
    options = {
      serialize: options
    };
  }
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
const platform$1 = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
};
const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
const _navigator = typeof navigator === "object" && navigator || void 0;
const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
const hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
const origin = hasBrowserEnv && window.location.href || "http://localhost";
const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv,
  hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv,
  navigator: _navigator,
  origin
}, Symbol.toStringTag, { value: "Module" }));
const platform = {
  ...utils,
  ...platform$1
};
function toURLEncodedForm(data, options) {
  return toFormData$1(data, new platform.classes.URLSearchParams(), {
    visitor: function(value, key, path2, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}
function parsePropPath(name) {
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i2;
  const len2 = keys.length;
  let key;
  for (i2 = 0; i2 < len2; i2++) {
    key = keys[i2];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path2, value, target, index) {
    let name = path2[index++];
    if (name === "__proto__") return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path2.length;
    name = !name && utils$1.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path2, value, target[name], index);
    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};
    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
function stringifySafely(rawValue, parser, encoder2) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder2 || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: transitionalDefaults,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils$1.isObject(data);
    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils$1.isFormData(data);
    if (isFormData2) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }
    if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData$1(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
      return data;
    }
    if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data, this.parseReviver);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method2) => {
  defaults.headers[method2] = {};
});
const ignoreDuplicateOf = utils$1.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
const parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i2;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i2 = line.indexOf(":");
    key = line.substring(0, i2).trim().toLowerCase();
    val = line.substring(i2 + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
const $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils$1.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils$1.isString(value)) return;
  if (utils$1.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils$1.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
let AxiosHeaders$1 = class AxiosHeaders2 {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils$1.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!utils$1.isArray(entry)) {
          throw TypeError("Object iterator must return a key-value pair");
        }
        obj[key = entry[0]] = (dest = obj[key]) ? utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
      }
      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$1.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$1.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils$1.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i2 = keys.length;
    let deleted = false;
    while (i2--) {
      const key = keys[i2];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype2 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype2, _header);
        accessors[lHeader] = true;
      }
    }
    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
};
AxiosHeaders$1.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils$1.freezeMethods(AxiosHeaders$1);
function transformData(fns, response) {
  const config = this || defaults;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;
  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel$1(value) {
  return !!(value && value.__CANCEL__);
}
function CanceledError$1(message2, config, request) {
  AxiosError$1.call(this, message2 == null ? "canceled" : message2, AxiosError$1.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils$1.inherits(CanceledError$1, AxiosError$1, {
  __CANCEL__: true
});
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError$1(
      "Request failed with status code " + response.status,
      [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
}
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push2(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i2 = tail;
    let bytesCount = 0;
    while (i2 !== head) {
      bytesCount += bytes[i2++];
      i2 = i2 % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1e3 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };
  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if (passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return throttle((e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: true
    };
    listener(data);
  }, freq);
};
const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};
const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
const isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
  url = new URL(url, platform.origin);
  return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;
const cookies = platform.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path2, domain, secure) {
      const cookie = [name + "=" + encodeURIComponent(value)];
      utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
      utils$1.isString(path2) && cookie.push("path=" + path2);
      utils$1.isString(domain) && cookie.push("domain=" + domain);
      secure === true && cookie.push("secure");
      document.cookie = cookie.join("; ");
    },
    read(name) {
      const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
function mergeConfig$1(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, prop, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({ caseless }, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, prop, caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(void 0, a, prop, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
  };
  utils$1.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}
const resolveConfig = (config) => {
  const newConfig = mergeConfig$1({}, config);
  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  newConfig.headers = headers = AxiosHeaders$1.from(headers);
  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
  if (auth) {
    headers.set(
      "Authorization",
      "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
    );
  }
  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(void 0);
    } else if (utils$1.isFunction(data.getHeaders)) {
      const formHeaders = data.getHeaders();
      const allowedHeaders = ["content-type", "content-length"];
      Object.entries(formHeaders).forEach(([key, val]) => {
        if (allowedHeaders.includes(key.toLowerCase())) {
          headers.set(key, val);
        }
      });
    }
  }
  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let { responseType, onUploadProgress, onDownloadProgress } = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;
    function done() {
      flushUpload && flushUpload();
      flushDownload && flushDownload();
      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
      _config.signal && _config.signal.removeEventListener("abort", onCanceled);
    }
    let request = new XMLHttpRequest();
    request.open(_config.method.toUpperCase(), _config.url, true);
    request.timeout = _config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders$1.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError$1("Request aborted", AxiosError$1.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError(event) {
      const msg = event && event.message ? event.message : "Network Error";
      const err = new AxiosError$1(msg, AxiosError$1.ERR_NETWORK, config, request);
      err.event = event || null;
      reject(err);
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError$1(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils$1.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = _config.responseType;
    }
    if (onDownloadProgress) {
      [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
      request.addEventListener("progress", downloadThrottled);
    }
    if (onUploadProgress && request.upload) {
      [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
      request.upload.addEventListener("progress", uploadThrottled);
      request.upload.addEventListener("loadend", flushUpload);
    }
    if (_config.cancelToken || _config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(_config.url);
    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError$1("Unsupported protocol " + protocol + ":", AxiosError$1.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};
const composeSignals = (signals, timeout) => {
  const { length } = signals = signals ? signals.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController();
    let aborted;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal2) => {
          signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
        });
        signals = null;
      }
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils$1.asap(unsubscribe);
    return signal;
  }
};
const streamChunk = function* (chunk, chunkSize) {
  let len2 = chunk.byteLength;
  if (len2 < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end2;
  while (pos < len2) {
    end2 = pos + chunkSize;
    yield chunk.slice(pos, end2);
    pos = end2;
  }
};
const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};
const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }
  const reader2 = stream.getReader();
  try {
    for (; ; ) {
      const { done, value } = await reader2.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader2.cancel();
  }
};
const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator2 = readBytes(stream, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done: done2, value } = await iterator2.next();
        if (done2) {
          _onFinish();
          controller.close();
          return;
        }
        let len2 = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len2;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator2.return();
    }
  }, {
    highWaterMark: 2
  });
};
const DEFAULT_CHUNK_SIZE = 64 * 1024;
const { isFunction } = utils$1;
const globalFetchAPI = (({ Request, Response }) => ({
  Request,
  Response
}))(utils$1.global);
const {
  ReadableStream: ReadableStream$1,
  TextEncoder: TextEncoder$1
} = utils$1.global;
const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false;
  }
};
const factory = (env) => {
  env = utils$1.merge.call({
    skipUndefined: true
  }, globalFetchAPI, env);
  const { fetch: envFetch, Request, Response } = env;
  const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
  const isRequestSupported = isFunction(Request);
  const isResponseSupported = isFunction(Response);
  if (!isFetchSupported) {
    return false;
  }
  const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);
  const encodeText = isFetchSupported && (typeof TextEncoder$1 === "function" ? /* @__PURE__ */ ((encoder2) => (str) => encoder2.encode(str))(new TextEncoder$1()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
  const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
    let duplexAccessed = false;
    const hasContentType = new Request(platform.origin, {
      body: new ReadableStream$1(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      }
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  });
  const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && (() => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type2) => {
      !resolvers[type2] && (resolvers[type2] = (res, config) => {
        let method2 = res && res[type2];
        if (method2) {
          return method2.call(res);
        }
        throw new AxiosError$1(`Response type '${type2}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config);
      });
    });
  })();
  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }
    if (utils$1.isBlob(body)) {
      return body.size;
    }
    if (utils$1.isSpecCompliantForm(body)) {
      const _request = new Request(platform.origin, {
        method: "POST",
        body
      });
      return (await _request.arrayBuffer()).byteLength;
    }
    if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (utils$1.isURLSearchParams(body)) {
      body = body + "";
    }
    if (utils$1.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };
  const resolveBodyLength = async (headers, body) => {
    const length = utils$1.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  };
  return async (config) => {
    let {
      url,
      method: method2,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions
    } = resolveConfig(config);
    let _fetch = envFetch || fetch;
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
    let request = null;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method2 !== "get" && method2 !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request(url, {
          method: "POST",
          body: data,
          duplex: "half"
        });
        let contentTypeHeader;
        if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils$1.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
      const resolvedOptions = {
        ...fetchOptions,
        signal: composedSignal,
        method: method2.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0
      };
      request = isRequestSupported && new Request(url, resolvedOptions);
      let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
      const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
          responseContentLength,
          progressEventReducer(asyncDecorator(onDownloadProgress), true)
        ) || [];
        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }
      responseType = responseType || "text";
      let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders$1.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config, request),
          {
            cause: err.cause || err
          }
        );
      }
      throw AxiosError$1.from(err, err && err.code, config, request);
    }
  };
};
const seedCache = /* @__PURE__ */ new Map();
const getFetch = (config) => {
  let env = config ? config.env : {};
  const { fetch: fetch2, Request, Response } = env;
  const seeds = [
    Request,
    Response,
    fetch2
  ];
  let len2 = seeds.length, i2 = len2, seed, target, map = seedCache;
  while (i2--) {
    seed = seeds[i2];
    target = map.get(seed);
    target === void 0 && map.set(seed, target = i2 ? /* @__PURE__ */ new Map() : factory(env));
    map = target;
  }
  return target;
};
getFetch();
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: {
    get: getFetch
  }
};
utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
const renderReason = (reason) => `- ${reason}`;
const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
const adapters = {
  getAdapter: (adapters2, config) => {
    adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
    const { length } = adapters2;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i2 = 0; i2 < length; i2++) {
      nameOrAdapter = adapters2[i2];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError$1(`Unknown adapter '${id}'`);
        }
      }
      if (adapter && (utils$1.isFunction(adapter) || (adapter = adapter.get(config)))) {
        break;
      }
      rejectedReasons[id || "#" + i2] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError$1(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  },
  adapters: knownAdapters
};
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError$1(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders$1.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters.getAdapter(config.adapter || defaults.adapter, config);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders$1.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel$1(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
const VERSION$1 = "1.12.2";
const validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type2, i2) => {
  validators$1[type2] = function validator2(thing) {
    return typeof thing === type2 || "a" + (i2 < 1 ? "n " : " ") + type2;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version2, message2) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message2 ? ". " + message2 : "");
  }
  return (value, opt, opts) => {
    if (validator2 === false) {
      throw new AxiosError$1(
        formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
        AxiosError$1.ERR_DEPRECATED
      );
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version2 + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError$1("options must be an object", AxiosError$1.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i2 = keys.length;
  while (i2-- > 0) {
    const opt = keys[i2];
    const validator2 = schema[opt];
    if (validator2) {
      const value = options[opt];
      const result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new AxiosError$1("option " + opt + " must be " + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError$1("Unknown option " + opt, AxiosError$1.ERR_BAD_OPTION);
    }
  }
}
const validator = {
  assertOptions,
  validators: validators$1
};
const validators = validator.validators;
let Axios$1 = class Axios2 {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
            err.stack += "\n" + stack;
          }
        } catch (e) {
        }
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig$1(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }
    if (config.allowAbsoluteUrls !== void 0) ;
    else if (this.defaults.allowAbsoluteUrls !== void 0) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }
    validator.assertOptions(config, {
      baseUrl: validators.spelling("baseURL"),
      withXsrfToken: validators.spelling("withXSRFToken")
    }, true);
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config.method]
    );
    headers && utils$1.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method2) => {
        delete headers[method2];
      }
    );
    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i2 = 0;
    let len2;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len2 = chain.length;
      promise = Promise.resolve(config);
      while (i2 < len2) {
        promise = promise.then(chain[i2++], chain[i2++]);
      }
      return promise;
    }
    len2 = requestInterceptorChain.length;
    let newConfig = config;
    while (i2 < len2) {
      const onFulfilled = requestInterceptorChain[i2++];
      const onRejected = requestInterceptorChain[i2++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i2 = 0;
    len2 = responseInterceptorChain.length;
    while (i2 < len2) {
      promise = promise.then(responseInterceptorChain[i2++], responseInterceptorChain[i2++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method2) {
  Axios$1.prototype[method2] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method: method2,
      url,
      data: (config || {}).data
    }));
  };
});
utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method2) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig$1(config || {}, {
        method: method2,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url,
        data
      }));
    };
  }
  Axios$1.prototype[method2] = generateHTTPMethod();
  Axios$1.prototype[method2 + "Form"] = generateHTTPMethod(true);
});
let CancelToken$1 = class CancelToken2 {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners) return;
      let i2 = token._listeners.length;
      while (i2-- > 0) {
        token._listeners[i2](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message2, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError$1(message2, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController();
    const abort = (err) => {
      controller.abort(err);
    };
    this.subscribe(abort);
    controller.signal.unsubscribe = () => this.unsubscribe(abort);
    return controller.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken2(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};
function spread$1(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError$1(payload) {
  return utils$1.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode$1 = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
  HttpStatusCode$1[value] = key;
});
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);
  utils$1.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
  utils$1.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create5(instanceConfig) {
    return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults);
axios.Axios = Axios$1;
axios.CanceledError = CanceledError$1;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel$1;
axios.VERSION = VERSION$1;
axios.toFormData = toFormData$1;
axios.AxiosError = AxiosError$1;
axios.Cancel = axios.CanceledError;
axios.all = function all2(promises) {
  return Promise.all(promises);
};
axios.spread = spread$1;
axios.isAxiosError = isAxiosError$1;
axios.mergeConfig = mergeConfig$1;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters.getAdapter;
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
const {
  Axios,
  AxiosError,
  CanceledError,
  isCancel,
  CancelToken,
  VERSION,
  all,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig
} = axios;
const api = axios.create({
  headers: {
    "Access-Control-Allow-Origin": "*",
    "web-app-source": true
  }
});
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);
const hexify = (n) => n ? numberToHex$1(n) : void 0;
const getPaymasterDataForChain = async ({
  params,
  method: method2,
  getPaymasterEndpoint
}) => {
  ({
    callData: params.callData,
    initCode: params.initCode,
    callGasLimit: hexify(params.callGasLimit),
    factory: params.factory,
    factoryData: params.factoryData,
    maxFeePerGas: hexify(params.maxFeePerGas || 0),
    maxPriorityFeePerGas: hexify(params.maxPriorityFeePerGas || 0),
    nonce: hexify(params.nonce),
    sender: params.sender,
    preVerificationGas: hexify(params.preVerificationGas || 0),
    verificationGasLimit: hexify(params.verificationGasLimit || 0),
    paymasterPostOpGasLimit: hexify(params.paymasterPostOpGasLimit || 0),
    paymasterVerificationGasLimit: hexify(params.paymasterVerificationGasLimit || 0)
  });
  {
    throw new Error("VITE_PAYMASTER_URL is not set - Paymaster Service URL - set it in .env to support paymaster");
  }
};
const KernelModuleIsInitializedAbi = [
  {
    type: "function",
    name: "isInitialized",
    inputs: [
      { name: "smartAccount", type: "address", internalType: "address" }
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view"
  }
];
const KernelModuleInstallAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "moduleType",
        type: "uint256"
      },
      { internalType: "address", name: "module", type: "address" },
      { internalType: "bytes", name: "initData", type: "bytes" }
    ],
    stateMutability: "payable",
    type: "function",
    name: "installModule"
  }
];
const KernelModuleIsModuleInstalledAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "moduleType",
        type: "uint256"
      },
      { internalType: "address", name: "module", type: "address" },
      {
        internalType: "bytes",
        name: "additionalContext",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function",
    name: "isModuleInstalled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }]
  }
];
const KernelV3ExecuteAbi = [
  {
    type: "function",
    name: "execute",
    inputs: [
      { name: "execMode", type: "bytes32", internalType: "ExecMode" },
      { name: "executionCalldata", type: "bytes", internalType: "bytes" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "executeFromExecutor",
    inputs: [
      { name: "execMode", type: "bytes32", internalType: "ExecMode" },
      { name: "executionCalldata", type: "bytes", internalType: "bytes" }
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
  }
];
const KernelV3AccountAbi = [
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
      { name: "extensions", type: "uint256[]", internalType: "uint256[]" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "entrypoint",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IEntryPoint" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      { name: "execMode", type: "bytes32", internalType: "ExecMode" },
      { name: "executionCalldata", type: "bytes", internalType: "bytes" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "executeFromExecutor",
    inputs: [
      { name: "execMode", type: "bytes32", internalType: "ExecMode" },
      { name: "executionCalldata", type: "bytes", internalType: "bytes" }
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
      { name: "hookData", type: "bytes", internalType: "bytes" }
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
      { name: "vIds", type: "bytes21[]", internalType: "ValidationId[]" },
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
      { name: "additionalContext", type: "bytes", internalType: "bytes" }
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
  { type: "error", name: "PermissionNotAlllowedForSignature", inputs: [] },
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
const getEncodedPluginsData = async ({ enableSignature, userOpSignature, action, enableData, hook }) => {
  return concat$1([
    hook?.getIdentifier() ?? zeroAddress,
    // hook address 20 bytes
    encodeAbiParameters$1(parseAbiParameters("bytes validatorData, bytes hookData, bytes selectorData, bytes enableSig, bytes userOpSig"), [
      enableData,
      await hook?.getEnableData() ?? "0x",
      concat$1([
        action.selector,
        action.address,
        action.hook?.address ?? zeroAddress,
        encodeAbiParameters$1(
          parseAbiParameters("bytes selectorInitData, bytes hookInitData"),
          // [TODO]: Add support for other call_type
          [CALL_TYPE.DELEGATE_CALL, "0x0000"]
        )
      ]),
      enableSignature,
      userOpSignature
    ])
  ]);
};
const isPluginInitialized = async (client, accountAddress, pluginAddress) => {
  try {
    return await getAction(client, readContract, "readContract")({
      abi: KernelModuleIsInitializedAbi,
      address: pluginAddress,
      functionName: "isInitialized",
      args: [accountAddress]
    });
  } catch (error) {
  }
  return false;
};
class AccountNotFoundError extends BaseError$3 {
  constructor({ docsPath: docsPath2 } = {}) {
    super([
      "Could not find an Account to execute with this Action.",
      "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client."
    ].join("\n"), {
      docsPath: docsPath2,
      docsSlug: "account",
      name: "AccountNotFoundError"
    });
  }
}
class SignTransactionNotSupportedBySmartAccountError extends BaseError$3 {
  constructor() {
    super("Smart account signer doesn't need to sign transactions", {
      name: "SignTransactionNotSupportedError"
    });
  }
}
var dist = {};
var MerkleTree$1 = {};
var buffer = {};
var base64Js = {};
base64Js.byteLength = byteLength;
base64Js.toByteArray = toByteArray;
base64Js.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
  var len2 = b64.length;
  if (len2 % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  var validLen = b64.indexOf("=");
  if (validLen === -1) validLen = len2;
  var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;
  var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i2;
  for (i2 = 0; i2 < len2; i2 += 4) {
    tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
    arr[curByte++] = tmp >> 16 & 255;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end2) {
  var tmp;
  var output = [];
  for (var i2 = start; i2 < end2; i2 += 3) {
    tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  var tmp;
  var len2 = uint8.length;
  var extraBytes = len2 % 3;
  var parts = [];
  var maxChunkLength = 16383;
  for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
    parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len2 - 1];
    parts.push(
      lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
    parts.push(
      lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
    );
  }
  return parts.join("");
}
var ieee754 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ieee754.read = function(buffer2, offset, isLE2, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i2 = isLE2 ? nBytes - 1 : 0;
  var d = isLE2 ? -1 : 1;
  var s = buffer2[offset + i2];
  i2 += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer2[offset + i2], i2 += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer2[offset + i2], i2 += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
ieee754.write = function(buffer2, value, offset, isLE2, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i2 = isLE2 ? 0 : nBytes - 1;
  var d = isLE2 ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer2[offset + i2] = m & 255, i2 += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer2[offset + i2] = e & 255, i2 += d, e /= 256, eLen -= 8) {
  }
  buffer2[offset + i2 - d] |= s * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(exports) {
  var base642 = base64Js;
  var ieee754$1 = ieee754;
  var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
  exports.Buffer = Buffer2;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  var K_MAX_LENGTH = 2147483647;
  exports.kMaxLength = K_MAX_LENGTH;
  Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
  if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
    console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
  }
  function typedArraySupport() {
    try {
      var arr = new Uint8Array(1);
      var proto = { foo: function() {
        return 42;
      } };
      Object.setPrototypeOf(proto, Uint8Array.prototype);
      Object.setPrototypeOf(arr, proto);
      return arr.foo() === 42;
    } catch (e) {
      return false;
    }
  }
  Object.defineProperty(Buffer2.prototype, "parent", {
    enumerable: true,
    get: function() {
      if (!Buffer2.isBuffer(this)) return void 0;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer2.prototype, "offset", {
    enumerable: true,
    get: function() {
      if (!Buffer2.isBuffer(this)) return void 0;
      return this.byteOffset;
    }
  });
  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    var buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer2.prototype);
    return buf;
  }
  function Buffer2(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      if (typeof encodingOrOffset === "string") {
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      }
      return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
  }
  Buffer2.poolSize = 8192;
  function from(value, encodingOrOffset, length) {
    if (typeof value === "string") {
      return fromString(value, encodingOrOffset);
    }
    if (ArrayBuffer.isView(value)) {
      return fromArrayView(value);
    }
    if (value == null) {
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === "number") {
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    }
    var valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) {
      return Buffer2.from(valueOf, encodingOrOffset, length);
    }
    var b = fromObject2(value);
    if (b) return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
      return Buffer2.from(
        value[Symbol.toPrimitive]("string"),
        encodingOrOffset,
        length
      );
    }
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
    );
  }
  Buffer2.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
  };
  Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(Buffer2, Uint8Array);
  function assertSize2(size2) {
    if (typeof size2 !== "number") {
      throw new TypeError('"size" argument must be of type number');
    } else if (size2 < 0) {
      throw new RangeError('The value "' + size2 + '" is invalid for option "size"');
    }
  }
  function alloc2(size2, fill, encoding) {
    assertSize2(size2);
    if (size2 <= 0) {
      return createBuffer(size2);
    }
    if (fill !== void 0) {
      return typeof encoding === "string" ? createBuffer(size2).fill(fill, encoding) : createBuffer(size2).fill(fill);
    }
    return createBuffer(size2);
  }
  Buffer2.alloc = function(size2, fill, encoding) {
    return alloc2(size2, fill, encoding);
  };
  function allocUnsafe(size2) {
    assertSize2(size2);
    return createBuffer(size2 < 0 ? 0 : checked(size2) | 0);
  }
  Buffer2.allocUnsafe = function(size2) {
    return allocUnsafe(size2);
  };
  Buffer2.allocUnsafeSlow = function(size2) {
    return allocUnsafe(size2);
  };
  function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer2.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
    var length = byteLength2(string, encoding) | 0;
    var buf = createBuffer(length);
    var actual = buf.write(string, encoding);
    if (actual !== length) {
      buf = buf.slice(0, actual);
    }
    return buf;
  }
  function fromArrayLike(array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0;
    var buf = createBuffer(length);
    for (var i2 = 0; i2 < length; i2 += 1) {
      buf[i2] = array[i2] & 255;
    }
    return buf;
  }
  function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
      var copy = new Uint8Array(arrayView);
      return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
  }
  function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds');
    }
    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds');
    }
    var buf;
    if (byteOffset === void 0 && length === void 0) {
      buf = new Uint8Array(array);
    } else if (length === void 0) {
      buf = new Uint8Array(array, byteOffset);
    } else {
      buf = new Uint8Array(array, byteOffset, length);
    }
    Object.setPrototypeOf(buf, Buffer2.prototype);
    return buf;
  }
  function fromObject2(obj) {
    if (Buffer2.isBuffer(obj)) {
      var len2 = checked(obj.length) | 0;
      var buf = createBuffer(len2);
      if (buf.length === 0) {
        return buf;
      }
      obj.copy(buf, 0, 0, len2);
      return buf;
    }
    if (obj.length !== void 0) {
      if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }
      return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }
  function checked(length) {
    if (length >= K_MAX_LENGTH) {
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    }
    return length | 0;
  }
  function SlowBuffer(length) {
    if (+length != length) {
      length = 0;
    }
    return Buffer2.alloc(+length);
  }
  Buffer2.isBuffer = function isBuffer2(b) {
    return b != null && b._isBuffer === true && b !== Buffer2.prototype;
  };
  Buffer2.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array)) a = Buffer2.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array)) b = Buffer2.from(b, b.offset, b.byteLength);
    if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    }
    if (a === b) return 0;
    var x = a.length;
    var y = b.length;
    for (var i2 = 0, len2 = Math.min(x, y); i2 < len2; ++i2) {
      if (a[i2] !== b[i2]) {
        x = a[i2];
        y = b[i2];
        break;
      }
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };
  Buffer2.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  };
  Buffer2.concat = function concat2(list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
      return Buffer2.alloc(0);
    }
    var i2;
    if (length === void 0) {
      length = 0;
      for (i2 = 0; i2 < list.length; ++i2) {
        length += list[i2].length;
      }
    }
    var buffer2 = Buffer2.allocUnsafe(length);
    var pos = 0;
    for (i2 = 0; i2 < list.length; ++i2) {
      var buf = list[i2];
      if (isInstance(buf, Uint8Array)) {
        if (pos + buf.length > buffer2.length) {
          Buffer2.from(buf).copy(buffer2, pos);
        } else {
          Uint8Array.prototype.set.call(
            buffer2,
            buf,
            pos
          );
        }
      } else if (!Buffer2.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      } else {
        buf.copy(buffer2, pos);
      }
      pos += buf.length;
    }
    return buffer2;
  };
  function byteLength2(string, encoding) {
    if (Buffer2.isBuffer(string)) {
      return string.length;
    }
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
      return string.byteLength;
    }
    if (typeof string !== "string") {
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
      );
    }
    var len2 = string.length;
    var mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len2 === 0) return 0;
    var loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "ascii":
        case "latin1":
        case "binary":
          return len2;
        case "utf8":
        case "utf-8":
          return utf8ToBytes2(string).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return len2 * 2;
        case "hex":
          return len2 >>> 1;
        case "base64":
          return base64ToBytes(string).length;
        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes2(string).length;
          }
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer2.byteLength = byteLength2;
  function slowToString(encoding, start, end2) {
    var loweredCase = false;
    if (start === void 0 || start < 0) {
      start = 0;
    }
    if (start > this.length) {
      return "";
    }
    if (end2 === void 0 || end2 > this.length) {
      end2 = this.length;
    }
    if (end2 <= 0) {
      return "";
    }
    end2 >>>= 0;
    start >>>= 0;
    if (end2 <= start) {
      return "";
    }
    if (!encoding) encoding = "utf8";
    while (true) {
      switch (encoding) {
        case "hex":
          return hexSlice(this, start, end2);
        case "utf8":
        case "utf-8":
          return utf8Slice(this, start, end2);
        case "ascii":
          return asciiSlice(this, start, end2);
        case "latin1":
        case "binary":
          return latin1Slice(this, start, end2);
        case "base64":
          return base64Slice(this, start, end2);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return utf16leSlice(this, start, end2);
        default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer2.prototype._isBuffer = true;
  function swap(b, n, m) {
    var i2 = b[n];
    b[n] = b[m];
    b[m] = i2;
  }
  Buffer2.prototype.swap16 = function swap16() {
    var len2 = this.length;
    if (len2 % 2 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for (var i2 = 0; i2 < len2; i2 += 2) {
      swap(this, i2, i2 + 1);
    }
    return this;
  };
  Buffer2.prototype.swap32 = function swap32() {
    var len2 = this.length;
    if (len2 % 4 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for (var i2 = 0; i2 < len2; i2 += 4) {
      swap(this, i2, i2 + 3);
      swap(this, i2 + 1, i2 + 2);
    }
    return this;
  };
  Buffer2.prototype.swap64 = function swap64() {
    var len2 = this.length;
    if (len2 % 8 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    }
    for (var i2 = 0; i2 < len2; i2 += 8) {
      swap(this, i2, i2 + 7);
      swap(this, i2 + 1, i2 + 6);
      swap(this, i2 + 2, i2 + 5);
      swap(this, i2 + 3, i2 + 4);
    }
    return this;
  };
  Buffer2.prototype.toString = function toString3() {
    var length = this.length;
    if (length === 0) return "";
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };
  Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
  Buffer2.prototype.equals = function equals(b) {
    if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
    if (this === b) return true;
    return Buffer2.compare(this, b) === 0;
  };
  Buffer2.prototype.inspect = function inspect() {
    var str = "";
    var max = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max) str += " ... ";
    return "<Buffer " + str + ">";
  };
  if (customInspectSymbol) {
    Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
  }
  Buffer2.prototype.compare = function compare(target, start, end2, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
      target = Buffer2.from(target, target.offset, target.byteLength);
    }
    if (!Buffer2.isBuffer(target)) {
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
      );
    }
    if (start === void 0) {
      start = 0;
    }
    if (end2 === void 0) {
      end2 = target ? target.length : 0;
    }
    if (thisStart === void 0) {
      thisStart = 0;
    }
    if (thisEnd === void 0) {
      thisEnd = this.length;
    }
    if (start < 0 || end2 > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError("out of range index");
    }
    if (thisStart >= thisEnd && start >= end2) {
      return 0;
    }
    if (thisStart >= thisEnd) {
      return -1;
    }
    if (start >= end2) {
      return 1;
    }
    start >>>= 0;
    end2 >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    var x = thisEnd - thisStart;
    var y = end2 - start;
    var len2 = Math.min(x, y);
    var thisCopy = this.slice(thisStart, thisEnd);
    var targetCopy = target.slice(start, end2);
    for (var i2 = 0; i2 < len2; ++i2) {
      if (thisCopy[i2] !== targetCopy[i2]) {
        x = thisCopy[i2];
        y = targetCopy[i2];
        break;
      }
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };
  function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
    if (buffer2.length === 0) return -1;
    if (typeof byteOffset === "string") {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 2147483647) {
      byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
      byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (numberIsNaN(byteOffset)) {
      byteOffset = dir ? 0 : buffer2.length - 1;
    }
    if (byteOffset < 0) byteOffset = buffer2.length + byteOffset;
    if (byteOffset >= buffer2.length) {
      if (dir) return -1;
      else byteOffset = buffer2.length - 1;
    } else if (byteOffset < 0) {
      if (dir) byteOffset = 0;
      else return -1;
    }
    if (typeof val === "string") {
      val = Buffer2.from(val, encoding);
    }
    if (Buffer2.isBuffer(val)) {
      if (val.length === 0) {
        return -1;
      }
      return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
      val = val & 255;
      if (typeof Uint8Array.prototype.indexOf === "function") {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
        }
      }
      return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
  }
  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;
    if (encoding !== void 0) {
      encoding = String(encoding).toLowerCase();
      if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }
        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }
    function read(buf, i3) {
      if (indexSize === 1) {
        return buf[i3];
      } else {
        return buf.readUInt16BE(i3 * indexSize);
      }
    }
    var i2;
    if (dir) {
      var foundIndex = -1;
      for (i2 = byteOffset; i2 < arrLength; i2++) {
        if (read(arr, i2) === read(val, foundIndex === -1 ? 0 : i2 - foundIndex)) {
          if (foundIndex === -1) foundIndex = i2;
          if (i2 - foundIndex + 1 === valLength) return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1) i2 -= i2 - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
      for (i2 = byteOffset; i2 >= 0; i2--) {
        var found = true;
        for (var j = 0; j < valLength; j++) {
          if (read(arr, i2 + j) !== read(val, j)) {
            found = false;
            break;
          }
        }
        if (found) return i2;
      }
    }
    return -1;
  }
  Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };
  Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };
  Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };
  function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = Number(length);
      if (length > remaining) {
        length = remaining;
      }
    }
    var strLen = string.length;
    if (length > strLen / 2) {
      length = strLen / 2;
    }
    for (var i2 = 0; i2 < length; ++i2) {
      var parsed = parseInt(string.substr(i2 * 2, 2), 16);
      if (numberIsNaN(parsed)) return i2;
      buf[offset + i2] = parsed;
    }
    return i2;
  }
  function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes2(string, buf.length - offset), buf, offset, length);
  }
  function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
  }
  function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
  }
  function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
  }
  Buffer2.prototype.write = function write(string, offset, length, encoding) {
    if (offset === void 0) {
      encoding = "utf8";
      length = this.length;
      offset = 0;
    } else if (length === void 0 && typeof offset === "string") {
      encoding = offset;
      length = this.length;
      offset = 0;
    } else if (isFinite(offset)) {
      offset = offset >>> 0;
      if (isFinite(length)) {
        length = length >>> 0;
        if (encoding === void 0) encoding = "utf8";
      } else {
        encoding = length;
        length = void 0;
      }
    } else {
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    }
    var remaining = this.length - offset;
    if (length === void 0 || length > remaining) length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError("Attempt to write outside buffer bounds");
    }
    if (!encoding) encoding = "utf8";
    var loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "hex":
          return hexWrite(this, string, offset, length);
        case "utf8":
        case "utf-8":
          return utf8Write(this, string, offset, length);
        case "ascii":
        case "latin1":
        case "binary":
          return asciiWrite(this, string, offset, length);
        case "base64":
          return base64Write(this, string, offset, length);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ucs2Write(this, string, offset, length);
        default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };
  Buffer2.prototype.toJSON = function toJSON3() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function base64Slice(buf, start, end2) {
    if (start === 0 && end2 === buf.length) {
      return base642.fromByteArray(buf);
    } else {
      return base642.fromByteArray(buf.slice(start, end2));
    }
  }
  function utf8Slice(buf, start, end2) {
    end2 = Math.min(buf.length, end2);
    var res = [];
    var i2 = start;
    while (i2 < end2) {
      var firstByte = buf[i2];
      var codePoint = null;
      var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (i2 + bytesPerSequence <= end2) {
        var secondByte, thirdByte, fourthByte, tempCodePoint;
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 128) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf[i2 + 1];
            if ((secondByte & 192) === 128) {
              tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
              if (tempCodePoint > 127) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf[i2 + 1];
            thirdByte = buf[i2 + 2];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
              if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf[i2 + 1];
            thirdByte = buf[i2 + 2];
            fourthByte = buf[i2 + 3];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
              if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                codePoint = tempCodePoint;
              }
            }
        }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        res.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      res.push(codePoint);
      i2 += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
  }
  var MAX_ARGUMENTS_LENGTH = 4096;
  function decodeCodePointsArray(codePoints) {
    var len2 = codePoints.length;
    if (len2 <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    var res = "";
    var i2 = 0;
    while (i2 < len2) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i2, i2 += MAX_ARGUMENTS_LENGTH)
      );
    }
    return res;
  }
  function asciiSlice(buf, start, end2) {
    var ret = "";
    end2 = Math.min(buf.length, end2);
    for (var i2 = start; i2 < end2; ++i2) {
      ret += String.fromCharCode(buf[i2] & 127);
    }
    return ret;
  }
  function latin1Slice(buf, start, end2) {
    var ret = "";
    end2 = Math.min(buf.length, end2);
    for (var i2 = start; i2 < end2; ++i2) {
      ret += String.fromCharCode(buf[i2]);
    }
    return ret;
  }
  function hexSlice(buf, start, end2) {
    var len2 = buf.length;
    if (!start || start < 0) start = 0;
    if (!end2 || end2 < 0 || end2 > len2) end2 = len2;
    var out = "";
    for (var i2 = start; i2 < end2; ++i2) {
      out += hexSliceLookupTable[buf[i2]];
    }
    return out;
  }
  function utf16leSlice(buf, start, end2) {
    var bytes = buf.slice(start, end2);
    var res = "";
    for (var i2 = 0; i2 < bytes.length - 1; i2 += 2) {
      res += String.fromCharCode(bytes[i2] + bytes[i2 + 1] * 256);
    }
    return res;
  }
  Buffer2.prototype.slice = function slice2(start, end2) {
    var len2 = this.length;
    start = ~~start;
    end2 = end2 === void 0 ? len2 : ~~end2;
    if (start < 0) {
      start += len2;
      if (start < 0) start = 0;
    } else if (start > len2) {
      start = len2;
    }
    if (end2 < 0) {
      end2 += len2;
      if (end2 < 0) end2 = 0;
    } else if (end2 > len2) {
      end2 = len2;
    }
    if (end2 < start) end2 = start;
    var newBuf = this.subarray(start, end2);
    Object.setPrototypeOf(newBuf, Buffer2.prototype);
    return newBuf;
  };
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
    if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
  }
  Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) checkOffset(offset, byteLength3, this.length);
    var val = this[offset];
    var mul = 1;
    var i2 = 0;
    while (++i2 < byteLength3 && (mul *= 256)) {
      val += this[offset + i2] * mul;
    }
    return val;
  };
  Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      checkOffset(offset, byteLength3, this.length);
    }
    var val = this[offset + --byteLength3];
    var mul = 1;
    while (byteLength3 > 0 && (mul *= 256)) {
      val += this[offset + --byteLength3] * mul;
    }
    return val;
  };
  Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
  };
  Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };
  Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };
  Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
  };
  Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };
  Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) checkOffset(offset, byteLength3, this.length);
    var val = this[offset];
    var mul = 1;
    var i2 = 0;
    while (++i2 < byteLength3 && (mul *= 256)) {
      val += this[offset + i2] * mul;
    }
    mul *= 128;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) checkOffset(offset, byteLength3, this.length);
    var i2 = byteLength3;
    var mul = 1;
    var val = this[offset + --i2];
    while (i2 > 0 && (mul *= 256)) {
      val += this[offset + --i2] * mul;
    }
    mul *= 128;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128)) return this[offset];
    return (255 - this[offset] + 1) * -1;
  };
  Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };
  Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };
  Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754$1.read(this, offset, true, 23, 4);
  };
  Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754$1.read(this, offset, false, 23, 4);
  };
  Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754$1.read(this, offset, true, 52, 8);
  };
  Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754$1.read(this, offset, false, 52, 8);
  };
  function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError("Index out of range");
  }
  Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value, offset, byteLength3, maxBytes, 0);
    }
    var mul = 1;
    var i2 = 0;
    this[offset] = value & 255;
    while (++i2 < byteLength3 && (mul *= 256)) {
      this[offset + i2] = value / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value, offset, byteLength3, maxBytes, 0);
    }
    var i2 = byteLength3 - 1;
    var mul = 1;
    this[offset + i2] = value & 255;
    while (--i2 >= 0 && (mul *= 256)) {
      this[offset + i2] = value / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
    return offset + 4;
  };
  Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value, offset, byteLength3, limit - 1, -limit);
    }
    var i2 = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value & 255;
    while (++i2 < byteLength3 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i2 - 1] !== 0) {
        sub = 1;
      }
      this[offset + i2] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value, offset, byteLength3, limit - 1, -limit);
    }
    var i2 = byteLength3 - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i2] = value & 255;
    while (--i2 >= 0 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i2 + 1] !== 0) {
        sub = 1;
      }
      this[offset + i2] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
    if (value < 0) value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
  };
  Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (value < 0) value = 4294967295 + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError("Index out of range");
    if (offset < 0) throw new RangeError("Index out of range");
  }
  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4);
    }
    ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }
  Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };
  Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };
  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8);
    }
    ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }
  Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };
  Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  };
  Buffer2.prototype.copy = function copy(target, targetStart, start, end2) {
    if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
    if (!start) start = 0;
    if (!end2 && end2 !== 0) end2 = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end2 > 0 && end2 < start) end2 = start;
    if (end2 === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;
    if (targetStart < 0) {
      throw new RangeError("targetStart out of bounds");
    }
    if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
    if (end2 < 0) throw new RangeError("sourceEnd out of bounds");
    if (end2 > this.length) end2 = this.length;
    if (target.length - targetStart < end2 - start) {
      end2 = target.length - targetStart + start;
    }
    var len2 = end2 - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
      this.copyWithin(targetStart, start, end2);
    } else {
      Uint8Array.prototype.set.call(
        target,
        this.subarray(start, end2),
        targetStart
      );
    }
    return len2;
  };
  Buffer2.prototype.fill = function fill(val, start, end2, encoding) {
    if (typeof val === "string") {
      if (typeof start === "string") {
        encoding = start;
        start = 0;
        end2 = this.length;
      } else if (typeof end2 === "string") {
        encoding = end2;
        end2 = this.length;
      }
      if (encoding !== void 0 && typeof encoding !== "string") {
        throw new TypeError("encoding must be a string");
      }
      if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      if (val.length === 1) {
        var code2 = val.charCodeAt(0);
        if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
          val = code2;
        }
      }
    } else if (typeof val === "number") {
      val = val & 255;
    } else if (typeof val === "boolean") {
      val = Number(val);
    }
    if (start < 0 || this.length < start || this.length < end2) {
      throw new RangeError("Out of range index");
    }
    if (end2 <= start) {
      return this;
    }
    start = start >>> 0;
    end2 = end2 === void 0 ? this.length : end2 >>> 0;
    if (!val) val = 0;
    var i2;
    if (typeof val === "number") {
      for (i2 = start; i2 < end2; ++i2) {
        this[i2] = val;
      }
    } else {
      var bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
      var len2 = bytes.length;
      if (len2 === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }
      for (i2 = 0; i2 < end2 - start; ++i2) {
        this[i2 + start] = bytes[i2 % len2];
      }
    }
    return this;
  };
  var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
  function base64clean(str) {
    str = str.split("=")[0];
    str = str.trim().replace(INVALID_BASE64_RE, "");
    if (str.length < 2) return "";
    while (str.length % 4 !== 0) {
      str = str + "=";
    }
    return str;
  }
  function utf8ToBytes2(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];
    for (var i2 = 0; i2 < length; ++i2) {
      codePoint = string.charCodeAt(i2);
      if (codePoint > 55295 && codePoint < 57344) {
        if (!leadSurrogate) {
          if (codePoint > 56319) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            continue;
          } else if (i2 + 1 === length) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            continue;
          }
          leadSurrogate = codePoint;
          continue;
        }
        if (codePoint < 56320) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
          leadSurrogate = codePoint;
          continue;
        }
        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
      } else if (leadSurrogate) {
        if ((units -= 3) > -1) bytes.push(239, 191, 189);
      }
      leadSurrogate = null;
      if (codePoint < 128) {
        if ((units -= 1) < 0) break;
        bytes.push(codePoint);
      } else if (codePoint < 2048) {
        if ((units -= 2) < 0) break;
        bytes.push(
          codePoint >> 6 | 192,
          codePoint & 63 | 128
        );
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0) break;
        bytes.push(
          codePoint >> 12 | 224,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0) break;
        bytes.push(
          codePoint >> 18 | 240,
          codePoint >> 12 & 63 | 128,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes;
  }
  function asciiToBytes(str) {
    var byteArray = [];
    for (var i2 = 0; i2 < str.length; ++i2) {
      byteArray.push(str.charCodeAt(i2) & 255);
    }
    return byteArray;
  }
  function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];
    for (var i2 = 0; i2 < str.length; ++i2) {
      if ((units -= 2) < 0) break;
      c = str.charCodeAt(i2);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }
    return byteArray;
  }
  function base64ToBytes(str) {
    return base642.toByteArray(base64clean(str));
  }
  function blitBuffer(src, dst, offset, length) {
    for (var i2 = 0; i2 < length; ++i2) {
      if (i2 + offset >= dst.length || i2 >= src.length) break;
      dst[i2 + offset] = src[i2];
    }
    return i2;
  }
  function isInstance(obj, type2) {
    return obj instanceof type2 || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type2.name;
  }
  function numberIsNaN(obj) {
    return obj !== obj;
  }
  var hexSliceLookupTable = function() {
    var alphabet = "0123456789abcdef";
    var table = new Array(256);
    for (var i2 = 0; i2 < 16; ++i2) {
      var i16 = i2 * 16;
      for (var j = 0; j < 16; ++j) {
        table[i16 + j] = alphabet[i2] + alphabet[j];
      }
    }
    return table;
  }();
})(buffer);
var bufferReverse = function reverse(src) {
  var buffer2 = new Buffer(src.length);
  for (var i2 = 0, j = src.length - 1; i2 <= j; ++i2, --j) {
    buffer2[i2] = src[j];
    buffer2[j] = src[i2];
  }
  return buffer2;
};
var sha256 = { exports: {} };
function commonjsRequire(path2) {
  throw new Error('Could not dynamically require "' + path2 + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var core = { exports: {} };
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
var hasRequiredCore;
function requireCore() {
  if (hasRequiredCore) return core.exports;
  hasRequiredCore = 1;
  (function(module, exports) {
    (function(root2, factory2) {
      {
        module.exports = factory2();
      }
    })(commonjsGlobal, function() {
      var CryptoJS = CryptoJS || function(Math2, undefined$1) {
        var crypto2;
        if (typeof window !== "undefined" && window.crypto) {
          crypto2 = window.crypto;
        }
        if (typeof self !== "undefined" && self.crypto) {
          crypto2 = self.crypto;
        }
        if (typeof globalThis !== "undefined" && globalThis.crypto) {
          crypto2 = globalThis.crypto;
        }
        if (!crypto2 && typeof window !== "undefined" && window.msCrypto) {
          crypto2 = window.msCrypto;
        }
        if (!crypto2 && typeof commonjsGlobal !== "undefined" && commonjsGlobal.crypto) {
          crypto2 = commonjsGlobal.crypto;
        }
        if (!crypto2 && typeof commonjsRequire === "function") {
          try {
            crypto2 = require$$0;
          } catch (err) {
          }
        }
        var cryptoSecureRandomInt = function() {
          if (crypto2) {
            if (typeof crypto2.getRandomValues === "function") {
              try {
                return crypto2.getRandomValues(new Uint32Array(1))[0];
              } catch (err) {
              }
            }
            if (typeof crypto2.randomBytes === "function") {
              try {
                return crypto2.randomBytes(4).readInt32LE();
              } catch (err) {
              }
            }
          }
          throw new Error("Native crypto module could not be used to get secure random number.");
        };
        var create5 = Object.create || /* @__PURE__ */ function() {
          function F() {
          }
          return function(obj) {
            var subtype;
            F.prototype = obj;
            subtype = new F();
            F.prototype = null;
            return subtype;
          };
        }();
        var C = {};
        var C_lib = C.lib = {};
        var Base2 = C_lib.Base = /* @__PURE__ */ function() {
          return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function(overrides) {
              var subtype = create5(this);
              if (overrides) {
                subtype.mixIn(overrides);
              }
              if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
                subtype.init = function() {
                  subtype.$super.init.apply(this, arguments);
                };
              }
              subtype.init.prototype = subtype;
              subtype.$super = this;
              return subtype;
            },
            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function() {
              var instance = this.extend();
              instance.init.apply(instance, arguments);
              return instance;
            },
            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function() {
            },
            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function(properties) {
              for (var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                  this[propertyName] = properties[propertyName];
                }
              }
              if (properties.hasOwnProperty("toString")) {
                this.toString = properties.toString;
              }
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function() {
              return this.init.prototype.extend(this);
            }
          };
        }();
        var WordArray = C_lib.WordArray = Base2.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of 32-bit words.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.create();
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
           */
          init: function(words, sigBytes) {
            words = this.words = words || [];
            if (sigBytes != undefined$1) {
              this.sigBytes = sigBytes;
            } else {
              this.sigBytes = words.length * 4;
            }
          },
          /**
           * Converts this word array to a string.
           *
           * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
           *
           * @return {string} The stringified word array.
           *
           * @example
           *
           *     var string = wordArray + '';
           *     var string = wordArray.toString();
           *     var string = wordArray.toString(CryptoJS.enc.Utf8);
           */
          toString: function(encoder2) {
            return (encoder2 || Hex).stringify(this);
          },
          /**
           * Concatenates a word array to this word array.
           *
           * @param {WordArray} wordArray The word array to append.
           *
           * @return {WordArray} This word array.
           *
           * @example
           *
           *     wordArray1.concat(wordArray2);
           */
          concat: function(wordArray) {
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;
            this.clamp();
            if (thisSigBytes % 4) {
              for (var i2 = 0; i2 < thatSigBytes; i2++) {
                var thatByte = thatWords[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                thisWords[thisSigBytes + i2 >>> 2] |= thatByte << 24 - (thisSigBytes + i2) % 4 * 8;
              }
            } else {
              for (var j = 0; j < thatSigBytes; j += 4) {
                thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
              }
            }
            this.sigBytes += thatSigBytes;
            return this;
          },
          /**
           * Removes insignificant bits.
           *
           * @example
           *
           *     wordArray.clamp();
           */
          clamp: function() {
            var words = this.words;
            var sigBytes = this.sigBytes;
            words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
            words.length = Math2.ceil(sigBytes / 4);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {WordArray} The clone.
           *
           * @example
           *
           *     var clone = wordArray.clone();
           */
          clone: function() {
            var clone = Base2.clone.call(this);
            clone.words = this.words.slice(0);
            return clone;
          },
          /**
           * Creates a word array filled with random bytes.
           *
           * @param {number} nBytes The number of random bytes to generate.
           *
           * @return {WordArray} The random word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.random(16);
           */
          random: function(nBytes) {
            var words = [];
            for (var i2 = 0; i2 < nBytes; i2 += 4) {
              words.push(cryptoSecureRandomInt());
            }
            return new WordArray.init(words, nBytes);
          }
        });
        var C_enc = C.enc = {};
        var Hex = C_enc.Hex = {
          /**
           * Converts a word array to a hex string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The hex string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var hexChars = [];
            for (var i2 = 0; i2 < sigBytes; i2++) {
              var bite = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
              hexChars.push((bite >>> 4).toString(16));
              hexChars.push((bite & 15).toString(16));
            }
            return hexChars.join("");
          },
          /**
           * Converts a hex string to a word array.
           *
           * @param {string} hexStr The hex string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
           */
          parse: function(hexStr) {
            var hexStrLength = hexStr.length;
            var words = [];
            for (var i2 = 0; i2 < hexStrLength; i2 += 2) {
              words[i2 >>> 3] |= parseInt(hexStr.substr(i2, 2), 16) << 24 - i2 % 8 * 4;
            }
            return new WordArray.init(words, hexStrLength / 2);
          }
        };
        var Latin1 = C_enc.Latin1 = {
          /**
           * Converts a word array to a Latin1 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Latin1 string.
           *
           * @static
           *
           * @example
           *
           *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var latin1Chars = [];
            for (var i2 = 0; i2 < sigBytes; i2++) {
              var bite = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
              latin1Chars.push(String.fromCharCode(bite));
            }
            return latin1Chars.join("");
          },
          /**
           * Converts a Latin1 string to a word array.
           *
           * @param {string} latin1Str The Latin1 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
           */
          parse: function(latin1Str) {
            var latin1StrLength = latin1Str.length;
            var words = [];
            for (var i2 = 0; i2 < latin1StrLength; i2++) {
              words[i2 >>> 2] |= (latin1Str.charCodeAt(i2) & 255) << 24 - i2 % 4 * 8;
            }
            return new WordArray.init(words, latin1StrLength);
          }
        };
        var Utf8 = C_enc.Utf8 = {
          /**
           * Converts a word array to a UTF-8 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-8 string.
           *
           * @static
           *
           * @example
           *
           *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
           */
          stringify: function(wordArray) {
            try {
              return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
              throw new Error("Malformed UTF-8 data");
            }
          },
          /**
           * Converts a UTF-8 string to a word array.
           *
           * @param {string} utf8Str The UTF-8 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
           */
          parse: function(utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
          }
        };
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base2.extend({
          /**
           * Resets this block algorithm's data buffer to its initial state.
           *
           * @example
           *
           *     bufferedBlockAlgorithm.reset();
           */
          reset: function() {
            this._data = new WordArray.init();
            this._nDataBytes = 0;
          },
          /**
           * Adds new data to this block algorithm's buffer.
           *
           * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
           *
           * @example
           *
           *     bufferedBlockAlgorithm._append('data');
           *     bufferedBlockAlgorithm._append(wordArray);
           */
          _append: function(data) {
            if (typeof data == "string") {
              data = Utf8.parse(data);
            }
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
          },
          /**
           * Processes available data blocks.
           *
           * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
           *
           * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
           *
           * @return {WordArray} The processed data.
           *
           * @example
           *
           *     var processedData = bufferedBlockAlgorithm._process();
           *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
           */
          _process: function(doFlush) {
            var processedWords;
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
              nBlocksReady = Math2.ceil(nBlocksReady);
            } else {
              nBlocksReady = Math2.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }
            var nWordsReady = nBlocksReady * blockSize;
            var nBytesReady = Math2.min(nWordsReady * 4, dataSigBytes);
            if (nWordsReady) {
              for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                this._doProcessBlock(dataWords, offset);
              }
              processedWords = dataWords.splice(0, nWordsReady);
              data.sigBytes -= nBytesReady;
            }
            return new WordArray.init(processedWords, nBytesReady);
          },
          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = bufferedBlockAlgorithm.clone();
           */
          clone: function() {
            var clone = Base2.clone.call(this);
            clone._data = this._data.clone();
            return clone;
          },
          _minBufferSize: 0
        });
        C_lib.Hasher = BufferedBlockAlgorithm.extend({
          /**
           * Configuration options.
           */
          cfg: Base2.extend(),
          /**
           * Initializes a newly created hasher.
           *
           * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
           *
           * @example
           *
           *     var hasher = CryptoJS.algo.SHA256.create();
           */
          init: function(cfg) {
            this.cfg = this.cfg.extend(cfg);
            this.reset();
          },
          /**
           * Resets this hasher to its initial state.
           *
           * @example
           *
           *     hasher.reset();
           */
          reset: function() {
            BufferedBlockAlgorithm.reset.call(this);
            this._doReset();
          },
          /**
           * Updates this hasher with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {Hasher} This hasher.
           *
           * @example
           *
           *     hasher.update('message');
           *     hasher.update(wordArray);
           */
          update: function(messageUpdate) {
            this._append(messageUpdate);
            this._process();
            return this;
          },
          /**
           * Finalizes the hash computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The hash.
           *
           * @example
           *
           *     var hash = hasher.finalize();
           *     var hash = hasher.finalize('message');
           *     var hash = hasher.finalize(wordArray);
           */
          finalize: function(messageUpdate) {
            if (messageUpdate) {
              this._append(messageUpdate);
            }
            var hash2 = this._doFinalize();
            return hash2;
          },
          blockSize: 512 / 32,
          /**
           * Creates a shortcut function to a hasher's object interface.
           *
           * @param {Hasher} hasher The hasher to create a helper for.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
           */
          _createHelper: function(hasher) {
            return function(message2, cfg) {
              return new hasher.init(cfg).finalize(message2);
            };
          },
          /**
           * Creates a shortcut function to the HMAC's object interface.
           *
           * @param {Hasher} hasher The hasher to use in this HMAC helper.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
           */
          _createHmacHelper: function(hasher) {
            return function(message2, key) {
              return new C_algo.HMAC.init(hasher, key).finalize(message2);
            };
          }
        });
        var C_algo = C.algo = {};
        return C;
      }(Math);
      return CryptoJS;
    });
  })(core);
  return core.exports;
}
(function(module, exports) {
  (function(root2, factory2) {
    {
      module.exports = factory2(requireCore());
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function(Math2) {
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo;
      var H = [];
      var K = [];
      (function() {
        function isPrime(n2) {
          var sqrtN = Math2.sqrt(n2);
          for (var factor = 2; factor <= sqrtN; factor++) {
            if (!(n2 % factor)) {
              return false;
            }
          }
          return true;
        }
        function getFractionalBits(n2) {
          return (n2 - (n2 | 0)) * 4294967296 | 0;
        }
        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
          if (isPrime(n)) {
            if (nPrime < 8) {
              H[nPrime] = getFractionalBits(Math2.pow(n, 1 / 2));
            }
            K[nPrime] = getFractionalBits(Math2.pow(n, 1 / 3));
            nPrime++;
          }
          n++;
        }
      })();
      var W = [];
      var SHA2562 = C_algo.SHA256 = Hasher.extend({
        _doReset: function() {
          this._hash = new WordArray.init(H.slice(0));
        },
        _doProcessBlock: function(M, offset) {
          var H2 = this._hash.words;
          var a = H2[0];
          var b = H2[1];
          var c = H2[2];
          var d = H2[3];
          var e = H2[4];
          var f = H2[5];
          var g = H2[6];
          var h = H2[7];
          for (var i2 = 0; i2 < 64; i2++) {
            if (i2 < 16) {
              W[i2] = M[offset + i2] | 0;
            } else {
              var gamma0x = W[i2 - 15];
              var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
              var gamma1x = W[i2 - 2];
              var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
              W[i2] = gamma0 + W[i2 - 7] + gamma1 + W[i2 - 16];
            }
            var ch = e & f ^ ~e & g;
            var maj = a & b ^ a & c ^ b & c;
            var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
            var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
            var t1 = h + sigma1 + ch + K[i2] + W[i2];
            var t2 = sigma0 + maj;
            h = g;
            g = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
          }
          H2[0] = H2[0] + a | 0;
          H2[1] = H2[1] + b | 0;
          H2[2] = H2[2] + c | 0;
          H2[3] = H2[3] + d | 0;
          H2[4] = H2[4] + e | 0;
          H2[5] = H2[5] + f | 0;
          H2[6] = H2[6] + g | 0;
          H2[7] = H2[7] + h | 0;
        },
        _doFinalize: function() {
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;
          dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math2.floor(nBitsTotal / 4294967296);
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
          data.sigBytes = dataWords.length * 4;
          this._process();
          return this._hash;
        },
        clone: function() {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();
          return clone;
        }
      });
      C.SHA256 = Hasher._createHelper(SHA2562);
      C.HmacSHA256 = Hasher._createHmacHelper(SHA2562);
    })(Math);
    return CryptoJS.SHA256;
  });
})(sha256);
var sha256Exports = sha256.exports;
var treeify = { exports: {} };
(function(module, exports) {
  (function(root2, factory2) {
    {
      module.exports = factory2();
    }
  })(commonjsGlobal, function() {
    function makePrefix(key, last) {
      var str = last ? "└" : "├";
      if (key) {
        str += "─ ";
      } else {
        str += "──┐";
      }
      return str;
    }
    function filterKeys(obj, hideFunctions) {
      var keys = [];
      for (var branch in obj) {
        if (!obj.hasOwnProperty(branch)) {
          continue;
        }
        if (hideFunctions && typeof obj[branch] === "function") {
          continue;
        }
        keys.push(branch);
      }
      return keys;
    }
    function growBranch(key, root2, last, lastStates, showValues, hideFunctions, callback) {
      var line = "", index = 0, lastKey, circular, lastStatesCopy = lastStates.slice(0);
      if (lastStatesCopy.push([root2, last]) && lastStates.length > 0) {
        lastStates.forEach(function(lastState, idx) {
          if (idx > 0) {
            line += (lastState[1] ? " " : "│") + "  ";
          }
          if (!circular && lastState[0] === root2) {
            circular = true;
          }
        });
        line += makePrefix(key, last) + key;
        showValues && (typeof root2 !== "object" || root2 instanceof Date) && (line += ": " + root2);
        circular && (line += " (circular ref.)");
        callback(line);
      }
      if (!circular && typeof root2 === "object") {
        var keys = filterKeys(root2, hideFunctions);
        keys.forEach(function(branch) {
          lastKey = ++index === keys.length;
          growBranch(branch, root2[branch], lastKey, lastStatesCopy, showValues, hideFunctions, callback);
        });
      }
    }
    var Treeify = {};
    Treeify.asLines = function(obj, showValues, hideFunctions, lineCallback) {
      var hideFunctionsArg = typeof hideFunctions !== "function" ? hideFunctions : false;
      growBranch(".", obj, false, [], showValues, hideFunctionsArg, lineCallback || hideFunctions);
    };
    Treeify.asTree = function(obj, showValues, hideFunctions) {
      var tree = "";
      growBranch(".", obj, false, [], showValues, hideFunctions, function(line) {
        tree += line + "\n";
      });
      return tree;
    };
    return Treeify;
  });
})(treeify);
var treeifyExports = treeify.exports;
var Base$1 = {};
var cryptoJs = { exports: {} };
var x64Core = { exports: {} };
var hasRequiredX64Core;
function requireX64Core() {
  if (hasRequiredX64Core) return x64Core.exports;
  hasRequiredX64Core = 1;
  (function(module, exports) {
    (function(root2, factory2) {
      {
        module.exports = factory2(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function(undefined$1) {
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base2 = C_lib.Base;
        var X32WordArray = C_lib.WordArray;
        var C_x64 = C.x64 = {};
        C_x64.Word = Base2.extend({
          /**
           * Initializes a newly created 64-bit word.
           *
           * @param {number} high The high 32 bits.
           * @param {number} low The low 32 bits.
           *
           * @example
           *
           *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
           */
          init: function(high, low) {
            this.high = high;
            this.low = low;
          }
          /**
           * Bitwise NOTs this word.
           *
           * @return {X64Word} A new x64-Word object after negating.
           *
           * @example
           *
           *     var negated = x64Word.not();
           */
          // not: function () {
          // var high = ~this.high;
          // var low = ~this.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ANDs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to AND with this word.
           *
           * @return {X64Word} A new x64-Word object after ANDing.
           *
           * @example
           *
           *     var anded = x64Word.and(anotherX64Word);
           */
          // and: function (word) {
          // var high = this.high & word.high;
          // var low = this.low & word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to OR with this word.
           *
           * @return {X64Word} A new x64-Word object after ORing.
           *
           * @example
           *
           *     var ored = x64Word.or(anotherX64Word);
           */
          // or: function (word) {
          // var high = this.high | word.high;
          // var low = this.low | word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise XORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to XOR with this word.
           *
           * @return {X64Word} A new x64-Word object after XORing.
           *
           * @example
           *
           *     var xored = x64Word.xor(anotherX64Word);
           */
          // xor: function (word) {
          // var high = this.high ^ word.high;
          // var low = this.low ^ word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the left.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftL(25);
           */
          // shiftL: function (n) {
          // if (n < 32) {
          // var high = (this.high << n) | (this.low >>> (32 - n));
          // var low = this.low << n;
          // } else {
          // var high = this.low << (n - 32);
          // var low = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the right.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftR(7);
           */
          // shiftR: function (n) {
          // if (n < 32) {
          // var low = (this.low >>> n) | (this.high << (32 - n));
          // var high = this.high >>> n;
          // } else {
          // var low = this.high >>> (n - 32);
          // var high = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Rotates this word n bits to the left.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotL(25);
           */
          // rotL: function (n) {
          // return this.shiftL(n).or(this.shiftR(64 - n));
          // },
          /**
           * Rotates this word n bits to the right.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotR(7);
           */
          // rotR: function (n) {
          // return this.shiftR(n).or(this.shiftL(64 - n));
          // },
          /**
           * Adds this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to add with this word.
           *
           * @return {X64Word} A new x64-Word object after adding.
           *
           * @example
           *
           *     var added = x64Word.add(anotherX64Word);
           */
          // add: function (word) {
          // var low = (this.low + word.low) | 0;
          // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
          // var high = (this.high + word.high + carry) | 0;
          // return X64Word.create(high, low);
          // }
        });
        C_x64.WordArray = Base2.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.x64.WordArray.create();
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ]);
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ], 10);
           */
          init: function(words, sigBytes) {
            words = this.words = words || [];
            if (sigBytes != undefined$1) {
              this.sigBytes = sigBytes;
            } else {
              this.sigBytes = words.length * 8;
            }
          },
          /**
           * Converts this 64-bit word array to a 32-bit word array.
           *
           * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
           *
           * @example
           *
           *     var x32WordArray = x64WordArray.toX32();
           */
          toX32: function() {
            var x64Words = this.words;
            var x64WordsLength = x64Words.length;
            var x32Words = [];
            for (var i2 = 0; i2 < x64WordsLength; i2++) {
              var x64Word = x64Words[i2];
              x32Words.push(x64Word.high);
              x32Words.push(x64Word.low);
            }
            return X32WordArray.create(x32Words, this.sigBytes);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {X64WordArray} The clone.
           *
           * @example
           *
           *     var clone = x64WordArray.clone();
           */
          clone: function() {
            var clone = Base2.clone.call(this);
            var words = clone.words = this.words.slice(0);
            var wordsLength = words.length;
            for (var i2 = 0; i2 < wordsLength; i2++) {
              words[i2] = words[i2].clone();
            }
            return clone;
          }
        });
      })();
      return CryptoJS;
    });
  })(x64Core);
  return x64Core.exports;
}
var libTypedarrays = { exports: {} };
var hasRequiredLibTypedarrays;
function requireLibTypedarrays() {
  if (hasRequiredLibTypedarrays) return libTypedarrays.exports;
  hasRequiredLibTypedarrays = 1;
  (function(module, exports) {
    (function(root2, factory2) {
      {
        module.exports = factory2(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        if (typeof ArrayBuffer != "function") {
          return;
        }
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var superInit = WordArray.init;
        var subInit = WordArray.init = function(typedArray) {
          if (typedArray instanceof ArrayBuffer) {
            typedArray = new Uint8Array(typedArray);
          }
          if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
          }
          if (typedArray instanceof Uint8Array) {
            var typedArrayByteLength = typedArray.byteLength;
            var words = [];
            for (var i2 = 0; i2 < typedArrayByteLength; i2++) {
              words[i2 >>> 2] |= typedArray[i2] << 24 - i2 % 4 * 8;
            }
            superInit.call(this, words, typedArrayByteLength);
          } else {
            superInit.apply(this, arguments);
          }
        };
        subInit.prototype = WordArray;
      })();
      return CryptoJS.lib.WordArray;
    });
  })(libTypedarrays);
  return libTypedarrays.exports;
}
var encUtf16 = { exports: {} };
var hasRequiredEncUtf16;
function requireEncUtf16() {
  if (hasRequiredEncUtf16) return encUtf16.exports;
  hasRequiredEncUtf16 = 1;
  (function(module, exports) {
    (function(root2, factory2) {
      {
        module.exports = factory2(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;
        C_enc.Utf16 = C_enc.Utf16BE = {
          /**
           * Converts a word array to a UTF-16 BE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 BE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var utf16Chars = [];
            for (var i2 = 0; i2 < sigBytes; i2 += 2) {
              var codePoint = words[i2 >>> 2] >>> 16 - i2 % 4 * 8 & 65535;
              utf16Chars.push(String.fromCharCode(codePoint));
            }
            return utf16Chars.join("");
          },
          /**
           * Converts a UTF-16 BE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 BE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
           */
          parse: function(utf16Str) {
            var utf16StrLength = utf16Str.length;
            var words = [];
            for (var i2 = 0; i2 < utf16StrLength; i2++) {
              words[i2 >>> 1] |= utf16Str.charCodeAt(i2) << 16 - i2 % 2 * 16;
            }
            return WordArray.create(words, utf16StrLength * 2);
          }
        };
        C_enc.Utf16LE = {
          /**
           * Converts a word array to a UTF-16 LE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 LE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var utf16Chars = [];
            for (var i2 = 0; i2 < sigBytes; i2 += 2) {
              var codePoint = swapEndian(words[i2 >>> 2] >>> 16 - i2 % 4 * 8 & 65535);
              utf16Chars.push(String.fromCharCode(codePoint));
            }
            return utf16Chars.join("");
          },
          /**
           * Converts a UTF-16 LE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 LE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
           */
          parse: function(utf16Str) {
            var utf16StrLength = utf16Str.length;
            var words = [];
            for (var i2 = 0; i2 < utf16StrLength; i2++) {
              words[i2 >>> 1] |= swapEndian(utf16Str.charCodeAt(i2) << 16 - i2 % 2 * 16);
            }
            return WordArray.create(words, utf16StrLength * 2);
          }
        };
        function swapEndian(word) {
          return word << 8 & 4278255360 | word >>> 8 & 16711935;
        }
      })();
      return CryptoJS.enc.Utf16;
    });
  })(encUtf16);
  return encUtf16.exports;
}
var encBase64 = { exports: {} };
var hasRequiredEncBase64;
function requireEncBase64() {
  if (hasRequiredEncBase64) return encBase64.exports;
  hasRequiredEncBase64 = 1;
  (function(module, exports) {
    (function(root2, factory2) {
      {
        module.exports = factory2(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;
        C_enc.Base64 = {
          /**
           * Converts a word array to a Base64 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Base64 string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;
            wordArray.clamp();
            var base64Chars = [];
            for (var i2 = 0; i2 < sigBytes; i2 += 3) {
              var byte1 = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
              var byte2 = words[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255;
              var byte3 = words[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255;
              var triplet = byte1 << 16 | byte2 << 8 | byte3;
              for (var j = 0; j < 4 && i2 + j * 0.75 < sigBytes; j++) {
                base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
              }
            }
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
              }
            }
            return base64Chars.join("");
          },
          /**
           * Converts a Base64 string to a word array.
           *
           * @param {string} base64Str The Base64 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
           */
          parse: function(base64Str) {
            var base64StrLength = base64Str.length;
            var map = this._map;
            var reverseMap = this._reverseMap;
            if (!reverseMap) {
              reverseMap = this._reverseMap = [];
              for (var j = 0; j < map.length; j++) {
                reverseMap[map.charCodeAt(j)] = j;
              }
            }
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              var paddingIndex = base64Str.indexOf(paddingChar);
              if (paddingIndex !== -1) {
                base64StrLength = paddingIndex;
              }
            }
            return parseLoop(base64Str, base64StrLength, reverseMap);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        };
        function parseLoop(base64Str, base64StrLength, reverseMap) {
          var words = [];
          var nBytes = 0;
          for (var i2 = 0; i2 < base64StrLength; i2++) {
            if (i2 % 4) {
              var bits1 = reverseMap[base64Str.charCodeAt(i2 - 1)] << i2 % 4 * 2;
              var bits2 = reverseMap[base64Str.charCodeAt(i2)] >>> 6 - i2 % 4 * 2;
              var bitsCombined = bits1 | bits2;
              words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
              nBytes++;
            }
          }
          return WordArray.create(words, nBytes);
        }
      })();
      return CryptoJS.enc.Base64;
    });
  })(encBase64);
  return encBase64.exports;
}
var encBase64url = { exports: {} };
var hasRequiredEncBase64url;
function requireEncBase64url() {
  if (hasRequiredEncBase64url) return encBase64url.exports;
  hasRequiredEncBase64url = 1;
  (function(module, exports) {
    (function(root2, factory2) {
      {
        module.exports = factory2(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;
        C_enc.Base64url = {
          /**
           * Converts a word array to a Base64url string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {string} The Base64url string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
           */
          stringify: function(wordArray, urlSafe) {
            if (urlSafe === void 0) {
              urlSafe = true;
            }
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = urlSafe ? this._safe_map : this._map;
            wordArray.clamp();
            var base64Chars = [];
            for (var i2 = 0; i2 < sigBytes; i2 += 3) {
              var byte1 = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
              var byte2 = words[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255;
              var byte3 = words[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255;
              var triplet = byte1 << 16 | byte2 << 8 | byte3;
              for (var j = 0; j < 4 && i2 + j * 0.75 < sigBytes; j++) {
                base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
              }
            }
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
              }
            }
            return base64Chars.join("");
          },
          /**
           * Converts a Base64url string to a word array.
           *
           * @param {string} base64Str The Base64url string.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
           */
          parse: function(base64Str, urlSafe) {
            if (urlSafe === void 0) {
              urlSafe = true;
            }
            var base64StrLength = base64Str.length;
            var map = urlSafe ? this._safe_map : this._map;
            var reverseMap = this._reverseMap;
            if (!reverseMap) {
              reverseMap = this._reverseMap = [];
              for (var j = 0; j < map.length; j++) {
                reverseMap[map.charCodeAt(j)] = j;
              }
            }
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              var paddingIndex = base64Str.indexOf(paddingChar);
              if (paddingIndex !== -1) {
                base64StrLength = paddingIndex;
              }
            }
            return parseLoop(base64Str, base64StrLength, reverseMap);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
          _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
        };
        function parseLoop(base64Str, base64StrLength, reverseMap) {
          var words = [];
          var nBytes = 0;
          for (var i2 = 0; i2 < base64StrLength; i2++) {
            if (i2 % 4) {
              var bits1 = reverseMap[base64Str.charCodeAt(i2 - 1)] << i2 % 4 * 2;
              var bits2 = reverseMap[base64Str.charCodeAt(i2)] >>> 6 - i2 % 4 * 2;
              var bitsCombined = bits1 | bits2;
              words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
              nBytes++;
            }
          }
          return WordArray.create(words, nBytes);
        }
      })();
      return CryptoJS.enc.Base64url;
    });
  })(encBase64url);
  return encBase64url.exports;
}
var md5 = { exports: {} };
var hasRequiredMd5;
function requireMd5() {
  if (hasRequiredMd5) return md5.exports;
  hasRequiredMd5 = 1;
  (function(module, exports) {
    (function(root2, factory2) {
      {
        module.exports = factory2(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function(Math2) {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;
        var T = [];
        (function() {
          for (var i2 = 0; i2 < 64; i2++) {
            T[i2] = Math2.abs(Math2.sin(i2 + 1)) * 4294967296 | 0;
          }
        })();
        var MD5 = C_algo.MD5 = Hasher.extend({
          _doReset: function() {
            this._hash = new WordArray.init([
              1732584193,
              4023233417,
              2562383102,
              271733878
            ]);
          },
          _doProcessBlock: function(M, offset) {
            for (var i2 = 0; i2 < 16; i2++) {
              var offset_i = offset + i2;
              var M_offset_i = M[offset_i];
              M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
            }
            var H = this._hash.words;
            var M_offset_0 = M[offset + 0];
            var M_offset_1 = M[offset + 1];
            var M_offset_2 = M[offset + 2];
            var M_offset_3 = M[offset + 3];
            var M_offset_4 = M[offset + 4];
            var M_offset_5 = M[offset + 5];
            var M_offset_6 = M[offset + 6];
            var M_offset_7 = M[offset + 7];
            var M_offset_8 = M[offset + 8];
            var M_offset_9 = M[offset + 9];
            var M_offset_10 = M[offset + 10];
            var M_offset_11 = M[offset + 11];
            var M_offset_12 = M[offset + 12];
            var M_offset_13 = M[offset + 13];
            var M_offset_14 = M[offset + 14];
            var M_offset_15 = M[offset + 15];
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            a = FF(a, b, c, d, M_offset_0, 7, T[0]);
            d = FF(d, a, b, c, M_offset_1, 12, T[1]);
            c = FF(c, d, a, b, M_offset_2, 17, T[2]);
            b = FF(b, c, d, a, M_offset_3, 22, T[3]);
            a = FF(a, b, c, d, M_offset_4, 7, T[4]);
            d = FF(d, a, b, c, M_offset_5, 12, T[5]);
            c = FF(c, d, a, b, M_offset_6, 17, T[6]);
            b = FF(b, c, d, a, M_offset_7, 22, T[7]);
            a = FF(a, b, c, d, M_offset_8, 7, T[8]);
            d = FF(d, a, b, c, M_offset_9, 12, T[9]);
            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
            a = FF(a, b, c, d, M_offset_12, 7, T[12]);
            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
            b = FF(b, c, d, a, M_offset_15, 22, T[15]);
            a = GG(a, b, c, d, M_offset_1, 5, T[16]);
            d = GG(d, a, b, c, M_offset_6, 9, T[17]);
            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
            b = GG(b, c, d, a, M_offset_0, 20, T[19]);
            a = GG(a, b, c, d, M_offset_5, 5, T[20]);
            d = GG(d, a, b, c, M_offset_10, 9, T[21]);
            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
            b = GG(b, c, d, a, M_offset_4, 20, T[23]);
            a = GG(a, b, c, d, M_offset_9, 5, T[24]);
            d = GG(d, a, b, c, M_offset_14, 9, T[25]);
            c = GG(c, d, a, b, M_offset_3, 14, T[26]);
            b = GG(b, c, d, a, M_offset_8, 20, T[27]);
            a = GG(a, b, c, d, M_offset_13, 5, T[28]);
            d = GG(d, a, b, c, M_offset_2, 9, T[29]);
            c = GG(c, d, a, b, M_offset_7, 14, T[30]);
            b = GG(b, c, d, a, M_offset_12, 20, T[31]);
            a = HH(a, b, c, d, M_offset_5, 4, T[32]);
            d = HH(d, a, b, c, M_offset_8, 11, T[33]);
            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
            a = HH(a, b, c, d, M_offset_1, 4, T[36]);
            d = HH(d, a, b, c, M_offset_4, 11, T[37]);
            c = HH(c, d, a, b, M_offset_7, 16, T[38]);
            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
            a = HH(a, b, c, d, M_offset_13, 4, T[40]);
            d = HH(d, a, b, c, M_offset_0, 11, T[41]);
            c = HH(c, d, a, b, M_offset_3, 16, T[42]);
            b = HH(b, c, d, a, M_offset_6, 23, T[43]);
            a = HH(a, b, c, d, M_offset_9, 4, T[44]);
            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
            b = HH(b, c, d, a, M_offset_2, 23, T[47]);
            a = II(a, b, c, d, M_offset_0, 6, T[48]);
            d = II(d, a, b, c, M_offset_7, 10, T[49]);
            c = II(c, d, a, b, M_offset_14, 15, T[50]);
            b = II(b, c, d, a, M_offset_5, 21, T[51]);
            a = II(a, b, c, d, M_offset_12, 6, T[52]);
            d = II(d, a, b, c, M_offset_3, 10, T[53]);
            c = II(c, d, a, b, M_offset_10, 15, T[54]);
            b = II(b, c, d, a, M_offset_1, 21, T[55]);
            a = II(a, b, c, d, M_offset_8, 6, T[56]);
            d = II(d, a, b, c, M_offset_15, 10, T[57]);
            c = II(c, d, a, b, M_offset_6, 15, T[58]);
            b = II(b, c, d, a, M_offset_13, 21, T[59]);
            a = II(a, b, c, d, M_offset_4, 6, T[60]);
            d = II(d, a, b, c, M_offset_11, 10, T[61]);
            c = II(c, d, a, b, M_offset_2, 15, T[62]);
            b = II(b, c, d, a, M_offset_9, 21, T[63]);
            H[0] = H[0] + a | 0;
            H[1] = H[1] + b | 0;
            H[2] = H[2] + c | 0;
            H[3] = H[3] + d | 0;
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
            var nBitsTotalH = Math2.floor(nBitsTotal / 4294967296);
            var nBitsTotalL = nBitsTotal;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
            data.sigBytes = (dataWords.length + 1) * 4;
            this._process();
            var hash2 = this._hash;
            var H = hash2.words;
            for (var i2 = 0; i2 < 4; i2++) {
              var H_i = H[i2];
              H[i2] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
            }
            return hash2;
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });
        function FF(a, b, c, d, x, s, t) {
          var n = a + (b & c | ~b & d) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }
        function GG(a, b, c, d, x, s, t) {
          var n = a + (b & d | c & ~d) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }
        function HH(a, b, c, d, x, s, t) {
          var n = a + (b ^ c ^ d) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }
        function II(a, b, c, d, x, s, t) {
          var n = a + (c ^ (b | ~d)) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }
        C.MD5 = Hasher._createHelper(MD5);
        C.HmacMD5 = Hasher._createHmacHelper(MD5);
      })(Math);
      return CryptoJS.MD5;
    });
  })(md5);
  return md5.exports;
}
var sha1 = { exports: {} };
var hasRequiredSha1;
function requireSha1() {
  if (hasRequiredSha1) return sha1.exports;
  hasRequiredSha1 = 1;
  (function(module, exports) {
    (function(root2, factory2) {
      {
        module.exports = factory2(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;
        var W = [];
        var SHA1 = C_algo.SHA1 = Hasher.extend({
          _doReset: function() {
            this._hash = new WordArray.init([
              1732584193,
              4023233417,
              2562383102,
              271733878,
              3285377520
            ]);
          },
          _doProcessBlock: function(M, offset) {
            var H = this._hash.words;
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            for (var i2 = 0; i2 < 80; i2++) {
              if (i2 < 16) {
                W[i2] = M[offset + i2] | 0;
              } else {
                var n = W[i2 - 3] ^ W[i2 - 8] ^ W[i2 - 14] ^ W[i2 - 16];
                W[i2] = n << 1 | n >>> 31;
              }
              var t = (a << 5 | a >>> 27) + e + W[i2];
              if (i2 < 20) {
                t += (b & c | ~b & d) + 1518500249;
              } else if (i2 < 40) {
                t += (b ^ c ^ d) + 1859775393;
              } else if (i2 < 60) {
                t += (b & c | b & d | c & d) - 1894007588;
              } else {
                t += (b ^ c ^ d) - 899497514;
              }
              e = d;
              d = c;
              c = b << 30 | b >>> 2;
              b = a;
              a = t;
            }
            H[0] = H[0] + a | 0;
            H[1] = H[1] + b | 0;
            H[2] = H[2] + c | 0;
            H[3] = H[3] + d | 0;
            H[4] = H[4] + e | 0;
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;
            this._process();
            return this._hash;
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });
        C.SHA1 = Hasher._createHelper(SHA1);
        C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
      })();
      return CryptoJS.SHA1;
    });
  })(sha1);
  return sha1.exports;
}
var sha224 = { exports: {} };
var hasRequiredSha224;
function requireSha224() {
  if (hasRequiredSha224) return sha224.exports;
  hasRequiredSha224 = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), sha256Exports);
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var SHA2562 = C_algo.SHA256;
        var SHA224 = C_algo.SHA224 = SHA2562.extend({
          _doReset: function() {
            this._hash = new WordArray.init([
              3238371032,
              914150663,
              812702999,
              4144912697,
              4290775857,
              1750603025,
              1694076839,
              3204075428
            ]);
          },
          _doFinalize: function() {
            var hash2 = SHA2562._doFinalize.call(this);
            hash2.sigBytes -= 4;
            return hash2;
          }
        });
        C.SHA224 = SHA2562._createHelper(SHA224);
        C.HmacSHA224 = SHA2562._createHmacHelper(SHA224);
      })();
      return CryptoJS.SHA224;
    });
  })(sha224);
  return sha224.exports;
}
var sha512 = { exports: {} };
var hasRequiredSha512;
function requireSha512() {
  if (hasRequiredSha512) return sha512.exports;
  hasRequiredSha512 = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireX64Core());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var Hasher = C_lib.Hasher;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var X64WordArray = C_x64.WordArray;
        var C_algo = C.algo;
        function X64Word_create() {
          return X64Word.create.apply(X64Word, arguments);
        }
        var K = [
          X64Word_create(1116352408, 3609767458),
          X64Word_create(1899447441, 602891725),
          X64Word_create(3049323471, 3964484399),
          X64Word_create(3921009573, 2173295548),
          X64Word_create(961987163, 4081628472),
          X64Word_create(1508970993, 3053834265),
          X64Word_create(2453635748, 2937671579),
          X64Word_create(2870763221, 3664609560),
          X64Word_create(3624381080, 2734883394),
          X64Word_create(310598401, 1164996542),
          X64Word_create(607225278, 1323610764),
          X64Word_create(1426881987, 3590304994),
          X64Word_create(1925078388, 4068182383),
          X64Word_create(2162078206, 991336113),
          X64Word_create(2614888103, 633803317),
          X64Word_create(3248222580, 3479774868),
          X64Word_create(3835390401, 2666613458),
          X64Word_create(4022224774, 944711139),
          X64Word_create(264347078, 2341262773),
          X64Word_create(604807628, 2007800933),
          X64Word_create(770255983, 1495990901),
          X64Word_create(1249150122, 1856431235),
          X64Word_create(1555081692, 3175218132),
          X64Word_create(1996064986, 2198950837),
          X64Word_create(2554220882, 3999719339),
          X64Word_create(2821834349, 766784016),
          X64Word_create(2952996808, 2566594879),
          X64Word_create(3210313671, 3203337956),
          X64Word_create(3336571891, 1034457026),
          X64Word_create(3584528711, 2466948901),
          X64Word_create(113926993, 3758326383),
          X64Word_create(338241895, 168717936),
          X64Word_create(666307205, 1188179964),
          X64Word_create(773529912, 1546045734),
          X64Word_create(1294757372, 1522805485),
          X64Word_create(1396182291, 2643833823),
          X64Word_create(1695183700, 2343527390),
          X64Word_create(1986661051, 1014477480),
          X64Word_create(2177026350, 1206759142),
          X64Word_create(2456956037, 344077627),
          X64Word_create(2730485921, 1290863460),
          X64Word_create(2820302411, 3158454273),
          X64Word_create(3259730800, 3505952657),
          X64Word_create(3345764771, 106217008),
          X64Word_create(3516065817, 3606008344),
          X64Word_create(3600352804, 1432725776),
          X64Word_create(4094571909, 1467031594),
          X64Word_create(275423344, 851169720),
          X64Word_create(430227734, 3100823752),
          X64Word_create(506948616, 1363258195),
          X64Word_create(659060556, 3750685593),
          X64Word_create(883997877, 3785050280),
          X64Word_create(958139571, 3318307427),
          X64Word_create(1322822218, 3812723403),
          X64Word_create(1537002063, 2003034995),
          X64Word_create(1747873779, 3602036899),
          X64Word_create(1955562222, 1575990012),
          X64Word_create(2024104815, 1125592928),
          X64Word_create(2227730452, 2716904306),
          X64Word_create(2361852424, 442776044),
          X64Word_create(2428436474, 593698344),
          X64Word_create(2756734187, 3733110249),
          X64Word_create(3204031479, 2999351573),
          X64Word_create(3329325298, 3815920427),
          X64Word_create(3391569614, 3928383900),
          X64Word_create(3515267271, 566280711),
          X64Word_create(3940187606, 3454069534),
          X64Word_create(4118630271, 4000239992),
          X64Word_create(116418474, 1914138554),
          X64Word_create(174292421, 2731055270),
          X64Word_create(289380356, 3203993006),
          X64Word_create(460393269, 320620315),
          X64Word_create(685471733, 587496836),
          X64Word_create(852142971, 1086792851),
          X64Word_create(1017036298, 365543100),
          X64Word_create(1126000580, 2618297676),
          X64Word_create(1288033470, 3409855158),
          X64Word_create(1501505948, 4234509866),
          X64Word_create(1607167915, 987167468),
          X64Word_create(1816402316, 1246189591)
        ];
        var W = [];
        (function() {
          for (var i2 = 0; i2 < 80; i2++) {
            W[i2] = X64Word_create();
          }
        })();
        var SHA512 = C_algo.SHA512 = Hasher.extend({
          _doReset: function() {
            this._hash = new X64WordArray.init([
              new X64Word.init(1779033703, 4089235720),
              new X64Word.init(3144134277, 2227873595),
              new X64Word.init(1013904242, 4271175723),
              new X64Word.init(2773480762, 1595750129),
              new X64Word.init(1359893119, 2917565137),
              new X64Word.init(2600822924, 725511199),
              new X64Word.init(528734635, 4215389547),
              new X64Word.init(1541459225, 327033209)
            ]);
          },
          _doProcessBlock: function(M, offset) {
            var H = this._hash.words;
            var H0 = H[0];
            var H1 = H[1];
            var H2 = H[2];
            var H3 = H[3];
            var H4 = H[4];
            var H5 = H[5];
            var H6 = H[6];
            var H7 = H[7];
            var H0h = H0.high;
            var H0l = H0.low;
            var H1h = H1.high;
            var H1l = H1.low;
            var H2h = H2.high;
            var H2l = H2.low;
            var H3h = H3.high;
            var H3l = H3.low;
            var H4h = H4.high;
            var H4l = H4.low;
            var H5h = H5.high;
            var H5l = H5.low;
            var H6h = H6.high;
            var H6l = H6.low;
            var H7h = H7.high;
            var H7l = H7.low;
            var ah = H0h;
            var al = H0l;
            var bh = H1h;
            var bl = H1l;
            var ch = H2h;
            var cl = H2l;
            var dh = H3h;
            var dl = H3l;
            var eh = H4h;
            var el = H4l;
            var fh = H5h;
            var fl = H5l;
            var gh = H6h;
            var gl = H6l;
            var hh = H7h;
            var hl = H7l;
            for (var i2 = 0; i2 < 80; i2++) {
              var Wil;
              var Wih;
              var Wi = W[i2];
              if (i2 < 16) {
                Wih = Wi.high = M[offset + i2 * 2] | 0;
                Wil = Wi.low = M[offset + i2 * 2 + 1] | 0;
              } else {
                var gamma0x = W[i2 - 15];
                var gamma0xh = gamma0x.high;
                var gamma0xl = gamma0x.low;
                var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
                var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);
                var gamma1x = W[i2 - 2];
                var gamma1xh = gamma1x.high;
                var gamma1xl = gamma1x.low;
                var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
                var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);
                var Wi7 = W[i2 - 7];
                var Wi7h = Wi7.high;
                var Wi7l = Wi7.low;
                var Wi16 = W[i2 - 16];
                var Wi16h = Wi16.high;
                var Wi16l = Wi16.low;
                Wil = gamma0l + Wi7l;
                Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                Wil = Wil + gamma1l;
                Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                Wil = Wil + Wi16l;
                Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
                Wi.high = Wih;
                Wi.low = Wil;
              }
              var chh = eh & fh ^ ~eh & gh;
              var chl = el & fl ^ ~el & gl;
              var majh = ah & bh ^ ah & ch ^ bh & ch;
              var majl = al & bl ^ al & cl ^ bl & cl;
              var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
              var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
              var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
              var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);
              var Ki = K[i2];
              var Kih = Ki.high;
              var Kil = Ki.low;
              var t1l = hl + sigma1l;
              var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
              var t1l = t1l + chl;
              var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
              var t1l = t1l + Kil;
              var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
              var t1l = t1l + Wil;
              var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);
              var t2l = sigma0l + majl;
              var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);
              hh = gh;
              hl = gl;
              gh = fh;
              gl = fl;
              fh = eh;
              fl = el;
              el = dl + t1l | 0;
              eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
              dh = ch;
              dl = cl;
              ch = bh;
              cl = bl;
              bh = ah;
              bl = al;
              al = t1l + t2l | 0;
              ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
            }
            H0l = H0.low = H0l + al;
            H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
            H1l = H1.low = H1l + bl;
            H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
            H2l = H2.low = H2l + cl;
            H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
            H3l = H3.low = H3l + dl;
            H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
            H4l = H4.low = H4l + el;
            H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
            H5l = H5.low = H5l + fl;
            H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
            H6l = H6.low = H6l + gl;
            H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
            H7l = H7.low = H7l + hl;
            H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 4294967296);
            dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;
            this._process();
            var hash2 = this._hash.toX32();
            return hash2;
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          },
          blockSize: 1024 / 32
        });
        C.SHA512 = Hasher._createHelper(SHA512);
        C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
      })();
      return CryptoJS.SHA512;
    });
  })(sha512);
  return sha512.exports;
}
var sha384 = { exports: {} };
var hasRequiredSha384;
function requireSha384() {
  if (hasRequiredSha384) return sha384.exports;
  hasRequiredSha384 = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireX64Core(), requireSha512());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var X64WordArray = C_x64.WordArray;
        var C_algo = C.algo;
        var SHA512 = C_algo.SHA512;
        var SHA384 = C_algo.SHA384 = SHA512.extend({
          _doReset: function() {
            this._hash = new X64WordArray.init([
              new X64Word.init(3418070365, 3238371032),
              new X64Word.init(1654270250, 914150663),
              new X64Word.init(2438529370, 812702999),
              new X64Word.init(355462360, 4144912697),
              new X64Word.init(1731405415, 4290775857),
              new X64Word.init(2394180231, 1750603025),
              new X64Word.init(3675008525, 1694076839),
              new X64Word.init(1203062813, 3204075428)
            ]);
          },
          _doFinalize: function() {
            var hash2 = SHA512._doFinalize.call(this);
            hash2.sigBytes -= 16;
            return hash2;
          }
        });
        C.SHA384 = SHA512._createHelper(SHA384);
        C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
      })();
      return CryptoJS.SHA384;
    });
  })(sha384);
  return sha384.exports;
}
var sha3 = { exports: {} };
var hasRequiredSha3;
function requireSha3() {
  if (hasRequiredSha3) return sha3.exports;
  hasRequiredSha3 = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireX64Core());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function(Math2) {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var C_algo = C.algo;
        var RHO_OFFSETS = [];
        var PI_INDEXES = [];
        var ROUND_CONSTANTS = [];
        (function() {
          var x = 1, y = 0;
          for (var t = 0; t < 24; t++) {
            RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;
            var newX = y % 5;
            var newY = (2 * x + 3 * y) % 5;
            x = newX;
            y = newY;
          }
          for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 5; y++) {
              PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
            }
          }
          var LFSR = 1;
          for (var i2 = 0; i2 < 24; i2++) {
            var roundConstantMsw = 0;
            var roundConstantLsw = 0;
            for (var j = 0; j < 7; j++) {
              if (LFSR & 1) {
                var bitPosition = (1 << j) - 1;
                if (bitPosition < 32) {
                  roundConstantLsw ^= 1 << bitPosition;
                } else {
                  roundConstantMsw ^= 1 << bitPosition - 32;
                }
              }
              if (LFSR & 128) {
                LFSR = LFSR << 1 ^ 113;
              } else {
                LFSR <<= 1;
              }
            }
            ROUND_CONSTANTS[i2] = X64Word.create(roundConstantMsw, roundConstantLsw);
          }
        })();
        var T = [];
        (function() {
          for (var i2 = 0; i2 < 25; i2++) {
            T[i2] = X64Word.create();
          }
        })();
        var SHA3 = C_algo.SHA3 = Hasher.extend({
          /**
           * Configuration options.
           *
           * @property {number} outputLength
           *   The desired number of bits in the output hash.
           *   Only values permitted are: 224, 256, 384, 512.
           *   Default: 512
           */
          cfg: Hasher.cfg.extend({
            outputLength: 512
          }),
          _doReset: function() {
            var state = this._state = [];
            for (var i2 = 0; i2 < 25; i2++) {
              state[i2] = new X64Word.init();
            }
            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
          },
          _doProcessBlock: function(M, offset) {
            var state = this._state;
            var nBlockSizeLanes = this.blockSize / 2;
            for (var i2 = 0; i2 < nBlockSizeLanes; i2++) {
              var M2i = M[offset + 2 * i2];
              var M2i1 = M[offset + 2 * i2 + 1];
              M2i = (M2i << 8 | M2i >>> 24) & 16711935 | (M2i << 24 | M2i >>> 8) & 4278255360;
              M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 16711935 | (M2i1 << 24 | M2i1 >>> 8) & 4278255360;
              var lane = state[i2];
              lane.high ^= M2i1;
              lane.low ^= M2i;
            }
            for (var round = 0; round < 24; round++) {
              for (var x = 0; x < 5; x++) {
                var tMsw = 0, tLsw = 0;
                for (var y = 0; y < 5; y++) {
                  var lane = state[x + 5 * y];
                  tMsw ^= lane.high;
                  tLsw ^= lane.low;
                }
                var Tx = T[x];
                Tx.high = tMsw;
                Tx.low = tLsw;
              }
              for (var x = 0; x < 5; x++) {
                var Tx4 = T[(x + 4) % 5];
                var Tx1 = T[(x + 1) % 5];
                var Tx1Msw = Tx1.high;
                var Tx1Lsw = Tx1.low;
                var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
                var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
                for (var y = 0; y < 5; y++) {
                  var lane = state[x + 5 * y];
                  lane.high ^= tMsw;
                  lane.low ^= tLsw;
                }
              }
              for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                var tMsw;
                var tLsw;
                var lane = state[laneIndex];
                var laneMsw = lane.high;
                var laneLsw = lane.low;
                var rhoOffset = RHO_OFFSETS[laneIndex];
                if (rhoOffset < 32) {
                  tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
                  tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
                } else {
                  tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
                  tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
                }
                var TPiLane = T[PI_INDEXES[laneIndex]];
                TPiLane.high = tMsw;
                TPiLane.low = tLsw;
              }
              var T0 = T[0];
              var state0 = state[0];
              T0.high = state0.high;
              T0.low = state0.low;
              for (var x = 0; x < 5; x++) {
                for (var y = 0; y < 5; y++) {
                  var laneIndex = x + 5 * y;
                  var lane = state[laneIndex];
                  var TLane = T[laneIndex];
                  var Tx1Lane = T[(x + 1) % 5 + 5 * y];
                  var Tx2Lane = T[(x + 2) % 5 + 5 * y];
                  lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
                  lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
                }
              }
              var lane = state[0];
              var roundConstant = ROUND_CONSTANTS[round];
              lane.high ^= roundConstant.high;
              lane.low ^= roundConstant.low;
            }
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            var blockSizeBits = this.blockSize * 32;
            dataWords[nBitsLeft >>> 5] |= 1 << 24 - nBitsLeft % 32;
            dataWords[(Math2.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 128;
            data.sigBytes = dataWords.length * 4;
            this._process();
            var state = this._state;
            var outputLengthBytes = this.cfg.outputLength / 8;
            var outputLengthLanes = outputLengthBytes / 8;
            var hashWords = [];
            for (var i2 = 0; i2 < outputLengthLanes; i2++) {
              var lane = state[i2];
              var laneMsw = lane.high;
              var laneLsw = lane.low;
              laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 16711935 | (laneMsw << 24 | laneMsw >>> 8) & 4278255360;
              laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 16711935 | (laneLsw << 24 | laneLsw >>> 8) & 4278255360;
              hashWords.push(laneLsw);
              hashWords.push(laneMsw);
            }
            return new WordArray.init(hashWords, outputLengthBytes);
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            var state = clone._state = this._state.slice(0);
            for (var i2 = 0; i2 < 25; i2++) {
              state[i2] = state[i2].clone();
            }
            return clone;
          }
        });
        C.SHA3 = Hasher._createHelper(SHA3);
        C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
      })(Math);
      return CryptoJS.SHA3;
    });
  })(sha3);
  return sha3.exports;
}
var ripemd160 = { exports: {} };
var hasRequiredRipemd160;
function requireRipemd160() {
  if (hasRequiredRipemd160) return ripemd160.exports;
  hasRequiredRipemd160 = 1;
  (function(module, exports) {
    (function(root2, factory2) {
      {
        module.exports = factory2(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      /** @preserve
      			(c) 2012 by Cédric Mesnil. All rights reserved.
      
      			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
      
      			    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
      			    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
      
      			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      			*/
      (function(Math2) {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;
        var _zl = WordArray.create([
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          7,
          4,
          13,
          1,
          10,
          6,
          15,
          3,
          12,
          0,
          9,
          5,
          2,
          14,
          11,
          8,
          3,
          10,
          14,
          4,
          9,
          15,
          8,
          1,
          2,
          7,
          0,
          6,
          13,
          11,
          5,
          12,
          1,
          9,
          11,
          10,
          0,
          8,
          12,
          4,
          13,
          3,
          7,
          15,
          14,
          5,
          6,
          2,
          4,
          0,
          5,
          9,
          7,
          12,
          2,
          10,
          14,
          1,
          3,
          8,
          11,
          6,
          15,
          13
        ]);
        var _zr = WordArray.create([
          5,
          14,
          7,
          0,
          9,
          2,
          11,
          4,
          13,
          6,
          15,
          8,
          1,
          10,
          3,
          12,
          6,
          11,
          3,
          7,
          0,
          13,
          5,
          10,
          14,
          15,
          8,
          12,
          4,
          9,
          1,
          2,
          15,
          5,
          1,
          3,
          7,
          14,
          6,
          9,
          11,
          8,
          12,
          2,
          10,
          0,
          4,
          13,
          8,
          6,
          4,
          1,
          3,
          11,
          15,
          0,
          5,
          12,
          2,
          13,
          9,
          7,
          10,
          14,
          12,
          15,
          10,
          4,
          1,
          5,
          8,
          7,
          6,
          2,
          13,
          14,
          0,
          3,
          9,
          11
        ]);
        var _sl = WordArray.create([
          11,
          14,
          15,
          12,
          5,
          8,
          7,
          9,
          11,
          13,
          14,
          15,
          6,
          7,
          9,
          8,
          7,
          6,
          8,
          13,
          11,
          9,
          7,
          15,
          7,
          12,
          15,
          9,
          11,
          7,
          13,
          12,
          11,
          13,
          6,
          7,
          14,
          9,
          13,
          15,
          14,
          8,
          13,
          6,
          5,
          12,
          7,
          5,
          11,
          12,
          14,
          15,
          14,
          15,
          9,
          8,
          9,
          14,
          5,
          6,
          8,
          6,
          5,
          12,
          9,
          15,
          5,
          11,
          6,
          8,
          13,
          12,
          5,
          12,
          13,
          14,
          11,
          8,
          5,
          6
        ]);
        var _sr = WordArray.create([
          8,
          9,
          9,
          11,
          13,
          15,
          15,
          5,
          7,
          7,
          8,
          11,
          14,
          14,
          12,
          6,
          9,
          13,
          15,
          7,
          12,
          8,
          9,
          11,
          7,
          7,
          12,
          7,
          6,
          15,
          13,
          11,
          9,
          7,
          15,
          11,
          8,
          6,
          6,
          14,
          12,
          13,
          5,
          14,
          13,
          13,
          7,
          5,
          15,
          5,
          8,
          11,
          14,
          14,
          6,
          14,
          6,
          9,
          12,
          9,
          12,
          5,
          15,
          8,
          8,
          5,
          12,
          9,
          12,
          5,
          14,
          6,
          8,
          13,
          6,
          5,
          15,
          13,
          11,
          11
        ]);
        var _hl = WordArray.create([0, 1518500249, 1859775393, 2400959708, 2840853838]);
        var _hr = WordArray.create([1352829926, 1548603684, 1836072691, 2053994217, 0]);
        var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
          _doReset: function() {
            this._hash = WordArray.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
          },
          _doProcessBlock: function(M, offset) {
            for (var i2 = 0; i2 < 16; i2++) {
              var offset_i = offset + i2;
              var M_offset_i = M[offset_i];
              M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
            }
            var H = this._hash.words;
            var hl = _hl.words;
            var hr = _hr.words;
            var zl = _zl.words;
            var zr = _zr.words;
            var sl = _sl.words;
            var sr = _sr.words;
            var al, bl, cl, dl, el;
            var ar, br, cr, dr, er;
            ar = al = H[0];
            br = bl = H[1];
            cr = cl = H[2];
            dr = dl = H[3];
            er = el = H[4];
            var t;
            for (var i2 = 0; i2 < 80; i2 += 1) {
              t = al + M[offset + zl[i2]] | 0;
              if (i2 < 16) {
                t += f1(bl, cl, dl) + hl[0];
              } else if (i2 < 32) {
                t += f2(bl, cl, dl) + hl[1];
              } else if (i2 < 48) {
                t += f3(bl, cl, dl) + hl[2];
              } else if (i2 < 64) {
                t += f4(bl, cl, dl) + hl[3];
              } else {
                t += f5(bl, cl, dl) + hl[4];
              }
              t = t | 0;
              t = rotl(t, sl[i2]);
              t = t + el | 0;
              al = el;
              el = dl;
              dl = rotl(cl, 10);
              cl = bl;
              bl = t;
              t = ar + M[offset + zr[i2]] | 0;
              if (i2 < 16) {
                t += f5(br, cr, dr) + hr[0];
              } else if (i2 < 32) {
                t += f4(br, cr, dr) + hr[1];
              } else if (i2 < 48) {
                t += f3(br, cr, dr) + hr[2];
              } else if (i2 < 64) {
                t += f2(br, cr, dr) + hr[3];
              } else {
                t += f1(br, cr, dr) + hr[4];
              }
              t = t | 0;
              t = rotl(t, sr[i2]);
              t = t + er | 0;
              ar = er;
              er = dr;
              dr = rotl(cr, 10);
              cr = br;
              br = t;
            }
            t = H[1] + cl + dr | 0;
            H[1] = H[2] + dl + er | 0;
            H[2] = H[3] + el + ar | 0;
            H[3] = H[4] + al + br | 0;
            H[4] = H[0] + bl + cr | 0;
            H[0] = t;
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
            data.sigBytes = (dataWords.length + 1) * 4;
            this._process();
            var hash2 = this._hash;
            var H = hash2.words;
            for (var i2 = 0; i2 < 5; i2++) {
              var H_i = H[i2];
              H[i2] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
            }
            return hash2;
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });
        function f1(x, y, z) {
          return x ^ y ^ z;
        }
        function f2(x, y, z) {
          return x & y | ~x & z;
        }
        function f3(x, y, z) {
          return (x | ~y) ^ z;
        }
        function f4(x, y, z) {
          return x & z | y & ~z;
        }
        function f5(x, y, z) {
          return x ^ (y | ~z);
        }
        function rotl(x, n) {
          return x << n | x >>> 32 - n;
        }
        C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
        C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
      })();
      return CryptoJS.RIPEMD160;
    });
  })(ripemd160);
  return ripemd160.exports;
}
var hmac = { exports: {} };
var hasRequiredHmac;
function requireHmac() {
  if (hasRequiredHmac) return hmac.exports;
  hasRequiredHmac = 1;
  (function(module, exports) {
    (function(root2, factory2) {
      {
        module.exports = factory2(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base2 = C_lib.Base;
        var C_enc = C.enc;
        var Utf8 = C_enc.Utf8;
        var C_algo = C.algo;
        C_algo.HMAC = Base2.extend({
          /**
           * Initializes a newly created HMAC.
           *
           * @param {Hasher} hasher The hash algorithm to use.
           * @param {WordArray|string} key The secret key.
           *
           * @example
           *
           *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
           */
          init: function(hasher, key) {
            hasher = this._hasher = new hasher.init();
            if (typeof key == "string") {
              key = Utf8.parse(key);
            }
            var hasherBlockSize = hasher.blockSize;
            var hasherBlockSizeBytes = hasherBlockSize * 4;
            if (key.sigBytes > hasherBlockSizeBytes) {
              key = hasher.finalize(key);
            }
            key.clamp();
            var oKey = this._oKey = key.clone();
            var iKey = this._iKey = key.clone();
            var oKeyWords = oKey.words;
            var iKeyWords = iKey.words;
            for (var i2 = 0; i2 < hasherBlockSize; i2++) {
              oKeyWords[i2] ^= 1549556828;
              iKeyWords[i2] ^= 909522486;
            }
            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
            this.reset();
          },
          /**
           * Resets this HMAC to its initial state.
           *
           * @example
           *
           *     hmacHasher.reset();
           */
          reset: function() {
            var hasher = this._hasher;
            hasher.reset();
            hasher.update(this._iKey);
          },
          /**
           * Updates this HMAC with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {HMAC} This HMAC instance.
           *
           * @example
           *
           *     hmacHasher.update('message');
           *     hmacHasher.update(wordArray);
           */
          update: function(messageUpdate) {
            this._hasher.update(messageUpdate);
            return this;
          },
          /**
           * Finalizes the HMAC computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The HMAC.
           *
           * @example
           *
           *     var hmac = hmacHasher.finalize();
           *     var hmac = hmacHasher.finalize('message');
           *     var hmac = hmacHasher.finalize(wordArray);
           */
          finalize: function(messageUpdate) {
            var hasher = this._hasher;
            var innerHash = hasher.finalize(messageUpdate);
            hasher.reset();
            var hmac2 = hasher.finalize(this._oKey.clone().concat(innerHash));
            return hmac2;
          }
        });
      })();
    });
  })(hmac);
  return hmac.exports;
}
var pbkdf2 = { exports: {} };
var hasRequiredPbkdf2;
function requirePbkdf2() {
  if (hasRequiredPbkdf2) return pbkdf2.exports;
  hasRequiredPbkdf2 = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), sha256Exports, requireHmac());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base2 = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var SHA2562 = C_algo.SHA256;
        var HMAC = C_algo.HMAC;
        var PBKDF2 = C_algo.PBKDF2 = Base2.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hasher to use. Default: SHA256
           * @property {number} iterations The number of iterations to perform. Default: 250000
           */
          cfg: Base2.extend({
            keySize: 128 / 32,
            hasher: SHA2562,
            iterations: 25e4
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.PBKDF2.create();
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
           */
          init: function(cfg) {
            this.cfg = this.cfg.extend(cfg);
          },
          /**
           * Computes the Password-Based Key Derivation Function 2.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(password, salt) {
            var cfg = this.cfg;
            var hmac2 = HMAC.create(cfg.hasher, password);
            var derivedKey = WordArray.create();
            var blockIndex = WordArray.create([1]);
            var derivedKeyWords = derivedKey.words;
            var blockIndexWords = blockIndex.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;
            while (derivedKeyWords.length < keySize) {
              var block = hmac2.update(salt).finalize(blockIndex);
              hmac2.reset();
              var blockWords = block.words;
              var blockWordsLength = blockWords.length;
              var intermediate = block;
              for (var i2 = 1; i2 < iterations; i2++) {
                intermediate = hmac2.finalize(intermediate);
                hmac2.reset();
                var intermediateWords = intermediate.words;
                for (var j = 0; j < blockWordsLength; j++) {
                  blockWords[j] ^= intermediateWords[j];
                }
              }
              derivedKey.concat(block);
              blockIndexWords[0]++;
            }
            derivedKey.sigBytes = keySize * 4;
            return derivedKey;
          }
        });
        C.PBKDF2 = function(password, salt, cfg) {
          return PBKDF2.create(cfg).compute(password, salt);
        };
      })();
      return CryptoJS.PBKDF2;
    });
  })(pbkdf2);
  return pbkdf2.exports;
}
var evpkdf = { exports: {} };
var hasRequiredEvpkdf;
function requireEvpkdf() {
  if (hasRequiredEvpkdf) return evpkdf.exports;
  hasRequiredEvpkdf = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireSha1(), requireHmac());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base2 = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var MD5 = C_algo.MD5;
        var EvpKDF = C_algo.EvpKDF = Base2.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hash algorithm to use. Default: MD5
           * @property {number} iterations The number of iterations to perform. Default: 1
           */
          cfg: Base2.extend({
            keySize: 128 / 32,
            hasher: MD5,
            iterations: 1
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.EvpKDF.create();
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
           */
          init: function(cfg) {
            this.cfg = this.cfg.extend(cfg);
          },
          /**
           * Derives a key from a password.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(password, salt) {
            var block;
            var cfg = this.cfg;
            var hasher = cfg.hasher.create();
            var derivedKey = WordArray.create();
            var derivedKeyWords = derivedKey.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;
            while (derivedKeyWords.length < keySize) {
              if (block) {
                hasher.update(block);
              }
              block = hasher.update(password).finalize(salt);
              hasher.reset();
              for (var i2 = 1; i2 < iterations; i2++) {
                block = hasher.finalize(block);
                hasher.reset();
              }
              derivedKey.concat(block);
            }
            derivedKey.sigBytes = keySize * 4;
            return derivedKey;
          }
        });
        C.EvpKDF = function(password, salt, cfg) {
          return EvpKDF.create(cfg).compute(password, salt);
        };
      })();
      return CryptoJS.EvpKDF;
    });
  })(evpkdf);
  return evpkdf.exports;
}
var cipherCore = { exports: {} };
var hasRequiredCipherCore;
function requireCipherCore() {
  if (hasRequiredCipherCore) return cipherCore.exports;
  hasRequiredCipherCore = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireEvpkdf());
      }
    })(commonjsGlobal, function(CryptoJS) {
      CryptoJS.lib.Cipher || function(undefined$1) {
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base2 = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
        var C_enc = C.enc;
        C_enc.Utf8;
        var Base64 = C_enc.Base64;
        var C_algo = C.algo;
        var EvpKDF = C_algo.EvpKDF;
        var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
          /**
           * Configuration options.
           *
           * @property {WordArray} iv The IV to use for this operation.
           */
          cfg: Base2.extend(),
          /**
           * Creates this cipher in encryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
           */
          createEncryptor: function(key, cfg) {
            return this.create(this._ENC_XFORM_MODE, key, cfg);
          },
          /**
           * Creates this cipher in decryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
           */
          createDecryptor: function(key, cfg) {
            return this.create(this._DEC_XFORM_MODE, key, cfg);
          },
          /**
           * Initializes a newly created cipher.
           *
           * @param {number} xformMode Either the encryption or decryption transormation mode constant.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
           */
          init: function(xformMode, key, cfg) {
            this.cfg = this.cfg.extend(cfg);
            this._xformMode = xformMode;
            this._key = key;
            this.reset();
          },
          /**
           * Resets this cipher to its initial state.
           *
           * @example
           *
           *     cipher.reset();
           */
          reset: function() {
            BufferedBlockAlgorithm.reset.call(this);
            this._doReset();
          },
          /**
           * Adds data to be encrypted or decrypted.
           *
           * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
           *
           * @return {WordArray} The data after processing.
           *
           * @example
           *
           *     var encrypted = cipher.process('data');
           *     var encrypted = cipher.process(wordArray);
           */
          process: function(dataUpdate) {
            this._append(dataUpdate);
            return this._process();
          },
          /**
           * Finalizes the encryption or decryption process.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
           *
           * @return {WordArray} The data after final processing.
           *
           * @example
           *
           *     var encrypted = cipher.finalize();
           *     var encrypted = cipher.finalize('data');
           *     var encrypted = cipher.finalize(wordArray);
           */
          finalize: function(dataUpdate) {
            if (dataUpdate) {
              this._append(dataUpdate);
            }
            var finalProcessedData = this._doFinalize();
            return finalProcessedData;
          },
          keySize: 128 / 32,
          ivSize: 128 / 32,
          _ENC_XFORM_MODE: 1,
          _DEC_XFORM_MODE: 2,
          /**
           * Creates shortcut functions to a cipher's object interface.
           *
           * @param {Cipher} cipher The cipher to create a helper for.
           *
           * @return {Object} An object with encrypt and decrypt shortcut functions.
           *
           * @static
           *
           * @example
           *
           *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
           */
          _createHelper: /* @__PURE__ */ function() {
            function selectCipherStrategy(key) {
              if (typeof key == "string") {
                return PasswordBasedCipher;
              } else {
                return SerializableCipher;
              }
            }
            return function(cipher) {
              return {
                encrypt: function(message2, key, cfg) {
                  return selectCipherStrategy(key).encrypt(cipher, message2, key, cfg);
                },
                decrypt: function(ciphertext, key, cfg) {
                  return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                }
              };
            };
          }()
        });
        C_lib.StreamCipher = Cipher.extend({
          _doFinalize: function() {
            var finalProcessedBlocks = this._process(true);
            return finalProcessedBlocks;
          },
          blockSize: 1
        });
        var C_mode = C.mode = {};
        var BlockCipherMode = C_lib.BlockCipherMode = Base2.extend({
          /**
           * Creates this mode for encryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
           */
          createEncryptor: function(cipher, iv) {
            return this.Encryptor.create(cipher, iv);
          },
          /**
           * Creates this mode for decryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
           */
          createDecryptor: function(cipher, iv) {
            return this.Decryptor.create(cipher, iv);
          },
          /**
           * Initializes a newly created mode.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
           */
          init: function(cipher, iv) {
            this._cipher = cipher;
            this._iv = iv;
          }
        });
        var CBC = C_mode.CBC = function() {
          var CBC2 = BlockCipherMode.extend();
          CBC2.Encryptor = CBC2.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              xorBlock.call(this, words, offset, blockSize);
              cipher.encryptBlock(words, offset);
              this._prevBlock = words.slice(offset, offset + blockSize);
            }
          });
          CBC2.Decryptor = CBC2.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var thisBlock = words.slice(offset, offset + blockSize);
              cipher.decryptBlock(words, offset);
              xorBlock.call(this, words, offset, blockSize);
              this._prevBlock = thisBlock;
            }
          });
          function xorBlock(words, offset, blockSize) {
            var block;
            var iv = this._iv;
            if (iv) {
              block = iv;
              this._iv = undefined$1;
            } else {
              block = this._prevBlock;
            }
            for (var i2 = 0; i2 < blockSize; i2++) {
              words[offset + i2] ^= block[i2];
            }
          }
          return CBC2;
        }();
        var C_pad = C.pad = {};
        var Pkcs7 = C_pad.Pkcs7 = {
          /**
           * Pads data using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to pad.
           * @param {number} blockSize The multiple that the data should be padded to.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
           */
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
            var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;
            var paddingWords = [];
            for (var i2 = 0; i2 < nPaddingBytes; i2 += 4) {
              paddingWords.push(paddingWord);
            }
            var padding = WordArray.create(paddingWords, nPaddingBytes);
            data.concat(padding);
          },
          /**
           * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to unpad.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.unpad(wordArray);
           */
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        C_lib.BlockCipher = Cipher.extend({
          /**
           * Configuration options.
           *
           * @property {Mode} mode The block mode to use. Default: CBC
           * @property {Padding} padding The padding strategy to use. Default: Pkcs7
           */
          cfg: Cipher.cfg.extend({
            mode: CBC,
            padding: Pkcs7
          }),
          reset: function() {
            var modeCreator;
            Cipher.reset.call(this);
            var cfg = this.cfg;
            var iv = cfg.iv;
            var mode = cfg.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) {
              modeCreator = mode.createEncryptor;
            } else {
              modeCreator = mode.createDecryptor;
              this._minBufferSize = 1;
            }
            if (this._mode && this._mode.__creator == modeCreator) {
              this._mode.init(this, iv && iv.words);
            } else {
              this._mode = modeCreator.call(mode, this, iv && iv.words);
              this._mode.__creator = modeCreator;
            }
          },
          _doProcessBlock: function(words, offset) {
            this._mode.processBlock(words, offset);
          },
          _doFinalize: function() {
            var finalProcessedBlocks;
            var padding = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
              padding.pad(this._data, this.blockSize);
              finalProcessedBlocks = this._process(true);
            } else {
              finalProcessedBlocks = this._process(true);
              padding.unpad(finalProcessedBlocks);
            }
            return finalProcessedBlocks;
          },
          blockSize: 128 / 32
        });
        var CipherParams = C_lib.CipherParams = Base2.extend({
          /**
           * Initializes a newly created cipher params object.
           *
           * @param {Object} cipherParams An object with any of the possible cipher parameters.
           *
           * @example
           *
           *     var cipherParams = CryptoJS.lib.CipherParams.create({
           *         ciphertext: ciphertextWordArray,
           *         key: keyWordArray,
           *         iv: ivWordArray,
           *         salt: saltWordArray,
           *         algorithm: CryptoJS.algo.AES,
           *         mode: CryptoJS.mode.CBC,
           *         padding: CryptoJS.pad.PKCS7,
           *         blockSize: 4,
           *         formatter: CryptoJS.format.OpenSSL
           *     });
           */
          init: function(cipherParams) {
            this.mixIn(cipherParams);
          },
          /**
           * Converts this cipher params object to a string.
           *
           * @param {Format} formatter (Optional) The formatting strategy to use.
           *
           * @return {string} The stringified cipher params.
           *
           * @throws Error If neither the formatter nor the default formatter is set.
           *
           * @example
           *
           *     var string = cipherParams + '';
           *     var string = cipherParams.toString();
           *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
           */
          toString: function(formatter) {
            return (formatter || this.formatter).stringify(this);
          }
        });
        var C_format = C.format = {};
        var OpenSSLFormatter = C_format.OpenSSL = {
          /**
           * Converts a cipher params object to an OpenSSL-compatible string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The OpenSSL-compatible string.
           *
           * @static
           *
           * @example
           *
           *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
           */
          stringify: function(cipherParams) {
            var wordArray;
            var ciphertext = cipherParams.ciphertext;
            var salt = cipherParams.salt;
            if (salt) {
              wordArray = WordArray.create([1398893684, 1701076831]).concat(salt).concat(ciphertext);
            } else {
              wordArray = ciphertext;
            }
            return wordArray.toString(Base64);
          },
          /**
           * Converts an OpenSSL-compatible string to a cipher params object.
           *
           * @param {string} openSSLStr The OpenSSL-compatible string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
           */
          parse: function(openSSLStr) {
            var salt;
            var ciphertext = Base64.parse(openSSLStr);
            var ciphertextWords = ciphertext.words;
            if (ciphertextWords[0] == 1398893684 && ciphertextWords[1] == 1701076831) {
              salt = WordArray.create(ciphertextWords.slice(2, 4));
              ciphertextWords.splice(0, 4);
              ciphertext.sigBytes -= 16;
            }
            return CipherParams.create({ ciphertext, salt });
          }
        };
        var SerializableCipher = C_lib.SerializableCipher = Base2.extend({
          /**
           * Configuration options.
           *
           * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
           */
          cfg: Base2.extend({
            format: OpenSSLFormatter
          }),
          /**
           * Encrypts a message.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(cipher, message2, key, cfg) {
            cfg = this.cfg.extend(cfg);
            var encryptor = cipher.createEncryptor(key, cfg);
            var ciphertext = encryptor.finalize(message2);
            var cipherCfg = encryptor.cfg;
            return CipherParams.create({
              ciphertext,
              key,
              iv: cipherCfg.iv,
              algorithm: cipher,
              mode: cipherCfg.mode,
              padding: cipherCfg.padding,
              blockSize: cipher.blockSize,
              formatter: cfg.format
            });
          },
          /**
           * Decrypts serialized ciphertext.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(cipher, ciphertext, key, cfg) {
            cfg = this.cfg.extend(cfg);
            ciphertext = this._parse(ciphertext, cfg.format);
            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
            return plaintext;
          },
          /**
           * Converts serialized ciphertext to CipherParams,
           * else assumed CipherParams already and returns ciphertext unchanged.
           *
           * @param {CipherParams|string} ciphertext The ciphertext.
           * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
           *
           * @return {CipherParams} The unserialized ciphertext.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
           */
          _parse: function(ciphertext, format) {
            if (typeof ciphertext == "string") {
              return format.parse(ciphertext, this);
            } else {
              return ciphertext;
            }
          }
        });
        var C_kdf = C.kdf = {};
        var OpenSSLKdf = C_kdf.OpenSSL = {
          /**
           * Derives a key and IV from a password.
           *
           * @param {string} password The password to derive from.
           * @param {number} keySize The size in words of the key to generate.
           * @param {number} ivSize The size in words of the IV to generate.
           * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
           *
           * @return {CipherParams} A cipher params object with the key, IV, and salt.
           *
           * @static
           *
           * @example
           *
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
           */
          execute: function(password, keySize, ivSize, salt, hasher) {
            if (!salt) {
              salt = WordArray.random(64 / 8);
            }
            if (!hasher) {
              var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
            } else {
              var key = EvpKDF.create({ keySize: keySize + ivSize, hasher }).compute(password, salt);
            }
            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
            key.sigBytes = keySize * 4;
            return CipherParams.create({ key, iv, salt });
          }
        };
        var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
          /**
           * Configuration options.
           *
           * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
           */
          cfg: SerializableCipher.cfg.extend({
            kdf: OpenSSLKdf
          }),
          /**
           * Encrypts a message using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(cipher, message2, password, cfg) {
            cfg = this.cfg.extend(cfg);
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);
            cfg.iv = derivedParams.iv;
            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message2, derivedParams.key, cfg);
            ciphertext.mixIn(derivedParams);
            return ciphertext;
          },
          /**
           * Decrypts serialized ciphertext using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(cipher, ciphertext, password, cfg) {
            cfg = this.cfg.extend(cfg);
            ciphertext = this._parse(ciphertext, cfg.format);
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);
            cfg.iv = derivedParams.iv;
            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
            return plaintext;
          }
        });
      }();
    });
  })(cipherCore);
  return cipherCore.exports;
}
var modeCfb = { exports: {} };
var hasRequiredModeCfb;
function requireModeCfb() {
  if (hasRequiredModeCfb) return modeCfb.exports;
  hasRequiredModeCfb = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      CryptoJS.mode.CFB = function() {
        var CFB = CryptoJS.lib.BlockCipherMode.extend();
        CFB.Encryptor = CFB.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
            this._prevBlock = words.slice(offset, offset + blockSize);
          }
        });
        CFB.Decryptor = CFB.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var thisBlock = words.slice(offset, offset + blockSize);
            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
            this._prevBlock = thisBlock;
          }
        });
        function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
          var keystream;
          var iv = this._iv;
          if (iv) {
            keystream = iv.slice(0);
            this._iv = void 0;
          } else {
            keystream = this._prevBlock;
          }
          cipher.encryptBlock(keystream, 0);
          for (var i2 = 0; i2 < blockSize; i2++) {
            words[offset + i2] ^= keystream[i2];
          }
        }
        return CFB;
      }();
      return CryptoJS.mode.CFB;
    });
  })(modeCfb);
  return modeCfb.exports;
}
var modeCtr = { exports: {} };
var hasRequiredModeCtr;
function requireModeCtr() {
  if (hasRequiredModeCtr) return modeCtr.exports;
  hasRequiredModeCtr = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      CryptoJS.mode.CTR = function() {
        var CTR = CryptoJS.lib.BlockCipherMode.extend();
        var Encryptor = CTR.Encryptor = CTR.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter;
            if (iv) {
              counter = this._counter = iv.slice(0);
              this._iv = void 0;
            }
            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0);
            counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0;
            for (var i2 = 0; i2 < blockSize; i2++) {
              words[offset + i2] ^= keystream[i2];
            }
          }
        });
        CTR.Decryptor = Encryptor;
        return CTR;
      }();
      return CryptoJS.mode.CTR;
    });
  })(modeCtr);
  return modeCtr.exports;
}
var modeCtrGladman = { exports: {} };
var hasRequiredModeCtrGladman;
function requireModeCtrGladman() {
  if (hasRequiredModeCtrGladman) return modeCtrGladman.exports;
  hasRequiredModeCtrGladman = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      /** @preserve
       * Counter block mode compatible with  Dr Brian Gladman fileenc.c
       * derived from CryptoJS.mode.CTR
       * Jan Hruby jhruby.web@gmail.com
       */
      CryptoJS.mode.CTRGladman = function() {
        var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();
        function incWord(word) {
          if ((word >> 24 & 255) === 255) {
            var b1 = word >> 16 & 255;
            var b2 = word >> 8 & 255;
            var b3 = word & 255;
            if (b1 === 255) {
              b1 = 0;
              if (b2 === 255) {
                b2 = 0;
                if (b3 === 255) {
                  b3 = 0;
                } else {
                  ++b3;
                }
              } else {
                ++b2;
              }
            } else {
              ++b1;
            }
            word = 0;
            word += b1 << 16;
            word += b2 << 8;
            word += b3;
          } else {
            word += 1 << 24;
          }
          return word;
        }
        function incCounter(counter) {
          if ((counter[0] = incWord(counter[0])) === 0) {
            counter[1] = incWord(counter[1]);
          }
          return counter;
        }
        var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter;
            if (iv) {
              counter = this._counter = iv.slice(0);
              this._iv = void 0;
            }
            incCounter(counter);
            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0);
            for (var i2 = 0; i2 < blockSize; i2++) {
              words[offset + i2] ^= keystream[i2];
            }
          }
        });
        CTRGladman.Decryptor = Encryptor;
        return CTRGladman;
      }();
      return CryptoJS.mode.CTRGladman;
    });
  })(modeCtrGladman);
  return modeCtrGladman.exports;
}
var modeOfb = { exports: {} };
var hasRequiredModeOfb;
function requireModeOfb() {
  if (hasRequiredModeOfb) return modeOfb.exports;
  hasRequiredModeOfb = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      CryptoJS.mode.OFB = function() {
        var OFB = CryptoJS.lib.BlockCipherMode.extend();
        var Encryptor = OFB.Encryptor = OFB.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var keystream = this._keystream;
            if (iv) {
              keystream = this._keystream = iv.slice(0);
              this._iv = void 0;
            }
            cipher.encryptBlock(keystream, 0);
            for (var i2 = 0; i2 < blockSize; i2++) {
              words[offset + i2] ^= keystream[i2];
            }
          }
        });
        OFB.Decryptor = Encryptor;
        return OFB;
      }();
      return CryptoJS.mode.OFB;
    });
  })(modeOfb);
  return modeOfb.exports;
}
var modeEcb = { exports: {} };
var hasRequiredModeEcb;
function requireModeEcb() {
  if (hasRequiredModeEcb) return modeEcb.exports;
  hasRequiredModeEcb = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      CryptoJS.mode.ECB = function() {
        var ECB = CryptoJS.lib.BlockCipherMode.extend();
        ECB.Encryptor = ECB.extend({
          processBlock: function(words, offset) {
            this._cipher.encryptBlock(words, offset);
          }
        });
        ECB.Decryptor = ECB.extend({
          processBlock: function(words, offset) {
            this._cipher.decryptBlock(words, offset);
          }
        });
        return ECB;
      }();
      return CryptoJS.mode.ECB;
    });
  })(modeEcb);
  return modeEcb.exports;
}
var padAnsix923 = { exports: {} };
var hasRequiredPadAnsix923;
function requirePadAnsix923() {
  if (hasRequiredPadAnsix923) return padAnsix923.exports;
  hasRequiredPadAnsix923 = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      CryptoJS.pad.AnsiX923 = {
        pad: function(data, blockSize) {
          var dataSigBytes = data.sigBytes;
          var blockSizeBytes = blockSize * 4;
          var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
          var lastBytePos = dataSigBytes + nPaddingBytes - 1;
          data.clamp();
          data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
          data.sigBytes += nPaddingBytes;
        },
        unpad: function(data) {
          var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
          data.sigBytes -= nPaddingBytes;
        }
      };
      return CryptoJS.pad.Ansix923;
    });
  })(padAnsix923);
  return padAnsix923.exports;
}
var padIso10126 = { exports: {} };
var hasRequiredPadIso10126;
function requirePadIso10126() {
  if (hasRequiredPadIso10126) return padIso10126.exports;
  hasRequiredPadIso10126 = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      CryptoJS.pad.Iso10126 = {
        pad: function(data, blockSize) {
          var blockSizeBytes = blockSize * 4;
          var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
          data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
        },
        unpad: function(data) {
          var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
          data.sigBytes -= nPaddingBytes;
        }
      };
      return CryptoJS.pad.Iso10126;
    });
  })(padIso10126);
  return padIso10126.exports;
}
var padIso97971 = { exports: {} };
var hasRequiredPadIso97971;
function requirePadIso97971() {
  if (hasRequiredPadIso97971) return padIso97971.exports;
  hasRequiredPadIso97971 = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      CryptoJS.pad.Iso97971 = {
        pad: function(data, blockSize) {
          data.concat(CryptoJS.lib.WordArray.create([2147483648], 1));
          CryptoJS.pad.ZeroPadding.pad(data, blockSize);
        },
        unpad: function(data) {
          CryptoJS.pad.ZeroPadding.unpad(data);
          data.sigBytes--;
        }
      };
      return CryptoJS.pad.Iso97971;
    });
  })(padIso97971);
  return padIso97971.exports;
}
var padZeropadding = { exports: {} };
var hasRequiredPadZeropadding;
function requirePadZeropadding() {
  if (hasRequiredPadZeropadding) return padZeropadding.exports;
  hasRequiredPadZeropadding = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      CryptoJS.pad.ZeroPadding = {
        pad: function(data, blockSize) {
          var blockSizeBytes = blockSize * 4;
          data.clamp();
          data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
        },
        unpad: function(data) {
          var dataWords = data.words;
          var i2 = data.sigBytes - 1;
          for (var i2 = data.sigBytes - 1; i2 >= 0; i2--) {
            if (dataWords[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) {
              data.sigBytes = i2 + 1;
              break;
            }
          }
        }
      };
      return CryptoJS.pad.ZeroPadding;
    });
  })(padZeropadding);
  return padZeropadding.exports;
}
var padNopadding = { exports: {} };
var hasRequiredPadNopadding;
function requirePadNopadding() {
  if (hasRequiredPadNopadding) return padNopadding.exports;
  hasRequiredPadNopadding = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      CryptoJS.pad.NoPadding = {
        pad: function() {
        },
        unpad: function() {
        }
      };
      return CryptoJS.pad.NoPadding;
    });
  })(padNopadding);
  return padNopadding.exports;
}
var formatHex = { exports: {} };
var hasRequiredFormatHex;
function requireFormatHex() {
  if (hasRequiredFormatHex) return formatHex.exports;
  hasRequiredFormatHex = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function(undefined$1) {
        var C = CryptoJS;
        var C_lib = C.lib;
        var CipherParams = C_lib.CipherParams;
        var C_enc = C.enc;
        var Hex = C_enc.Hex;
        var C_format = C.format;
        C_format.Hex = {
          /**
           * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The hexadecimally encoded string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
           */
          stringify: function(cipherParams) {
            return cipherParams.ciphertext.toString(Hex);
          },
          /**
           * Converts a hexadecimally encoded ciphertext string to a cipher params object.
           *
           * @param {string} input The hexadecimally encoded string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
           */
          parse: function(input) {
            var ciphertext = Hex.parse(input);
            return CipherParams.create({ ciphertext });
          }
        };
      })();
      return CryptoJS.format.Hex;
    });
  })(formatHex);
  return formatHex.exports;
}
var aes = { exports: {} };
var hasRequiredAes;
function requireAes() {
  if (hasRequiredAes) return aes.exports;
  hasRequiredAes = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo;
        var SBOX = [];
        var INV_SBOX = [];
        var SUB_MIX_0 = [];
        var SUB_MIX_1 = [];
        var SUB_MIX_2 = [];
        var SUB_MIX_3 = [];
        var INV_SUB_MIX_0 = [];
        var INV_SUB_MIX_1 = [];
        var INV_SUB_MIX_2 = [];
        var INV_SUB_MIX_3 = [];
        (function() {
          var d = [];
          for (var i2 = 0; i2 < 256; i2++) {
            if (i2 < 128) {
              d[i2] = i2 << 1;
            } else {
              d[i2] = i2 << 1 ^ 283;
            }
          }
          var x = 0;
          var xi = 0;
          for (var i2 = 0; i2 < 256; i2++) {
            var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
            sx = sx >>> 8 ^ sx & 255 ^ 99;
            SBOX[x] = sx;
            INV_SBOX[sx] = x;
            var x2 = d[x];
            var x4 = d[x2];
            var x8 = d[x4];
            var t = d[sx] * 257 ^ sx * 16843008;
            SUB_MIX_0[x] = t << 24 | t >>> 8;
            SUB_MIX_1[x] = t << 16 | t >>> 16;
            SUB_MIX_2[x] = t << 8 | t >>> 24;
            SUB_MIX_3[x] = t;
            var t = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
            INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
            INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
            INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
            INV_SUB_MIX_3[sx] = t;
            if (!x) {
              x = xi = 1;
            } else {
              x = x2 ^ d[d[d[x8 ^ x2]]];
              xi ^= d[d[xi]];
            }
          }
        })();
        var RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
        var AES = C_algo.AES = BlockCipher.extend({
          _doReset: function() {
            var t;
            if (this._nRounds && this._keyPriorReset === this._key) {
              return;
            }
            var key = this._keyPriorReset = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4;
            var nRounds = this._nRounds = keySize + 6;
            var ksRows = (nRounds + 1) * 4;
            var keySchedule = this._keySchedule = [];
            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
              if (ksRow < keySize) {
                keySchedule[ksRow] = keyWords[ksRow];
              } else {
                t = keySchedule[ksRow - 1];
                if (!(ksRow % keySize)) {
                  t = t << 8 | t >>> 24;
                  t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
                  t ^= RCON[ksRow / keySize | 0] << 24;
                } else if (keySize > 6 && ksRow % keySize == 4) {
                  t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
                }
                keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
              }
            }
            var invKeySchedule = this._invKeySchedule = [];
            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
              var ksRow = ksRows - invKsRow;
              if (invKsRow % 4) {
                var t = keySchedule[ksRow];
              } else {
                var t = keySchedule[ksRow - 4];
              }
              if (invKsRow < 4 || ksRow <= 4) {
                invKeySchedule[invKsRow] = t;
              } else {
                invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 255]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 255]] ^ INV_SUB_MIX_3[SBOX[t & 255]];
              }
            }
          },
          encryptBlock: function(M, offset) {
            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
          },
          decryptBlock: function(M, offset) {
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
          },
          _doCryptBlock: function(M, offset, keySchedule, SUB_MIX_02, SUB_MIX_12, SUB_MIX_22, SUB_MIX_32, SBOX2) {
            var nRounds = this._nRounds;
            var s0 = M[offset] ^ keySchedule[0];
            var s1 = M[offset + 1] ^ keySchedule[1];
            var s2 = M[offset + 2] ^ keySchedule[2];
            var s3 = M[offset + 3] ^ keySchedule[3];
            var ksRow = 4;
            for (var round = 1; round < nRounds; round++) {
              var t0 = SUB_MIX_02[s0 >>> 24] ^ SUB_MIX_12[s1 >>> 16 & 255] ^ SUB_MIX_22[s2 >>> 8 & 255] ^ SUB_MIX_32[s3 & 255] ^ keySchedule[ksRow++];
              var t1 = SUB_MIX_02[s1 >>> 24] ^ SUB_MIX_12[s2 >>> 16 & 255] ^ SUB_MIX_22[s3 >>> 8 & 255] ^ SUB_MIX_32[s0 & 255] ^ keySchedule[ksRow++];
              var t2 = SUB_MIX_02[s2 >>> 24] ^ SUB_MIX_12[s3 >>> 16 & 255] ^ SUB_MIX_22[s0 >>> 8 & 255] ^ SUB_MIX_32[s1 & 255] ^ keySchedule[ksRow++];
              var t3 = SUB_MIX_02[s3 >>> 24] ^ SUB_MIX_12[s0 >>> 16 & 255] ^ SUB_MIX_22[s1 >>> 8 & 255] ^ SUB_MIX_32[s2 & 255] ^ keySchedule[ksRow++];
              s0 = t0;
              s1 = t1;
              s2 = t2;
              s3 = t3;
            }
            var t0 = (SBOX2[s0 >>> 24] << 24 | SBOX2[s1 >>> 16 & 255] << 16 | SBOX2[s2 >>> 8 & 255] << 8 | SBOX2[s3 & 255]) ^ keySchedule[ksRow++];
            var t1 = (SBOX2[s1 >>> 24] << 24 | SBOX2[s2 >>> 16 & 255] << 16 | SBOX2[s3 >>> 8 & 255] << 8 | SBOX2[s0 & 255]) ^ keySchedule[ksRow++];
            var t2 = (SBOX2[s2 >>> 24] << 24 | SBOX2[s3 >>> 16 & 255] << 16 | SBOX2[s0 >>> 8 & 255] << 8 | SBOX2[s1 & 255]) ^ keySchedule[ksRow++];
            var t3 = (SBOX2[s3 >>> 24] << 24 | SBOX2[s0 >>> 16 & 255] << 16 | SBOX2[s1 >>> 8 & 255] << 8 | SBOX2[s2 & 255]) ^ keySchedule[ksRow++];
            M[offset] = t0;
            M[offset + 1] = t1;
            M[offset + 2] = t2;
            M[offset + 3] = t3;
          },
          keySize: 256 / 32
        });
        C.AES = BlockCipher._createHelper(AES);
      })();
      return CryptoJS.AES;
    });
  })(aes);
  return aes.exports;
}
var tripledes = { exports: {} };
var hasRequiredTripledes;
function requireTripledes() {
  if (hasRequiredTripledes) return tripledes.exports;
  hasRequiredTripledes = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo;
        var PC1 = [
          57,
          49,
          41,
          33,
          25,
          17,
          9,
          1,
          58,
          50,
          42,
          34,
          26,
          18,
          10,
          2,
          59,
          51,
          43,
          35,
          27,
          19,
          11,
          3,
          60,
          52,
          44,
          36,
          63,
          55,
          47,
          39,
          31,
          23,
          15,
          7,
          62,
          54,
          46,
          38,
          30,
          22,
          14,
          6,
          61,
          53,
          45,
          37,
          29,
          21,
          13,
          5,
          28,
          20,
          12,
          4
        ];
        var PC2 = [
          14,
          17,
          11,
          24,
          1,
          5,
          3,
          28,
          15,
          6,
          21,
          10,
          23,
          19,
          12,
          4,
          26,
          8,
          16,
          7,
          27,
          20,
          13,
          2,
          41,
          52,
          31,
          37,
          47,
          55,
          30,
          40,
          51,
          45,
          33,
          48,
          44,
          49,
          39,
          56,
          34,
          53,
          46,
          42,
          50,
          36,
          29,
          32
        ];
        var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
        var SBOX_P = [
          {
            0: 8421888,
            268435456: 32768,
            536870912: 8421378,
            805306368: 2,
            1073741824: 512,
            1342177280: 8421890,
            1610612736: 8389122,
            1879048192: 8388608,
            2147483648: 514,
            2415919104: 8389120,
            2684354560: 33280,
            2952790016: 8421376,
            3221225472: 32770,
            3489660928: 8388610,
            3758096384: 0,
            4026531840: 33282,
            134217728: 0,
            402653184: 8421890,
            671088640: 33282,
            939524096: 32768,
            1207959552: 8421888,
            1476395008: 512,
            1744830464: 8421378,
            2013265920: 2,
            2281701376: 8389120,
            2550136832: 33280,
            2818572288: 8421376,
            3087007744: 8389122,
            3355443200: 8388610,
            3623878656: 32770,
            3892314112: 514,
            4160749568: 8388608,
            1: 32768,
            268435457: 2,
            536870913: 8421888,
            805306369: 8388608,
            1073741825: 8421378,
            1342177281: 33280,
            1610612737: 512,
            1879048193: 8389122,
            2147483649: 8421890,
            2415919105: 8421376,
            2684354561: 8388610,
            2952790017: 33282,
            3221225473: 514,
            3489660929: 8389120,
            3758096385: 32770,
            4026531841: 0,
            134217729: 8421890,
            402653185: 8421376,
            671088641: 8388608,
            939524097: 512,
            1207959553: 32768,
            1476395009: 8388610,
            1744830465: 2,
            2013265921: 33282,
            2281701377: 32770,
            2550136833: 8389122,
            2818572289: 514,
            3087007745: 8421888,
            3355443201: 8389120,
            3623878657: 0,
            3892314113: 33280,
            4160749569: 8421378
          },
          {
            0: 1074282512,
            16777216: 16384,
            33554432: 524288,
            50331648: 1074266128,
            67108864: 1073741840,
            83886080: 1074282496,
            100663296: 1073758208,
            117440512: 16,
            134217728: 540672,
            150994944: 1073758224,
            167772160: 1073741824,
            184549376: 540688,
            201326592: 524304,
            218103808: 0,
            234881024: 16400,
            251658240: 1074266112,
            8388608: 1073758208,
            25165824: 540688,
            41943040: 16,
            58720256: 1073758224,
            75497472: 1074282512,
            92274688: 1073741824,
            109051904: 524288,
            125829120: 1074266128,
            142606336: 524304,
            159383552: 0,
            176160768: 16384,
            192937984: 1074266112,
            209715200: 1073741840,
            226492416: 540672,
            243269632: 1074282496,
            260046848: 16400,
            268435456: 0,
            285212672: 1074266128,
            301989888: 1073758224,
            318767104: 1074282496,
            335544320: 1074266112,
            352321536: 16,
            369098752: 540688,
            385875968: 16384,
            402653184: 16400,
            419430400: 524288,
            436207616: 524304,
            452984832: 1073741840,
            469762048: 540672,
            486539264: 1073758208,
            503316480: 1073741824,
            520093696: 1074282512,
            276824064: 540688,
            293601280: 524288,
            310378496: 1074266112,
            327155712: 16384,
            343932928: 1073758208,
            360710144: 1074282512,
            377487360: 16,
            394264576: 1073741824,
            411041792: 1074282496,
            427819008: 1073741840,
            444596224: 1073758224,
            461373440: 524304,
            478150656: 0,
            494927872: 16400,
            511705088: 1074266128,
            528482304: 540672
          },
          {
            0: 260,
            1048576: 0,
            2097152: 67109120,
            3145728: 65796,
            4194304: 65540,
            5242880: 67108868,
            6291456: 67174660,
            7340032: 67174400,
            8388608: 67108864,
            9437184: 67174656,
            10485760: 65792,
            11534336: 67174404,
            12582912: 67109124,
            13631488: 65536,
            14680064: 4,
            15728640: 256,
            524288: 67174656,
            1572864: 67174404,
            2621440: 0,
            3670016: 67109120,
            4718592: 67108868,
            5767168: 65536,
            6815744: 65540,
            7864320: 260,
            8912896: 4,
            9961472: 256,
            11010048: 67174400,
            12058624: 65796,
            13107200: 65792,
            14155776: 67109124,
            15204352: 67174660,
            16252928: 67108864,
            16777216: 67174656,
            17825792: 65540,
            18874368: 65536,
            19922944: 67109120,
            20971520: 256,
            22020096: 67174660,
            23068672: 67108868,
            24117248: 0,
            25165824: 67109124,
            26214400: 67108864,
            27262976: 4,
            28311552: 65792,
            29360128: 67174400,
            30408704: 260,
            31457280: 65796,
            32505856: 67174404,
            17301504: 67108864,
            18350080: 260,
            19398656: 67174656,
            20447232: 0,
            21495808: 65540,
            22544384: 67109120,
            23592960: 256,
            24641536: 67174404,
            25690112: 65536,
            26738688: 67174660,
            27787264: 65796,
            28835840: 67108868,
            29884416: 67109124,
            30932992: 67174400,
            31981568: 4,
            33030144: 65792
          },
          {
            0: 2151682048,
            65536: 2147487808,
            131072: 4198464,
            196608: 2151677952,
            262144: 0,
            327680: 4198400,
            393216: 2147483712,
            458752: 4194368,
            524288: 2147483648,
            589824: 4194304,
            655360: 64,
            720896: 2147487744,
            786432: 2151678016,
            851968: 4160,
            917504: 4096,
            983040: 2151682112,
            32768: 2147487808,
            98304: 64,
            163840: 2151678016,
            229376: 2147487744,
            294912: 4198400,
            360448: 2151682112,
            425984: 0,
            491520: 2151677952,
            557056: 4096,
            622592: 2151682048,
            688128: 4194304,
            753664: 4160,
            819200: 2147483648,
            884736: 4194368,
            950272: 4198464,
            1015808: 2147483712,
            1048576: 4194368,
            1114112: 4198400,
            1179648: 2147483712,
            1245184: 0,
            1310720: 4160,
            1376256: 2151678016,
            1441792: 2151682048,
            1507328: 2147487808,
            1572864: 2151682112,
            1638400: 2147483648,
            1703936: 2151677952,
            1769472: 4198464,
            1835008: 2147487744,
            1900544: 4194304,
            1966080: 64,
            2031616: 4096,
            1081344: 2151677952,
            1146880: 2151682112,
            1212416: 0,
            1277952: 4198400,
            1343488: 4194368,
            1409024: 2147483648,
            1474560: 2147487808,
            1540096: 64,
            1605632: 2147483712,
            1671168: 4096,
            1736704: 2147487744,
            1802240: 2151678016,
            1867776: 4160,
            1933312: 2151682048,
            1998848: 4194304,
            2064384: 4198464
          },
          {
            0: 128,
            4096: 17039360,
            8192: 262144,
            12288: 536870912,
            16384: 537133184,
            20480: 16777344,
            24576: 553648256,
            28672: 262272,
            32768: 16777216,
            36864: 537133056,
            40960: 536871040,
            45056: 553910400,
            49152: 553910272,
            53248: 0,
            57344: 17039488,
            61440: 553648128,
            2048: 17039488,
            6144: 553648256,
            10240: 128,
            14336: 17039360,
            18432: 262144,
            22528: 537133184,
            26624: 553910272,
            30720: 536870912,
            34816: 537133056,
            38912: 0,
            43008: 553910400,
            47104: 16777344,
            51200: 536871040,
            55296: 553648128,
            59392: 16777216,
            63488: 262272,
            65536: 262144,
            69632: 128,
            73728: 536870912,
            77824: 553648256,
            81920: 16777344,
            86016: 553910272,
            90112: 537133184,
            94208: 16777216,
            98304: 553910400,
            102400: 553648128,
            106496: 17039360,
            110592: 537133056,
            114688: 262272,
            118784: 536871040,
            122880: 0,
            126976: 17039488,
            67584: 553648256,
            71680: 16777216,
            75776: 17039360,
            79872: 537133184,
            83968: 536870912,
            88064: 17039488,
            92160: 128,
            96256: 553910272,
            100352: 262272,
            104448: 553910400,
            108544: 0,
            112640: 553648128,
            116736: 16777344,
            120832: 262144,
            124928: 537133056,
            129024: 536871040
          },
          {
            0: 268435464,
            256: 8192,
            512: 270532608,
            768: 270540808,
            1024: 268443648,
            1280: 2097152,
            1536: 2097160,
            1792: 268435456,
            2048: 0,
            2304: 268443656,
            2560: 2105344,
            2816: 8,
            3072: 270532616,
            3328: 2105352,
            3584: 8200,
            3840: 270540800,
            128: 270532608,
            384: 270540808,
            640: 8,
            896: 2097152,
            1152: 2105352,
            1408: 268435464,
            1664: 268443648,
            1920: 8200,
            2176: 2097160,
            2432: 8192,
            2688: 268443656,
            2944: 270532616,
            3200: 0,
            3456: 270540800,
            3712: 2105344,
            3968: 268435456,
            4096: 268443648,
            4352: 270532616,
            4608: 270540808,
            4864: 8200,
            5120: 2097152,
            5376: 268435456,
            5632: 268435464,
            5888: 2105344,
            6144: 2105352,
            6400: 0,
            6656: 8,
            6912: 270532608,
            7168: 8192,
            7424: 268443656,
            7680: 270540800,
            7936: 2097160,
            4224: 8,
            4480: 2105344,
            4736: 2097152,
            4992: 268435464,
            5248: 268443648,
            5504: 8200,
            5760: 270540808,
            6016: 270532608,
            6272: 270540800,
            6528: 270532616,
            6784: 8192,
            7040: 2105352,
            7296: 2097160,
            7552: 0,
            7808: 268435456,
            8064: 268443656
          },
          {
            0: 1048576,
            16: 33555457,
            32: 1024,
            48: 1049601,
            64: 34604033,
            80: 0,
            96: 1,
            112: 34603009,
            128: 33555456,
            144: 1048577,
            160: 33554433,
            176: 34604032,
            192: 34603008,
            208: 1025,
            224: 1049600,
            240: 33554432,
            8: 34603009,
            24: 0,
            40: 33555457,
            56: 34604032,
            72: 1048576,
            88: 33554433,
            104: 33554432,
            120: 1025,
            136: 1049601,
            152: 33555456,
            168: 34603008,
            184: 1048577,
            200: 1024,
            216: 34604033,
            232: 1,
            248: 1049600,
            256: 33554432,
            272: 1048576,
            288: 33555457,
            304: 34603009,
            320: 1048577,
            336: 33555456,
            352: 34604032,
            368: 1049601,
            384: 1025,
            400: 34604033,
            416: 1049600,
            432: 1,
            448: 0,
            464: 34603008,
            480: 33554433,
            496: 1024,
            264: 1049600,
            280: 33555457,
            296: 34603009,
            312: 1,
            328: 33554432,
            344: 1048576,
            360: 1025,
            376: 34604032,
            392: 33554433,
            408: 34603008,
            424: 0,
            440: 34604033,
            456: 1049601,
            472: 1024,
            488: 33555456,
            504: 1048577
          },
          {
            0: 134219808,
            1: 131072,
            2: 134217728,
            3: 32,
            4: 131104,
            5: 134350880,
            6: 134350848,
            7: 2048,
            8: 134348800,
            9: 134219776,
            10: 133120,
            11: 134348832,
            12: 2080,
            13: 0,
            14: 134217760,
            15: 133152,
            2147483648: 2048,
            2147483649: 134350880,
            2147483650: 134219808,
            2147483651: 134217728,
            2147483652: 134348800,
            2147483653: 133120,
            2147483654: 133152,
            2147483655: 32,
            2147483656: 134217760,
            2147483657: 2080,
            2147483658: 131104,
            2147483659: 134350848,
            2147483660: 0,
            2147483661: 134348832,
            2147483662: 134219776,
            2147483663: 131072,
            16: 133152,
            17: 134350848,
            18: 32,
            19: 2048,
            20: 134219776,
            21: 134217760,
            22: 134348832,
            23: 131072,
            24: 0,
            25: 131104,
            26: 134348800,
            27: 134219808,
            28: 134350880,
            29: 133120,
            30: 2080,
            31: 134217728,
            2147483664: 131072,
            2147483665: 2048,
            2147483666: 134348832,
            2147483667: 133152,
            2147483668: 32,
            2147483669: 134348800,
            2147483670: 134217728,
            2147483671: 134219808,
            2147483672: 134350880,
            2147483673: 134217760,
            2147483674: 134219776,
            2147483675: 0,
            2147483676: 133120,
            2147483677: 2080,
            2147483678: 131104,
            2147483679: 134350848
          }
        ];
        var SBOX_MASK = [
          4160749569,
          528482304,
          33030144,
          2064384,
          129024,
          8064,
          504,
          2147483679
        ];
        var DES = C_algo.DES = BlockCipher.extend({
          _doReset: function() {
            var key = this._key;
            var keyWords = key.words;
            var keyBits = [];
            for (var i2 = 0; i2 < 56; i2++) {
              var keyBitPos = PC1[i2] - 1;
              keyBits[i2] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
            }
            var subKeys = this._subKeys = [];
            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
              var subKey = subKeys[nSubKey] = [];
              var bitShift = BIT_SHIFTS[nSubKey];
              for (var i2 = 0; i2 < 24; i2++) {
                subKey[i2 / 6 | 0] |= keyBits[(PC2[i2] - 1 + bitShift) % 28] << 31 - i2 % 6;
                subKey[4 + (i2 / 6 | 0)] |= keyBits[28 + (PC2[i2 + 24] - 1 + bitShift) % 28] << 31 - i2 % 6;
              }
              subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;
              for (var i2 = 1; i2 < 7; i2++) {
                subKey[i2] = subKey[i2] >>> (i2 - 1) * 4 + 3;
              }
              subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
            }
            var invSubKeys = this._invSubKeys = [];
            for (var i2 = 0; i2 < 16; i2++) {
              invSubKeys[i2] = subKeys[15 - i2];
            }
          },
          encryptBlock: function(M, offset) {
            this._doCryptBlock(M, offset, this._subKeys);
          },
          decryptBlock: function(M, offset) {
            this._doCryptBlock(M, offset, this._invSubKeys);
          },
          _doCryptBlock: function(M, offset, subKeys) {
            this._lBlock = M[offset];
            this._rBlock = M[offset + 1];
            exchangeLR.call(this, 4, 252645135);
            exchangeLR.call(this, 16, 65535);
            exchangeRL.call(this, 2, 858993459);
            exchangeRL.call(this, 8, 16711935);
            exchangeLR.call(this, 1, 1431655765);
            for (var round = 0; round < 16; round++) {
              var subKey = subKeys[round];
              var lBlock = this._lBlock;
              var rBlock = this._rBlock;
              var f = 0;
              for (var i2 = 0; i2 < 8; i2++) {
                f |= SBOX_P[i2][((rBlock ^ subKey[i2]) & SBOX_MASK[i2]) >>> 0];
              }
              this._lBlock = rBlock;
              this._rBlock = lBlock ^ f;
            }
            var t = this._lBlock;
            this._lBlock = this._rBlock;
            this._rBlock = t;
            exchangeLR.call(this, 1, 1431655765);
            exchangeRL.call(this, 8, 16711935);
            exchangeRL.call(this, 2, 858993459);
            exchangeLR.call(this, 16, 65535);
            exchangeLR.call(this, 4, 252645135);
            M[offset] = this._lBlock;
            M[offset + 1] = this._rBlock;
          },
          keySize: 64 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        function exchangeLR(offset, mask) {
          var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
          this._rBlock ^= t;
          this._lBlock ^= t << offset;
        }
        function exchangeRL(offset, mask) {
          var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
          this._lBlock ^= t;
          this._rBlock ^= t << offset;
        }
        C.DES = BlockCipher._createHelper(DES);
        var TripleDES = C_algo.TripleDES = BlockCipher.extend({
          _doReset: function() {
            var key = this._key;
            var keyWords = key.words;
            if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
              throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
            }
            var key1 = keyWords.slice(0, 2);
            var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
            var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);
            this._des1 = DES.createEncryptor(WordArray.create(key1));
            this._des2 = DES.createEncryptor(WordArray.create(key2));
            this._des3 = DES.createEncryptor(WordArray.create(key3));
          },
          encryptBlock: function(M, offset) {
            this._des1.encryptBlock(M, offset);
            this._des2.decryptBlock(M, offset);
            this._des3.encryptBlock(M, offset);
          },
          decryptBlock: function(M, offset) {
            this._des3.decryptBlock(M, offset);
            this._des2.encryptBlock(M, offset);
            this._des1.decryptBlock(M, offset);
          },
          keySize: 192 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        C.TripleDES = BlockCipher._createHelper(TripleDES);
      })();
      return CryptoJS.TripleDES;
    });
  })(tripledes);
  return tripledes.exports;
}
var rc4 = { exports: {} };
var hasRequiredRc4;
function requireRc4() {
  if (hasRequiredRc4) return rc4.exports;
  hasRequiredRc4 = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo;
        var RC4 = C_algo.RC4 = StreamCipher.extend({
          _doReset: function() {
            var key = this._key;
            var keyWords = key.words;
            var keySigBytes = key.sigBytes;
            var S = this._S = [];
            for (var i2 = 0; i2 < 256; i2++) {
              S[i2] = i2;
            }
            for (var i2 = 0, j = 0; i2 < 256; i2++) {
              var keyByteIndex = i2 % keySigBytes;
              var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 255;
              j = (j + S[i2] + keyByte) % 256;
              var t = S[i2];
              S[i2] = S[j];
              S[j] = t;
            }
            this._i = this._j = 0;
          },
          _doProcessBlock: function(M, offset) {
            M[offset] ^= generateKeystreamWord.call(this);
          },
          keySize: 256 / 32,
          ivSize: 0
        });
        function generateKeystreamWord() {
          var S = this._S;
          var i2 = this._i;
          var j = this._j;
          var keystreamWord = 0;
          for (var n = 0; n < 4; n++) {
            i2 = (i2 + 1) % 256;
            j = (j + S[i2]) % 256;
            var t = S[i2];
            S[i2] = S[j];
            S[j] = t;
            keystreamWord |= S[(S[i2] + S[j]) % 256] << 24 - n * 8;
          }
          this._i = i2;
          this._j = j;
          return keystreamWord;
        }
        C.RC4 = StreamCipher._createHelper(RC4);
        var RC4Drop = C_algo.RC4Drop = RC4.extend({
          /**
           * Configuration options.
           *
           * @property {number} drop The number of keystream words to drop. Default 192
           */
          cfg: RC4.cfg.extend({
            drop: 192
          }),
          _doReset: function() {
            RC4._doReset.call(this);
            for (var i2 = this.cfg.drop; i2 > 0; i2--) {
              generateKeystreamWord.call(this);
            }
          }
        });
        C.RC4Drop = StreamCipher._createHelper(RC4Drop);
      })();
      return CryptoJS.RC4;
    });
  })(rc4);
  return rc4.exports;
}
var rabbit = { exports: {} };
var hasRequiredRabbit;
function requireRabbit() {
  if (hasRequiredRabbit) return rabbit.exports;
  hasRequiredRabbit = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo;
        var S = [];
        var C_ = [];
        var G = [];
        var Rabbit = C_algo.Rabbit = StreamCipher.extend({
          _doReset: function() {
            var K = this._key.words;
            var iv = this.cfg.iv;
            for (var i2 = 0; i2 < 4; i2++) {
              K[i2] = (K[i2] << 8 | K[i2] >>> 24) & 16711935 | (K[i2] << 24 | K[i2] >>> 8) & 4278255360;
            }
            var X = this._X = [
              K[0],
              K[3] << 16 | K[2] >>> 16,
              K[1],
              K[0] << 16 | K[3] >>> 16,
              K[2],
              K[1] << 16 | K[0] >>> 16,
              K[3],
              K[2] << 16 | K[1] >>> 16
            ];
            var C2 = this._C = [
              K[2] << 16 | K[2] >>> 16,
              K[0] & 4294901760 | K[1] & 65535,
              K[3] << 16 | K[3] >>> 16,
              K[1] & 4294901760 | K[2] & 65535,
              K[0] << 16 | K[0] >>> 16,
              K[2] & 4294901760 | K[3] & 65535,
              K[1] << 16 | K[1] >>> 16,
              K[3] & 4294901760 | K[0] & 65535
            ];
            this._b = 0;
            for (var i2 = 0; i2 < 4; i2++) {
              nextState.call(this);
            }
            for (var i2 = 0; i2 < 8; i2++) {
              C2[i2] ^= X[i2 + 4 & 7];
            }
            if (iv) {
              var IV = iv.words;
              var IV_0 = IV[0];
              var IV_1 = IV[1];
              var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
              var i22 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
              var i1 = i0 >>> 16 | i22 & 4294901760;
              var i3 = i22 << 16 | i0 & 65535;
              C2[0] ^= i0;
              C2[1] ^= i1;
              C2[2] ^= i22;
              C2[3] ^= i3;
              C2[4] ^= i0;
              C2[5] ^= i1;
              C2[6] ^= i22;
              C2[7] ^= i3;
              for (var i2 = 0; i2 < 4; i2++) {
                nextState.call(this);
              }
            }
          },
          _doProcessBlock: function(M, offset) {
            var X = this._X;
            nextState.call(this);
            S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
            S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
            S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
            S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
            for (var i2 = 0; i2 < 4; i2++) {
              S[i2] = (S[i2] << 8 | S[i2] >>> 24) & 16711935 | (S[i2] << 24 | S[i2] >>> 8) & 4278255360;
              M[offset + i2] ^= S[i2];
            }
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function nextState() {
          var X = this._X;
          var C2 = this._C;
          for (var i2 = 0; i2 < 8; i2++) {
            C_[i2] = C2[i2];
          }
          C2[0] = C2[0] + 1295307597 + this._b | 0;
          C2[1] = C2[1] + 3545052371 + (C2[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
          C2[2] = C2[2] + 886263092 + (C2[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
          C2[3] = C2[3] + 1295307597 + (C2[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
          C2[4] = C2[4] + 3545052371 + (C2[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
          C2[5] = C2[5] + 886263092 + (C2[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
          C2[6] = C2[6] + 1295307597 + (C2[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
          C2[7] = C2[7] + 3545052371 + (C2[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
          this._b = C2[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
          for (var i2 = 0; i2 < 8; i2++) {
            var gx = X[i2] + C2[i2];
            var ga = gx & 65535;
            var gb = gx >>> 16;
            var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
            var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
            G[i2] = gh ^ gl;
          }
          X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
          X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
          X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
          X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
          X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
          X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
          X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
          X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
        }
        C.Rabbit = StreamCipher._createHelper(Rabbit);
      })();
      return CryptoJS.Rabbit;
    });
  })(rabbit);
  return rabbit.exports;
}
var rabbitLegacy = { exports: {} };
var hasRequiredRabbitLegacy;
function requireRabbitLegacy() {
  if (hasRequiredRabbitLegacy) return rabbitLegacy.exports;
  hasRequiredRabbitLegacy = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo;
        var S = [];
        var C_ = [];
        var G = [];
        var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
          _doReset: function() {
            var K = this._key.words;
            var iv = this.cfg.iv;
            var X = this._X = [
              K[0],
              K[3] << 16 | K[2] >>> 16,
              K[1],
              K[0] << 16 | K[3] >>> 16,
              K[2],
              K[1] << 16 | K[0] >>> 16,
              K[3],
              K[2] << 16 | K[1] >>> 16
            ];
            var C2 = this._C = [
              K[2] << 16 | K[2] >>> 16,
              K[0] & 4294901760 | K[1] & 65535,
              K[3] << 16 | K[3] >>> 16,
              K[1] & 4294901760 | K[2] & 65535,
              K[0] << 16 | K[0] >>> 16,
              K[2] & 4294901760 | K[3] & 65535,
              K[1] << 16 | K[1] >>> 16,
              K[3] & 4294901760 | K[0] & 65535
            ];
            this._b = 0;
            for (var i2 = 0; i2 < 4; i2++) {
              nextState.call(this);
            }
            for (var i2 = 0; i2 < 8; i2++) {
              C2[i2] ^= X[i2 + 4 & 7];
            }
            if (iv) {
              var IV = iv.words;
              var IV_0 = IV[0];
              var IV_1 = IV[1];
              var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
              var i22 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
              var i1 = i0 >>> 16 | i22 & 4294901760;
              var i3 = i22 << 16 | i0 & 65535;
              C2[0] ^= i0;
              C2[1] ^= i1;
              C2[2] ^= i22;
              C2[3] ^= i3;
              C2[4] ^= i0;
              C2[5] ^= i1;
              C2[6] ^= i22;
              C2[7] ^= i3;
              for (var i2 = 0; i2 < 4; i2++) {
                nextState.call(this);
              }
            }
          },
          _doProcessBlock: function(M, offset) {
            var X = this._X;
            nextState.call(this);
            S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
            S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
            S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
            S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
            for (var i2 = 0; i2 < 4; i2++) {
              S[i2] = (S[i2] << 8 | S[i2] >>> 24) & 16711935 | (S[i2] << 24 | S[i2] >>> 8) & 4278255360;
              M[offset + i2] ^= S[i2];
            }
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function nextState() {
          var X = this._X;
          var C2 = this._C;
          for (var i2 = 0; i2 < 8; i2++) {
            C_[i2] = C2[i2];
          }
          C2[0] = C2[0] + 1295307597 + this._b | 0;
          C2[1] = C2[1] + 3545052371 + (C2[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
          C2[2] = C2[2] + 886263092 + (C2[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
          C2[3] = C2[3] + 1295307597 + (C2[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
          C2[4] = C2[4] + 3545052371 + (C2[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
          C2[5] = C2[5] + 886263092 + (C2[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
          C2[6] = C2[6] + 1295307597 + (C2[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
          C2[7] = C2[7] + 3545052371 + (C2[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
          this._b = C2[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
          for (var i2 = 0; i2 < 8; i2++) {
            var gx = X[i2] + C2[i2];
            var ga = gx & 65535;
            var gb = gx >>> 16;
            var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
            var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
            G[i2] = gh ^ gl;
          }
          X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
          X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
          X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
          X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
          X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
          X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
          X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
          X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
        }
        C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
      })();
      return CryptoJS.RabbitLegacy;
    });
  })(rabbitLegacy);
  return rabbitLegacy.exports;
}
var blowfish = { exports: {} };
var hasRequiredBlowfish;
function requireBlowfish() {
  if (hasRequiredBlowfish) return blowfish.exports;
  hasRequiredBlowfish = 1;
  (function(module, exports) {
    (function(root2, factory2, undef) {
      {
        module.exports = factory2(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo;
        const N = 16;
        const ORIG_P = [
          608135816,
          2242054355,
          320440878,
          57701188,
          2752067618,
          698298832,
          137296536,
          3964562569,
          1160258022,
          953160567,
          3193202383,
          887688300,
          3232508343,
          3380367581,
          1065670069,
          3041331479,
          2450970073,
          2306472731
        ];
        const ORIG_S = [
          [
            3509652390,
            2564797868,
            805139163,
            3491422135,
            3101798381,
            1780907670,
            3128725573,
            4046225305,
            614570311,
            3012652279,
            134345442,
            2240740374,
            1667834072,
            1901547113,
            2757295779,
            4103290238,
            227898511,
            1921955416,
            1904987480,
            2182433518,
            2069144605,
            3260701109,
            2620446009,
            720527379,
            3318853667,
            677414384,
            3393288472,
            3101374703,
            2390351024,
            1614419982,
            1822297739,
            2954791486,
            3608508353,
            3174124327,
            2024746970,
            1432378464,
            3864339955,
            2857741204,
            1464375394,
            1676153920,
            1439316330,
            715854006,
            3033291828,
            289532110,
            2706671279,
            2087905683,
            3018724369,
            1668267050,
            732546397,
            1947742710,
            3462151702,
            2609353502,
            2950085171,
            1814351708,
            2050118529,
            680887927,
            999245976,
            1800124847,
            3300911131,
            1713906067,
            1641548236,
            4213287313,
            1216130144,
            1575780402,
            4018429277,
            3917837745,
            3693486850,
            3949271944,
            596196993,
            3549867205,
            258830323,
            2213823033,
            772490370,
            2760122372,
            1774776394,
            2652871518,
            566650946,
            4142492826,
            1728879713,
            2882767088,
            1783734482,
            3629395816,
            2517608232,
            2874225571,
            1861159788,
            326777828,
            3124490320,
            2130389656,
            2716951837,
            967770486,
            1724537150,
            2185432712,
            2364442137,
            1164943284,
            2105845187,
            998989502,
            3765401048,
            2244026483,
            1075463327,
            1455516326,
            1322494562,
            910128902,
            469688178,
            1117454909,
            936433444,
            3490320968,
            3675253459,
            1240580251,
            122909385,
            2157517691,
            634681816,
            4142456567,
            3825094682,
            3061402683,
            2540495037,
            79693498,
            3249098678,
            1084186820,
            1583128258,
            426386531,
            1761308591,
            1047286709,
            322548459,
            995290223,
            1845252383,
            2603652396,
            3431023940,
            2942221577,
            3202600964,
            3727903485,
            1712269319,
            422464435,
            3234572375,
            1170764815,
            3523960633,
            3117677531,
            1434042557,
            442511882,
            3600875718,
            1076654713,
            1738483198,
            4213154764,
            2393238008,
            3677496056,
            1014306527,
            4251020053,
            793779912,
            2902807211,
            842905082,
            4246964064,
            1395751752,
            1040244610,
            2656851899,
            3396308128,
            445077038,
            3742853595,
            3577915638,
            679411651,
            2892444358,
            2354009459,
            1767581616,
            3150600392,
            3791627101,
            3102740896,
            284835224,
            4246832056,
            1258075500,
            768725851,
            2589189241,
            3069724005,
            3532540348,
            1274779536,
            3789419226,
            2764799539,
            1660621633,
            3471099624,
            4011903706,
            913787905,
            3497959166,
            737222580,
            2514213453,
            2928710040,
            3937242737,
            1804850592,
            3499020752,
            2949064160,
            2386320175,
            2390070455,
            2415321851,
            4061277028,
            2290661394,
            2416832540,
            1336762016,
            1754252060,
            3520065937,
            3014181293,
            791618072,
            3188594551,
            3933548030,
            2332172193,
            3852520463,
            3043980520,
            413987798,
            3465142937,
            3030929376,
            4245938359,
            2093235073,
            3534596313,
            375366246,
            2157278981,
            2479649556,
            555357303,
            3870105701,
            2008414854,
            3344188149,
            4221384143,
            3956125452,
            2067696032,
            3594591187,
            2921233993,
            2428461,
            544322398,
            577241275,
            1471733935,
            610547355,
            4027169054,
            1432588573,
            1507829418,
            2025931657,
            3646575487,
            545086370,
            48609733,
            2200306550,
            1653985193,
            298326376,
            1316178497,
            3007786442,
            2064951626,
            458293330,
            2589141269,
            3591329599,
            3164325604,
            727753846,
            2179363840,
            146436021,
            1461446943,
            4069977195,
            705550613,
            3059967265,
            3887724982,
            4281599278,
            3313849956,
            1404054877,
            2845806497,
            146425753,
            1854211946
          ],
          [
            1266315497,
            3048417604,
            3681880366,
            3289982499,
            290971e4,
            1235738493,
            2632868024,
            2414719590,
            3970600049,
            1771706367,
            1449415276,
            3266420449,
            422970021,
            1963543593,
            2690192192,
            3826793022,
            1062508698,
            1531092325,
            1804592342,
            2583117782,
            2714934279,
            4024971509,
            1294809318,
            4028980673,
            1289560198,
            2221992742,
            1669523910,
            35572830,
            157838143,
            1052438473,
            1016535060,
            1802137761,
            1753167236,
            1386275462,
            3080475397,
            2857371447,
            1040679964,
            2145300060,
            2390574316,
            1461121720,
            2956646967,
            4031777805,
            4028374788,
            33600511,
            2920084762,
            1018524850,
            629373528,
            3691585981,
            3515945977,
            2091462646,
            2486323059,
            586499841,
            988145025,
            935516892,
            3367335476,
            2599673255,
            2839830854,
            265290510,
            3972581182,
            2759138881,
            3795373465,
            1005194799,
            847297441,
            406762289,
            1314163512,
            1332590856,
            1866599683,
            4127851711,
            750260880,
            613907577,
            1450815602,
            3165620655,
            3734664991,
            3650291728,
            3012275730,
            3704569646,
            1427272223,
            778793252,
            1343938022,
            2676280711,
            2052605720,
            1946737175,
            3164576444,
            3914038668,
            3967478842,
            3682934266,
            1661551462,
            3294938066,
            4011595847,
            840292616,
            3712170807,
            616741398,
            312560963,
            711312465,
            1351876610,
            322626781,
            1910503582,
            271666773,
            2175563734,
            1594956187,
            70604529,
            3617834859,
            1007753275,
            1495573769,
            4069517037,
            2549218298,
            2663038764,
            504708206,
            2263041392,
            3941167025,
            2249088522,
            1514023603,
            1998579484,
            1312622330,
            694541497,
            2582060303,
            2151582166,
            1382467621,
            776784248,
            2618340202,
            3323268794,
            2497899128,
            2784771155,
            503983604,
            4076293799,
            907881277,
            423175695,
            432175456,
            1378068232,
            4145222326,
            3954048622,
            3938656102,
            3820766613,
            2793130115,
            2977904593,
            26017576,
            3274890735,
            3194772133,
            1700274565,
            1756076034,
            4006520079,
            3677328699,
            720338349,
            1533947780,
            354530856,
            688349552,
            3973924725,
            1637815568,
            332179504,
            3949051286,
            53804574,
            2852348879,
            3044236432,
            1282449977,
            3583942155,
            3416972820,
            4006381244,
            1617046695,
            2628476075,
            3002303598,
            1686838959,
            431878346,
            2686675385,
            1700445008,
            1080580658,
            1009431731,
            832498133,
            3223435511,
            2605976345,
            2271191193,
            2516031870,
            1648197032,
            4164389018,
            2548247927,
            300782431,
            375919233,
            238389289,
            3353747414,
            2531188641,
            2019080857,
            1475708069,
            455242339,
            2609103871,
            448939670,
            3451063019,
            1395535956,
            2413381860,
            1841049896,
            1491858159,
            885456874,
            4264095073,
            4001119347,
            1565136089,
            3898914787,
            1108368660,
            540939232,
            1173283510,
            2745871338,
            3681308437,
            4207628240,
            3343053890,
            4016749493,
            1699691293,
            1103962373,
            3625875870,
            2256883143,
            3830138730,
            1031889488,
            3479347698,
            1535977030,
            4236805024,
            3251091107,
            2132092099,
            1774941330,
            1199868427,
            1452454533,
            157007616,
            2904115357,
            342012276,
            595725824,
            1480756522,
            206960106,
            497939518,
            591360097,
            863170706,
            2375253569,
            3596610801,
            1814182875,
            2094937945,
            3421402208,
            1082520231,
            3463918190,
            2785509508,
            435703966,
            3908032597,
            1641649973,
            2842273706,
            3305899714,
            1510255612,
            2148256476,
            2655287854,
            3276092548,
            4258621189,
            236887753,
            3681803219,
            274041037,
            1734335097,
            3815195456,
            3317970021,
            1899903192,
            1026095262,
            4050517792,
            356393447,
            2410691914,
            3873677099,
            3682840055
          ],
          [
            3913112168,
            2491498743,
            4132185628,
            2489919796,
            1091903735,
            1979897079,
            3170134830,
            3567386728,
            3557303409,
            857797738,
            1136121015,
            1342202287,
            507115054,
            2535736646,
            337727348,
            3213592640,
            1301675037,
            2528481711,
            1895095763,
            1721773893,
            3216771564,
            62756741,
            2142006736,
            835421444,
            2531993523,
            1442658625,
            3659876326,
            2882144922,
            676362277,
            1392781812,
            170690266,
            3921047035,
            1759253602,
            3611846912,
            1745797284,
            664899054,
            1329594018,
            3901205900,
            3045908486,
            2062866102,
            2865634940,
            3543621612,
            3464012697,
            1080764994,
            553557557,
            3656615353,
            3996768171,
            991055499,
            499776247,
            1265440854,
            648242737,
            3940784050,
            980351604,
            3713745714,
            1749149687,
            3396870395,
            4211799374,
            3640570775,
            1161844396,
            3125318951,
            1431517754,
            545492359,
            4268468663,
            3499529547,
            1437099964,
            2702547544,
            3433638243,
            2581715763,
            2787789398,
            1060185593,
            1593081372,
            2418618748,
            4260947970,
            69676912,
            2159744348,
            86519011,
            2512459080,
            3838209314,
            1220612927,
            3339683548,
            133810670,
            1090789135,
            1078426020,
            1569222167,
            845107691,
            3583754449,
            4072456591,
            1091646820,
            628848692,
            1613405280,
            3757631651,
            526609435,
            236106946,
            48312990,
            2942717905,
            3402727701,
            1797494240,
            859738849,
            992217954,
            4005476642,
            2243076622,
            3870952857,
            3732016268,
            765654824,
            3490871365,
            2511836413,
            1685915746,
            3888969200,
            1414112111,
            2273134842,
            3281911079,
            4080962846,
            172450625,
            2569994100,
            980381355,
            4109958455,
            2819808352,
            2716589560,
            2568741196,
            3681446669,
            3329971472,
            1835478071,
            660984891,
            3704678404,
            4045999559,
            3422617507,
            3040415634,
            1762651403,
            1719377915,
            3470491036,
            2693910283,
            3642056355,
            3138596744,
            1364962596,
            2073328063,
            1983633131,
            926494387,
            3423689081,
            2150032023,
            4096667949,
            1749200295,
            3328846651,
            309677260,
            2016342300,
            1779581495,
            3079819751,
            111262694,
            1274766160,
            443224088,
            298511866,
            1025883608,
            3806446537,
            1145181785,
            168956806,
            3641502830,
            3584813610,
            1689216846,
            3666258015,
            3200248200,
            1692713982,
            2646376535,
            4042768518,
            1618508792,
            1610833997,
            3523052358,
            4130873264,
            2001055236,
            3610705100,
            2202168115,
            4028541809,
            2961195399,
            1006657119,
            2006996926,
            3186142756,
            1430667929,
            3210227297,
            1314452623,
            4074634658,
            4101304120,
            2273951170,
            1399257539,
            3367210612,
            3027628629,
            1190975929,
            2062231137,
            2333990788,
            2221543033,
            2438960610,
            1181637006,
            548689776,
            2362791313,
            3372408396,
            3104550113,
            3145860560,
            296247880,
            1970579870,
            3078560182,
            3769228297,
            1714227617,
            3291629107,
            3898220290,
            166772364,
            1251581989,
            493813264,
            448347421,
            195405023,
            2709975567,
            677966185,
            3703036547,
            1463355134,
            2715995803,
            1338867538,
            1343315457,
            2802222074,
            2684532164,
            233230375,
            2599980071,
            2000651841,
            3277868038,
            1638401717,
            4028070440,
            3237316320,
            6314154,
            819756386,
            300326615,
            590932579,
            1405279636,
            3267499572,
            3150704214,
            2428286686,
            3959192993,
            3461946742,
            1862657033,
            1266418056,
            963775037,
            2089974820,
            2263052895,
            1917689273,
            448879540,
            3550394620,
            3981727096,
            150775221,
            3627908307,
            1303187396,
            508620638,
            2975983352,
            2726630617,
            1817252668,
            1876281319,
            1457606340,
            908771278,
            3720792119,
            3617206836,
            2455994898,
            1729034894,
            1080033504
          ],
          [
            976866871,
            3556439503,
            2881648439,
            1522871579,
            1555064734,
            1336096578,
            3548522304,
            2579274686,
            3574697629,
            3205460757,
            3593280638,
            3338716283,
            3079412587,
            564236357,
            2993598910,
            1781952180,
            1464380207,
            3163844217,
            3332601554,
            1699332808,
            1393555694,
            1183702653,
            3581086237,
            1288719814,
            691649499,
            2847557200,
            2895455976,
            3193889540,
            2717570544,
            1781354906,
            1676643554,
            2592534050,
            3230253752,
            1126444790,
            2770207658,
            2633158820,
            2210423226,
            2615765581,
            2414155088,
            3127139286,
            673620729,
            2805611233,
            1269405062,
            4015350505,
            3341807571,
            4149409754,
            1057255273,
            2012875353,
            2162469141,
            2276492801,
            2601117357,
            993977747,
            3918593370,
            2654263191,
            753973209,
            36408145,
            2530585658,
            25011837,
            3520020182,
            2088578344,
            530523599,
            2918365339,
            1524020338,
            1518925132,
            3760827505,
            3759777254,
            1202760957,
            3985898139,
            3906192525,
            674977740,
            4174734889,
            2031300136,
            2019492241,
            3983892565,
            4153806404,
            3822280332,
            352677332,
            2297720250,
            60907813,
            90501309,
            3286998549,
            1016092578,
            2535922412,
            2839152426,
            457141659,
            509813237,
            4120667899,
            652014361,
            1966332200,
            2975202805,
            55981186,
            2327461051,
            676427537,
            3255491064,
            2882294119,
            3433927263,
            1307055953,
            942726286,
            933058658,
            2468411793,
            3933900994,
            4215176142,
            1361170020,
            2001714738,
            2830558078,
            3274259782,
            1222529897,
            1679025792,
            2729314320,
            3714953764,
            1770335741,
            151462246,
            3013232138,
            1682292957,
            1483529935,
            471910574,
            1539241949,
            458788160,
            3436315007,
            1807016891,
            3718408830,
            978976581,
            1043663428,
            3165965781,
            1927990952,
            4200891579,
            2372276910,
            3208408903,
            3533431907,
            1412390302,
            2931980059,
            4132332400,
            1947078029,
            3881505623,
            4168226417,
            2941484381,
            1077988104,
            1320477388,
            886195818,
            18198404,
            3786409e3,
            2509781533,
            112762804,
            3463356488,
            1866414978,
            891333506,
            18488651,
            661792760,
            1628790961,
            3885187036,
            3141171499,
            876946877,
            2693282273,
            1372485963,
            791857591,
            2686433993,
            3759982718,
            3167212022,
            3472953795,
            2716379847,
            445679433,
            3561995674,
            3504004811,
            3574258232,
            54117162,
            3331405415,
            2381918588,
            3769707343,
            4154350007,
            1140177722,
            4074052095,
            668550556,
            3214352940,
            367459370,
            261225585,
            2610173221,
            4209349473,
            3468074219,
            3265815641,
            314222801,
            3066103646,
            3808782860,
            282218597,
            3406013506,
            3773591054,
            379116347,
            1285071038,
            846784868,
            2669647154,
            3771962079,
            3550491691,
            2305946142,
            453669953,
            1268987020,
            3317592352,
            3279303384,
            3744833421,
            2610507566,
            3859509063,
            266596637,
            3847019092,
            517658769,
            3462560207,
            3443424879,
            370717030,
            4247526661,
            2224018117,
            4143653529,
            4112773975,
            2788324899,
            2477274417,
            1456262402,
            2901442914,
            1517677493,
            1846949527,
            2295493580,
            3734397586,
            2176403920,
            1280348187,
            1908823572,
            3871786941,
            846861322,
            1172426758,
            3287448474,
            3383383037,
            1655181056,
            3139813346,
            901632758,
            1897031941,
            2986607138,
            3066810236,
            3447102507,
            1393639104,
            373351379,
            950779232,
            625454576,
            3124240540,
            4148612726,
            2007998917,
            544563296,
            2244738638,
            2330496472,
            2058025392,
            1291430526,
            424198748,
            50039436,
            29584100,
            3605783033,
            2429876329,
            2791104160,
            1057563949,
            3255363231,
            3075367218,
            3463963227,
            1469046755,
            985887462
          ]
        ];
        var BLOWFISH_CTX = {
          pbox: [],
          sbox: []
        };
        function F(ctx, x) {
          let a = x >> 24 & 255;
          let b = x >> 16 & 255;
          let c = x >> 8 & 255;
          let d = x & 255;
          let y = ctx.sbox[0][a] + ctx.sbox[1][b];
          y = y ^ ctx.sbox[2][c];
          y = y + ctx.sbox[3][d];
          return y;
        }
        function BlowFish_Encrypt(ctx, left, right) {
          let Xl = left;
          let Xr = right;
          let temp;
          for (let i2 = 0; i2 < N; ++i2) {
            Xl = Xl ^ ctx.pbox[i2];
            Xr = F(ctx, Xl) ^ Xr;
            temp = Xl;
            Xl = Xr;
            Xr = temp;
          }
          temp = Xl;
          Xl = Xr;
          Xr = temp;
          Xr = Xr ^ ctx.pbox[N];
          Xl = Xl ^ ctx.pbox[N + 1];
          return { left: Xl, right: Xr };
        }
        function BlowFish_Decrypt(ctx, left, right) {
          let Xl = left;
          let Xr = right;
          let temp;
          for (let i2 = N + 1; i2 > 1; --i2) {
            Xl = Xl ^ ctx.pbox[i2];
            Xr = F(ctx, Xl) ^ Xr;
            temp = Xl;
            Xl = Xr;
            Xr = temp;
          }
          temp = Xl;
          Xl = Xr;
          Xr = temp;
          Xr = Xr ^ ctx.pbox[1];
          Xl = Xl ^ ctx.pbox[0];
          return { left: Xl, right: Xr };
        }
        function BlowFishInit(ctx, key, keysize) {
          for (let Row = 0; Row < 4; Row++) {
            ctx.sbox[Row] = [];
            for (let Col = 0; Col < 256; Col++) {
              ctx.sbox[Row][Col] = ORIG_S[Row][Col];
            }
          }
          let keyIndex = 0;
          for (let index = 0; index < N + 2; index++) {
            ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
            keyIndex++;
            if (keyIndex >= keysize) {
              keyIndex = 0;
            }
          }
          let Data1 = 0;
          let Data2 = 0;
          let res = 0;
          for (let i2 = 0; i2 < N + 2; i2 += 2) {
            res = BlowFish_Encrypt(ctx, Data1, Data2);
            Data1 = res.left;
            Data2 = res.right;
            ctx.pbox[i2] = Data1;
            ctx.pbox[i2 + 1] = Data2;
          }
          for (let i2 = 0; i2 < 4; i2++) {
            for (let j = 0; j < 256; j += 2) {
              res = BlowFish_Encrypt(ctx, Data1, Data2);
              Data1 = res.left;
              Data2 = res.right;
              ctx.sbox[i2][j] = Data1;
              ctx.sbox[i2][j + 1] = Data2;
            }
          }
          return true;
        }
        var Blowfish = C_algo.Blowfish = BlockCipher.extend({
          _doReset: function() {
            if (this._keyPriorReset === this._key) {
              return;
            }
            var key = this._keyPriorReset = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4;
            BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
          },
          encryptBlock: function(M, offset) {
            var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
            M[offset] = res.left;
            M[offset + 1] = res.right;
          },
          decryptBlock: function(M, offset) {
            var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
            M[offset] = res.left;
            M[offset + 1] = res.right;
          },
          blockSize: 64 / 32,
          keySize: 128 / 32,
          ivSize: 64 / 32
        });
        C.Blowfish = BlockCipher._createHelper(Blowfish);
      })();
      return CryptoJS.Blowfish;
    });
  })(blowfish);
  return blowfish.exports;
}
(function(module, exports) {
  (function(root2, factory2, undef) {
    {
      module.exports = factory2(requireCore(), requireX64Core(), requireLibTypedarrays(), requireEncUtf16(), requireEncBase64(), requireEncBase64url(), requireMd5(), requireSha1(), sha256Exports, requireSha224(), requireSha512(), requireSha384(), requireSha3(), requireRipemd160(), requireHmac(), requirePbkdf2(), requireEvpkdf(), requireCipherCore(), requireModeCfb(), requireModeCtr(), requireModeCtrGladman(), requireModeOfb(), requireModeEcb(), requirePadAnsix923(), requirePadIso10126(), requirePadIso97971(), requirePadZeropadding(), requirePadNopadding(), requireFormatHex(), requireAes(), requireTripledes(), requireRc4(), requireRabbit(), requireRabbitLegacy(), requireBlowfish());
    }
  })(commonjsGlobal, function(CryptoJS) {
    return CryptoJS;
  });
})(cryptoJs);
var cryptoJsExports = cryptoJs.exports;
var __importDefault$3 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod2) {
  return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
};
Object.defineProperty(Base$1, "__esModule", { value: true });
Base$1.Base = void 0;
const buffer_1$2 = buffer;
const crypto_js_1 = __importDefault$3(cryptoJsExports);
class Base {
  /**
   * print
   * @desc Prints out a visual representation of the merkle tree.
   * @example
   *```js
   *tree.print()
   *```
   */
  print() {
    Base.print(this);
  }
  /**
   * bufferIndexOf
   * @desc Returns the first index of which given buffer is found in array.
   * @param {Buffer[]} haystack - Array of buffers.
   * @param {Buffer} needle - Buffer to find.
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.bufferIndexOf(haystack, needle)
   *```
   */
  bufferIndexOf(array, element, isSorted = false) {
    if (isSorted) {
      return this.binarySearch(array, element, buffer_1$2.Buffer.compare);
    }
    const eqChecker = (buffer1, buffer2) => buffer1.equals(buffer2);
    return this.linearSearch(array, element, eqChecker);
  }
  /**
   * binarySearch
   * @desc Returns the first index of which given item is found in array using binary search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} compareFunction
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = MerkleTree.binarySearch(array, element, Buffer.compare)
   *```
   */
  static binarySearch(array, element, compareFunction) {
    let start = 0;
    let end2 = array.length - 1;
    while (start <= end2) {
      const mid = Math.floor((start + end2) / 2);
      const ordering = compareFunction(array[mid], element);
      if (ordering === 0) {
        for (let i2 = mid - 1; i2 >= 0; i2--) {
          if (compareFunction(array[i2], element) === 0)
            continue;
          return i2 + 1;
        }
        return 0;
      } else if (ordering < 0) {
        start = mid + 1;
      } else {
        end2 = mid - 1;
      }
    }
    return -1;
  }
  /**
   * binarySearch
   * @desc Returns the first index of which given item is found in array using binary search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} compareFunction
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.binarySearch(array, element, Buffer.compare)
   *```
   */
  binarySearch(array, element, compareFunction) {
    return Base.binarySearch(array, element, compareFunction);
  }
  /**
   * linearSearch
   * @desc Returns the first index of which given item is found in array using linear search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} eqChecker
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = MerkleTree.linearSearch(array, element, (a, b) => a === b)
   *```
   */
  static linearSearch(array, element, eqChecker) {
    for (let i2 = 0; i2 < array.length; i2++) {
      if (eqChecker(array[i2], element)) {
        return i2;
      }
    }
    return -1;
  }
  /**
   * linearSearch
   * @desc Returns the first index of which given item is found in array using linear search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} eqChecker
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.linearSearch(array, element, (a, b) => a === b)
   *```
   */
  linearSearch(array, element, eqChecker) {
    return Base.linearSearch(array, element, eqChecker);
  }
  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Object|Buffer|ArrayBuffer} value
   * @return {Buffer}
   *
   * @example
   * ```js
   *const buf = MerkleTree.bufferify('0x1234')
   *```
   */
  static bufferify(value) {
    if (!buffer_1$2.Buffer.isBuffer(value)) {
      if (typeof value === "object" && value.words) {
        return buffer_1$2.Buffer.from(value.toString(crypto_js_1.default.enc.Hex), "hex");
      } else if (Base.isHexString(value)) {
        return buffer_1$2.Buffer.from(value.replace(/^0x/, ""), "hex");
      } else if (typeof value === "string") {
        return buffer_1$2.Buffer.from(value);
      } else if (typeof value === "bigint") {
        return buffer_1$2.Buffer.from(value.toString(16), "hex");
      } else if (value instanceof Uint8Array) {
        return buffer_1$2.Buffer.from(value.buffer);
      } else if (typeof value === "number") {
        let s = value.toString();
        if (s.length % 2) {
          s = `0${s}`;
        }
        return buffer_1$2.Buffer.from(s, "hex");
      } else if (ArrayBuffer.isView(value)) {
        return buffer_1$2.Buffer.from(value.buffer, value.byteOffset, value.byteLength);
      }
    }
    return value;
  }
  bigNumberify(value) {
    return Base.bigNumberify(value);
  }
  static bigNumberify(value) {
    if (typeof value === "bigint") {
      return value;
    }
    if (typeof value === "string") {
      if (value.startsWith("0x") && Base.isHexString(value)) {
        return BigInt("0x" + value.replace("0x", "").toString());
      }
      return BigInt(value);
    }
    if (buffer_1$2.Buffer.isBuffer(value)) {
      return BigInt("0x" + value.toString("hex"));
    }
    if (value instanceof Uint8Array) {
      return BigInt(value);
    }
    if (typeof value === "number") {
      return BigInt(value);
    }
    throw new Error("cannot bigNumberify");
  }
  /**
   * isHexString
   * @desc Returns true if value is a hex string.
   * @param {String} value
   * @return {Boolean}
   *
   * @example
   * ```js
   *console.log(MerkleTree.isHexString('0x1234'))
   *```
   */
  static isHexString(v) {
    return typeof v === "string" && /^(0x)?[0-9A-Fa-f]*$/.test(v);
  }
  /**
   * print
   * @desc Prints out a visual representation of the given merkle tree.
   * @param {Object} tree - Merkle tree instance.
   * @return {String}
   * @example
   *```js
   *MerkleTree.print(tree)
   *```
   */
  static print(tree) {
    console.log(tree.toString());
  }
  /**
   * bufferToHex
   * @desc Returns a hex string with 0x prefix for given buffer.
   * @param {Buffer} value
   * @return {String}
   * @example
   *```js
   *const hexStr = tree.bufferToHex(Buffer.from('A'))
   *```
   */
  bufferToHex(value, withPrefix = true) {
    return Base.bufferToHex(value, withPrefix);
  }
  /**
   * bufferToHex
   * @desc Returns a hex string with 0x prefix for given buffer.
   * @param {Buffer} value
   * @return {String}
   * @example
   *```js
   *const hexStr = MerkleTree.bufferToHex(Buffer.from('A'))
   *```
   */
  static bufferToHex(value, withPrefix = true) {
    return `${withPrefix ? "0x" : ""}${(value || buffer_1$2.Buffer.alloc(0)).toString("hex")}`;
  }
  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Object|Buffer} value
   * @return {Buffer}
   *
   * @example
   * ```js
   *const buf = tree.bufferify('0x1234')
   *```
   */
  bufferify(value) {
    return Base.bufferify(value);
  }
  /**
   * bufferifyFn
   * @desc Returns a function that will bufferify the return value.
   * @param {Function}
   * @return {Function}
   *
   * @example
   * ```js
   *const fn = tree.bufferifyFn((value) => sha256(value))
   *```
   */
  bufferifyFn(f) {
    return (value) => {
      const v = f(value);
      if (buffer_1$2.Buffer.isBuffer(v)) {
        return v;
      }
      if (this.isHexString(v)) {
        return buffer_1$2.Buffer.from(v.replace("0x", ""), "hex");
      }
      if (typeof v === "string") {
        return buffer_1$2.Buffer.from(v);
      }
      if (typeof v === "bigint") {
        return buffer_1$2.Buffer.from(value.toString(16), "hex");
      }
      if (ArrayBuffer.isView(v)) {
        return buffer_1$2.Buffer.from(v.buffer, v.byteOffset, v.byteLength);
      }
      return buffer_1$2.Buffer.from(f(crypto_js_1.default.enc.Hex.parse(value.toString("hex"))).toString(crypto_js_1.default.enc.Hex), "hex");
    };
  }
  /**
   * isHexString
   * @desc Returns true if value is a hex string.
   * @param {String} value
   * @return {Boolean}
   *
   * @example
   * ```js
   *console.log(MerkleTree.isHexString('0x1234'))
   *```
   */
  isHexString(value) {
    return Base.isHexString(value);
  }
  /**
   * log2
   * @desc Returns the log2 of number.
   * @param {Number} value
   * @return {Number}
   */
  log2(n) {
    return n === 1 ? 0 : 1 + this.log2(n / 2 | 0);
  }
  /**
   * zip
   * @desc Returns true if value is a hex string.
   * @param {String[]|Number[]|Buffer[]} a - first array
   * @param {String[]|Number[]|Buffer[]} b -  second array
   * @return {String[][]|Number[][]|Buffer[][]}
   *
   * @example
   * ```js
   *const zipped = tree.zip(['a', 'b'],['A', 'B'])
   *console.log(zipped) // [ [ 'a', 'A' ], [ 'b', 'B' ] ]
   *```
   */
  zip(a, b) {
    return a.map((e, i2) => [e, b[i2]]);
  }
  static hexZeroPad(hexStr, length) {
    return "0x" + hexStr.replace("0x", "").padStart(length, "0");
  }
}
Base$1.Base = Base;
Base$1.default = Base;
var __importDefault$2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod2) {
  return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
};
Object.defineProperty(MerkleTree$1, "__esModule", { value: true });
MerkleTree$1.MerkleTree = void 0;
const buffer_1$1 = buffer;
const buffer_reverse_1 = __importDefault$2(bufferReverse);
const sha256_1$1 = __importDefault$2(sha256Exports);
const treeify_1$1 = __importDefault$2(treeifyExports);
const Base_1$3 = __importDefault$2(Base$1);
class MerkleTree extends Base_1$3.default {
  /**
   * @desc Constructs a Merkle Tree.
   * All nodes and leaves are stored as Buffers.
   * Lonely leaf nodes are promoted to the next level up without being hashed again.
   * @param {Buffer[]} leaves - Array of hashed leaves. Each leaf must be a Buffer.
   * @param {Function} hashFunction - Hash function to use for hashing leaves and nodes
   * @param {Object} options - Additional options
   * @example
   *```js
   *const MerkleTree = require('merkletreejs')
   *const crypto = require('crypto')
   *
   *function sha256(data) {
   *  // returns Buffer
   *  return crypto.createHash('sha256').update(data).digest()
   *}
   *
   *const leaves = ['a', 'b', 'c'].map(value => keccak(value))
   *
   *const tree = new MerkleTree(leaves, sha256)
   *```
   */
  constructor(leaves, hashFn = sha256_1$1.default, options = {}) {
    super();
    this.duplicateOdd = false;
    this.concatenator = buffer_1$1.Buffer.concat;
    this.hashLeaves = false;
    this.isBitcoinTree = false;
    this.leaves = [];
    this.layers = [];
    this.sortLeaves = false;
    this.sortPairs = false;
    this.sort = false;
    this.fillDefaultHash = null;
    this.complete = false;
    if (options.complete) {
      if (options.isBitcoinTree) {
        throw new Error('option "complete" is incompatible with "isBitcoinTree"');
      }
      if (options.duplicateOdd) {
        throw new Error('option "complete" is incompatible with "duplicateOdd"');
      }
    }
    this.isBitcoinTree = !!options.isBitcoinTree;
    this.hashLeaves = !!options.hashLeaves;
    this.sortLeaves = !!options.sortLeaves;
    this.sortPairs = !!options.sortPairs;
    this.complete = !!options.complete;
    if (options.fillDefaultHash) {
      if (typeof options.fillDefaultHash === "function") {
        this.fillDefaultHash = options.fillDefaultHash;
      } else if (buffer_1$1.Buffer.isBuffer(options.fillDefaultHash) || typeof options.fillDefaultHash === "string") {
        this.fillDefaultHash = (idx, hashFn2) => options.fillDefaultHash;
      } else {
        throw new Error('method "fillDefaultHash" must be a function, Buffer, or string');
      }
    }
    this.sort = !!options.sort;
    if (this.sort) {
      this.sortLeaves = true;
      this.sortPairs = true;
    }
    this.duplicateOdd = !!options.duplicateOdd;
    if (options.concatenator) {
      this.concatenator = options.concatenator;
    }
    this.hashFn = this.bufferifyFn(hashFn);
    this.processLeaves(leaves);
  }
  getOptions() {
    var _a, _b;
    return {
      complete: this.complete,
      isBitcoinTree: this.isBitcoinTree,
      hashLeaves: this.hashLeaves,
      sortLeaves: this.sortLeaves,
      sortPairs: this.sortPairs,
      sort: this.sort,
      fillDefaultHash: (_b = (_a = this.fillDefaultHash) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null,
      duplicateOdd: this.duplicateOdd
    };
  }
  processLeaves(leaves) {
    if (this.hashLeaves) {
      leaves = leaves.map(this.hashFn);
    }
    this.leaves = leaves.map(this.bufferify);
    if (this.sortLeaves) {
      this.leaves = this.leaves.sort(buffer_1$1.Buffer.compare);
    }
    if (this.fillDefaultHash) {
      for (let i2 = this.leaves.length; i2 < Math.pow(2, Math.ceil(Math.log2(this.leaves.length))); i2++) {
        this.leaves.push(this.bufferify(this.fillDefaultHash(i2, this.hashFn)));
      }
    }
    this.createHashes(this.leaves);
  }
  createHashes(nodes) {
    this.layers = [nodes];
    while (nodes.length > 1) {
      const layerIndex = this.layers.length;
      this.layers.push([]);
      const layerLimit = this.complete && layerIndex === 1 && !Number.isInteger(Math.log2(nodes.length)) ? 2 * nodes.length - Math.pow(2, Math.ceil(Math.log2(nodes.length))) : nodes.length;
      for (let i2 = 0; i2 < nodes.length; i2 += 2) {
        if (i2 >= layerLimit) {
          this.layers[layerIndex].push(...nodes.slice(layerLimit));
          break;
        } else if (i2 + 1 === nodes.length) {
          if (nodes.length % 2 === 1) {
            const data = nodes[nodes.length - 1];
            let hash3 = data;
            if (this.isBitcoinTree) {
              hash3 = this.hashFn(this.concatenator([buffer_reverse_1.default(data), buffer_reverse_1.default(data)]));
              hash3 = buffer_reverse_1.default(this.hashFn(hash3));
              this.layers[layerIndex].push(hash3);
              continue;
            } else {
              if (this.duplicateOdd) ;
              else {
                this.layers[layerIndex].push(nodes[i2]);
                continue;
              }
            }
          }
        }
        const left = nodes[i2];
        const right = i2 + 1 === nodes.length ? left : nodes[i2 + 1];
        let combined = null;
        if (this.isBitcoinTree) {
          combined = [buffer_reverse_1.default(left), buffer_reverse_1.default(right)];
        } else {
          combined = [left, right];
        }
        if (this.sortPairs) {
          combined.sort(buffer_1$1.Buffer.compare);
        }
        let hash2 = this.hashFn(this.concatenator(combined));
        if (this.isBitcoinTree) {
          hash2 = buffer_reverse_1.default(this.hashFn(hash2));
        }
        this.layers[layerIndex].push(hash2);
      }
      nodes = this.layers[layerIndex];
    }
  }
  /**
   * addLeaf
   * @desc Adds a leaf to the tree and re-calculates layers.
   * @param {String|Buffer} - Leaf
   * @param {Boolean} - Set to true if the leaf should be hashed before being added to tree.
   * @example
   *```js
   *tree.addLeaf(newLeaf)
   *```
   */
  addLeaf(leaf, shouldHash = false) {
    if (shouldHash) {
      leaf = this.hashFn(leaf);
    }
    this.processLeaves(this.leaves.concat(leaf));
  }
  /**
   * addLeaves
   * @desc Adds multiple leaves to the tree and re-calculates layers.
   * @param {String[]|Buffer[]} - Array of leaves
   * @param {Boolean} - Set to true if the leaves should be hashed before being added to tree.
   * @example
   *```js
   *tree.addLeaves(newLeaves)
   *```
   */
  addLeaves(leaves, shouldHash = false) {
    if (shouldHash) {
      leaves = leaves.map(this.hashFn);
    }
    this.processLeaves(this.leaves.concat(leaves));
  }
  /**
   * getLeaves
   * @desc Returns array of leaves of Merkle Tree.
   * @return {Buffer[]}
   * @example
   *```js
   *const leaves = tree.getLeaves()
   *```
   */
  getLeaves(values) {
    if (Array.isArray(values)) {
      if (this.hashLeaves) {
        values = values.map(this.hashFn);
        if (this.sortLeaves) {
          values = values.sort(buffer_1$1.Buffer.compare);
        }
      }
      return this.leaves.filter((leaf) => this.bufferIndexOf(values, leaf, this.sortLeaves) !== -1);
    }
    return this.leaves;
  }
  /**
   * getLeaf
   * @desc Returns the leaf at the given index.
   * @param {Number} - Index number
   * @return {Buffer}
   * @example
   *```js
   *const leaf = tree.getLeaf(1)
   *```
   */
  getLeaf(index) {
    if (index < 0 || index > this.leaves.length - 1) {
      return buffer_1$1.Buffer.from([]);
    }
    return this.leaves[index];
  }
  /**
   * getLeafIndex
   * @desc Returns the index of the given leaf, or -1 if the leaf is not found.
   * @param {String|Buffer} - Target leaf
   * @return {number}
   * @example
   *```js
   *const leaf = Buffer.from('abc')
   *const index = tree.getLeafIndex(leaf)
   *```
   */
  getLeafIndex(target) {
    target = this.bufferify(target);
    const leaves = this.getLeaves();
    for (let i2 = 0; i2 < leaves.length; i2++) {
      const leaf = leaves[i2];
      if (leaf.equals(target)) {
        return i2;
      }
    }
    return -1;
  }
  /**
   * getLeafCount
   * @desc Returns the total number of leaves.
   * @return {number}
   * @example
   *```js
   *const count = tree.getLeafCount()
   *```
   */
  getLeafCount() {
    return this.leaves.length;
  }
  /**
   * getHexLeaves
   * @desc Returns array of leaves of Merkle Tree as hex strings.
   * @return {String[]}
   * @example
   *```js
   *const leaves = tree.getHexLeaves()
   *```
   */
  getHexLeaves() {
    return this.leaves.map((leaf) => this.bufferToHex(leaf));
  }
  /**
   * marshalLeaves
   * @desc Returns array of leaves of Merkle Tree as a JSON string.
   * @param {String[]|Buffer[]} - Merkle tree leaves
   * @return {String} - List of leaves as JSON string
   * @example
   *```js
   *const jsonStr = MerkleTree.marshalLeaves(leaves)
   *```
   */
  static marshalLeaves(leaves) {
    return JSON.stringify(leaves.map((leaf) => MerkleTree.bufferToHex(leaf)), null, 2);
  }
  /**
   * unmarshalLeaves
   * @desc Returns array of leaves of Merkle Tree as a Buffers.
   * @param {String|Object} - JSON stringified leaves
   * @return {Buffer[]} - Unmarshalled list of leaves
   * @example
   *```js
   *const leaves = MerkleTree.unmarshalLeaves(jsonStr)
   *```
   */
  static unmarshalLeaves(jsonStr) {
    let parsed = null;
    if (typeof jsonStr === "string") {
      parsed = JSON.parse(jsonStr);
    } else if (jsonStr instanceof Object) {
      parsed = jsonStr;
    } else {
      throw new Error("Expected type of string or object");
    }
    if (!parsed) {
      return [];
    }
    if (!Array.isArray(parsed)) {
      throw new Error("Expected JSON string to be array");
    }
    return parsed.map(MerkleTree.bufferify);
  }
  /**
   * getLayers
   * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root.
   * @return {Buffer[][]}
   * @example
   *```js
   *const layers = tree.getLayers()
   *```
   */
  getLayers() {
    return this.layers;
  }
  /**
   * getHexLayers
   * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root as hex strings.
   * @return {String[][]}
   * @example
   *```js
   *const layers = tree.getHexLayers()
   *```
   */
  getHexLayers() {
    return this.layers.reduce((acc, item) => {
      if (Array.isArray(item)) {
        acc.push(item.map((layer) => this.bufferToHex(layer)));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
  }
  /**
   * getLayersFlat
   * @desc Returns single flat array of all layers of Merkle Tree, including leaves and root.
   * @return {Buffer[]}
   * @example
   *```js
   *const layers = tree.getLayersFlat()
   *```
   */
  getLayersFlat() {
    const layers = this.layers.reduce((acc, item) => {
      if (Array.isArray(item)) {
        acc.unshift(...item);
      } else {
        acc.unshift(item);
      }
      return acc;
    }, []);
    layers.unshift(buffer_1$1.Buffer.from([0]));
    return layers;
  }
  /**
   * getHexLayersFlat
   * @desc Returns single flat array of all layers of Merkle Tree, including leaves and root as hex string.
   * @return {String[]}
   * @example
   *```js
   *const layers = tree.getHexLayersFlat()
   *```
   */
  getHexLayersFlat() {
    return this.getLayersFlat().map((layer) => this.bufferToHex(layer));
  }
  /**
   * getLayerCount
   * @desc Returns the total number of layers.
   * @return {number}
   * @example
   *```js
   *const count = tree.getLayerCount()
   *```
   */
  getLayerCount() {
    return this.getLayers().length;
  }
  /**
   * getRoot
   * @desc Returns the Merkle root hash as a Buffer.
   * @return {Buffer}
   * @example
   *```js
   *const root = tree.getRoot()
   *```
   */
  getRoot() {
    if (this.layers.length === 0) {
      return buffer_1$1.Buffer.from([]);
    }
    return this.layers[this.layers.length - 1][0] || buffer_1$1.Buffer.from([]);
  }
  /**
   * getHexRoot
   * @desc Returns the Merkle root hash as a hex string.
   * @return {String}
   * @example
   *```js
   *const root = tree.getHexRoot()
   *```
   */
  getHexRoot() {
    return this.bufferToHex(this.getRoot());
  }
  /**
   * getProof
   * @desc Returns the proof for a target leaf.
   * @param {Buffer} leaf - Target leaf
   * @param {Number} [index] - Target leaf index in leaves array.
   * Use if there are leaves containing duplicate data in order to distinguish it.
   * @return {Object[]} - Array of objects containing a position property of type string
   * with values of 'left' or 'right' and a data property of type Buffer.
   * @example
   * ```js
   *const proof = tree.getProof(leaves[2])
   *```
   *
   * @example
   *```js
   *const leaves = ['a', 'b', 'a'].map(value => keccak(value))
   *const tree = new MerkleTree(leaves, keccak)
   *const proof = tree.getProof(leaves[2], 2)
   *```
   */
  getProof(leaf, index) {
    if (typeof leaf === "undefined") {
      throw new Error("leaf is required");
    }
    leaf = this.bufferify(leaf);
    const proof = [];
    if (!Number.isInteger(index)) {
      index = -1;
      for (let i2 = 0; i2 < this.leaves.length; i2++) {
        if (buffer_1$1.Buffer.compare(leaf, this.leaves[i2]) === 0) {
          index = i2;
        }
      }
    }
    if (index <= -1) {
      return [];
    }
    for (let i2 = 0; i2 < this.layers.length; i2++) {
      const layer = this.layers[i2];
      const isRightNode = index % 2;
      const pairIndex = isRightNode ? index - 1 : this.isBitcoinTree && index === layer.length - 1 && i2 < this.layers.length - 1 ? index : index + 1;
      if (pairIndex < layer.length) {
        proof.push({
          position: isRightNode ? "left" : "right",
          data: layer[pairIndex]
        });
      }
      index = index / 2 | 0;
    }
    return proof;
  }
  /**
   * getHexProof
   * @desc Returns the proof for a target leaf as hex strings.
   * @param {Buffer} leaf - Target leaf
   * @param {Number} [index] - Target leaf index in leaves array.
   * Use if there are leaves containing duplicate data in order to distinguish it.
   * @return {String[]} - Proof array as hex strings.
   * @example
   * ```js
   *const proof = tree.getHexProof(leaves[2])
   *```
   */
  getHexProof(leaf, index) {
    return this.getProof(leaf, index).map((item) => this.bufferToHex(item.data));
  }
  /**
   * getProofs
   * @desc Returns the proofs for all leaves.
   * @return {Object[]} - Array of objects containing a position property of type string
   * with values of 'left' or 'right' and a data property of type Buffer for all leaves.
   * @example
   * ```js
   *const proofs = tree.getProofs()
   *```
   *
   * @example
   *```js
   *const leaves = ['a', 'b', 'a'].map(value => keccak(value))
   *const tree = new MerkleTree(leaves, keccak)
   *const proofs = tree.getProofs()
   *```
   */
  getProofs() {
    const proof = [];
    const proofs = [];
    this.getProofsDFS(this.layers.length - 1, 0, proof, proofs);
    return proofs;
  }
  /**
   * getProofsDFS
   * @desc Get all proofs through single traverse
   * @param {Number} currentLayer - Current layer index in traverse.
   * @param {Number} index - Current tarvese node index in traverse.
   * @param {Object[]} proof - Proof chain for single leaf.
   * @param {Object[]} proofs - Proofs for all leaves
   * @example
   * ```js
   *const layers = tree.getLayers()
   *const index = 0;
   *let proof = [];
   *let proofs = [];
   *const proof = tree.getProofsDFS(layers, index, proof, proofs)
   *```
   */
  getProofsDFS(currentLayer, index, proof, proofs) {
    const isRightNode = index % 2;
    if (currentLayer === -1) {
      if (!isRightNode)
        proofs.push([...proof].reverse());
      return;
    }
    if (index >= this.layers[currentLayer].length)
      return;
    const layer = this.layers[currentLayer];
    const pairIndex = isRightNode ? index - 1 : index + 1;
    let pushed = false;
    if (pairIndex < layer.length) {
      pushed = true;
      proof.push({
        position: isRightNode ? "left" : "right",
        data: layer[pairIndex]
      });
    }
    const leftchildIndex = index * 2;
    const rightchildIndex = index * 2 + 1;
    this.getProofsDFS(currentLayer - 1, leftchildIndex, proof, proofs);
    this.getProofsDFS(currentLayer - 1, rightchildIndex, proof, proofs);
    if (pushed)
      proof.splice(proof.length - 1, 1);
  }
  /**
   * getHexProofs
   * @desc Returns the proofs for all leaves as hex strings.
   * @return {String[]} - Proofs array as hex strings.
   * @example
   * ```js
   *const proofs = tree.getHexProofs()
   *```
   */
  getHexProofs() {
    return this.getProofs().map((item) => this.bufferToHex(item.data));
  }
  /**
  * getPositionalHexProof
  * @desc Returns the proof for a target leaf as hex strings and the position in binary (left == 0).
  * @param {Buffer} leaf - Target leaf
  * @param {Number} [index] - Target leaf index in leaves array.
  * Use if there are leaves containing duplicate data in order to distinguish it.
  * @return {(string | number)[][]} - Proof array as hex strings. position at index 0
  * @example
  * ```js
  *const proof = tree.getPositionalHexProof(leaves[2])
  *```
  */
  getPositionalHexProof(leaf, index) {
    return this.getProof(leaf, index).map((item) => {
      return [
        item.position === "left" ? 0 : 1,
        this.bufferToHex(item.data)
      ];
    });
  }
  /**
   * marshalProof
   * @desc Returns proof array as JSON string.
   * @param {String[]|Object[]} proof - Merkle tree proof array
   * @return {String} - Proof array as JSON string.
   * @example
   * ```js
   *const jsonStr = MerkleTree.marshalProof(proof)
   *```
   */
  static marshalProof(proof) {
    const json = proof.map((item) => {
      if (typeof item === "string") {
        return item;
      }
      if (buffer_1$1.Buffer.isBuffer(item)) {
        return MerkleTree.bufferToHex(item);
      }
      return {
        position: item.position,
        data: MerkleTree.bufferToHex(item.data)
      };
    });
    return JSON.stringify(json, null, 2);
  }
  /**
   * unmarshalProof
   * @desc Returns the proof for a target leaf as a list of Buffers.
   * @param {String|Object} - Merkle tree leaves
   * @return {String|Object} - Marshalled proof
   * @example
   * ```js
   *const proof = MerkleTree.unmarshalProof(jsonStr)
   *```
   */
  static unmarshalProof(jsonStr) {
    let parsed = null;
    if (typeof jsonStr === "string") {
      parsed = JSON.parse(jsonStr);
    } else if (jsonStr instanceof Object) {
      parsed = jsonStr;
    } else {
      throw new Error("Expected type of string or object");
    }
    if (!parsed) {
      return [];
    }
    if (!Array.isArray(parsed)) {
      throw new Error("Expected JSON string to be array");
    }
    return parsed.map((item) => {
      if (typeof item === "string") {
        return MerkleTree.bufferify(item);
      } else if (item instanceof Object) {
        return {
          position: item.position,
          data: MerkleTree.bufferify(item.data)
        };
      } else {
        throw new Error("Expected item to be of type string or object");
      }
    });
  }
  static marshalTree(tree) {
    const root2 = tree.getHexRoot();
    const leaves = tree.leaves.map((leaf) => MerkleTree.bufferToHex(leaf));
    const layers = tree.getHexLayers();
    const options = tree.getOptions();
    return JSON.stringify({
      options,
      root: root2,
      layers,
      leaves
    }, null, 2);
  }
  static unmarshalTree(jsonStr, hashFn = sha256_1$1.default, options = {}) {
    let parsed = null;
    if (typeof jsonStr === "string") {
      parsed = JSON.parse(jsonStr);
    } else if (jsonStr instanceof Object) {
      parsed = jsonStr;
    } else {
      throw new Error("Expected type of string or object");
    }
    if (!parsed) {
      throw new Error("could not parse json");
    }
    options = Object.assign({}, parsed.options || {}, options);
    return new MerkleTree(parsed.leaves, hashFn, options);
  }
  /**
   * getProofIndices
   * @desc Returns the proof indices for given tree indices.
   * @param {Number[]} treeIndices - Tree indices
   * @param {Number} depth - Tree depth; number of layers.
   * @return {Number[]} - Proof indices
   * @example
   * ```js
   *const proofIndices = tree.getProofIndices([2,5,6], 4)
   *console.log(proofIndices) // [ 23, 20, 19, 8, 3 ]
   *```
   */
  getProofIndices(treeIndices, depth) {
    const leafCount = Math.pow(2, depth);
    let maximalIndices = /* @__PURE__ */ new Set();
    for (const index of treeIndices) {
      let x = leafCount + index;
      while (x > 1) {
        maximalIndices.add(x ^ 1);
        x = x / 2 | 0;
      }
    }
    const a = treeIndices.map((index) => leafCount + index);
    const b = Array.from(maximalIndices).sort((a2, b2) => a2 - b2).reverse();
    maximalIndices = a.concat(b);
    const redundantIndices = /* @__PURE__ */ new Set();
    const proof = [];
    for (let index of maximalIndices) {
      if (!redundantIndices.has(index)) {
        proof.push(index);
        while (index > 1) {
          redundantIndices.add(index);
          if (!redundantIndices.has(index ^ 1))
            break;
          index = index / 2 | 0;
        }
      }
    }
    return proof.filter((index) => {
      return !treeIndices.includes(index - leafCount);
    });
  }
  getProofIndicesForUnevenTree(sortedLeafIndices, leavesCount) {
    const depth = Math.ceil(Math.log2(leavesCount));
    const unevenLayers = [];
    for (let index = 0; index < depth; index++) {
      const unevenLayer = leavesCount % 2 !== 0;
      if (unevenLayer) {
        unevenLayers.push({ index, leavesCount });
      }
      leavesCount = Math.ceil(leavesCount / 2);
    }
    const proofIndices = [];
    let layerNodes = sortedLeafIndices;
    for (let layerIndex = 0; layerIndex < depth; layerIndex++) {
      const siblingIndices = layerNodes.map((index) => {
        if (index % 2 === 0) {
          return index + 1;
        }
        return index - 1;
      });
      let proofNodeIndices = siblingIndices.filter((index) => !layerNodes.includes(index));
      const unevenLayer = unevenLayers.find(({ index }) => index === layerIndex);
      if (unevenLayer && layerNodes.includes(unevenLayer.leavesCount - 1)) {
        proofNodeIndices = proofNodeIndices.slice(0, -1);
      }
      proofIndices.push(proofNodeIndices);
      layerNodes = [...new Set(layerNodes.map((index) => {
        if (index % 2 === 0) {
          return index / 2;
        }
        if (index % 2 === 0) {
          return (index + 1) / 2;
        }
        return (index - 1) / 2;
      }))];
    }
    return proofIndices;
  }
  /**
   * getMultiProof
   * @desc Returns the multiproof for given tree indices.
   * @param {Number[]} indices - Tree indices.
   * @return {Buffer[]} - Multiproofs
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getMultiProof(indices)
   *```
   */
  getMultiProof(tree, indices) {
    if (!this.complete) {
      console.warn("Warning: For correct multiProofs it's strongly recommended to set complete: true");
    }
    if (!indices) {
      indices = tree;
      tree = this.getLayersFlat();
    }
    const isUneven = this.isUnevenTree();
    if (isUneven) {
      if (indices.every(Number.isInteger)) {
        return this.getMultiProofForUnevenTree(indices);
      }
    }
    if (!indices.every(Number.isInteger)) {
      let els = indices;
      if (this.sortPairs) {
        els = els.sort(buffer_1$1.Buffer.compare);
      }
      let ids = els.map((el) => this.bufferIndexOf(this.leaves, el, this.sortLeaves)).sort((a, b) => a === b ? 0 : a > b ? 1 : -1);
      if (!ids.every((idx) => idx !== -1)) {
        throw new Error("Element does not exist in Merkle tree");
      }
      const hashes = [];
      const proof = [];
      let nextIds = [];
      for (let i2 = 0; i2 < this.layers.length; i2++) {
        const layer = this.layers[i2];
        for (let j = 0; j < ids.length; j++) {
          const idx = ids[j];
          const pairElement = this.getPairNode(layer, idx);
          hashes.push(layer[idx]);
          if (pairElement) {
            proof.push(pairElement);
          }
          nextIds.push(idx / 2 | 0);
        }
        ids = nextIds.filter((value, i3, self2) => self2.indexOf(value) === i3);
        nextIds = [];
      }
      return proof.filter((value) => !hashes.includes(value));
    }
    return this.getProofIndices(indices, Math.log2(tree.length / 2 | 0)).map((index) => tree[index]);
  }
  getMultiProofForUnevenTree(tree, indices) {
    if (!indices) {
      indices = tree;
      tree = this.getLayers();
    }
    let proofHashes = [];
    let currentLayerIndices = indices;
    for (const treeLayer of tree) {
      const siblings = [];
      for (const index of currentLayerIndices) {
        if (index % 2 === 0) {
          const idx2 = index + 1;
          if (!currentLayerIndices.includes(idx2)) {
            if (treeLayer[idx2]) {
              siblings.push(treeLayer[idx2]);
              continue;
            }
          }
        }
        const idx = index - 1;
        if (!currentLayerIndices.includes(idx)) {
          if (treeLayer[idx]) {
            siblings.push(treeLayer[idx]);
            continue;
          }
        }
      }
      proofHashes = proofHashes.concat(siblings);
      const uniqueIndices = /* @__PURE__ */ new Set();
      for (const index of currentLayerIndices) {
        if (index % 2 === 0) {
          uniqueIndices.add(index / 2);
          continue;
        }
        if (index % 2 === 0) {
          uniqueIndices.add((index + 1) / 2);
          continue;
        }
        uniqueIndices.add((index - 1) / 2);
      }
      currentLayerIndices = Array.from(uniqueIndices);
    }
    return proofHashes;
  }
  /**
   * getHexMultiProof
   * @desc Returns the multiproof for given tree indices as hex strings.
   * @param {Number[]} indices - Tree indices.
   * @return {String[]} - Multiproofs as hex strings.
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getHexMultiProof(indices)
   *```
   */
  getHexMultiProof(tree, indices) {
    return this.getMultiProof(tree, indices).map((x) => this.bufferToHex(x));
  }
  /**
   * getProofFlags
   * @desc Returns list of booleans where proofs should be used instead of hashing.
   * Proof flags are used in the Solidity multiproof verifiers.
   * @param {Number[]|Buffer[]} leaves
   * @param {Buffer[]} proofs
   * @return {Boolean[]} - Boolean flags
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getMultiProof(indices)
   *const proofFlags = tree.getProofFlags(leaves, proof)
   *```
   */
  getProofFlags(leaves, proofs) {
    if (!Array.isArray(leaves) || leaves.length <= 0) {
      throw new Error("Invalid Inputs!");
    }
    let ids;
    if (leaves.every(Number.isInteger)) {
      ids = [...leaves].sort((a, b) => a === b ? 0 : a > b ? 1 : -1);
    } else {
      ids = leaves.map((el) => this.bufferIndexOf(this.leaves, el, this.sortLeaves)).sort((a, b) => a === b ? 0 : a > b ? 1 : -1);
    }
    if (!ids.every((idx) => idx !== -1)) {
      throw new Error("Element does not exist in Merkle tree");
    }
    const _proofs = proofs.map((item) => this.bufferify(item));
    const tested = [];
    const flags = [];
    for (let index = 0; index < this.layers.length; index++) {
      const layer = this.layers[index];
      ids = ids.reduce((ids2, idx) => {
        const skipped = tested.includes(layer[idx]);
        if (!skipped) {
          const pairElement = this.getPairNode(layer, idx);
          const proofUsed = _proofs.includes(layer[idx]) || _proofs.includes(pairElement);
          pairElement && flags.push(!proofUsed);
          tested.push(layer[idx]);
          tested.push(pairElement);
        }
        ids2.push(idx / 2 | 0);
        return ids2;
      }, []);
    }
    return flags;
  }
  /**
   * verify
   * @desc Returns true if the proof path (array of hashes) can connect the target node
   * to the Merkle root.
   * @param {Object[]} proof - Array of proof objects that should connect
   * target node to Merkle root.
   * @param {Buffer} targetNode - Target node Buffer
   * @param {Buffer} root - Merkle root Buffer
   * @return {Boolean}
   * @example
   *```js
   *const root = tree.getRoot()
   *const proof = tree.getProof(leaves[2])
   *const verified = tree.verify(proof, leaves[2], root)
   *```
   */
  verify(proof, targetNode, root2) {
    let hash2 = this.bufferify(targetNode);
    root2 = this.bufferify(root2);
    if (!Array.isArray(proof) || !targetNode || !root2) {
      return false;
    }
    for (let i2 = 0; i2 < proof.length; i2++) {
      const node = proof[i2];
      let data = null;
      let isLeftNode = null;
      if (typeof node === "string") {
        data = this.bufferify(node);
        isLeftNode = true;
      } else if (Array.isArray(node)) {
        isLeftNode = node[0] === 0;
        data = this.bufferify(node[1]);
      } else if (buffer_1$1.Buffer.isBuffer(node)) {
        data = node;
        isLeftNode = true;
      } else if (node instanceof Object) {
        data = this.bufferify(node.data);
        isLeftNode = node.position === "left";
      } else {
        throw new Error("Expected node to be of type string or object");
      }
      const buffers = [];
      if (this.isBitcoinTree) {
        buffers.push(buffer_reverse_1.default(hash2));
        buffers[isLeftNode ? "unshift" : "push"](buffer_reverse_1.default(data));
        hash2 = this.hashFn(this.concatenator(buffers));
        hash2 = buffer_reverse_1.default(this.hashFn(hash2));
      } else {
        if (this.sortPairs) {
          if (buffer_1$1.Buffer.compare(hash2, data) === -1) {
            buffers.push(hash2, data);
            hash2 = this.hashFn(this.concatenator(buffers));
          } else {
            buffers.push(data, hash2);
            hash2 = this.hashFn(this.concatenator(buffers));
          }
        } else {
          buffers.push(hash2);
          buffers[isLeftNode ? "unshift" : "push"](data);
          hash2 = this.hashFn(this.concatenator(buffers));
        }
      }
    }
    return buffer_1$1.Buffer.compare(hash2, root2) === 0;
  }
  /**
   * verifyMultiProof
   * @desc Returns true if the multiproofs can connect the leaves to the Merkle root.
   * @param {Buffer} root - Merkle tree root
   * @param {Number[]} proofIndices - Leave indices for proof
   * @param {Buffer[]} proofLeaves - Leaf values at indices for proof
   * @param {Number} leavesCount - Count of original leaves
   * @param {Buffer[]} proof - Multiproofs given indices
   * @return {Boolean}
   * @example
   *```js
   *const leaves = tree.getLeaves()
   *const root = tree.getRoot()
   *const treeFlat = tree.getLayersFlat()
   *const leavesCount = leaves.length
   *const proofIndices = [2, 5, 6]
   *const proofLeaves = proofIndices.map(i => leaves[i])
   *const proof = tree.getMultiProof(treeFlat, indices)
   *const verified = tree.verifyMultiProof(root, proofIndices, proofLeaves, leavesCount, proof)
   *```
   */
  verifyMultiProof(root2, proofIndices, proofLeaves, leavesCount, proof) {
    const isUneven = this.isUnevenTree();
    if (isUneven) {
      return this.verifyMultiProofForUnevenTree(root2, proofIndices, proofLeaves, leavesCount, proof);
    }
    const depth = Math.ceil(Math.log2(leavesCount));
    root2 = this.bufferify(root2);
    proofLeaves = proofLeaves.map((leaf) => this.bufferify(leaf));
    proof = proof.map((leaf) => this.bufferify(leaf));
    const tree = {};
    for (const [index, leaf] of this.zip(proofIndices, proofLeaves)) {
      tree[Math.pow(2, depth) + index] = leaf;
    }
    for (const [index, proofitem] of this.zip(this.getProofIndices(proofIndices, depth), proof)) {
      tree[index] = proofitem;
    }
    let indexqueue = Object.keys(tree).map((value) => +value).sort((a, b) => a - b);
    indexqueue = indexqueue.slice(0, indexqueue.length - 1);
    let i2 = 0;
    while (i2 < indexqueue.length) {
      const index = indexqueue[i2];
      if (index >= 2 && {}.hasOwnProperty.call(tree, index ^ 1)) {
        let pair = [tree[index - index % 2], tree[index - index % 2 + 1]];
        if (this.sortPairs) {
          pair = pair.sort(buffer_1$1.Buffer.compare);
        }
        const hash2 = pair[1] ? this.hashFn(this.concatenator(pair)) : pair[0];
        tree[index / 2 | 0] = hash2;
        indexqueue.push(index / 2 | 0);
      }
      i2 += 1;
    }
    return !proofIndices.length || {}.hasOwnProperty.call(tree, 1) && tree[1].equals(root2);
  }
  verifyMultiProofWithFlags(root2, leaves, proofs, proofFlag) {
    root2 = this.bufferify(root2);
    leaves = leaves.map(this.bufferify);
    proofs = proofs.map(this.bufferify);
    const leavesLen = leaves.length;
    const totalHashes = proofFlag.length;
    const hashes = [];
    let leafPos = 0;
    let hashPos = 0;
    let proofPos = 0;
    for (let i2 = 0; i2 < totalHashes; i2++) {
      const bufA = proofFlag[i2] ? leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++] : proofs[proofPos++];
      const bufB = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++];
      const buffers = [bufA, bufB].sort(buffer_1$1.Buffer.compare);
      hashes[i2] = this.hashFn(this.concatenator(buffers));
    }
    return buffer_1$1.Buffer.compare(hashes[totalHashes - 1], root2) === 0;
  }
  verifyMultiProofForUnevenTree(root2, indices, leaves, leavesCount, proof) {
    root2 = this.bufferify(root2);
    leaves = leaves.map((leaf) => this.bufferify(leaf));
    proof = proof.map((leaf) => this.bufferify(leaf));
    const computedRoot = this.calculateRootForUnevenTree(indices, leaves, leavesCount, proof);
    return root2.equals(computedRoot);
  }
  /**
   * getDepth
   * @desc Returns the tree depth (number of layers)
   * @return {Number}
   * @example
   *```js
   *const depth = tree.getDepth()
   *```
   */
  getDepth() {
    return this.getLayers().length - 1;
  }
  /**
   * getLayersAsObject
   * @desc Returns the layers as nested objects instead of an array.
   * @example
   *```js
   *const layersObj = tree.getLayersAsObject()
   *```
   */
  getLayersAsObject() {
    const layers = this.getLayers().map((layer) => layer.map((value) => this.bufferToHex(value, false)));
    const objs = [];
    for (let i2 = 0; i2 < layers.length; i2++) {
      const arr = [];
      for (let j = 0; j < layers[i2].length; j++) {
        const obj = { [layers[i2][j]]: null };
        if (objs.length) {
          obj[layers[i2][j]] = {};
          const a = objs.shift();
          const akey = Object.keys(a)[0];
          obj[layers[i2][j]][akey] = a[akey];
          if (objs.length) {
            const b = objs.shift();
            const bkey = Object.keys(b)[0];
            obj[layers[i2][j]][bkey] = b[bkey];
          }
        }
        arr.push(obj);
      }
      objs.push(...arr);
    }
    return objs[0];
  }
  /**
   * verify
   * @desc Returns true if the proof path (array of hashes) can connect the target node
   * to the Merkle root.
   * @param {Object[]} proof - Array of proof objects that should connect
   * target node to Merkle root.
   * @param {Buffer} targetNode - Target node Buffer
   * @param {Buffer} root - Merkle root Buffer
   * @param {Function} hashFunction - Hash function for hashing leaves and nodes
   * @param {Object} options - Additional options
   * @return {Boolean}
   * @example
   *```js
   *const verified = MerkleTree.verify(proof, leaf, root, sha256, options)
   *```
   */
  static verify(proof, targetNode, root2, hashFn = sha256_1$1.default, options = {}) {
    const tree = new MerkleTree([], hashFn, options);
    return tree.verify(proof, targetNode, root2);
  }
  /**
   * getMultiProof
   * @desc Returns the multiproof for given tree indices.
   * @param {Buffer[]} tree - Tree as a flat array.
   * @param {Number[]} indices - Tree indices.
   * @return {Buffer[]} - Multiproofs
   *
   *@example
   * ```js
   *const flatTree = tree.getLayersFlat()
   *const indices = [2, 5, 6]
   *const proof = MerkleTree.getMultiProof(flatTree, indices)
   *```
   */
  static getMultiProof(tree, indices) {
    const t = new MerkleTree([]);
    return t.getMultiProof(tree, indices);
  }
  /**
   * resetTree
   * @desc Resets the tree by clearing the leaves and layers.
   * @example
   *```js
   *tree.resetTree()
   *```
   */
  resetTree() {
    this.leaves = [];
    this.layers = [];
  }
  /**
   * getPairNode
   * @desc Returns the node at the index for given layer.
   * @param {Buffer[]} layer - Tree layer
   * @param {Number} index - Index at layer.
   * @return {Buffer} - Node
   *
   *@example
   * ```js
   *const node = tree.getPairNode(layer, index)
   *```
   */
  getPairNode(layer, idx) {
    const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    if (pairIdx < layer.length) {
      return layer[pairIdx];
    } else {
      return null;
    }
  }
  /**
   * toTreeString
   * @desc Returns a visual representation of the merkle tree as a string.
   * @return {String}
   * @example
   *```js
   *console.log(tree.toTreeString())
   *```
   */
  toTreeString() {
    const obj = this.getLayersAsObject();
    return treeify_1$1.default.asTree(obj, true);
  }
  /**
   * toString
   * @desc Returns a visual representation of the merkle tree as a string.
   * @example
   *```js
   *console.log(tree.toString())
   *```
   */
  toString() {
    return this.toTreeString();
  }
  isUnevenTree(treeLayers) {
    const depth = (treeLayers === null || treeLayers === void 0 ? void 0 : treeLayers.length) || this.getDepth();
    return !this.isPowOf2(depth);
  }
  isPowOf2(v) {
    return v && !(v & v - 1);
  }
  calculateRootForUnevenTree(leafIndices, leafHashes, totalLeavesCount, proofHashes) {
    const leafTuples = this.zip(leafIndices, leafHashes).sort(([indexA], [indexB]) => indexA - indexB);
    const leafTupleIndices = leafTuples.map(([index]) => index);
    const proofIndices = this.getProofIndicesForUnevenTree(leafTupleIndices, totalLeavesCount);
    let nextSliceStart = 0;
    const proofTuplesByLayers = [];
    for (let i2 = 0; i2 < proofIndices.length; i2++) {
      const indices = proofIndices[i2];
      const sliceStart = nextSliceStart;
      nextSliceStart += indices.length;
      proofTuplesByLayers[i2] = this.zip(indices, proofHashes.slice(sliceStart, nextSliceStart));
    }
    const tree = [leafTuples];
    for (let layerIndex = 0; layerIndex < proofTuplesByLayers.length; layerIndex++) {
      const currentLayer = proofTuplesByLayers[layerIndex].concat(tree[layerIndex]).sort(([indexA], [indexB]) => indexA - indexB).map(([, hash2]) => hash2);
      const s = tree[layerIndex].map(([layerIndex2]) => layerIndex2);
      const parentIndices = [...new Set(s.map((index) => {
        if (index % 2 === 0) {
          return index / 2;
        }
        if (index % 2 === 0) {
          return (index + 1) / 2;
        }
        return (index - 1) / 2;
      }))];
      const parentLayer = [];
      for (let i2 = 0; i2 < parentIndices.length; i2++) {
        const parentNodeTreeIndex = parentIndices[i2];
        const bufA = currentLayer[i2 * 2];
        const bufB = currentLayer[i2 * 2 + 1];
        const hash2 = bufB ? this.hashFn(this.concatenator([bufA, bufB])) : bufA;
        parentLayer.push([parentNodeTreeIndex, hash2]);
      }
      tree.push(parentLayer);
    }
    return tree[tree.length - 1][0][1];
  }
}
MerkleTree$1.MerkleTree = MerkleTree;
if (typeof window !== "undefined") {
  window.MerkleTree = MerkleTree;
}
MerkleTree$1.default = MerkleTree;
var MerkleMountainRange$1 = {};
var __importDefault$1 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod2) {
  return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
};
Object.defineProperty(MerkleMountainRange$1, "__esModule", { value: true });
MerkleMountainRange$1.MerkleMountainRange = void 0;
const buffer_1 = buffer;
const sha256_1 = __importDefault$1(sha256Exports);
const Base_1$2 = __importDefault$1(Base$1);
class MerkleMountainRange extends Base_1$2.default {
  constructor(hashFn = sha256_1.default, leaves = [], hashLeafFn, peakBaggingFn, hashBranchFn) {
    super();
    this.root = buffer_1.Buffer.alloc(0);
    this.size = 0;
    this.width = 0;
    this.hashes = {};
    this.data = {};
    leaves = leaves.map(this.bufferify);
    this.hashFn = this.bufferifyFn(hashFn);
    this.hashLeafFn = hashLeafFn;
    this.peakBaggingFn = peakBaggingFn;
    this.hashBranchFn = hashBranchFn;
    for (const leaf of leaves) {
      this.append(leaf);
    }
  }
  /**
   * @desc This only stores the hashed value of the leaf.
   * If you need to retrieve the detail data later, use a map to store them.
   */
  append(data) {
    data = this.bufferify(data);
    const dataHash = this.hashFn(data);
    const dataHashHex = this.bufferToHex(dataHash);
    if (!this.data[dataHashHex] || this.bufferToHex(this.hashFn(this.data[dataHashHex])) !== dataHashHex) {
      this.data[dataHashHex] = data;
    }
    const leaf = this.hashLeaf(this.size + 1, dataHash);
    this.hashes[this.size + 1] = leaf;
    this.width += 1;
    const peakIndexes = this.getPeakIndexes(this.width);
    this.size = this.getSize(this.width);
    const peaks = [];
    for (let i2 = 0; i2 < peakIndexes.length; i2++) {
      peaks[i2] = this._getOrCreateNode(peakIndexes[i2]);
    }
    this.root = this.peakBagging(this.width, peaks);
  }
  /**
   * @desc It returns the hash of a leaf node with hash(M | DATA )
   *       M is the index of the node.
   */
  hashLeaf(index, dataHash) {
    dataHash = this.bufferify(dataHash);
    if (this.hashLeafFn) {
      return this.bufferify(this.hashLeafFn(index, dataHash));
    }
    return this.hashFn(buffer_1.Buffer.concat([this.bufferify(index), dataHash]));
  }
  /**
   * @desc It returns the hash a parent node with hash(M | Left child | Right child)
   *       M is the index of the node.
   */
  hashBranch(index, left, right) {
    if (this.hashBranchFn) {
      return this.bufferify(this.hashBranchFn(index, left, right));
    }
    return this.hashFn(buffer_1.Buffer.concat([this.bufferify(index), this.bufferify(left), this.bufferify(right)]));
  }
  getPeaks() {
    const peakIndexes = this.getPeakIndexes(this.width);
    const peaks = [];
    for (let i2 = 0; i2 < peakIndexes.length; i2++) {
      peaks[i2] = this.hashes[peakIndexes[i2]];
    }
    return peaks;
  }
  getLeafIndex(width) {
    if (width % 2 === 1) {
      return this.getSize(width);
    }
    return this.getSize(width - 1) + 1;
  }
  /**
   * @desc It returns all peaks of the smallest merkle mountain range tree which includes
   *       the given index(size).
   */
  getPeakIndexes(width) {
    const numPeaks = this.numOfPeaks(width);
    const peakIndexes = [];
    let count = 0;
    let size2 = 0;
    for (let i2 = 255; i2 > 0; i2--) {
      if ((width & 1 << i2 - 1) !== 0) {
        size2 = size2 + (1 << i2) - 1;
        peakIndexes[count++] = size2;
        if (peakIndexes.length >= numPeaks) {
          break;
        }
      }
    }
    if (count !== peakIndexes.length) {
      throw new Error("invalid bit calculation");
    }
    return peakIndexes;
  }
  numOfPeaks(width) {
    let bits = width;
    let num = 0;
    while (bits > 0) {
      if (bits % 2 === 1) {
        num++;
      }
      bits = bits >> 1;
    }
    return num;
  }
  peakBagging(width, peaks) {
    const size2 = this.getSize(width);
    if (this.numOfPeaks(width) !== peaks.length) {
      throw new Error("received invalid number of peaks");
    }
    if (width === 0 && !peaks.length) {
      return buffer_1.Buffer.alloc(0);
    }
    if (this.peakBaggingFn) {
      return this.bufferify(this.peakBaggingFn(size2, peaks));
    }
    return this.hashFn(buffer_1.Buffer.concat([this.bufferify(size2), ...peaks.map(this.bufferify)]));
  }
  /**
   * @desc It returns the size of the tree.
   */
  getSize(width) {
    return (width << 1) - this.numOfPeaks(width);
  }
  /**
   * @desc It returns the root value of the tree.
   */
  getRoot() {
    return this.root;
  }
  getHexRoot() {
    return this.bufferToHex(this.getRoot());
  }
  /**
   * @dev It returns the hash value of a node for the given position. Note that the index starts from 1.
   */
  getNode(index) {
    return this.hashes[index];
  }
  /**
   * @desc It returns the height of the highest peak.
   */
  mountainHeight(size2) {
    let height = 1;
    while (1 << height <= size2 + height) {
      height++;
    }
    return height - 1;
  }
  /**
   * @desc It returns the height of the index.
   */
  heightAt(index) {
    let reducedIndex = index;
    let peakIndex = 0;
    let height = 0;
    while (reducedIndex > peakIndex) {
      reducedIndex -= (1 << height) - 1;
      height = this.mountainHeight(reducedIndex);
      peakIndex = (1 << height) - 1;
    }
    return height - (peakIndex - reducedIndex);
  }
  /**
   * @desc It returns whether the index is the leaf node or not
   */
  isLeaf(index) {
    return this.heightAt(index) === 1;
  }
  /**
   * @desc It returns the children when it is a parent node.
   */
  getChildren(index) {
    const left = index - (1 << this.heightAt(index) - 1);
    const right = index - 1;
    if (left === right) {
      throw new Error("not a parent");
    }
    return [left, right];
  }
  /**
   * @desc It returns a merkle proof for a leaf. Note that the index starts from 1.
   */
  getMerkleProof(index) {
    if (index > this.size) {
      throw new Error("out of range");
    }
    if (!this.isLeaf(index)) {
      throw new Error("not a leaf");
    }
    const root2 = this.root;
    const width = this.width;
    const peaks = this.getPeakIndexes(this.width);
    const peakBagging = [];
    let cursor = 0;
    for (let i2 = 0; i2 < peaks.length; i2++) {
      peakBagging[i2] = this.hashes[peaks[i2]];
      if (peaks[i2] >= index && cursor === 0) {
        cursor = peaks[i2];
      }
    }
    let left = 0;
    let right = 0;
    let height = this.heightAt(cursor);
    const siblings = [];
    while (cursor !== index) {
      height--;
      [left, right] = this.getChildren(cursor);
      cursor = index <= left ? left : right;
      siblings[height - 1] = this.hashes[index <= left ? right : left];
    }
    return {
      root: root2,
      width,
      peakBagging,
      siblings
    };
  }
  /**
   * @desc It returns true when the given params verifies that the given value exists in the tree or reverts the transaction.
   */
  verify(root2, width, index, value, peaks, siblings) {
    value = this.bufferify(value);
    const size2 = this.getSize(width);
    if (size2 < index) {
      throw new Error("index is out of range");
    }
    if (!root2.equals(this.peakBagging(width, peaks))) {
      throw new Error("invalid root hash from the peaks");
    }
    let cursor = 0;
    let targetPeak;
    const peakIndexes = this.getPeakIndexes(width);
    for (let i2 = 0; i2 < peakIndexes.length; i2++) {
      if (peakIndexes[i2] >= index) {
        targetPeak = peaks[i2];
        cursor = peakIndexes[i2];
        break;
      }
    }
    if (!targetPeak) {
      throw new Error("target not found");
    }
    let height = siblings.length + 1;
    const path2 = new Array(height);
    let left = 0;
    let right = 0;
    while (height > 0) {
      path2[--height] = cursor;
      if (cursor === index) {
        break;
      } else {
        [left, right] = this.getChildren(cursor);
        cursor = index > left ? right : left;
        continue;
      }
    }
    let node;
    while (height < path2.length) {
      cursor = path2[height];
      if (height === 0) {
        node = this.hashLeaf(cursor, this.hashFn(value));
      } else if (cursor - 1 === path2[height - 1]) {
        node = this.hashBranch(cursor, siblings[height - 1], node);
      } else {
        node = this.hashBranch(cursor, node, siblings[height - 1]);
      }
      height++;
    }
    if (!node.equals(targetPeak)) {
      throw new Error("hashed peak is invalid");
    }
    return true;
  }
  peaksToPeakMap(width, peaks) {
    const peakMap = {};
    let bitIndex = 0;
    let peakRef = 0;
    let count = peaks.length;
    for (let height = 1; height <= 32; height++) {
      bitIndex = 32 - height;
      peakRef = 1 << height - 1;
      if ((width & peakRef) !== 0) {
        peakMap[bitIndex] = peaks[--count];
      } else {
        peakMap[bitIndex] = 0;
      }
    }
    if (count !== 0) {
      throw new Error("invalid number of peaks");
    }
    return peakMap;
  }
  peakMapToPeaks(width, peakMap) {
    const arrLength = this.numOfPeaks(width);
    const peaks = new Array(arrLength);
    let count = 0;
    for (let i2 = 0; i2 < 32; i2++) {
      if (peakMap[i2] !== 0) {
        peaks[count++] = peakMap[i2];
      }
    }
    if (count !== arrLength) {
      throw new Error("invalid number of peaks");
    }
    return peaks;
  }
  peakUpdate(width, prevPeakMap, itemHash) {
    const nextPeakMap = {};
    const newWidth = width + 1;
    let cursorIndex = this.getLeafIndex(newWidth);
    let cursorNode = this.hashLeaf(cursorIndex, itemHash);
    let bitIndex = 0;
    let peakRef = 0;
    let prevPeakExist = false;
    let nextPeakExist = false;
    let obtained = false;
    for (let height = 1; height <= 32; height++) {
      bitIndex = 32 - height;
      if (obtained) {
        nextPeakMap[bitIndex] = prevPeakMap[bitIndex];
      } else {
        peakRef = 1 << height - 1;
        prevPeakExist = (width & peakRef) !== 0;
        nextPeakExist = (newWidth & peakRef) !== 0;
        cursorIndex++;
        if (prevPeakExist) {
          cursorNode = this.hashBranch(cursorIndex, prevPeakMap[bitIndex], cursorNode);
        }
        if (nextPeakExist) {
          if (prevPeakExist) {
            nextPeakMap[bitIndex] = prevPeakMap[bitIndex];
          } else {
            nextPeakMap[bitIndex] = cursorNode;
          }
          obtained = true;
        } else {
          nextPeakMap[bitIndex] = 0;
        }
      }
    }
    return nextPeakMap;
  }
  rollUp(root2, width, peaks, itemHashes) {
    if (!root2.equals(this.peakBagging(width, peaks))) {
      throw new Error("invalid root hash from the peaks");
    }
    let tmpWidth = width;
    let tmpPeakMap = this.peaksToPeakMap(width, peaks);
    for (let i2 = 0; i2 < itemHashes.length; i2++) {
      tmpPeakMap = this.peakUpdate(tmpWidth, tmpPeakMap, itemHashes[i2]);
      tmpWidth++;
    }
    return this.peakBagging(tmpWidth, this.peakMapToPeaks(tmpWidth, tmpPeakMap));
  }
  /**
   * @desc It returns the hash value of the node for the index.
   *      If the hash already exists it simply returns the stored value. On the other hand,
   *      it computes hashes recursively downward.
   *      Only appending an item calls this function.
   */
  _getOrCreateNode(index) {
    if (index > this.size) {
      throw new Error("out of range");
    }
    if (!this.hashes[index]) {
      const [leftIndex, rightIndex] = this.getChildren(index);
      const leftHash = this._getOrCreateNode(leftIndex);
      const rightHash = this._getOrCreateNode(rightIndex);
      this.hashes[index] = this.hashBranch(index, leftHash, rightHash);
    }
    return this.hashes[index];
  }
}
MerkleMountainRange$1.MerkleMountainRange = MerkleMountainRange;
if (typeof window !== "undefined") {
  window.MerkleMountainRange = MerkleMountainRange;
}
MerkleMountainRange$1.default = MerkleMountainRange;
var IncrementalMerkleTree$1 = {};
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod2) {
  return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
};
Object.defineProperty(IncrementalMerkleTree$1, "__esModule", { value: true });
IncrementalMerkleTree$1.IncrementalMerkleTree = void 0;
const Base_1$1 = __importDefault(Base$1);
const treeify_1 = __importDefault(treeifyExports);
class IncrementalMerkleTree extends Base_1$1.default {
  constructor(hashFn, options) {
    super();
    this.hashFn = hashFn;
    if (options.depth) {
      this.depth = options.depth;
    }
    if (options.arity) {
      this.arity = options.arity;
    }
    if (this.depth < 1) {
      throw new Error("depth must be greater than 0");
    }
    if (this.arity < 1) {
      throw new Error("arity must be greater than 0");
    }
    const nodes = [];
    let zeroValue = options.zeroValue;
    this.zeroValue = zeroValue;
    this.zeroes = [];
    if (this.depth) {
      for (let i2 = 0; i2 < this.depth; i2++) {
        this.zeroes.push(zeroValue);
        nodes[i2] = [];
        zeroValue = this.hashFn(Array(this.arity).fill(zeroValue));
      }
    }
    this.nodes = nodes;
    this.root = zeroValue;
  }
  getRoot() {
    return this.root;
  }
  getHexRoot() {
    return this.bufferToHex(this.bufferify(this.getRoot()));
  }
  insert(leaf) {
    if (this.depth && this.arity) {
      if (this.nodes[0].length >= this.getMaxLeaves()) {
        throw new Error("tree is full");
      }
    }
    let node = leaf;
    let index = this.nodes[0].length;
    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity;
      const levelStartIndex = index - position;
      const levelEndIndex = levelStartIndex + this.arity;
      const children = [];
      this.nodes[level][index] = node;
      for (let i2 = levelStartIndex; i2 < levelEndIndex; i2 += 1) {
        if (i2 < this.nodes[level].length) {
          children.push(this.nodes[level][i2]);
        } else {
          children.push(this.zeroes[level]);
        }
      }
      node = this.hashFn(children);
      index = Math.floor(index / this.arity);
    }
    this.root = node;
  }
  delete(index) {
    this.update(index, this.zeroValue);
  }
  update(index, newLeaf) {
    if (index < 0 || index >= this.nodes[0].length) {
      throw new Error("out of bounds");
    }
    let node = newLeaf;
    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity;
      const levelStartIndex = index - position;
      const levelEndIndex = levelStartIndex + this.arity;
      const children = [];
      this.nodes[level][index] = node;
      for (let i2 = levelStartIndex; i2 < levelEndIndex; i2 += 1) {
        if (i2 < this.nodes[level].length) {
          children.push(this.nodes[level][i2]);
        } else {
          children.push(this.zeroes[level]);
        }
      }
      node = this.hashFn(children);
      index = Math.floor(index / this.arity);
    }
    this.root = node;
  }
  getDepth() {
    return this.depth;
  }
  getArity() {
    return this.arity;
  }
  getMaxLeaves() {
    return Math.pow(this.depth, this.arity);
  }
  indexOf(leaf) {
    return this.nodes[0].indexOf(leaf);
  }
  getLeaves() {
    const leaves = this.copyList(this.nodes[0]);
    const index = this.nodes[0].length;
    for (let i2 = index; i2 < this.getMaxLeaves(); i2++) {
      leaves[i2] = this.zeroValue;
    }
    return leaves;
  }
  copyList(list) {
    return list.map((x) => BigInt(x));
  }
  getLayers() {
    const layers = [];
    for (const list of this.nodes) {
      layers.push(this.copyList(list));
    }
    if (layers[0].length < this.getMaxLeaves()) {
      let index = layers[0].length;
      for (let i2 = index; i2 < this.getMaxLeaves(); i2++) {
        layers[0][i2] = this.zeroValue;
      }
      for (let level = 0; level < this.depth; level++) {
        const position = index % this.arity;
        const levelStartIndex = index - position;
        const levelEndIndex = levelStartIndex + this.arity;
        for (let i2 = levelStartIndex; i2 < levelEndIndex; i2++) {
          if (i2 >= layers[level].length) {
            layers[level][i2] = this.zeroes[level];
          }
        }
        index = Math.floor(index / this.arity);
      }
    }
    layers.push([this.root]);
    return layers;
  }
  getHexLayers() {
    return this.getLayers().reduce((acc, item) => {
      if (Array.isArray(item)) {
        acc.push(item.map((layer) => this.bufferToHex(this.bufferify(layer))));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
  }
  getLayersAsObject() {
    const layers = this.getLayers().map((layer) => layer.map((value) => this.bufferToHex(this.bufferify(value), false)));
    const objs = [];
    for (let i2 = 0; i2 < layers.length; i2++) {
      const arr = [];
      for (let j = 0; j < layers[i2].length; j++) {
        const obj = { [layers[i2][j]]: null };
        if (objs.length) {
          obj[layers[i2][j]] = {};
          const a = objs.shift();
          const akey = Object.keys(a)[0];
          obj[layers[i2][j]][akey] = a[akey];
          if (objs.length) {
            const b = objs.shift();
            const bkey = Object.keys(b)[0];
            obj[layers[i2][j]][bkey] = b[bkey];
          }
        }
        arr.push(obj);
      }
      objs.push(...arr);
    }
    return objs[0];
  }
  computeRoot() {
    let node;
    let index = this.nodes[0].length;
    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity;
      const levelStartIndex = index - position;
      const levelEndIndex = levelStartIndex + this.arity;
      const children = [];
      for (let i2 = levelStartIndex; i2 < levelEndIndex; i2 += 1) {
        if (i2 < this.nodes[level].length) {
          children.push(this.nodes[level][i2]);
        } else {
          children.push(this.zeroes[level]);
        }
      }
      node = this.hashFn(children);
      index = Math.floor(index / this.arity);
    }
    return node;
  }
  getProof(index) {
    if (index < 0 || index >= this.nodes[0].length) {
      throw new Error("The leaf does not exist in this tree");
    }
    const siblings = [];
    const pathIndices = [];
    const leafIndex = index;
    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity;
      const levelStartIndex = index - position;
      const levelEndIndex = levelStartIndex + this.arity;
      pathIndices[level] = position;
      siblings[level] = [];
      for (let i2 = levelStartIndex; i2 < levelEndIndex; i2 += 1) {
        if (i2 !== index) {
          if (i2 < this.nodes[level].length) {
            siblings[level].push(this.nodes[level][i2]);
          } else {
            siblings[level].push(this.zeroes[level]);
          }
        }
      }
      index = Math.floor(index / this.arity);
    }
    return { root: this.root, leaf: this.nodes[0][leafIndex], pathIndices, siblings };
  }
  verify(proof) {
    let node = proof.leaf;
    for (let i2 = 0; i2 < proof.siblings.length; i2 += 1) {
      const children = proof.siblings[i2].slice();
      children.splice(proof.pathIndices[i2], 0, node);
      node = this.hashFn(children);
    }
    return proof.root === node;
  }
  toString() {
    return this.toTreeString();
  }
  toTreeString() {
    const obj = this.getLayersAsObject();
    return treeify_1.default.asTree(obj, true);
  }
}
IncrementalMerkleTree$1.IncrementalMerkleTree = IncrementalMerkleTree;
if (typeof window !== "undefined") {
  window.IncrementalMerkleTree = IncrementalMerkleTree;
}
IncrementalMerkleTree$1.default = IncrementalMerkleTree;
var MerkleSumTree$1 = {};
Object.defineProperty(MerkleSumTree$1, "__esModule", { value: true });
MerkleSumTree$1.MerkleSumTree = MerkleSumTree$1.ProofStep = MerkleSumTree$1.Leaf = MerkleSumTree$1.Bucket = void 0;
const Base_1 = Base$1;
class Bucket {
  constructor(size2, hashed) {
    this.size = BigInt(size2);
    this.hashed = hashed;
    this.parent = null;
    this.left = null;
    this.right = null;
  }
}
MerkleSumTree$1.Bucket = Bucket;
class Leaf {
  constructor(hashFn, rng, data) {
    this.hashFn = hashFn;
    this.rng = rng.map((x) => BigInt(x));
    this.data = data;
  }
  getBucket() {
    let hashed;
    if (this.data) {
      hashed = this.hashFn(this.data);
    } else {
      hashed = Buffer.alloc(32);
    }
    return new Bucket(BigInt(this.rng[1]) - BigInt(this.rng[0]), hashed);
  }
}
MerkleSumTree$1.Leaf = Leaf;
class ProofStep {
  constructor(bucket, right) {
    this.bucket = bucket;
    this.right = right;
  }
}
MerkleSumTree$1.ProofStep = ProofStep;
class MerkleSumTree extends Base_1.Base {
  constructor(leaves, hashFn) {
    super();
    this.leaves = leaves;
    this.hashFn = hashFn;
    MerkleSumTree.checkConsecutive(leaves);
    this.buckets = [];
    for (const l of leaves) {
      this.buckets.push(l.getBucket());
    }
    let buckets = [];
    for (const bucket of this.buckets) {
      buckets.push(bucket);
    }
    while (buckets.length !== 1) {
      const newBuckets = [];
      while (buckets.length) {
        if (buckets.length >= 2) {
          const b1 = buckets.shift();
          const b2 = buckets.shift();
          const size2 = b1.size + b2.size;
          const hashed = this.hashFn(Buffer.concat([this.sizeToBuffer(b1.size), this.bufferify(b1.hashed), this.sizeToBuffer(b2.size), this.bufferify(b2.hashed)]));
          const b = new Bucket(size2, hashed);
          b2.parent = b;
          b1.parent = b2.parent;
          b1.right = b2;
          b2.left = b1;
          newBuckets.push(b);
        } else {
          newBuckets.push(buckets.shift());
        }
      }
      buckets = newBuckets;
    }
    this.root = buckets[0];
  }
  sizeToBuffer(size2) {
    const buf = Buffer.alloc(8);
    const view = new DataView(buf.buffer);
    view.setBigInt64(0, BigInt(size2), false);
    return buf;
  }
  static checkConsecutive(leaves) {
    let curr = BigInt(0);
    for (const leaf of leaves) {
      if (leaf.rng[0] !== curr) {
        throw new Error("leaf ranges are invalid");
      }
      curr = BigInt(leaf.rng[1]);
    }
  }
  // gets inclusion/exclusion proof of a bucket in the specified index
  getProof(index) {
    let curr = this.buckets[Number(index)];
    const proof = [];
    while (curr && curr.parent) {
      const right = !!curr.right;
      const bucket = curr.right ? curr.right : curr.left;
      curr = curr.parent;
      proof.push(new ProofStep(bucket, right));
    }
    return proof;
  }
  sum(arr) {
    let total = BigInt(0);
    for (const value of arr) {
      total += BigInt(value);
    }
    return total;
  }
  // validates the suppplied proof for a specified leaf according to the root bucket
  verifyProof(root2, leaf, proof) {
    const rng = [this.sum(proof.filter((x) => !x.right).map((x) => x.bucket.size)), BigInt(root2.size) - this.sum(proof.filter((x) => x.right).map((x) => x.bucket.size))];
    if (!(rng[0] === leaf.rng[0] && rng[1] === leaf.rng[1])) {
      return false;
    }
    let curr = leaf.getBucket();
    let hashed;
    for (const step of proof) {
      if (step.right) {
        hashed = this.hashFn(Buffer.concat([this.sizeToBuffer(curr.size), this.bufferify(curr.hashed), this.sizeToBuffer(step.bucket.size), this.bufferify(step.bucket.hashed)]));
      } else {
        hashed = this.hashFn(Buffer.concat([this.sizeToBuffer(step.bucket.size), this.bufferify(step.bucket.hashed), this.sizeToBuffer(curr.size), this.bufferify(curr.hashed)]));
      }
      curr = new Bucket(BigInt(curr.size) + BigInt(step.bucket.size), hashed);
    }
    return curr.size === root2.size && curr.hashed.toString("hex") === root2.hashed.toString("hex");
  }
}
MerkleSumTree$1.MerkleSumTree = MerkleSumTree;
if (typeof window !== "undefined") {
  window.MerkleSumTree = MerkleSumTree;
}
MerkleSumTree$1.default = MerkleSumTree;
(function(exports) {
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod2) {
    return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.MerkleTree = void 0;
  const MerkleTree_1 = __importDefault2(MerkleTree$1);
  exports.MerkleTree = MerkleTree_1.default;
  var MerkleMountainRange_1 = MerkleMountainRange$1;
  Object.defineProperty(exports, "MerkleMountainRange", { enumerable: true, get: function() {
    return MerkleMountainRange_1.MerkleMountainRange;
  } });
  var IncrementalMerkleTree_1 = IncrementalMerkleTree$1;
  Object.defineProperty(exports, "IncrementalMerkleTree", { enumerable: true, get: function() {
    return IncrementalMerkleTree_1.IncrementalMerkleTree;
  } });
  var MerkleSumTree_1 = MerkleSumTree$1;
  Object.defineProperty(exports, "MerkleSumTree", { enumerable: true, get: function() {
    return MerkleSumTree_1.MerkleSumTree;
  } });
  exports.default = MerkleTree_1.default;
})(dist);
async function prepareAndSignUserOperations(clients, args_) {
  if (clients.length < 2 && args_.length < 2) {
    throw new Error("Should send more than 1 user operation");
  }
  if (clients.length !== args_.length) {
    throw new Error("Number of clients and user operations do not match");
  }
  for (let i2 = 0; i2 < clients.length; i2++) {
    const client = clients[i2];
    const arg = args_[i2];
    if (client.chain === void 0) {
      throw new Error("client.chain is undefined, please provide a chain");
    }
    if (client.chain.id !== arg.chainId) {
      throw new Error(`Chain ID mismatch at index ${i2}: client.chainId (${client.chain.id}) !== args_.chainId (${arg.chainId})`);
    }
  }
  const args = args_;
  const accounts_ = args.map((arg, index) => arg.account ?? clients[index].account);
  if (!accounts_.every((account2) => account2 !== void 0)) {
    throw new AccountNotFoundError();
  }
  const accounts = accounts_.map((account2) => parseAccount(account2));
  const _userOperations = args.map(({ chainId, ...userOp }) => userOp);
  const action = {
    selector: toFunctionSelector$1(getAbiItem$1({ abi: KernelV3AccountAbi, name: "execute" })),
    address: zeroAddress
  };
  const account = accounts[0];
  if (account.kernelPluginManager.regularValidator) {
    const isPluginEnabledPerChains = await Promise.all(accounts.map(async (account2, index) => await account2.kernelPluginManager.isEnabled(account2.address, action.selector) || await isPluginInitialized(clients[index], account2.address, account2.kernelPluginManager.address)));
    const allEnabled = isPluginEnabledPerChains.every((enabled) => enabled);
    const noneEnabled = isPluginEnabledPerChains.every((enabled) => !enabled);
    if (!allEnabled && !noneEnabled) {
      throw new Error("Plugins must be either all enabled or all disabled across chains.");
    }
    if (noneEnabled) {
      const dummySignatures = await Promise.all(accounts.map(async (account2, index) => {
        return account2.kernelPluginManager.regularValidator?.getStubSignature(_userOperations[index]);
      }));
      for (const signature of dummySignatures) {
        if (signature === void 0) {
          throw new Error("Dummy signatures are undefined");
        }
      }
      const pluginEnableTypedDatas = await Promise.all(accounts.map(async (account2) => {
        return account2.kernelPluginManager.getPluginsEnableTypedData(account2.address);
      }));
      const leaves = pluginEnableTypedDatas.map((typedData) => {
        return hashTypedData$1(typedData);
      });
      const merkleTree2 = new dist.MerkleTree(leaves, keccak256$1, {
        sortPairs: true
      });
      const merkleRoot2 = merkleTree2.getHexRoot();
      const ecdsaSig2 = await account.kernelPluginManager.sudoValidator?.signMessage({
        message: {
          raw: merkleRoot2
        }
      });
      if (!ecdsaSig2) {
        throw new Error("No ecdsaSig, check if the sudo validator is multi-chain-ecdsa-validator");
      }
      const enableSigs = accounts.map((_, index) => {
        const merkleProof = merkleTree2.getHexProof(leaves[index]);
        const encodedMerkleProof = encodeAbiParameters$1([{ name: "proof", type: "bytes32[]" }], [merkleProof]);
        return concatHex$1([ecdsaSig2, merkleRoot2, encodedMerkleProof]);
      });
      const encodedDummySignatures = await Promise.all(accounts.map(async (account2, index) => {
        return getEncodedPluginsData({
          enableSignature: enableSigs[index],
          userOpSignature: dummySignatures[index],
          action,
          enableData: await account2.kernelPluginManager.getEnableData(account2.address)
        });
      }));
      for (const [index, userOperation] of _userOperations.entries()) {
        userOperation.signature = encodedDummySignatures[index];
      }
      const userOperations2 = await Promise.all(_userOperations.map(async (_userOperation, index) => {
        return await getAction(clients[index], prepareUserOperation, "prepareUserOperation")(_userOperation);
      }));
      const encodedSignatures = await Promise.all(userOperations2.map(async (userOperation, index) => {
        return await getEncodedPluginsData({
          enableSignature: enableSigs[index],
          userOpSignature: await accounts[index].kernelPluginManager.signUserOperationWithActiveValidator(userOperation),
          action,
          enableData: await accounts[index].kernelPluginManager.getEnableData(account.address)
        });
      }));
      userOperations2.forEach((userOperation, index) => {
        userOperation.signature = encodedSignatures[index];
      });
      return userOperations2;
    }
    if (allEnabled) {
      const userOperations2 = await Promise.all(_userOperations.map(async (_userOperation, index) => {
        return await getAction(clients[index], prepareUserOperation, "prepareUserOperation")(_userOperation);
      }));
      const signatures = await Promise.all(userOperations2.map((userOperation, index) => accounts[index].kernelPluginManager.signUserOperationWithActiveValidator(userOperation)));
      userOperations2.forEach((userOperation, index) => {
        userOperation.signature = signatures[index];
      });
      return userOperations2;
    }
  }
  const userOperations = await Promise.all(_userOperations.map(async (_userOperation, index) => {
    return await getAction(clients[index], prepareUserOperation, "prepareUserOperation")(_userOperation);
  }));
  const userOpHashes = userOperations.map((userOp, index) => {
    return getUserOperationHash({
      userOperation: {
        ...userOp,
        signature: "0x"
      },
      entryPointAddress: account.entryPoint.address,
      entryPointVersion: account.entryPoint.version,
      chainId: args_[index].chainId
    });
  });
  const merkleTree = new dist.MerkleTree(userOpHashes, keccak256$1, {
    sortPairs: true
  });
  const merkleRoot = merkleTree.getHexRoot();
  const ecdsaSig = await account.kernelPluginManager.signMessage({
    message: {
      raw: merkleRoot
    }
  });
  const encodeMerkleDataWithSig = (userOpHash) => {
    const merkleProof = merkleTree.getHexProof(userOpHash);
    const encodedMerkleProof = encodeAbiParameters$1([{ name: "proof", type: "bytes32[]" }], [merkleProof]);
    return concatHex$1([ecdsaSig, merkleRoot, encodedMerkleProof]);
  };
  const signedMultiUserOps = userOperations.map((userOp, index) => {
    return {
      ...userOp,
      signature: encodeMerkleDataWithSig(userOpHashes[index])
    };
  });
  return signedMultiUserOps;
}
const FALLBACK_CALL_GAS_LIMIT = 900000n;
const MIN_VERIFICATION_GAS_LIMIT = 1200000n;
const PRE_VERIFICATION_GAS = 90000n;
const withMargin = (value, marginPct = 25n) => value + value * marginPct / 100n;
const createUserOps = async (config, account, calls) => {
  const chainId = account.client.chain.id;
  const publicClient = config.getPublicClient(chainId);
  if (!publicClient) {
    throw new Error(`Public client not found for chain ${chainId}`);
  }
  const callGasEstimates = await Promise.all(
    calls.map(
      (call2) => publicClient.estimateGas({
        account,
        to: call2.to,
        data: call2.data,
        value: call2.value
      }).then(withMargin).catch((error) => {
        console.warn(
          `Gas estimation failed for call to ${call2.to}, falling back`,
          "message" in error ? error.message : "Unknown error"
        );
        return FALLBACK_CALL_GAS_LIMIT;
      })
    )
  );
  const callGasLimit = callGasEstimates.reduce((acc, gas) => acc + gas, 0n);
  const verificationGasLimit = callGasLimit + PRE_VERIFICATION_GAS > MIN_VERIFICATION_GAS_LIMIT ? callGasLimit + PRE_VERIFICATION_GAS : MIN_VERIFICATION_GAS_LIMIT;
  const gasEstimate = await publicClient.estimateFeesPerGas();
  const paymaster = config.hasPaymaster ? {
    getPaymasterData: (parameters) => {
      return getPaymasterDataForChain({
        params: parameters,
        method: "pm_sponsorUserOperation",
        getPaymasterEndpoint: config.getPaymasterEndpoint
      });
    },
    getPaymasterStubData: (parameters) => {
      return getPaymasterDataForChain({
        params: parameters,
        method: "pm_getPaymasterStubData",
        getPaymasterEndpoint: config.getPaymasterEndpoint
      });
    }
  } : void 0;
  const callData = await account.encodeCalls(calls);
  return {
    account,
    chainId,
    callData,
    callGasLimit,
    verificationGasLimit,
    preVerificationGas: PRE_VERIFICATION_GAS,
    maxFeePerGas: gasEstimate.maxFeePerGas,
    maxPriorityFeePerGas: gasEstimate.maxPriorityFeePerGas,
    paymaster
  };
};
const composeUserOps = async (operations, options = {}) => {
  const signedOps = (await prepareAndSignUserOperations(
    operations.map((operation) => operation.publicClient),
    operations.map((operation) => operation.userOp)
  )).map(toRpcUserOpCanonical);
  options.onSigned?.(signedOps);
  const builds = await Promise.all(
    operations.map(
      (operation, index) => operation.publicClient.request({
        method: "compose_buildSignedUserOpsTx",
        params: [[signedOps[index]], { chainId: operation.publicClient.chain.id }]
      })
    )
  );
  const explorerUrls = operations.map(
    (operation, index) => new URL(`tx/${builds[index].hash}`, operation.publicClient.chain.blockExplorers?.default?.url).toString()
  );
  options.onComposed?.(builds, explorerUrls);
  const payload = encodeXtMessage({
    senderId: "client",
    entries: builds.map((build) => ({ chainId: build.chainId, rawTx: build.raw }))
  });
  return {
    signedOps,
    builds,
    payload,
    explorerUrls,
    send: async () => operations[0].publicClient.request({
      method: "eth_sendXTransaction",
      params: [payload]
    }).then(() => {
      const hashes = builds.map((build) => build.hash);
      return {
        hashes,
        wait: () => Promise.all(
          hashes.map((hash2, index) => {
            return operations[index].publicClient.waitForTransactionReceipt({ hash: hash2 });
          })
        )
      };
    })
  };
};
export {
  VALIDATOR_TYPE as $,
  isAddressEqual as A,
  getAddress as B,
  encodeAbiParameters as C,
  getAction as D,
  readContract as E,
  parseAbi as F,
  AccountNotFoundError$1 as G,
  parseAccount as H,
  stringToHex as I,
  getTypesForEIP712Domain as J,
  validateTypedData as K,
  LruMap as L,
  serializeTypedData as M,
  isAddress as N,
  InvalidAddressError as O,
  encodeFunctionData as P,
  call as Q,
  decodeFunctionResult as R,
  getContractError$1 as S,
  AccountTypeNotSupportedError as T,
  prepareAuthorization as U,
  KernelModuleIsModuleInstalledAbi as V,
  getChainId as W,
  getUserOperationHash as X,
  KernelV3AccountAbi as Y,
  KERNEL_NAME as Z,
  CALL_TYPE as _,
  rollupB as a,
  VALIDATOR_MODE as a0,
  isPluginInitialized as a1,
  getEncodedPluginsData as a2,
  safeCreateCallAddress as a3,
  KernelV3ExecuteAbi as a4,
  EXEC_TYPE as a5,
  KernelModuleInstallAbi as a6,
  entryPoint07Address as a7,
  KernelVersionToAddressesMap as a8,
  MAGIC_VALUE_SIG_REPLAYABLE as a9,
  clean as aA,
  aexists as aB,
  abytes as aC,
  randomBytes as aD,
  concatBytes as aE,
  sha256$3 as aF,
  dist as aa,
  SignTransactionNotSupportedBySmartAccountError as ab,
  KERNEL_V3_1 as ac,
  slice as ad,
  toFunctionSelector as ae,
  formatAbiItem$1 as af,
  AbiFunctionSignatureNotFoundError as ag,
  decodeAbiParameters as ah,
  getAbiItem as ai,
  AbiErrorNotFoundError as aj,
  AbiErrorInputsNotFoundError as ak,
  AbiFunctionNotFoundError as al,
  AbiFunctionOutputsNotFoundError as am,
  InvalidArrayError as an,
  BaseError$2 as ao,
  getUrl as ap,
  stringify as aq,
  batchGatewayAbi as ar,
  solidityError as as,
  decodeErrorResult as at,
  concat as au,
  HttpRequestError as av,
  anumber as aw,
  Hash as ax,
  ahash as ay,
  toBytes as az,
  base as b,
  arbitrum as c,
  rollupsAccountAbstractionContracts as d,
  entryPointV07 as e,
  composeRollupsContracts as f,
  encodeXtMessage as g,
  hoodi as h,
  createUserOps as i,
  composeUserOps as j,
  keccak256 as k,
  checksumAddress as l,
  mainnet as m,
  concatHex as n,
  optimism as o,
  polygon as p,
  toRlp as q,
  rollupA as r,
  numberToHex as s,
  toRpcUserOpCanonical as t,
  hexToBytes as u,
  isHex as v,
  toHex as w,
  hexToBigInt as x,
  size as y,
  hexToNumber as z
};
