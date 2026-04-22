import { describe, it, expect, vi, beforeEach } from 'vitest';
import { upsertStaffMember, deleteStaffMember } from './staff';
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
    from: vi.fn().mockReturnThis(),
    upsert: vi.fn(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseServer.createClient).mockResolvedValue(mockSupabase as any);
    // Reset individual method mocks to default behavior
    mockSupabase.from.mockReturnThis();
    mockSupabase.delete.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.single.mockResolvedValue({ data: null, error: null });
    mockSupabase.upsert.mockResolvedValue({ data: null, error: null });
  });

  it('should return error if unauthorized', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    
    const result = await upsertStaffMember({ 
      name: 'John Doe', position: 'Sekdes', order_index: 0
    });
    
    expect(result.error).toBe('Unauthorized');
  });

  it('should return validation error if data is invalid', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    
    const result = await upsertStaffMember({ 
      name: '', position: '', order_index: -1
    } as any);
    
    expect(result.error).toBeDefined();
    const errorObj = result.error as Record<string, string[]>;
    expect(errorObj.name).toBeDefined();
    expect(errorObj.position).toBeDefined();
  });

  it('should call upsert with correct data including parent_id', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    mockSupabase.upsert.mockResolvedValue({ error: null });
    
    const staffData = {
      name: 'Jane Doe',
      position: 'Staff',
      parent_id: '550e8400-e29b-41d4-a716-446655440000',
      order_index: 1,
      photo_url: ''
    };
    
    const result = await upsertStaffMember(staffData);
    
    expect(result.success).toBe(true);
    expect(mockSupabase.upsert).toHaveBeenCalledWith(expect.objectContaining({
      name: staffData.name,
      position: staffData.position,
      order_index: staffData.order_index
    }));
  });

  it('should call upsert with id when updating', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    mockSupabase.upsert.mockResolvedValue({ error: null });
    mockSupabase.single.mockResolvedValue({ data: { photo_url: 'old-photo.jpg' }, error: null });
    
    const staffData = {
      name: 'Jane Doe',
      position: 'Staff',
      parent_id: null,
      order_index: 0,
      photo_url: 'new-photo.jpg'
    };
    const id = 'existing-uuid';
    
    const result = await upsertStaffMember(staffData, id);
    
    expect(result.success).toBe(true);
    expect(mockSupabase.upsert).toHaveBeenCalledWith({ id, ...staffData });
  });

  it('should return error if supabase upsert fails', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    mockSupabase.upsert.mockResolvedValue({ error: { message: 'Database error' } });
    
    const staffData = {
      name: 'Jane Doe',
      position: 'Staff',
      order_index: 0,
      photo_url: '',
      parent_id: null
    };
    
    const result = await upsertStaffMember(staffData);
    
    expect(result.error).toBe('Database error');
  });

  describe('deleteStaffMember', () => {
    it('should return error if unauthorized', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
      
      const result = await deleteStaffMember('some-id');
      
      expect(result.error).toBe('Unauthorized');
    });

    it('should call delete with correct id', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
      mockSupabase.single.mockResolvedValue({ data: { photo_url: null }, error: null });
      mockSupabase.eq.mockResolvedValue({ error: null });
      
      const id = 'some-uuid';
      const result = await deleteStaffMember(id);
      
      expect(result.success).toBe(true);
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', id);
    });
  });
});
