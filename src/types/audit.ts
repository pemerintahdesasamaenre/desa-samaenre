export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  entity_type: string;
  method: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'AUTH';
  details: Record<string, unknown>;
  created_at: string;
}
