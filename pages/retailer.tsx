import { useState } from 'react'
import QRCode from 'react-qr-code'

export default function Retailer() {
  const [postcode, setPostcode] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/referral/create', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ postcode }) })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      alert('Failed')
    } finally { setLoading(false) }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Retailer referral code</h1>
      <form onSubmit={onCreate}>
        <input placeholder="Shop postcode" value={postcode} onChange={e=>setPostcode(e.target.value)} required />
        <button type="submit" disabled={loading}>Create referral</button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <div>Referral code: <strong>{result.code}</strong></div>
          <div style={{ background: 'white', display: 'inline-block', padding: 8, marginTop: 8 }}>
            <QRCode value={`${window.location.origin}/ref/${result.code}`} />
          </div>
          <div style={{ marginTop: 8 }}>Link: <a href={`/?referral=${result.code}`}>{`${window.location.origin}/?referral=${result.code}`}</a></div>
        </div>
      )}
    </main>
  )
}
