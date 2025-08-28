import React, { useState, useEffect } from 'react';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import { Product } from './types/Product';
import './App.css';

type NewProduct = Omit<Product, 'id' | 'imageUrl'>;
type ViewMode = 'board' | 'list';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ ...doc.data(), id: doc.id } as Product);
      });
      setProducts(productsData);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('board');

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

  const handleAddProduct = async (productToAdd: NewProduct) => {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...productToAdd,
        imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    handleCloseModal();
  };

  const handleStockChange = async (productId: string, amount: number) => {
    const productRef = doc(db, "products", productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      const newStock = Math.max(0, product.stock + amount);
      await updateDoc(productRef, { stock: newStock });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      await deleteDoc(doc(db, "products", productId));
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    const productRef = doc(db, "products", updatedProduct.id);
    const { id, ...productData } = updatedProduct;
    await updateDoc(productRef, productData);
    handleCloseModal();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Inventario</h1>
          <div>
            <ButtonGroup className="me-2">
              <Button variant={viewMode === 'board' ? 'primary' : 'outline-primary'} onClick={() => setViewMode('board')}>Tarjetas</Button>
              <Button variant={viewMode === 'list' ? 'primary' : 'outline-primary'} onClick={() => setViewMode('list')}>Lista</Button>
            </ButtonGroup>
            <Button variant="success" size="lg" onClick={handleShowModal}>+ Añadir Producto</Button>
          </div>
        </div>
        {viewMode === 'board' ? (
          <ProductList 
            products={filteredProducts} 
            onStockChange={handleStockChange} 
            onDeleteProduct={handleDeleteProduct}
            onStartEdit={handleStartEdit}
          />
        ) : (
          <ProductTable
            products={filteredProducts}
            onStockChange={handleStockChange}
            onDeleteProduct={handleDeleteProduct}
            onStartEdit={handleStartEdit}
          />
        )}
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