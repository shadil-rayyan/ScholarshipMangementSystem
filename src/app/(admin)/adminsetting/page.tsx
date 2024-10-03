'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DropdownItem {
  id: string;
  name: string;
}

const AdminPanel = () => {
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const [occupations, setOccupations] = useState<DropdownItem[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [newOccupation, setNewOccupation] = useState<string>('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingOccupationId, setEditingOccupationId] = useState<string | null>(null);
  const [categoryEditValue, setCategoryEditValue] = useState<string>('');
  const [occupationEditValue, setOccupationEditValue] = useState<string>('');

  // Fetch categories and occupations on load
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const categoryResponse = await axios.get('/api/admin/categories');
        const occupationResponse = await axios.get('/api/admin/occupations');
        setCategories(categoryResponse.data);
        setOccupations(occupationResponse.data);
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    };
    fetchDropdownOptions();
  }, []);

  // Handle adding new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert('Category name cannot be empty!');
    try {
      const response = await axios.post('/api/admin/categories/addCategories', { name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };


  const handleDeleteCategory = async (id: string) => {
    try {
      await axios.delete(`/api/admin/categories/deleteCategories?id=${id}`); // Include the query parameter `id`
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // // Handle editing an category
  // const handleEditCategory = async (id: string) => {
  //   if (!categoryEditValue.trim()) return alert('Category name cannot be empty!');

  //   try {
  //     console.log("Editing category with ID:", id); // Log the ID being edited
  //     const response = await axios.put(`/api/admin/categories/editCategories/${id}`, { name: categoryEditValue });
  //     setCategories(categories.map((category) => (category.id === id ? response.data : category)));
  //     setEditingCategoryId(null);
  //     setCategoryEditValue('');
  //   } catch (error) {
  //     console.error('Error editing category:', error);
  //   }
  // };



  // Handle adding new occupation
  const handleAddOccupation = async () => {
    if (!newOccupation.trim()) return alert('Occupation name cannot be empty!');
    try {
      const response = await axios.post('/api/admin/occupations/addOccupations', { name: newOccupation });
      setOccupations([...occupations, response.data]);
      setNewOccupation('');
    } catch (error) {
      console.error('Error adding occupation:', error);
    }
  };

  // Handle deleting an occupation
  const handleDeleteOccupation = async (id: string) => {
    try {
      await axios.delete(`/api/admin/occupations?id=${id}`);
      setOccupations(occupations.filter((occupation) => occupation.id !== id));
    } catch (error) {
      console.error('Error deleting occupation:', error);
    }
  };

  // Handle editing an occupation
  const handleEditOccupation = async (id: string) => {
    if (!occupationEditValue.trim()) return alert('Occupation name cannot be empty!');
    try {
      const response = await axios.put(`/api/admin/occupations/${id}`, { name: occupationEditValue });
      setOccupations(
        occupations.map((occupation) => (occupation.id === id ? response.data : occupation))
      );
      setEditingOccupationId(null);
      setOccupationEditValue('');
    } catch (error) {
      console.error('Error editing occupation:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* Categories Management */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
        <ul className="mb-4">
          {categories.map((category) => (
            <li key={category.id} className="flex justify-between items-center mb-2">
              {editingCategoryId === category.id ? (
                <>
                  <input
                    type="text"
                    className="border px-4 py-2 rounded mr-2"
                    value={categoryEditValue}
                    onChange={(e) => setCategoryEditValue(e.target.value)}
                  />
                  {/* <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEditCategory(category.id)}
                  >
                    Save
                  </button> */}
                  {/* <button
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                    onClick={() => setEditingCategoryId(null)}
                  >
                    Cancel
                  </button> */}
                </>
              ) : (
                <>
                  {category.name}
                  <div>
                    {/* <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => {
                        setEditingCategoryId(category.id);
                        setCategoryEditValue(category.name);
                      }}
                    >
                      Edit
                    </button> */}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center mb-4">
          <input
            type="text"
            className="border px-4 py-2 rounded mr-2"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddCategory}>
            Add Category
          </button>
        </div>
      </div>

      {/* Occupations Management */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Manage Occupations</h2>
        <ul className="mb-4">
          {occupations.map((occupation) => (
            <li key={occupation.id} className="flex justify-between items-center mb-2">
              {editingOccupationId === occupation.id ? (
                <>
                  <input
                    type="text"
                    className="border px-4 py-2 rounded mr-2"
                    value={occupationEditValue}
                    onChange={(e) => setOccupationEditValue(e.target.value)}
                  />
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEditOccupation(occupation.id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                    onClick={() => setEditingOccupationId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {occupation.name}
                  <div>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => {
                        setEditingOccupationId(occupation.id);
                        setOccupationEditValue(occupation.name);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteOccupation(occupation.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center mb-4">
          <input
            type="text"
            className="border px-4 py-2 rounded mr-2"
            placeholder="New Occupation"
            value={newOccupation}
            onChange={(e) => setNewOccupation(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddOccupation}>
            Add Occupation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
