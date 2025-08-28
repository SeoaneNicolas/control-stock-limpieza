import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductModal from './components/ProductModal';
import { Product } from './types/Product';
import './App.css';

// Omitimos 'id' pero ahora también 'imageUrl' al crear, ya que se generará automáticamente
type NewProduct = Omit<Product, 'id' | 'imageUrl'>;

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        return JSON.parse(storedProducts);
      }
    } catch (error) {
      console.error("Error parsing products from localStorage", error);
    }
    // Si no hay nada en localStorage, o hay un error, se usa la lista por defecto.
    return [
      { id: 1, name: 'Lavandina', description: 'Botella de 1L', price: 150.0, stock: 50, imageUrl: 'https://picsum.photos/seed/lavandina/400/300' },
      { id: 2, name: 'Detergente', description: 'Botella de 500ml', price: 120.5, stock: 40, imageUrl: 'https://picsum.photos/seed/detergente/400/300' },
      { id: 3, name: 'Limpiador Multiuso', description: 'Aerosol de 750ml', price: 200.0, stock: 60, imageUrl: 'https://picsum.photos/seed/limpiador/400/300' },
      { id: 4, name: 'Bolsas de Residuos', description: 'Paquete de 20 unidades', price: 80.0, stock: 100, imageUrl: 'https://picsum.photos/seed/bolsas/400/300' },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error("Error saving products to localStorage", error);
    }
  }, [products]);

  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCloseModal = () => {
    setShowModal(false);
    setProductToEdit(null);
  };
  
  const handleShowModal = () => {
    setProductToEdit(null);
    setShowModal(true);
  };

  const handleStartEdit = (product: Product) => {
    setProductToEdit(product);
    setShowModal(true);
  };

  const handleAddProduct = (productToAdd: NewProduct) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: newId,
      ...productToAdd,
      // Genera una imagen única basada en el nuevo ID
      imageUrl: `https://picsum.photos/seed/${newId}/400/300`,
    };
    setProducts([...products, newProduct]);
    handleCloseModal();
  };

  const handleStockChange = (productId: number, amount: number) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, stock: Math.max(0, p.stock + amount) } // Evita stock negativo
        : p
    ));
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    handleCloseModal();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Container className="mt-4">
        <ProductList 
          products={filteredProducts} 
          onAddProduct={handleShowModal} 
          onStockChange={handleStockChange} 
          onDeleteProduct={handleDeleteProduct}
          onStartEdit={handleStartEdit}
        />
      </Container>
      <ProductModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        onAddProduct={handleAddProduct} 
        onUpdateProduct={handleUpdateProduct}
        productToEdit={productToEdit}
      />
    </div>
  );
}

export default App;
