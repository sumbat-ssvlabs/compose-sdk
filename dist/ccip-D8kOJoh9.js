"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const index = require("./index-BnHS7hMo.js");
function decodeFunctionData(parameters) {
  const { abi, data } = parameters;
  const signature = index.slice(data, 0, 4);
  const description = abi.find((x) => x.type === "function" && signature === index.toFunctionSelector(index.formatAbiItem(x)));
  if (!description)
    throw new index.AbiFunctionSignatureNotFoundError(signature, {
      docsPath: "/docs/contract/decodeFunctionData"
    });
  return {
    functionName: description.name,
    args: "inputs" in description && description.inputs && description.inputs.length > 0 ? index.decodeAbiParameters(description.inputs, index.slice(data, 4)) : void 0
  };
}
const docsPath$1 = "/docs/contract/encodeErrorResult";
function encodeErrorResult(parameters) {
  const { abi, errorName, args } = parameters;
  let abiItem = abi[0];
  if (errorName) {
    const item = index.getAbiItem({ abi, args, name: errorName });
    if (!item)
      throw new index.AbiErrorNotFoundError(errorName, { docsPath: docsPath$1 });
    abiItem = item;
  }
  if (abiItem.type !== "error")
    throw new index.AbiErrorNotFoundError(void 0, { docsPath: docsPath$1 });
  const definition = index.formatAbiItem(abiItem);
  const signature = index.toFunctionSelector(definition);
  let data = "0x";
  if (args && args.length > 0) {
    if (!abiItem.inputs)
      throw new index.AbiErrorInputsNotFoundError(abiItem.name, { docsPath: docsPath$1 });
    data = index.encodeAbiParameters(abiItem.inputs, args);
  }
  return index.concatHex([signature, data]);
}
const docsPath = "/docs/contract/encodeFunctionResult";
function encodeFunctionResult(parameters) {
  const { abi, functionName, result } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = index.getAbiItem({ abi, name: functionName });
    if (!item)
      throw new index.AbiFunctionNotFoundError(functionName, { docsPath });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new index.AbiFunctionNotFoundError(void 0, { docsPath });
  if (!abiItem.outputs)
    throw new index.AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath });
  const values = (() => {
    if (abiItem.outputs.length === 0)
      return [];
    if (abiItem.outputs.length === 1)
      return [result];
    if (Array.isArray(result))
      return result;
    throw new index.InvalidArrayError(result);
  })();
  return index.encodeAbiParameters(abiItem.outputs, values);
}
class OffchainLookupError extends index.BaseError {
  constructor({ callbackSelector, cause, data, extraData, sender, urls }) {
    super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
      cause,
      metaMessages: [
        ...cause.metaMessages || [],
        cause.metaMessages?.length ? "" : [],
        "Offchain Gateway Call:",
        urls && [
          "  Gateway URL(s):",
          ...urls.map((url) => `    ${index.getUrl(url)}`)
        ],
        `  Sender: ${sender}`,
        `  Data: ${data}`,
        `  Callback selector: ${callbackSelector}`,
        `  Extra data: ${extraData}`
      ].flat(),
      name: "OffchainLookupError"
    });
  }
}
class OffchainLookupResponseMalformedError extends index.BaseError {
  constructor({ result, url }) {
    super("Offchain gateway response is malformed. Response data must be a hex value.", {
      metaMessages: [
        `Gateway URL: ${index.getUrl(url)}`,
        `Response: ${index.stringify(result)}`
      ],
      name: "OffchainLookupResponseMalformedError"
    });
  }
}
class OffchainLookupSenderMismatchError extends index.BaseError {
  constructor({ sender, to }) {
    super("Reverted sender address does not match target contract address (`to`).", {
      metaMessages: [
        `Contract address: ${to}`,
        `OffchainLookup sender address: ${sender}`
      ],
      name: "OffchainLookupSenderMismatchError"
    });
  }
}
const localBatchGatewayUrl = "x-batch-gateway:true";
async function localBatchGatewayRequest(parameters) {
  const { data, ccipRequest: ccipRequest2 } = parameters;
  const { args: [queries] } = decodeFunctionData({ abi: index.batchGatewayAbi, data });
  const failures = [];
  const responses = [];
  await Promise.all(queries.map(async (query, i) => {
    try {
      responses[i] = query.urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({ data: query.data, ccipRequest: ccipRequest2 }) : await ccipRequest2(query);
      failures[i] = false;
    } catch (err) {
      failures[i] = true;
      responses[i] = encodeError(err);
    }
  }));
  return encodeFunctionResult({
    abi: index.batchGatewayAbi,
    functionName: "query",
    result: [failures, responses]
  });
}
function encodeError(error) {
  if (error.name === "HttpRequestError" && error.status)
    return encodeErrorResult({
      abi: index.batchGatewayAbi,
      errorName: "HttpError",
      args: [error.status, error.shortMessage]
    });
  return encodeErrorResult({
    abi: [index.solidityError],
    errorName: "Error",
    args: ["shortMessage" in error ? error.shortMessage : error.message]
  });
}
const offchainLookupSignature = "0x556f1830";
const offchainLookupAbiItem = {
  name: "OffchainLookup",
  type: "error",
  inputs: [
    {
      name: "sender",
      type: "address"
    },
    {
      name: "urls",
      type: "string[]"
    },
    {
      name: "callData",
      type: "bytes"
    },
    {
      name: "callbackFunction",
      type: "bytes4"
    },
    {
      name: "extraData",
      type: "bytes"
    }
  ]
};
async function offchainLookup(client, { blockNumber, blockTag, data, to }) {
  const { args } = index.decodeErrorResult({
    data,
    abi: [offchainLookupAbiItem]
  });
  const [sender, urls, callData, callbackSelector, extraData] = args;
  const { ccipRead } = client;
  const ccipRequest_ = ccipRead && typeof ccipRead?.request === "function" ? ccipRead.request : ccipRequest;
  try {
    if (!index.isAddressEqual(to, sender))
      throw new OffchainLookupSenderMismatchError({ sender, to });
    const result = urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({
      data: callData,
      ccipRequest: ccipRequest_
    }) : await ccipRequest_({ data: callData, sender, urls });
    const { data: data_ } = await index.call(client, {
      blockNumber,
      blockTag,
      data: index.concat([
        callbackSelector,
        index.encodeAbiParameters([{ type: "bytes" }, { type: "bytes" }], [result, extraData])
      ]),
      to
    });
    return data_;
  } catch (err) {
    throw new OffchainLookupError({
      callbackSelector,
      cause: err,
      data,
      extraData,
      sender,
      urls
    });
  }
}
async function ccipRequest({ data, sender, urls }) {
  let error = new Error("An unknown error occurred.");
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const method = url.includes("{data}") ? "GET" : "POST";
    const body = method === "POST" ? { data, sender } : void 0;
    const headers = method === "POST" ? { "Content-Type": "application/json" } : {};
    try {
      const response = await fetch(url.replace("{sender}", sender.toLowerCase()).replace("{data}", data), {
        body: JSON.stringify(body),
        headers,
        method
      });
      let result;
      if (response.headers.get("Content-Type")?.startsWith("application/json")) {
        result = (await response.json()).data;
      } else {
        result = await response.text();
      }
      if (!response.ok) {
        error = new index.HttpRequestError({
          body,
          details: result?.error ? index.stringify(result.error) : response.statusText,
          headers: response.headers,
          status: response.status,
          url
        });
        continue;
      }
      if (!index.isHex(result)) {
        error = new OffchainLookupResponseMalformedError({
          result,
          url
        });
        continue;
      }
      return result;
    } catch (err) {
      error = new index.HttpRequestError({
        body,
        details: err.message,
        url
      });
    }
  }
  throw error;
}
exports.ccipRequest = ccipRequest;
exports.offchainLookup = offchainLookup;
exports.offchainLookupAbiItem = offchainLookupAbiItem;
exports.offchainLookupSignature = offchainLookupSignature;
