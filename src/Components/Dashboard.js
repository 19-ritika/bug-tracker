import React, { useState, useEffect } from 'react';
import AddBugForm from './AddBugForm';
import './Dashboard.css';

// Determine API base URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'http://54.171.71.11'  // EC2 production environment
    : 'http://localhost:5000'; // Local development environment

const Dashboard = () => {
    const [bugs, setBugs] = useState([]);
    const [showAddBugForm, setShowAddBugForm] = useState(false);
    const [editingBug, setEditingBug] = useState(null); // Track which bug is being edited

    useEffect(() => {
        fetchBugs();
    }, []);

    // Fetch bugs from the server
    const fetchBugs = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/get_bugs`);
            if (response.ok) {
                const data = await response.json();
                setBugs(data);
            } else {
                console.error('Failed to fetch bugs:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching bugs:', error);
        }
    };

    const addBug = async (bug) => {
        try {
            const response = await fetch(`${API_BASE_URL}/add_bug`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bug),
            });
            if (response.ok) {
                fetchBugs();
                setShowAddBugForm(false);
            } else {
                console.error('Failed to add bug:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding bug:', error);
        }
    };

    const handleCancel = () => {
        setShowAddBugForm(false);
        setEditingBug(null);
    };

    const startEditing = (bug) => {
        setEditingBug(bug);
    };

    const saveEdit = async (bug) => {
        try {
            const cleanedId = bug.id.split(' - ')[1];
            const updatedBug = { ...bug, id: cleanedId };
            const response = await fetch(`${API_BASE_URL}/edit_bug/${cleanedId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBug),
            });

            if (response.ok) {
                fetchBugs();
                setEditingBug(null);
            } else {
                console.error('Failed to edit bug:', response.statusText);
            }
        } catch (error) {
            console.error('Error editing bug:', error);
        }
    };

    const deleteBug = async (id) => {
        try {
            const bugId = id.split(' - ')[1];
            const response = await fetch(`${API_BASE_URL}/delete_bug/${bugId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setBugs(bugs.filter((bug) => bug.id !== id));
            } else {
                console.error('Failed to delete bug:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting bug:', error);
        }
    };

    // Helper functions for rendering table cells
    const renderEditableField = (field, value, onChange) => {
        return (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange({ ...editingBug, [field]: e.target.value })}
            />
        );
    };

    const renderEditableDate = (value, onChange) => {
        return (
            <input
                type="date"
                value={value}
                onChange={(e) => onChange({ ...editingBug, date: e.target.value })}
            />
        );
    };

    const renderEditableSelect = (field, value, options, onChange) => {
        return (
            <select
                value={value}
                onChange={(e) => onChange({ ...editingBug, [field]: e.target.value })}
            >
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        );
    };

    return (
        <div className="dashboard">
            {showAddBugForm ? (
                <AddBugForm onAddBug={addBug} onCancel={handleCancel} />
            ) : (
                <>
                    <button className="addBugButton" onClick={() => setShowAddBugForm(true)}>
                        Add Bug
                    </button>
                    <h2>Bug List</h2>
                    <table className="bugTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bugs.map((bug) => (
                                <tr key={bug.id}>
                                    <td>{bug.id}</td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id
                                            ? renderEditableField('title', editingBug.title, setEditingBug)
                                            : bug.title}
                                    </td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id
                                            ? renderEditableField('description', editingBug.description, setEditingBug)
                                            : bug.description}
                                    </td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id
                                            ? renderEditableDate(editingBug.date, setEditingBug)
                                            : bug.date}
                                    </td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id
                                            ? renderEditableSelect('status', editingBug.status, ['Open', 'In Progress', 'Closed'], setEditingBug)
                                            : bug.status}
                                    </td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id
                                            ? renderEditableSelect('priority', editingBug.priority, ['Low', 'Medium', 'High'], setEditingBug)
                                            : bug.priority}
                                    </td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id ? (
                                            <>
                                                <button onClick={() => saveEdit(editingBug)} className="saveButton">✔️</button>
                                                <button onClick={handleCancel} className="cancelButton">❌</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEditing(bug)} className="editButton">✏️</button>
                                                <button onClick={() => deleteBug(bug.id)} className="deleteButton">🗑️</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Dashboard;
