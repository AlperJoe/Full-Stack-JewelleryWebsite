import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "./App.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import FilterBar from './components/FilterBar';

function App() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  
  useEffect(() => {
    const query = new URLSearchParams();
  
    if (filters.minPrice) query.append("minPrice", filters.minPrice);
    if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
    if (filters.minPopularity) query.append("minPopularity", filters.minPopularity);
  
    axios
      .get(`http://localhost:3000/api/products?${query.toString()}`)
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, [filters]);
  
  

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // let useEffect handle request
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900,  settings: { slidesToShow: 2 } },
      { breakpoint: 600,  settings: { slidesToShow: 1 } },
    ]
  };

  return (
    <div className="App">
      <h1>first-hand jewelry from Africa</h1>
      <FilterBar onFilter={handleFilterChange} />
      <Slider {...settings}>
        {products.map((product, index) => (
          <ProductCard key={index} data={product} />
        ))}
      </Slider>
    </div>
  );
}

function ProductCard({ data }) {
  const [color, setColor] = useState("yellow");

  return (
    <div className="card">
      <img src={data.images[color]} alt={data.name} />
      <h2>{data.name}</h2>
      <p>{data.price}</p>

      <div className="color-picker">
        {["yellow", "white", "rose"].map((c) => (
          <span
            key={c}
            className={`color-dot ${c} ${color === c ? "active" : ""}`}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <p style={{ fontSize: '12px', color: '#555' }}>
        {color === 'yellow' ? 'Yellow Gold' : color === 'white' ? 'White Gold' : 'Rose Gold'}
      </p>

      <div className="star-rating">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < Math.floor(data.starRating);
          const half = data.starRating - i >= 0.5 && data.starRating - i < 1;
          return (
            <span key={i} style={{ color: '#f5b301', fontSize: '16px' }}>
              {filled ? '★' : half ? '⯨' : '☆'}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default App;
