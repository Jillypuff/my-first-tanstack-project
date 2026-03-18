import { Link } from "@tanstack/react-router"

export default function Header() {
  return (
    <header>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </header>
  )
}
