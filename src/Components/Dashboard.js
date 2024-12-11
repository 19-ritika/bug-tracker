import React, { useState, useEffect } from 'react';
import AddBugForm from './AddBugForm';
import './Dashboard.css';

//  check the API base URL as per the environment
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'http://54.171.71.11' 
    : 'http://localhost:5000';  
// function for dashboard
const Dashboard = () => {
    const [bugs, setBugs] = useState([]);
    const [showAddBugForm, setShowAddBugForm] = useState(false);
    const [editingBug, setEditingBug] = useState(null); 

    useEffect(() => {
        fetchBugs();
    }, []); 

    // function to fetch bugs
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
    // function for submitting add bug 
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
    // cancel edit function
    const handleCancel = () => {
        setShowAddBugForm(false);
        setEditingBug(null); 
    };
    // start edit function
    const startEditing = (bug) => {
        setEditingBug(bug);
    };
    // save edit function
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
    // function for bug deletion
    const deleteBug = async (id) => {
        try {
           
            const bugId = id.split(' - ')[1];  
            
            // Send the DELETE request to the backend with the cleaned ID
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

    return (
        <div className="dashboard">
            {showAddBugForm ? (
                <AddBugForm onAddBug={addBug} onCancel={handleCancel} />
            ) : (
                <>
                    <button className="addBugButton" onClick={() => setShowAddBugForm(true)}>
                        Add-Bug
                    </button>
                    <h2 id = 'bugHead'>Bug-List </h2>
                    <table className="bugTable">
                        <thead>
                            <tr>
                                <th> Bug ID</th>
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
                                        {editingBug && editingBug.id === bug.id ? (
                                            <input
                                                type="text"
                                                value={editingBug.title}
                                                onChange={(e) =>
                                                    setEditingBug({ ...editingBug, title: e.target.value })
                                                }
                                            />
                                        ) : (
                                            bug.title
                                        )}
                                    </td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id ? (
                                            <input
                                                type="text"
                                                value={editingBug.description}
                                                onChange={(e) =>
                                                    setEditingBug({ ...editingBug, description: e.target.value })
                                                }
                                            />
                                        ) : (
                                            bug.description
                                        )}
                                    </td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id ? (
                                            <input
                                                type="date"
                                                value={editingBug.date}
                                                onChange={(e) =>
                                                    setEditingBug({ ...editingBug, date: e.target.value })
                                                }
                                            />
                                        ) : (
                                            bug.date
                                        )}
                                    </td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id ? (
                                            <select
                                                value={editingBug.status}
                                                onChange={(e) =>
                                                    setEditingBug({ ...editingBug, status: e.target.value })
                                                }
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        ) : (
                                            bug.status
                                        )}
                                    </td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id ? (
                                            <select
                                                value={editingBug.priority}
                                                onChange={(e) =>
                                                    setEditingBug({ ...editingBug, priority: e.target.value })
                                                }
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        ) : (
                                            bug.priority
                                        )}
                                    </td>
                                    <td>
                                        {editingBug && editingBug.id === bug.id ? (
                                            <>
                                                <button onClick={() => saveEdit(editingBug)} className="saveButton">
                                                    ✔️
                                                </button>
                                                <button onClick={handleCancel} className="cancelButton">
                                                    ❌
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEditing(bug)}
                                                    className="editButton"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => deleteBug(bug.id)}
                                                    className="deleteButton"
                                                >
                                                    🗑️
                                                </button>
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
