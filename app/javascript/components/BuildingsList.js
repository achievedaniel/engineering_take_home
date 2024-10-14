import React, { useState, useEffect } from 'react';

const BuildingList = () => {
  const [buildings, setBuildings] = useState([]);

  const filterBuildingKeys = (obj) => {
    let notCustom = ["id", "address", "zip", "state", "client", "client_id"]
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !notCustom.includes(key))
    );
  }

  useEffect(() => {
    fetch('/buildings.json/')
      .then(response => response.json())
      .then(data => setBuildings(data.buildings));
  }, []);

  return (
    <div className="App">
      {buildings.map((building) => (
        <div key={building.id} >
          <div className="card">
          <h3 className="card-title">{building.client}</h3>
          <p className="card-content">Adress: {building.address} {building.state} {building.zip}</p>
          {Object.entries(filterBuildingKeys(building)).map(([key, value]) => (
              <p className="card-content" key={key}>{key}: {value}</p>
            ))}
          <button className="card-button" data-action="click->navigation#renderUpdate" data-building={building.id} data-client={building.client_id}>Update</button>
          <button className="card-button" data-action="click->navigation#renderDestroy" data-building={building.id} >Remove</button>
        </div>
        </div>
      ))}
      <div data-navigation-target="container">
        <button data-action="click->navigation#renderNew" className="card-button blue-btn" data-client="1">Create New Building</button>
      </div>
  </div>
);
};

export default BuildingList;
