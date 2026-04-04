"use server";

/**
 * Server side action to securely verify passwords.
 */

export async function verifyAdminPasscode(password: string): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD || "love";
  return password === secret;
}

export async function verifyGirlfriendPasscode(password: string): Promise<boolean> {
  const secret = process.env.GIRLFRIEND_PASSWORD || "heart";
  return password === secret;
}
