import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productsService";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header/>
        <main className="flex-1">
          <div className="bg-gray-50 min-h-screen container mx-auto px-4 lg:px-8 py-8">
            <p className="text-center text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer/>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
    <Header/>
    <main className="flex-1">
      <div className="bg-gray-50 min-h-screen container mx-auto px-4 lg:px-8 py-8">
        
      </div>
    </main>
    <Footer/>
  </div>
  )
}

export default ProductDetails;