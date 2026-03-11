import { Routes, Route, Link } from 'react-router-dom'
import { Navbar, Container, Nav } from 'react-bootstrap'
import RestaurantList from './pages/RestaurantList'
import RestaurantDetail from './pages/RestaurantDetail'
// Usando pato.png desde public

import './App.css'


function App() {
  return (
    <div className="App">
      <Navbar variant="dark" expand="lg" className="mb-4 shadow-sm sticky-top">
        <Container fluid className="px-5">
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img src={`${import.meta.env.BASE_URL}pato.png`} alt="PlatoClick Logo" className="logo-img" />
            <span className="fw-bold">PlatoClick</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="main-content pb-5">
        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        </Routes>
      </main>

      <footer className="footer py-4 text-center">
        <Container>
          <p className="mb-0 text-muted">© 2026 PlatoClick - Geraldine Ramírez Hernández</p>
        </Container>
      </footer>
    </div>
  )
}

export default App
