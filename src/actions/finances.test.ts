import { describe, it, expect, vi } from 'vitest';
import { addFinanceEntry } from './finances';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('addFinanceEntry', () => {
  it('should return error if unauthorized', async () => {
    (createClient as any).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) }
    });

    const result = await addFinanceEntry({ 
      year: 2026, type: 'income', category_name: 'PADesa', amount: 1000000 
    });
    expect(result.error).toBe('Unauthorized');
  });

  it('should return error if validation fails', async () => {
    (createClient as any).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }) }
    });

    const result = await addFinanceEntry({ 
      year: 1999, type: 'income', category_name: '', amount: -1 
    } as any);
    
    expect(result.error).toBeDefined();
    expect(result.error).toHaveProperty('year');
    expect(result.error).toHaveProperty('category_name');
    expect(result.error).toHaveProperty('amount');
  });

  it('should return success if authorized and data is valid', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    (createClient as any).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }) },
      from: vi.fn().mockReturnValue({
        insert: mockInsert
      })
    });

    const result = await addFinanceEntry({ 
      year: 2026, type: 'income', category_name: 'PADesa', amount: 1000000 
    });

    expect(result.success).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith({
      year: 2026, type: 'income', category_name: 'PADesa', amount: 1000000
    });
  });
});
