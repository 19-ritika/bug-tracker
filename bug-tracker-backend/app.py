from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
import uuid
from dotenv import load_dotenv
from bson import ObjectId
from flask_wtf.csrf import CSRFProtect


load_dotenv()

app = Flask(__name__, static_folder = 'build', static_url_path = '/build')

# Initialize CSRF protection
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# CORS policies
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
CORS(app, resources = {r"/*": {"origins": allowed_origins}})

# Configure MongoDB URI from .env
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# Serve static files
@app.route('/build/<path:path>')
def serve_static_files(path):
    return send_from_directory('build', path)

# Serve non api paths
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

# Add bug route
@app.route('/add_bug', methods=['POST'])
def add_bug():
    data = request.get_json()

    # Validate input fields 
    if not all(key in data for key in ('title', 'description', 'date', 'status', 'priority')):
        return jsonify({'error': 'Missing required fields'}), 400

    # generate unique id for bug to uniquely identify each bug in mongodb table
    new_id = str(uuid.uuid4().hex[:5])  

    # prepare bug
    new_bug = {
        "id": new_id,  
        "title": data['title'],
        "description": data['description'],
        "date": data['date'],
        "status": data['status'],
        "priority": data['priority']
    }

    try:
        # Add bug into the 'bugTracker' collection
        result = mongo.db.bugTracker.insert_one(new_bug)
        new_bug['_id'] = str(result.inserted_id) 
        return jsonify(new_bug), 201 
    except Exception as e:
        print("Error inserting bug:", str(e))
        return jsonify({'error': str(e)}), 500

# Get bugs route
@app.route('/get_bugs', methods=['GET'])
def get_bugs():
    try:
        # Get all bugs from the 'bugTracker' collection
        bugs = mongo.db.bugTracker.find()

        bug_list = []
        for bug in bugs:
            # Create a new dictionary with a modified ID
            modified_bug = {
                "id": f"Bug - {str(bug['id'])[:5]}",  
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

    # Find the bug using the id
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
        # search for the bug using the ID and delete it
        result = mongo.db.bugTracker.delete_one({"id": id})

        if result.deleted_count == 0:
            return jsonify({'error': 'Bug not found'}), 404
        return jsonify({"message": "Bug deleted successfully"}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
