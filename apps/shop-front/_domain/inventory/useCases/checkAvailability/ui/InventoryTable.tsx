'use client'

import type { InventoryItem } from '@/_domain/inventory/model'

interface Props {
  inventory: InventoryItem[]
}

export const InventoryTable = ({ inventory }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>In Stock</th>
            <th>Reserved</th>
            <th>Available</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.productId}>
              <td>{item.productId}</td>
              <td>{item.stockCount}</td>
              <td>{item.reservedCount}</td>
              <td>
                <span
                  className={`badge ${
                    item.stockCount - item.reservedCount > 10
                      ? 'badge-success'
                      : item.stockCount - item.reservedCount > 0
                        ? 'badge-warning'
                        : 'badge-error'
                  }`}
                >
                  {item.stockCount - item.reservedCount}
                </span>
              </td>
              <td>{new Date(item.lastUpdated).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
