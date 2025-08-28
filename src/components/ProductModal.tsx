import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Product } from '../types/Product';

type NewProduct = Omit<Product, 'id'>;

interface ProductModalProps {
  show: boolean;
  handleClose: () => void;
  onAddProduct: (product: NewProduct) => void;
  onUpdateProduct: (product: Product) => void;
  productToEdit: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ show, handleClose, onAddProduct, onUpdateProduct, productToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const isEditing = productToEdit !== null;

  useEffect(() => {
    if (show) {
      if (isEditing) {
        setName(productToEdit.name);
        setDescription(productToEdit.description);
        setPrice(String(productToEdit.price));
        setStock(String(productToEdit.stock));
      } else {
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
      }
    }
  }, [show, productToEdit, isEditing]);

  const handleSave = () => {
    if (!name || !price || !stock) {
      alert('Por favor, complete al menos nombre, precio y stock.');
      return;
    }

    if (isEditing) {
      const updatedProduct: Product = {
        id: productToEdit.id,
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      };
      onUpdateProduct(updatedProduct);
    } else {
      const newProduct: NewProduct = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      };
      onAddProduct(newProduct);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formProductName">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Ej: Lavandina" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProductDescription">
            <Form.Label>Descripción</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Ej: Botella de 1L" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProductPrice">
            <Form.Label>Precio</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Ej: 150.0" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProductStock">
            <Form.Label>Stock Inicial</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Ej: 50" 
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
