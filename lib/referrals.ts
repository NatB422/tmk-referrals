import fs from 'fs'
import path from 'path'

type Referral = { code: string; postcode: string; createdAt: string }

const DATA_PATH = path.resolve(process.cwd(), 'data')
const FILE = path.join(DATA_PATH, 'referrals.json')

let referrals: Referral[] = []

function load() {
  try {
    if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH, { recursive: true })
    if (fs.existsSync(FILE)) {
      const raw = fs.readFileSync(FILE, 'utf8')
      referrals = JSON.parse(raw)
    } else {
      referrals = []
      fs.writeFileSync(FILE, JSON.stringify(referrals, null, 2))
    }
  } catch (err) {
    console.error('Failed to load referrals', err)
    referrals = []
  }
}

function save() {
  try {
    if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH, { recursive: true })
    fs.writeFileSync(FILE, JSON.stringify(referrals, null, 2), 'utf8')
  } catch (err) {
    console.error('Failed to save referrals', err)
  }
}

load()

export function createReferralForPostcode(postcode: string): Referral {
  const code = `REF-${postcode.replace(/\s+/g, '').toUpperCase()}-${Date.now()}`
  const r: Referral = { code, postcode, createdAt: new Date().toISOString() }
  referrals.push(r)
  save()
  return r
}

export function findReferralByCode(code: string) {
  return referrals.find(r => r.code === code) ?? null
}

export function findReferralByPostcode(postcode: string) {
  return referrals.find(r => r.postcode.replace(/\s+/g,'').toUpperCase() === postcode.replace(/\s+/g,'').toUpperCase()) ?? null
}
