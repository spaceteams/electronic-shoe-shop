'use server'

import type { VoucherRepo } from '@/_domain/voucher/repo'

const vouchers = [
  {
    code: 'SUMMER10',
    percentage: 10,
    active: true,
  },
]

export const getVoucher: VoucherRepo['getByCode'] = async (code) => {
  return vouchers.find((voucher) => voucher.code === code) ?? null
}
