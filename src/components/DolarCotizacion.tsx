import React, { useState, useEffect } from 'react';
import { Spinner, Badge } from 'react-bootstrap';

// Definimos una interfaz para la estructura de cada tipo de dólar que esperamos de la API
interface DolarData {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

const DolarCotizacion: React.FC = () => {
  const [oficial, setOficial] = useState<DolarData | null>(null);
  const [blue, setBlue] = useState<DolarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDolarData = async () => {
    try {
      const response = await fetch('https://dolarapi.com/v1/dolares');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: DolarData[] = await response.json();
      
      const oficialData = data.find(d => d.casa === 'oficial');
      const blueData = data.find(d => d.casa === 'blue');

      setOficial(oficialData || null);
      setBlue(blueData || null);
      setError(null);
    } catch (e: any) {
      setError("No se pudo cargar la cotización.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDolarData(); // Primera carga

    const intervalId = setInterval(fetchDolarData, 300000); // Actualiza cada 5 minutos

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  if (loading) {
    return <Spinner animation="border" size="sm" variant="light" />;
  }

  if (error) {
    return <Badge bg="danger">{error}</Badge>;
  }

  return (
    <div className="d-none d-lg-flex align-items-center text-white">
      {oficial && (
        <div className="me-3">
          <span className="me-2">Dólar Oficial:</span>
          <Badge bg="secondary">${oficial.venta}</Badge>
        </div>
      )}
      {blue && (
        <div>
          <span className="me-2">Dólar Blue:</span>
          <Badge bg="primary">${blue.venta}</Badge>
        </div>
      )}
    </div>
  );
};

export default DolarCotizacion;
