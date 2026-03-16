import { Link } from "@tanstack/react-router"

export default function Header() {
  return (
    <header>
      <Link to="/">Home</Link>
      <Link to="/facts">Facts</Link>
    </header>
  )
}
