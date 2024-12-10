import React, { useState } from 'react';
import './AddBugForm.css';

// Add bug form where users add bug details
const AddBugForm = ({ onAddBug, onCancel }) => {
    const [bug, setBug] = useState({
        title: '',
        description: '',
        status: '',
        priority: '',
        date: '', 
    });

    // Add state for error messages
    const [errors, setErrors] = useState({
        title: '',
        description: '',
        status: '',
        priority: '',
        date: ''
    });

    // function when user gives an input, it updates field in bug state
    const handleChange = (e) => {
        const { name, value } = e.target;

        // For title, only text (letters and spaces) are allowed
        if (name === 'title' && !/^[a-zA-Z\s]*$/.test(value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                title: 'Title should only contain letters and spaces!'
            }));
            return; 
        }

        setBug((prevBug) => ({
            ...prevBug,
            [name]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    // Function to validate the form fields
    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};

        // Check if title is empty or exceeds 20 characters
        if (!bug.title) {
            formIsValid = false;
            newErrors.title = "Title is required!";
        } else if (bug.title.length > 20) {
            formIsValid = false;
            newErrors.title = "Title cannot exceed 20 characters!";
        }

        // Check if description is empty or exceeds 50 characters
        if (!bug.description) {
            formIsValid = false;
            newErrors.description = "Description is required!";
        } else if (bug.description.length > 50) {
            formIsValid = false;
            newErrors.description = "Description cannot exceed 50 characters!";
        }

        // Check if status is selected
        if (!bug.status) {
            formIsValid = false;
            newErrors.status = "Status is required!";
        }

        // Check if priority is selected
        if (!bug.priority) {
            formIsValid = false;
            newErrors.priority = "Priority is required!";
        }

        // Check if date is selected
        if (!bug.date) {
            formIsValid = false;
            newErrors.date = "Date is required!";
        }

        setErrors(newErrors);
        return formIsValid;
    };

    // handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate the form before submitting
        if (validateForm()) {
            onAddBug(bug); // If valid, call the parent function to add the bug
        }
    };

    return (
        // form to fill in bug details
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
                    maxLength={20} 
                />
                {errors.title && <span className="error">{errors.title}</span>}
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
                {errors.description && <span className="error">{errors.description}</span>}
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
                {errors.status && <span className="error">{errors.status}</span>}
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
                {errors.priority && <span className="error">{errors.priority}</span>}
            </div>

            <div className="formGroup">
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={bug.date}
                    onChange={handleChange}
                    required
                />
                {errors.date && <span className="error">{errors.date}</span>}
            </div>

            <div className="formGroup">
                <button type="submit">Add Bug</button>
                <button style = {{color : 'green'}} type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default AddBugForm;

