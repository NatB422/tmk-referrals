import type { NextApiRequest, NextApiResponse } from 'next'

type Order = {
  name: string
  address: string
  town: string
  postcode: string
  product: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const body = req.body as Order
  // Basic validation
  if (!body?.name || !body?.address || !body?.postcode || !body?.product) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  // In a real app you'd persist the order and return an id
  const orderId = `ORD-${Date.now()}`
  return res.status(201).json({ orderId, received: body })
}
