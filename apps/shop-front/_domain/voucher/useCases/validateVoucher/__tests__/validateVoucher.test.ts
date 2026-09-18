import { validateVoucherUseCase } from '@/_domain/voucher/useCases/validateVoucher'

describe('validateVoucherUseCase', () => {
  it('normalizes and returns an active voucher', async () => {
    const repo = {
      getByCode: jest.fn().mockResolvedValue({
        code: 'SUMMER10',
        percentage: 10,
        active: true,
      }),
    }

    const result = await validateVoucherUseCase(repo, ' summer10 ')

    expect(repo.getByCode).toHaveBeenCalledWith('SUMMER10')
    expect(result).toEqual({
      valid: true,
      voucher: { code: 'SUMMER10', percentage: 10 },
    })
  })

  it('rejects inactive vouchers', async () => {
    const repo = {
      getByCode: jest.fn().mockResolvedValue({
        code: 'SUMMER10',
        percentage: 10,
        active: false,
      }),
    }

    await expect(validateVoucherUseCase(repo, 'SUMMER10')).resolves.toEqual({
      valid: false,
      reason: 'Invalid voucher',
    })
  })
})
