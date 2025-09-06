'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DropdownItem {
  id: string;
  name: string;
}

const DropdownSettingsPage = () => {
    const [categories, setCategories] = useState<DropdownItem[]>([]);
    const [occupations, setOccupations] = useState<DropdownItem[]>([]);
    const [newCategory, setNewCategory] = useState<string>('');
    const [newOccupation, setNewOccupation] = useState<string>('');

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingItemValue, setEditingItemValue] = useState<string>('');

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryRes, occupationRes] = await Promise.all([
                    axios.get('/api/admin/categories'),
                    axios.get('/api/admin/occupations')
                ]);
                setCategories(categoryRes.data);
                setOccupations(occupationRes.data);
            } catch (error) {
                console.error('Error fetching dropdown options:', error);
            }
        };
        fetchData();
    }, []);

    // --- Generic Handlers for Categories and Occupations ---

    const handleAddItem = async (type: 'category' | 'occupation') => {
        const name = type === 'category' ? newCategory.trim() : newOccupation.trim();
        const endpoint = type === 'category' ? '/api/admin/categories/addCategories' : '/api/admin/occupations/addOccupations';
        const setData = type === 'category' ? setCategories : setOccupations;
        const setNewItem = type === 'category' ? setNewCategory : setNewOccupation;

        if (!name) return alert('Name cannot be empty!');
        try {
            const response = await axios.post(endpoint, { name });
            setData(prev => [...prev, response.data]);
            setNewItem('');
        } catch (error) {
            console.error(`Error adding ${type}:`, error);
        }
    };

    const handleDeleteItem = async (id: string, type: 'category' | 'occupation') => {
        const endpoint = type === 'category' ? `/api/admin/categories/deleteCategories?id=${id}` : `/api/admin/occupations/deleteOccupations?id=${id}`;
        const setData = type === 'category' ? setCategories : setOccupations;

        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            await axios.delete(endpoint);
            setData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
        }
    };

    const handleUpdateItem = async (type: 'category' | 'occupation') => {
        if (!editingItemId || !editingItemValue.trim()) return;
        
        // Note: You need to create these update API endpoints
        const endpoint = type === 'category' ? `/api/admin/categories/updateCategory` : `/api/admin/occupations/updateOccupation`;
        const setData = type === 'category' ? setCategories : setOccupations;

        try {
            await axios.put(endpoint, { id: editingItemId, name: editingItemValue });
            setData(prev => prev.map(item => item.id === editingItemId ? { ...item, name: editingItemValue } : item));
            setEditingItemId(null);
            setEditingItemValue('');
        } catch (error) {
            console.error(`Error updating ${type}:`, error);
            alert(`Failed to update ${type}. Make sure the API endpoint exists.`);
        }
    };

    const startEditing = (item: DropdownItem) => {
        setEditingItemId(item.id);
        setEditingItemValue(item.name);
    };

    const cancelEditing = () => {
        setEditingItemId(null);
        setEditingItemValue('');
    };

    // Reusable component for managing a list
    const ManagementSection = ({ title, items, newItemValue, onNewItemChange, onAddItem, onDelete, onUpdate, type }: any) => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
            {/* Add New Item Form */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    className="flex-grow border px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder={`New ${type}...`}
                    value={newItemValue}
                    onChange={onNewItemChange}
                />
                <button 
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                    onClick={onAddItem}
                >
                    Add {type}
                </button>
            </div>
            {/* List of Items */}
            <ul className="space-y-2">
                {items.map((item: DropdownItem) => (
                    <li key={item.id} className="flex justify-between items-center p-2 border rounded-md">
                        {editingItemId === item.id ? (
                            <>
                                <input
                                    type="text"
                                    className="flex-grow border px-3 py-1 rounded-md mr-2"
                                    value={editingItemValue}
                                    onChange={(e) => setEditingItemValue(e.target.value)}
                                />
                                <button className="bg-green-500 text-white px-3 py-1 rounded-md mr-1 hover:bg-green-600" onClick={() => onUpdate(type)}>Save</button>
                                <button className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600" onClick={cancelEditing}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className="text-gray-800">{item.name}</span>
                                <div className="flex gap-2">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600" onClick={() => startEditing(item)}>Edit</button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" onClick={() => onDelete(item.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Dropdown Items</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ManagementSection
                    title="Manage Categories"
                    items={categories}
                    newItemValue={newCategory}
                    onNewItemChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
                    onAddItem={() => handleAddItem('category')}
                    onDelete={(id: string) => handleDeleteItem(id, 'category')}
                    onUpdate={handleUpdateItem}
                    type="Category"
                />
                <ManagementSection
                    title="Manage Occupations"
                    items={occupations}
                    newItemValue={newOccupation}
                    onNewItemChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewOccupation(e.target.value)}
                    onAddItem={() => handleAddItem('occupation')}
                    onDelete={(id: string) => handleDeleteItem(id, 'occupation')}
                    onUpdate={handleUpdateItem}
                    type="Occupation"
                />
            </div>
        </div>
    );
};

export default DropdownSettingsPage;