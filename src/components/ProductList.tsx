import React from 'react';
import { Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { Product } from '../types/Product';

interface ProductListProps {
  products: Product[];
  onAddProduct: () => void;
  onStockChange: (productId: number, amount: number) => void;
  onDeleteProduct: (productId: number) => void;
  onStartEdit: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddProduct, onStockChange, onDeleteProduct, onStartEdit }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Inventario</h1>
        <Button variant="success" size="lg" onClick={onAddProduct}>+ Añadir Producto</Button>
      </div>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <Card 
              className="product-card h-100" 
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            >
              <div className="card-body-overlay">
                <div>
                  <Card.Title className="d-flex justify-content-between align-items-start">
                    {product.name}
                    <Badge bg={product.stock > 0 ? 'success' : 'danger'} pill>
                      {product.stock} en Stock
                    </Badge>
                  </Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <Card.Text className="fs-4 fw-bold">${product.price.toFixed(2)}</Card.Text>
                </div>
                <div className="mt-4">
                  <div className="d-flex justify-content-between mb-2">
                    <Button variant="outline-light" size="sm" onClick={() => onStockChange(product.id, -1)}>-1</Button>
                    <span className="mx-2">Ajustar Stock</span>
                    <Button variant="outline-light" size="sm" onClick={() => onStockChange(product.id, 1)}>+1</Button>
                  </div>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" onClick={() => onStartEdit(product)}>Editar</Button>
                    <Button variant="outline-danger" onClick={() => onDeleteProduct(product.id)}>Eliminar</Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProductList;