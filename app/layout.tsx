import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disaster Management System',
  description: 'MVP for disaster prediction and response',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
      </head>
      <body>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" href="/">DisasterResponse MVP</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" href="/">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/alerts">Alerts</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/resources">Resources</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container mt-4">
          {children}
        </div>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"
          async
          defer
        ></script>
      </body>
    </html>
  )
}