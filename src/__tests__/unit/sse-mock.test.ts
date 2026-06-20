import { createMockSSEClient } from '@/api/sse.mock'

describe('createMockSSEClient', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls onStatusChange with connecting then connected', () => {
    const onMessage = vi.fn()
    const onStatusChange = vi.fn()

    const client = createMockSSEClient({ onMessage, onStatusChange })
    expect(onStatusChange).toHaveBeenCalledWith('connecting')

    vi.advanceTimersByTime(600)
    expect(onStatusChange).toHaveBeenCalledWith('connected')

    client.destroy()
  })

  it('starts pushing data events after connection', () => {
    const onMessage = vi.fn()
    const onStatusChange = vi.fn()

    createMockSSEClient({ onMessage, onStatusChange })

    vi.advanceTimersByTime(600) // connect
    expect(onStatusChange).toHaveBeenCalledWith('connected')

    vi.advanceTimersByTime(16000)
    expect(onMessage).toHaveBeenCalled()
  })

  it('destroy prevents further messages', () => {
    const onMessage = vi.fn()
    const onStatusChange = vi.fn()

    const client = createMockSSEClient({ onMessage, onStatusChange })

    vi.advanceTimersByTime(600)
    client.destroy()
    expect(onStatusChange).toHaveBeenLastCalledWith('disconnected')

    const messageCount = onMessage.mock.calls.length
    vi.advanceTimersByTime(100000)
    expect(onMessage).toHaveBeenCalledTimes(messageCount)
  })
})
