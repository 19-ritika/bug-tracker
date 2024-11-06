import React, { useState } from 'react';
import './AddBugForm.css';

const AddBugForm = ({ onAddBug, onCancel }) => {
    const [bug, setBug] = useState({
        title: '',
        description: '',
        status: '',
        priority: '',
        date: '', // Set date to an empty string for manual input
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBug((prevBug) => ({
            ...prevBug,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the bug object without the ID to the parent
        onAddBug(bug);
    };

    return (
        <form className="addBugForm" onSubmit={handleSubmit}>
            <div className="formGroup">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={bug.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="formGroup">
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={bug.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="formGroup">
                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    name="status"
                    value={bug.status}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>

            <div className="formGroup">
                <label htmlFor="priority">Priority</label>
                <select
                    id="priority"
                    name="priority"
                    value={bug.priority}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            <div className="formGroup">
                <label htmlFor="date">Date</label>
                <input
                    type="date" // Change input type to date
                    id="date"
                    name="date"
                    value={bug.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="formGroup">
                <button type="submit">Add Bug</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default AddBugForm;
