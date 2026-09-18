import { handler } from '../ERP/order/createOrder'

describe('createOrder Lambda', () => {
  it('logs success for normal execution', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    await handler({
      Records: [
        {
          body: JSON.stringify({
            dynamodb: {
              NewImage: {
                id: { S: 'order-123' },
                email: { S: 'test@example.com' },
              },
            },
          }),
        },
      ],
    } as never)

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Create a new order 'order-123'"))

    consoleSpy.mockRestore()
  })

  it('simulates ERP failure when random is below threshold', async () => {
    const originalRandom = Math.random
    Math.random = jest.fn().mockReturnValue(0.1) // below 0.34

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    await handler({
      Records: [
        {
          body: JSON.stringify({
            dynamodb: {
              NewImage: {
                id: { S: 'order-456' },
              },
            },
          }),
        },
      ],
    } as never)

    expect(consoleSpy).toHaveBeenCalledWith('Creating the order in ERP system failed!')

    consoleSpy.mockRestore()
  })
})
