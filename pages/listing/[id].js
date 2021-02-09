import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { connectToDatabase } from "../../util/mongodb"
import Header from "../../components/Header"

export default function Listing({ property }) {
  const router = useRouter()
  return (
    <div className="container">
      <Head>
        <title>{property && property.name} | Nextbnb</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <Link href="/">
          <a onClick={() => router.back()} className="go_back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go back
          </a>
        </Link>
        {property ? (
          <div>
            <div className="columns">
              <img src={property.images.picture_url} alt="" />
              <div className="property_info">
                <div className="primary_info">
                  <h3>{property.name}</h3>
                  <p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {property.address.street}
                  </p>
                  <p>
                    {property.accommodates} guests - {property.bedrooms}{" "}
                    bedrooms - {Math.floor(property.bathrooms.$numberDecimal)}{" "}
                    bathrooms
                  </p>
                </div>
                <p>{property.description}</p>
                <a className="button" href={property.listing_url}>
                  Check availability
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="loader">Loading...</div>
        )}
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
        accommodates: 1,
        bedrooms: 1,
        bathrooms: 1,
        description: 1,
        price: 1,
        cleaning_fee: 1,
        amenities: 1,
        listing_url: 1,
      },
    }
  )

  return {
    props: { property: JSON.parse(JSON.stringify(data)) },
    revalidate: 1,
  }
}
