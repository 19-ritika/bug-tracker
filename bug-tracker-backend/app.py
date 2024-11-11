from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
import uuid
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

app = Flask(__name__, static_folder = 'build', static_url_path = '/build')
CORS(app)

# Configure MongoDB URI from .env
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# Serve static files (React build)
@app.route('/build/<path:path>')
def serve_static_files(path):
    return send_from_directory('build', path)

# Serve React app (index.html) for any route not related to API
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    # Check if the request is for an API route, in your case they don't start with '/api/', so we just serve the React app
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        # Serve the static file if it exists (like JS, CSS, images)
        return send_from_directory(app.static_folder, path)
    # Serve the index.html for all other routes (SPA fallback)
    return send_from_directory(app.static_folder, 'index.html')

# Add bug route
@app.route('/add_bug', methods=['POST'])
def add_bug():
    data = request.get_json()

    # Validate required fields (no need to validate 'id' anymore)
    if not all(key in data for key in ('title', 'description', 'date', 'status', 'priority')):
        return jsonify({'error': 'Missing required fields'}), 400

    # Generate a unique ID for the bug if needed (you can remove this if you want MongoDB's _id to handle uniqueness)
    new_id = str(uuid.uuid4().hex[:5])  # Generate a new UUID, only if needed

    # Create the bug document using the provided data
    new_bug = {
        "id": new_id,  # Optional: you can keep this if you need a custom 'id' field for your app
        "title": data['title'],
        "description": data['description'],
        "date": data['date'],
        "status": data['status'],
        "priority": data['priority']
    }

    try:
        # Insert the bug into the 'bugTracker' collection
        result = mongo.db.bugTracker.insert_one(new_bug)
        
        # Include the MongoDB _id in the response to match the stored document format
        new_bug['_id'] = str(result.inserted_id)  # MongoDB assigns _id automatically
        return jsonify(new_bug), 201  # Return the inserted bug document, including the MongoDB _id
    except Exception as e:
        print("Error inserting bug:", str(e))
        return jsonify({'error': str(e)}), 500

# Get bugs route
@app.route('/get_bugs', methods=['GET'])
def get_bugs():
    try:
        # Fetch all bugs from the 'bugTracker' collection
        bugs = mongo.db.bugTracker.find()
        # Convert the cursor to a list of dictionaries
        bug_list = []
        for bug in bugs:
            # Create a new dictionary with a modified ID
            modified_bug = {
                "id": f"Bug - {str(bug['id'])[:5]}",  # Format the ID
                "title": bug['title'],
                "description": bug['description'],
                "date": bug['date'],
                "status": bug['status'],
                "priority": bug['priority']
            }
            bug_list.append(modified_bug)

        return jsonify(bug_list), 200
    except Exception as e:
        print("Error fetching bugs:", str(e))
        return jsonify({'error': str(e)}), 500
    
# Edit bug route
@app.route('/edit_bug/<id>', methods=['PUT'])
def edit_bug(id):
    data = request.get_json()

    # Find the bug in the collection using the cleaned ID
    bug = mongo.db.bugTracker.find_one({"id": id})
    if not bug:
        return jsonify({'error': 'Bug not found'}), 404

    # Update the bug with new data
    updated_bug = {
        "title": data['title'],
        "description": data['description'],
        "status": data['status'],
        "priority": data['priority'],
        "date": data['date']
    }

    try:
        # Update the bug in the database
        mongo.db.bugTracker.update_one({"id": id}, {"$set": updated_bug})
        return jsonify({"message": "Bug updated successfully"}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete bug route
@app.route('/delete_bug/<id>', methods=['DELETE'])
def delete_bug(id):
    try:
        # Directly search for the bug using the 6-character ID
        result = mongo.db.bugTracker.delete_one({"id": id})

        if result.deleted_count == 0:
            return jsonify({'error': 'Bug not found'}), 404
        return jsonify({"message": "Bug deleted successfully"}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
