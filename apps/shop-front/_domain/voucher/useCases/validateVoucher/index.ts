import type { VoucherRepo } from '@/_domain/voucher/repo'

export type ValidateVoucherResult =
  | { valid: true; voucher: { code: string; percentage: number } }
  | { valid: false; reason: string }

export async function validateVoucherUseCase(repo: VoucherRepo, code: string): Promise<ValidateVoucherResult> {
  const normalizedCode = code.trim().toUpperCase()

  if (!normalizedCode) {
    return { valid: false, reason: 'Enter a voucher code' }
  }

  const voucher = await repo.getByCode(normalizedCode)

  if (!voucher || !voucher.active) {
    return { valid: false, reason: 'Invalid voucher' }
  }

  return {
    valid: true,
    voucher: {
      code: voucher.code,
      percentage: voucher.percentage,
    },
  }
}
