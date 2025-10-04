import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { code } = ctx.query
  if (!code) return { notFound: true }
  // redirect to main page with referral query param
  return {
    redirect: {
      destination: `/?referral=${encodeURIComponent(String(code))}`,
      permanent: false,
    },
  }
}

export default function Ref() {
  // This page only redirects server-side. Fallback UI if JS runs here.
  return <main style={{ padding: 20 }}>Redirecting...</main>
}
