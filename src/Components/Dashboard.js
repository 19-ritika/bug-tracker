import React, { useState, useEffect } from 'react';
import AddBugForm from './AddBugForm';
import './Dashboard.css';

const Dashboard = () => {
    const [bugs, setBugs] = useState([]);
    const [showAddBugForm, setShowAddBugForm] = useState(false);
    const [editingBug, setEditingBug] = useState(null); // Track which bug is being edited

    useEffect(() => {
        fetchBugs();
    }, []); // Fetch bugs only once when the component mounts

    // Fetch bugs from the server
    const fetchBugs = async () => {
        try {
            const response = await fetch('http://localhost:5000/get_bugs');
            if (response.ok) {
                const data = await response.json();
                setBugs(data); // Set the fetched bugs with the properly formatted ID
            } else {
                console.error('Failed to fetch bugs:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching bugs:', error);
        }
    };

    const addBug = async (bug) => {
        try {
            const response = await fetch('http://localhost:5000/add_bug', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bug),
            });
            if (response.ok) {
                // After adding the bug, fetch the updated bug list
                fetchBugs();  // This will refresh the state and update the UI with the new bug list
                setShowAddBugForm(false); // Optionally, hide the form after adding the bug
            } else {
                console.error('Failed to add bug:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding bug:', error);
        }
    };

    const handleCancel = () => {
        setShowAddBugForm(false);
        setEditingBug(null); // Reset editing state
    };

    const startEditing = (bug) => {
        setEditingBug(bug); // Set the bug as the one to edit
    };

    const saveEdit = async (bug) => {
        try {
            // Clean the ID by removing the "Bug - " prefix
            const cleanedId = bug.id.split(' - ')[1];  // This gets the 6-character ID like '93f44'
    
            // Prepare the updated bug data (including the cleaned ID)
            const updatedBug = { ...bug, id: cleanedId };
    
            // Send the PUT request to update the bug
            const response = await fetch(`http://localhost:5000/edit_bug/${cleanedId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBug),
            });
    
            if (response.ok) {
                fetchBugs(); // Refresh the bug list after the update
                setEditingBug(null); // Stop editing
            } else {
                console.error('Failed to edit bug:', response.statusText);
            }
        } catch (error) {
            console.error('Error editing bug:', error);
        }
    };

    // Delete bug
    // Assuming you have the 'bugs' state initialized somewhere in your code
const deleteBug = async (id) => {
    try {
        // Extract the 6-character ID from 'Bug - 93f44'
        const bugId = id.split(' - ')[1];  // This gets '93f44' from 'Bug - 93f44'
        
        // Send the DELETE request to the backend with the cleaned ID
        const response = await fetch(`http://localhost:5000/delete_bug/${bugId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            // Remove the deleted bug from the UI
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
