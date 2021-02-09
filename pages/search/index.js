import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useRef, useEffect } from "react"

import Header from "./../../components/Header"
import PropertyCard from "./../../components/PropertyCard"

export default function Search({ properties }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputElement = useRef(null)

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus()
    }
  }, [])

  useEffect(() => {
    if (properties) {
      setIsLoading(false)
    }
  }, [properties])

  const router = useRouter()

  function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setSearchTerm(event.target["query"].value)

    router.push(`/search/?term=${event.target["query"].value}`)
  }

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

      <Header />

      <main>
        <form onSubmit={handleSubmit}>
          <label for="searchField">Search by location or description</label>
          <input
            ref={inputElement}
            id="searchField"
            placeholder="Search by location or description"
            type="text"
            backgroundColor="white"
            name="query"
          />
          <button type="submit">Search</button>
        </form>
        {!isLoading &&
          (searchTerm.length ? (
            properties.length ? (
              <h2>Search results for {searchTerm}</h2>
            ) : (
              <h2>No results.</h2>
            )
          ) : (
            ""
          ))}

        <div className="grid">
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            properties &&
            properties.map((property) => (
              <PropertyCard property={property} key={property.id} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const res = await fetch(
    `https://nextbnb-pi.vercel.app/api/search?term=${query.term}`
  )
  const data = await res.json()

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
