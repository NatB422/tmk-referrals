import type { NextApiRequest, NextApiResponse } from 'next'
import { createReferralForPostcode } from '../../../lib/referrals'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { postcode } = req.body || {}
  if (!postcode) return res.status(400).json({ error: 'postcode required' })
  const r = createReferralForPostcode(postcode)
  return res.status(201).json(r)
}
