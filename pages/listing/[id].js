import Head from "next/head"
import { connectToDatabase } from "../../util/mongodb"
import Header from "../../components/Header"

export default function Listing({ property }) {
  return (
    <div className="container">
      <Head>
        <title>{property && property.name} | Nextbnb</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        <div className="grid">
          {property ? (
            <div>
              <img src={property.images.picture_url} alt="" />
              <h3>{property.name}</h3>
              <p>{property.address.street}</p>
              <p>{property.summary}</p>
            </div>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </main>
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const { db } = await connectToDatabase()

  const data = await db.collection("listingsAndReviews").findOne(
    {
      _id: params.id,
    },
    {
      projection: {
        name: 1,
        images: 1,
        address: 1,
        summary: 1,
        price: 1,
        cleaning_fee: 1,
        amenities: 1,
      },
    }
  )

  return {
    props: { property: JSON.parse(JSON.stringify(data)) },
    revalidate: 1,
  }
}
