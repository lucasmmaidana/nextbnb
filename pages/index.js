import Head from "next/head"
import { connectToDatabase } from "../util/mongodb"

import Header from "./../components/Header"
import PropertyCard from "./../components/PropertyCard"

export default function Home({ properties }) {
  return (
    <div className="container">
      <Head>
        <title>Nextbnb</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
