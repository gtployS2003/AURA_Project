import "./Header.scss";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="header">
      <NavLink to="/" className="header__logo">
        <p>AURA</p>
      </NavLink>

      <ul className="header__list">
        <NavLink to="/my-outfits" as="li" className="header__list-item">
          My Outfits
        </NavLink>
      </ul>
    </nav>
  );
}
