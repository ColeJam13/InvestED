import '../styles/MarketsView.css';
import React, { useState } from 'react';
import AssetSearch from '../components/AssetSearch';
import AssetDetails from '../components/AssetDetails';


function MarketsView() {
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  return (
    <div className="markets-view">
      <div className="search-section">
        <h1>Search Assets</h1>
        <AssetSearch onAssetSelect={setSelectedSymbol} />
      </div>
      
      <div className="details-section">
        {selectedSymbol && <AssetDetails symbol={selectedSymbol} />}
      </div>
    </div>
  );
}

export default MarketsView;