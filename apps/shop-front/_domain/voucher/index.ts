import { getVoucher } from '@/_adapter/voucherRepo/getVoucher'
import { withRepo } from '@/_di'
import { validateVoucherUseCase } from '@/_domain/voucher/useCases/validateVoucher'

export const voucherService = {
  validate: withRepo(validateVoucherUseCase, {
    getByCode: getVoucher,
  }),
}
