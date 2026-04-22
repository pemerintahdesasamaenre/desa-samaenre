import { describe, it, expect, vi } from 'vitest';
import { addFinanceEntry } from './finances';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

type MockClient = Awaited<ReturnType<typeof createClient>>;

describe('addFinanceEntry', () => {
  it('should return error if unauthorized', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) }
    } as unknown as MockClient);

    const result = await addFinanceEntry({ 
      year: 2026, type: 'income', category_name: 'PADesa', amount: 1000000 
    });
    expect(result.error).toBe('Unauthorized');
  });

  it('should return error if validation fails', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }) }
    } as unknown as MockClient);

    const result = await addFinanceEntry({ 
      year: 1999, type: 'income', category_name: '', amount: -1 
    } as unknown as Parameters<typeof addFinanceEntry>[0]);
    
    expect(result.error).toBeDefined();
    const errorObj = result.error as Record<string, string[]>;
    expect(errorObj).toHaveProperty('year');
    expect(errorObj).toHaveProperty('category_name');
    expect(errorObj).toHaveProperty('amount');
  });

  it('should return success if authorized and data is valid', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }) },
      from: vi.fn().mockReturnValue({
        insert: mockInsert
      })
    } as unknown as MockClient);

    const result = await addFinanceEntry({ 
      year: 2026, type: 'income', category_name: 'PADesa', amount: 1000000 
    });

    expect(result.success).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith({
      year: 2026, type: 'income', category_name: 'PADesa', amount: 1000000
    });
  });
});
