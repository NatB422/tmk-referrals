import { useState } from 'react'
import dynamic from 'next/dynamic'

const QRCodeLogo = dynamic(() => import('react-qrcode-logo').then(mod => mod.QRCode), { ssr: false })

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
            {typeof window !== 'undefined' && (() => {
              const QR: any = QRCodeLogo as any
              return (
                <QR
                  value={`${window.location.origin}/ref/${result.code}`}
                  size={256}
                  // using the external logo the user requested
                  logoImage={'https://themightykitchen.com/cdn/shop/t/6/assets/favicon.ico'}
                  logoWidth={56}
                  logoHeight={56}
                  logoOpacity={1}
                  logoPadding={6}
                  removeQrCodeBehindLogo={false}
                />
              )
            })()}
          </div>
          <div style={{ marginTop: 8 }}>Link: <a href={`/?referral=${result.code}`}>{`${window.location.origin}/?referral=${result.code}`}</a></div>
        </div>
      )}
    </main>
  )
}
