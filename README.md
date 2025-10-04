# Mighty Drinks postcode checker (Next.js)

Simple Next.js app to check whether Mighty Drinks delivers alternative milk to a postcode. If not covered, shows nearest shops and a map.

Environment variables (create a `.env.local`):

- NEXT_PUBLIC_COVERAGE_API - e.g. https://api.example.com/coverage
- NEXT_PUBLIC_SHOPS_API - e.g. https://api.example.com/shops

API expectations:
- Coverage: GET {coverage_api}?postcode=SW1A1AA returns JSON {"coverage": null} or {"coverage": 2765}
- Shops: GET {shops_api}?postcode=SW1A1AA returns JSON array [{"address": "...", "geolocation": [lat, lon], "distanceFromPostcode": 1.23}, ...]

Run

```
npm install
npm run dev
```
