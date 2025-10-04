import { useState, useEffect } from 'react'
import Head from 'next/head'
import { checkCoverage, findShops } from '../lib/api'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const MapClient = dynamic(() => import('../components/MapClient'), { ssr: false })

export default function Home() {
  const [postcode, setPostcode] = useState('')
  const [orderLoading, setOrderLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', address: '', town: '', postcode: '', product: 'Barista Oat Milk' })
  const [coverage, setCoverage] = useState<number | null | undefined>(undefined)
  const [shops, setShops] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [referralNote, setReferralNote] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const code = router.query.referral as string | undefined
    if (!code) return
    ;(async () => {
      try {
        const res = await fetch(`/api/referral/${encodeURIComponent(code)}`)
        if (!res.ok) {
          setReferralNote(`Referral ${code} not found`)
          return
        }
        const data = await res.json()
        setReferralNote(`Referred by shop postcode ${data.postcode} (code ${data.code})`)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [router.query])

  async function onCheck(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setCoverage(undefined)
    setShops([])
    try {
      const cov = await checkCoverage(postcode)
      setCoverage(cov)
      // always fetch nearby shops to show on the map even when coverage exists
      const nearest = await findShops(postcode)
      setShops(nearest)

    } catch (err) {
      console.error(err)
      alert('Error checking postcode')
    } finally {
      setLoading(false)
      setChecked(true)
    }
  }

  async function onPlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    setOrderLoading(true)
    setOrderSuccess(null)
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form })
      })
      const data = await res.json()
      setOrderSuccess(data?.orderId ?? 'ok')
    } catch (err) {
      console.error(err)
      alert('Order failed')
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Mighty Drinks postcode checker</title>
      </Head>
      <main>
        <h1>Can Mighty Drinks deliver alternative milk to your postcode?</h1>

        <form onSubmit={onCheck} style={{ marginBottom: 16 }}>
          <input value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="Enter postcode" />
          <button type="submit" disabled={loading || !postcode}>Check</button>
        </form>

        {referralNote && (
          <div style={{ background: '#fffae6', padding: 8, marginBottom: 12 }}>
            <strong>{referralNote}</strong>
          </div>
        )}

        {checked && (
        <div>
          <div>
            {coverage ? (
              <div>
                <p>Good news — coverage id: {coverage}</p>

                {!orderSuccess ? (
                  <form onSubmit={onPlaceOrder}>
                    <h2>Place an order</h2>
                    <div>
                      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                    </div>
                    <div>
                      <input placeholder="Town" value={form.town} onChange={e => setForm({ ...form, town: e.target.value })} required />
                    </div>
                    <div>
                      <input placeholder="Postcode" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} required />
                    </div>
                    <div>
                      <label>Product</label>
                      <select value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}>
                        <option>Barista Oat Milk</option>
                        <option>Pea Milk</option>
                        <option>Soya Milk</option>
                      </select>
                    </div>
                    <div>
                      <button type="submit" disabled={orderLoading}>Place order</button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <strong>Order placed — id {orderSuccess}</strong>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>Sorry, we don't deliver to that postcode.</p>
                </div>
            )}
          </div>
          <div>
            <p> Nearest shops:</p>
            <ul>
                {shops.map((s, i) => (
                <li key={i}>{s.address} — {s.distanceFromPostcode} km</li>
                ))}
            </ul>
            <div style={{ height: 400 }}>
                <MapClient shops={shops} postcode={postcode} />
            </div>
          </div>
        </div>
        )}
      </main>
    </div>
  )
}
