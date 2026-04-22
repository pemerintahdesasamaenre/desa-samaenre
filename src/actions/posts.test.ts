import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPost } from './posts';
import { createClient } from '../lib/supabase/server';

vi.mock('../lib/supabase/server', () => ({
  createClient: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('createPost', () => {
  const mockPostData = { 
    title: 'Test Title', 
    slug: 'test-title', 
    content: 'This is a long enough content for testing.', 
    category_id: '00000000-0000-0000-0000-000000000000', 
    type: 'news' as const, 
    status: 'draft' as const 
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error if not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) }
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const result = await createPost(mockPostData);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return validation error if data is invalid', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }) }
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const result = await createPost({ ...mockPostData, title: 'sh' }); // too short
    expect(result.error).toHaveProperty('title');
  });

  it('should create post successfully', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }) },
      from: vi.fn().mockReturnValue({
        insert: mockInsert
      })
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const result = await createPost(mockPostData);
    
    expect(result.success).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith({
      ...mockPostData,
      author_id: 'user-123',
      event_date: null
    });
  });

  it('should return error if database insert fails', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }) },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: { message: 'Database error' } })
      })
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const result = await createPost(mockPostData);
    expect(result.error).toBe('Database error');
  });
});
