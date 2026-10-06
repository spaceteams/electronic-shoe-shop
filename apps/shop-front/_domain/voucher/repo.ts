import type { Voucher } from '@/_domain/voucher/model'

export interface VoucherRepo {
  getByCode: (code: string) => Promise<Voucher | null>
}
