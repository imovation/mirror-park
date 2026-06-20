import { createSSEClient } from '@/api/sse'

describe('createSSEClient', () => {
  it('is a function', () => {
    expect(typeof createSSEClient).toBe('function')
  })

  it('returns an object with destroy method', () => {
    const client = createSSEClient({
      onMessage: () => {},
      onStatusChange: () => {},
    })
    expect(client).toHaveProperty('destroy')
    expect(typeof client.destroy).toBe('function')
    client.destroy()
  })
})
