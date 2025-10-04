import type { NextApiRequest, NextApiResponse } from 'next'
import { findReferralByCode } from '../../../lib/referrals'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query
  if (!code || Array.isArray(code)) return res.status(400).json({ error: 'code required' })
  const r = findReferralByCode(code)
  if (!r) return res.status(404).json({ error: 'not found' })
  return res.status(200).json(r)
}
