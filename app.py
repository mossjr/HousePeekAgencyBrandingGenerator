from flask import Flask, request, render_template, jsonify, send_from_directory
import os
import base64
import json
from PIL import Image
import io
import shutil
import zipfile

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload-logo', methods=['POST'])
def upload_logo():
    if 'logo' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['logo']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Save the file temporarily
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'temp_logo.png')
    file.save(filepath)
    
    # Return the path to the saved file
    return jsonify({'success': True, 'filepath': filepath})

@app.route('/save-images', methods=['POST'])
def save_images():
    data = json.loads(request.data)
    agency_id = data.get('agency_id')
    images = data.get('images')
    
    if not agency_id:
        return jsonify({'error': 'No agency ID provided'}), 400
    
    # Create a directory for the agency if it doesn't exist
    agency_dir = os.path.join(app.config['UPLOAD_FOLDER'], agency_id)
    if not os.path.exists(agency_dir):
        os.makedirs(agency_dir)
    
    # Save each image
    for img_name, img_data in images.items():
        # Remove the data URL prefix
        img_data = img_data.split(',')[1]
        # Decode the base64 data
        img_bytes = base64.b64decode(img_data)
        
        # Convert to PIL Image
        img = Image.open(io.BytesIO(img_bytes))
        
        # Save the image
        img_path = os.path.join(agency_dir, f"{img_name}.png")
        img.save(img_path, 'PNG')
    
    return jsonify({'success': True, 'directory': agency_dir})

@app.route('/download/<agency_id>', methods=['GET'])
def download(agency_id):
    agency_dir = os.path.join(app.config['UPLOAD_FOLDER'], agency_id)
    if not os.path.exists(agency_dir):
        return jsonify({'error': 'Agency directory not found'}), 404
    
    # Create a zip file of the agency directory
    zip_filename = f"{agency_id}.zip"
    zip_path = os.path.join(app.config['UPLOAD_FOLDER'], zip_filename)
    
    # Create a new zip file
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        # Add all files in the agency directory to the zip
        for root, dirs, files in os.walk(agency_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Add file to zip with a path relative to the agency directory
                arcname = os.path.relpath(file_path, agency_dir)
                zipf.write(file_path, arcname)
    
    # Send the zip file
    return send_from_directory(
        app.config['UPLOAD_FOLDER'],
        zip_filename,
        as_attachment=True,
        download_name=zip_filename
    )

if __name__ == '__main__':
    app.run(debug=True) 