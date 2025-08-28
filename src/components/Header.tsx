import React from 'react';
import { Navbar, Container, Form } from 'react-bootstrap';
import DolarCotizacion from './DolarCotizacion'; // Importar el nuevo componente

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <Navbar expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand href="#home" className="fw-bold">Gestor de Stock</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="d-flex align-items-center me-auto">
            <DolarCotizacion />
          </div>
          
          <Form className="d-flex mt-3 mt-lg-0">
            <Form.Control
              type="search"
              placeholder="Buscar producto..."
              className="me-2"
              aria-label="Buscar"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;