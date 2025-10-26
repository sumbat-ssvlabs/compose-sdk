import type { ConfigArgs } from '@/utils/zod/config';

export type ConfigReturnType = object;

export const isConfig = (props: unknown): props is ConfigReturnType => {
  return typeof props === 'object';
};

export const createConfig = (props: ConfigArgs): ConfigReturnType => {};
