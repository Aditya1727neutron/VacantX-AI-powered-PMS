import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-brand">VacantX</span>
          <span className="footer-copy">© 2026 VacantX. University Campus Parking System · IT Support</span>
        </div>
        <div className="footer-right">
          <span className="footer-status">
            <span className="status-dot"></span>
            System Online
          </span>
        </div>
      </div>
    </footer>
  );
}
