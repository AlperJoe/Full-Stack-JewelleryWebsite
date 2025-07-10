import React, { useState } from 'react';
import './FilterBar.css';

export default function FilterBar({ onFilter }) {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPopularity, setMinPopularity] = useState(0);

  const apply = () => {
    const filters = {};
    if (minPrice.trim()) filters.minPrice = minPrice.trim();
    if (maxPrice.trim()) filters.maxPrice = maxPrice.trim();
    if (minPopularity > 0) filters.minPopularity = (minPopularity / 5).toFixed(2);

    onFilter(filters);
  };

  const clear = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinPopularity(0);
    onFilter({}); // reset filters
  };

  return (
    <div className="filter-bar">
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <div className="star-picker">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setMinPopularity(star)}
            style={{
              cursor: 'pointer',
              fontSize: '24px',
              color: star <= minPopularity ? '#f5b301' : '#ccc',
              transition: 'color 0.2s'
            }}
          >
            ★
          </span>
        ))}
        <span style={{ marginLeft: '8px', fontSize: '14px' }}>
          Min Rating: {minPopularity} ⭐
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={apply}>Apply Filters</button>
        <button onClick={clear} style={{ backgroundColor: '#aaa' }}>
          Reset
        </button>
      </div>
    </div>
  );
}
