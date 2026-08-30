import { describe, expect, it } from 'vitest';
import { SyncQueue, principalFromSession } from '../../../packages/integration/src/index';

describe('contratos de integração', () => {
  it('converte sessão em principal autorizado', () => {
    const principal = principalFromSession({ userId: 'u1' as never, role: 'rh', workId: 'w1' as never, expiresAt: '2099-01-01' });
    expect(principal.role).toBe('rh');
    expect(principal.workIds).toEqual(['w1']);
  });

  it('remove da fila apenas mudanças aceitas', () => {
    const queue = new SyncQueue();
    queue.enqueue({ id: 'a', entity: 'work', operation: 'upsert', version: 1 });
    queue.enqueue({ id: 'b', entity: 'work', operation: 'upsert', version: 1 });
    queue.acknowledge({ accepted: ['a'], rejected: [{ id: 'b', reason: 'conflict' }], serverVersion: 2 });
    expect(queue.snapshot().map((item) => item.id)).toEqual(['b']);
  });
});
