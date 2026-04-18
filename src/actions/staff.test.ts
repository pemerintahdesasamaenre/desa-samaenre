import { describe, it, expect, vi, beforeEach } from 'vitest';
import { upsertStaffMember } from './staff';
import * as supabaseServer from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('upsertStaffMember', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({ error: null })),
    })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (supabaseServer.createClient as any).mockResolvedValue(mockSupabase);
  });

  it('should return error if unauthorized', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    
    const result = await (upsertStaffMember as any)({ 
      name: 'John Doe', position: 'Sekdes'
    });
    
    expect(result.error).toBe('Unauthorized');
  });

  it('should return validation error if data is invalid', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    
    const result = await (upsertStaffMember as any)({ 
      name: '', position: '' // Invalid data
    });
    
    expect(result.error).toBeDefined();
    expect(result.error.name).toBeDefined();
    expect(result.error.position).toBeDefined();
  });

  it('should call upsert with correct data including parent_id', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    const upsertSpy = vi.fn(() => ({ error: null }));
    mockSupabase.from.mockReturnValue({ upsert: upsertSpy } as any);
    
    const staffData = {
      name: 'Jane Doe',
      position: 'Staff',
      parent_id: '550e8400-e29b-41d4-a716-446655440000',
      order_index: 1
    };
    
    const result = await (upsertStaffMember as any)(staffData);
    
    expect(result.success).toBe(true);
    expect(upsertSpy).toHaveBeenCalledWith(expect.objectContaining(staffData));
  });

  it('should call upsert with id when updating', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    const upsertSpy = vi.fn(() => ({ error: null }));
    mockSupabase.from.mockReturnValue({ upsert: upsertSpy } as any);
    
    const staffData = {
      name: 'Jane Doe',
      position: 'Staff',
      parent_id: null,
      order_index: 0
    };
    const id = 'existing-uuid';
    
    const result = await (upsertStaffMember as any)(staffData, id);
    
    expect(result.success).toBe(true);
    expect(upsertSpy).toHaveBeenCalledWith({ id, ...staffData });
  });

  it('should return error if supabase upsert fails', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    const upsertSpy = vi.fn(() => ({ error: { message: 'Database error' } }));
    mockSupabase.from.mockReturnValue({ upsert: upsertSpy } as any);
    
    const staffData = {
      name: 'Jane Doe',
      position: 'Staff'
    };
    
    const result = await (upsertStaffMember as any)(staffData);
    
    expect(result.error).toBe('Database error');
  });

  describe('deleteStaffMember', () => {
    it('should return error if unauthorized', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
      
      const { deleteStaffMember } = await import('./staff');
      const result = await deleteStaffMember('some-id');
      
      expect(result.error).toBe('Unauthorized');
    });

    it('should call delete with correct id', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
      const deleteSpy = vi.fn(() => ({ eq: vi.fn(() => ({ error: null })) }));
      mockSupabase.from.mockReturnValue({ delete: deleteSpy } as any);
      
      const id = 'some-uuid';
      const { deleteStaffMember } = await import('./staff');
      const result = await deleteStaffMember(id);
      
      expect(result.success).toBe(true);
      expect(deleteSpy).toHaveBeenCalled();
    });
  });
});
