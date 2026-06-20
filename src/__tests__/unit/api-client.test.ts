import { fetchApi } from '@/api/client'

describe('fetchApi', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns parsed JSON on successful response', async () => {
    const mockData = { name: 'test', value: 42 }
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response)

    const result = await fetchApi<typeof mockData>('/test-endpoint')
    expect(result).toEqual(mockData)
  })

  it('throws on HTTP error response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response)

    await expect(fetchApi('/test-endpoint')).rejects.toThrow('API error: 500 Internal Server Error')
  })

  it('throws on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('NetworkError'))

    await expect(fetchApi('/test-endpoint')).rejects.toThrow('NetworkError')
  })
})
