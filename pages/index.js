import Head from "next/head"
import Link from "next/link"
import { connectToDatabase } from "../util/mongodb"

import Header from "./../components/Header"
import PropertyCard from "./../components/PropertyCard"

export default function Home({ properties }) {
  return (
    <div className="container">
      <Head>
        <title>Nextbnb</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Next.js project with MongoDB Atlas."
        />
        <meta
          property="og:image"
          content="https://nextbnb-pi.vercel.app/nextbnb_cover.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://nextbnb-pi.vercel.app/" />
        <meta property="twitter:title" content="Nextbnb" />
        <meta
          property="twitter:description"
          content="Next.js project with MongoDB Atlas."
        />
        <meta
          property="twitter:image"
          content="https://nextbnb-pi.vercel.app/nextbnb_cover.png"
        />
      </Head>

      <nav>
        <Link href="/search">
          <a className="button searchButton">
            <span>Search</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </Link>
      </nav>

      <Header />

      <main>
        <div className="grid">
          {properties &&
            properties.map((property) => (
              <PropertyCard property={property} key={property.id} />
            ))}
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase()

  const data = await db
    .collection("listingsAndReviews")
    .find()
    .sort({ _id: 1 })
    .limit(40)
    .toArray()

  const properties = data.map((property) => {
    const price = JSON.parse(JSON.stringify(property.price))

    let cleaningFee = 0
    if (property.cleaning_fee !== undefined) {
      cleaningFee = JSON.parse(JSON.stringify(property.cleaning_fee))
      cleaningFee = cleaningFee.$numberDecimal
    }

    return {
      id: property._id,
      name: property.name,
      summary: property.summary,
      img: property.images.picture_url,
      address: property.address,
      guests: property.accommodates,
      price: price.$numberDecimal,
      cleaning_fee: cleaningFee,
    }
  })

  return {
    props: { properties },
  }
}
