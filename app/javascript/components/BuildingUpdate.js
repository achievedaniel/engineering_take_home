import React, { useState, useEffect } from 'react';

const BuildingForm = ({ clientid, onSubmit, buildingid }) => {
  const [custom, setCustom] = useState([]);
  const [custom_field, setCustomFields] = useState({
    custom_fields: {},
    custom_types: {} 
  });

  const [building, setBuilding] = useState([]);

  useEffect(() => {
    fetch(`/clients/${clientid}/buildings/${buildingid}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setBuilding(data || {});
      })
  }, []);


  useEffect(() => {
    fetch(`/clients/${clientid}/custom_fields`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCustom(data.custom_fields || []);
      })
      .catch((error) => console.error('Error fetching custom fields:', error));
  }, [clientid]);

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
    const payload = {
      building,
      custom_field
    };

      fetch(`/clients/${clientid}/buildings/${buildingid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) 
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          onSubmit();
          console.log("Form submitted successfully");
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error('Error submitting form:', error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={building.address || 'Enter address'}
          value={building.address}
          onChange={(e) => setBuilding({ ...building, address: e.target.value })}
        />
        <input
          type="text"
          placeholder={building.state}
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