import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function validatePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash);
}
