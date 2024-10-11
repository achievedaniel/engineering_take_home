import React, { useState, useEffect } from 'react';

const BuildingForm = ({ clientId, onSubmit }) => {
    const [custom, setCustom] = useState([]);
    const [custom_field, setCustomFields] = useState({
        custom_fields: {}
    })
    const [building, setBuilding] = useState({
    address: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    // API call using fetch
    fetch('/clients/1/custom_fields')  // replace with the actual API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();  // Parse the JSON from the response
      })
      .then((data) => {
        setCustom(data.custom_fields || []);set // Set the fetched data to state
      })
  }, []);

  const handleCustomFieldChange = (fieldId, value, customType) => {
    setCustomFields((prevState) => ({
      ...prevState,
      custom_fields: {
        ...prevState.custom_fields,
        [fieldId]: value,
      },
      custom_types: {
        ...prevState.custom_types,
        [fieldId]: customType,
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/clients/1/buildings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ building, custom_field })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          onSubmit();
        } else {
          console.error(data.message);
        }
      });
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
    <input
        type="text"
        placeholder="Address"
        value={building.address}
        onChange={(e) => setBuilding({ ...building, address: e.target.value })}
      />
    <input
        type="text"
        placeholder="State"
        value={building.state}
        onChange={(e) => setBuilding({ ...building, state: e.target.value })}
      />
    <input
        type="number"
        placeholder="Zip"
        value={building.zip}
        onChange={(e) => setBuilding({ ...building, zip: e.target.value })}
      />
        {custom.map((field) => (
            <div key={field.id}>
                <label>{field.name}:</label>
                {field.custom_type === 'text' && (
                <input
                    type="text"
                    value={custom_field.custom_fields[field.id] || ''}
                    onChange={(e) => handleCustomFieldChange(field.id, e.target.value, field.custom_type)}
                />
                )}
                {field.custom_type === 'number' && (
                <input
                    type="number"
                    value={custom_field.custom_fields[field.id] || ''}
                    onChange={(e) => handleCustomFieldChange(field.id, e.target.value, field.custom_type)}
                />
                )}
                {field.custom_type === 'enum' && (
                <select
                    value={custom_field.custom_fields[field.id] || ''}
                    onChange={(e) => handleCustomFieldChange(field.id, e.target.value, field.custom_type)}
                >
                    {field.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                        {option}
                    </option>
                    ))}
                </select>
                )}
            </div>
        ))}
      <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default BuildingForm;