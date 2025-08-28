import React from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import { Product } from '../types/Product';

interface ProductTableProps {
  products: Product[];
  onStockChange: (productId: string, amount: number) => void;
  onDeleteProduct: (productId: string) => void;
  onStartEdit: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onStockChange, onDeleteProduct, onStartEdit }) => {
  return (
    <Table striped bordered hover responsive className="mt-4">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>
              <Badge bg={product.stock > 0 ? 'success' : 'danger'} pill>
                {product.stock}
              </Badge>
            </td>
            <td>
              <div className="d-flex flex-column flex-sm-row gap-2">
                <div className="btn-group" role="group">
                  <Button variant="outline-secondary" size="sm" onClick={() => onStockChange(product.id, -1)}>-1</Button>
                  <Button variant="outline-secondary" size="sm" onClick={() => onStockChange(product.id, 1)}>+1</Button>
                </div>
                <div className="btn-group" role="group">
                  <Button variant="outline-primary" size="sm" onClick={() => onStartEdit(product)}>Editar</Button>
                  <Button variant="outline-danger" size="sm" onClick={() => onDeleteProduct(product.id)}>Eliminar</Button>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProductTable;
