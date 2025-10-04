import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix default icon path issues in some bundlers
delete (L.Icon.Default as any).prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapClient({ shops = [], postcode }: { shops?: any[]; postcode?: string }) {
  // center map on first shop or fallback
  function toLatLng(g: any): [number, number] {
    if (!g) return [51.505, -0.09]
    if (Array.isArray(g) && g.length >= 2) return [Number(g[0]), Number(g[1])]
    if (g.lat !== undefined && g.lon !== undefined) return [Number(g.lat), Number(g.lon)]
    if (g.latitude !== undefined && g.longitude !== undefined) return [Number(g.latitude), Number(g.longitude)]
    return [51.505, -0.09]
  }

  const center: [number, number] = shops.length ? toLatLng(shops[0].geolocation) : [51.505, -0.09]

  useEffect(() => {
    // no-op, placeholder if needed
  }, [shops])

  return (
    <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {shops.map((s, i) => (
        <Marker key={i} position={toLatLng(s.geolocation)}>
          <Popup>
            <div>
              <strong>{s.address}</strong>
              <div>{s.distanceFromPostcode} km</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
