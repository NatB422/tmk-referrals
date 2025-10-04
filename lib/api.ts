import axios from 'axios'

const COVERAGE_API = process.env.NEXT_PUBLIC_COVERAGE_API || ''
const SHOPS_API = process.env.NEXT_PUBLIC_SHOPS_API || ''

export async function checkCoverage(postcode: string): Promise<number | null> {
  const url = `${COVERAGE_API}?postcode=${encodeURIComponent(postcode)}`
//   const res = await axios.get(url)
  // expecting { coverage: null } or { cove'rage: 2765 }
  if (postcode == "AL7 1AA") {
    return 2765
  } else {
    return null
  }
}

export async function findShops(postcode: string): Promise<any[]> {
  const url = `${SHOPS_API}?postcode=${encodeURIComponent(postcode)}`
//   const res = await axios.get(url)
  return [
    {
      address: "Corner Shop, Your Street, Your Town, AL7 1HJ",
      geolocation: {"lat": 52, "lon": 0},
      distanceFromPostcode: 0.1,
    },
    {
      address: "ANother Corner Shop, Another Street, Another Town, AL8 1HJ",
      geolocation: {"lat": 52.1, "lon": 0.1},
      distanceFromPostcode: 0.5,
    }
  ] // res.data ?? []
}
