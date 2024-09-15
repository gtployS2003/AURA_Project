import React from "react";
import "./Footer.scss";

function Footer() {
  const currentYear = new Date().getFullYear();  // ใช้เพื่อดึงปีปัจจุบัน
  return (
    <footer className="footer">
      <p>&copy; {currentYear} AURA</p>
    </footer>
  );
}

export default Footer;
