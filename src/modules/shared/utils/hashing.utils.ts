import * as argon2 from 'argon2';

export const hashString = async (value: string): Promise<string> =>
  await argon2.hash(value);
export const isStringMatched = async (
  hash: string,
  value: string,
): Promise<boolean> => await argon2.verify(hash, value);
