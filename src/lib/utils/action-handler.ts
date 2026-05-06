import { getAuthUser } from './auth';

export type ActionResponse<T = unknown> = {
  success?: boolean;
  data?: T;
  error?: string | Record<string, string[]>;
};

/**
 * Wrapper for server actions that require authentication.
 * Handles auth check and basic error catching.
 */
export async function protectedAction<T>(
  callback: (user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>>) => Promise<ActionResponse<T>>
): Promise<ActionResponse<T>> {
  try {
    const user = await getAuthUser();
    if (!user) return { error: 'Unauthorized' };
    
    return await callback(user);
  } catch (error: unknown) {
    console.error('Protected Action Error:', error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem';
    return { error: message };
  }
}

/**
 * Simple wrapper for public server actions to catch unexpected errors.
 */
export async function publicAction<T>(
  callback: () => Promise<ActionResponse<T>>
): Promise<ActionResponse<T>> {
  try {
    return await callback();
  } catch (error: unknown) {
    console.error('Public Action Error:', error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem';
    return { error: message };
  }
}
