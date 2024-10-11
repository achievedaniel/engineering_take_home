import React, { useState, useEffect } from 'react';

const BuildingList = () => {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    fetch('/buildings/')
      .then(response => response.json())
      .then(data => setBuildings(data.buildings));
  }, []);

  return (
    <div>
    {buildings.map((building) => (
      <div key={building.id} >
        <h3>{building.client_name}</h3>
        <p>{building.address}</p>
        <p>{building.name}</p>
        <p>{building.zip}</p>
      </div>
    ))}
  </div>
);
};

export default BuildingList;