import React, { useState } from 'react';
import styled from 'styled-components';
import { useNutrition } from '../../context/NutritionContext';
import { v4 as uuidv4 } from 'uuid';

const Container = styled.div`
  margin-bottom: 20px;
`;

const FoodTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  th {
    background-color: ${props => props.theme.colors.background2};
    font-weight: bold;
  }
  
  tr:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  flex: 1;
  min-width: 80px;
`;

const Button = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const ActionButton = styled(Button)`
  padding: 5px 10px;
  margin-right: 5px;
  background-color: ${props => props.danger 
    ? props.theme.colors.error 
    : props.theme.colors.secondary};
  
  &:hover {
    background-color: ${props => props.danger 
      ? props.theme.colors.errorDark 
      : props.theme.colors.secondaryDark};
  }
`;

const SearchInput = styled(Input)`
  margin-bottom: 15px;
  width: 100%;
  max-width: 300px;
`;

function FoodItemList() {
  const { state, dispatch } = useNutrition();
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    portion: ''
  });
  const [editingId, setEditingId] = useState(null);

  const filteredItems = state.foodItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: name === 'name' || name === 'portion' ? value : Number(value) }));
  };

  const addFoodItem = () => {
    // Validate inputs
    if (!newItem.name || !newItem.calories) {
      alert('Name and calories are required!');
      return;
    }

    const itemToAdd = {
      ...newItem,
      id: uuidv4()
    };

    dispatch({ type: 'ADD_FOOD_ITEM', payload: itemToAdd });
    
    // Reset form
    setNewItem({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      portion: ''
    });
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setNewItem(item);
  };

  const updateFoodItem = () => {
    dispatch({ type: 'UPDATE_FOOD_ITEM', payload: newItem });
    setEditingId(null);
    setNewItem({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      portion: ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewItem({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      portion: ''
    });
  };

  const deleteFoodItem = (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      dispatch({ type: 'DELETE_FOOD_ITEM', payload: id });
    }
  };

  return (
    <Container>
      <h2>Lebensmittel-Datenbank</h2>
      
      <SearchInput 
        type="text" 
        placeholder="Suche nach Lebensmitteln..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <FormRow>
        <Input 
          type="text" 
          name="name"
          placeholder="Name" 
          value={newItem.name} 
          onChange={handleInputChange}
        />
        <Input 
          type="number" 
          name="calories"
          placeholder="Kalorien" 
          value={newItem.calories} 
          onChange={handleInputChange}
        />
        <Input 
          type="number" 
          name="protein"
          placeholder="Protein (g)" 
          value={newItem.protein} 
          onChange={handleInputChange}
        />
        <Input 
          type="number" 
          name="carbs"
          placeholder="Kohlenhydrate (g)" 
          value={newItem.carbs} 
          onChange={handleInputChange}
        />
        <Input 
          type="number" 
          name="fat"
          placeholder="Fett (g)" 
          value={newItem.fat} 
          onChange={handleInputChange}
        />
        <Input 
          type="text" 
          name="portion"
          placeholder="Portion (z.B. 100g)" 
          value={newItem.portion} 
          onChange={handleInputChange}
        />
        
        {editingId ? (
          <>
            <Button onClick={updateFoodItem}>Aktualisieren</Button>
            <Button onClick={cancelEditing}>Abbrechen</Button>
          </>
        ) : (
          <Button onClick={addFoodItem}>Hinzufügen</Button>
        )}
      </FormRow>
      
      <FoodTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Kalorien</th>
            <th>Protein (g)</th>
            <th>Kohlenhydrate (g)</th>
            <th>Fett (g)</th>
            <th>Portion</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.calories}</td>
              <td>{item.protein}</td>
              <td>{item.carbs}</td>
              <td>{item.fat}</td>
              <td>{item.portion}</td>
              <td>
                <ActionButton onClick={() => startEditing(item)}>Bearbeiten</ActionButton>
                <ActionButton danger onClick={() => deleteFoodItem(item.id)}>Löschen</ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </FoodTable>
    </Container>
  );
}

export default FoodItemList; 