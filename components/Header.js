import Link from "next/link"

function Header(props) {
  return (
    <header>
      <Link href="/">
        <a>
          <h1 className="title">Nextbnb</h1>
        </a>
      </Link>
      <p className="description">Somewhere, there's a room for you.</p>
    </header>
  )
}

export default Header
