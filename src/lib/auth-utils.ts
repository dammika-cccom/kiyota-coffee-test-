import { getSession } from "@/lib/session";

export async function getAuthUser() {
  const session = await getSession();
  if (!session) return null;
  return {
    userId: session.userId as string,
    role: session.role as string,
  };
}