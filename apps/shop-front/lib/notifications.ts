/**
 * Notification service stub.
 * Planned for Q3 2024 to send email confirmations via SES.
 * Currently not wired up because we are waiting for the marketing team
 * to finalize email templates.
 */

export interface NotificationPayload {
  to: string
  subject: string
  body: string
  templateId?: string
}

export async function sendNotification(_payload: NotificationPayload): Promise<boolean> {
  console.log('[Notification] Would send email (disabled)')
  return true
}

export function formatOrderConfirmationEmail(orderId: string, total: number): string {
  return `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order!</p>
    <p>Order ID: ${orderId}</p>
    <p>Total: ${total.toFixed(2)} €</p>
  `
}
