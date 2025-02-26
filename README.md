# Canvas-Based PNG Generator

A Flask web application that allows users to generate and customize PNG files with logo placement, background color customization, and proper formatting for both landscape and portrait orientations.

## Features

- Upload and position logos on multiple canvases
- Customize background colors
- Generate four PNG files with specific formats:
  - Landscape Agency (1920x1080)
  - Landscape Endcard (1920x1080)
  - Portrait Agency (1080x1920) 
  - Portrait Endcard (1080x1920)
- Center-line alignment helpers (horizontal and vertical)
- Logo resizing functionality
- Download all generated files as a ZIP archive

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Create and activate a virtual environment:
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install flask pillow
   ```

4. Create required directories:
   ```bash
   mkdir -p static/css static/js templates uploads
   ```

## Running the Application

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Open a web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage Instructions

1. **Enter Agency ID**:
   - Type an ID in the "Agency ID" field. This will be used to name the output folder.

2. **Upload a Logo**:
   - Click "Choose File" under "Upload Logo" to select your logo image.
   - The logo will appear on all four canvases.

3. **Customize Background Color**:
   - Use the color picker to select a background color for all canvases.

4. **Position and Resize the Logo**:
   - Drag the logo to position it on each canvas.
   - Use the corner handles to resize the logo as needed.
   - The logo will snap to the center when dragged close to it.

5. **Alignment Helpers**:
   - Click "Center H" to horizontally center the logo.
   - Click "Center V" to vertically position the logo at the top.
   - Click "Reset Logo" to restore the original position.

6. **Generate Images**:
   - Click "Generate Images" to create the PNG files.
   - You will see a confirmation message when successful.

7. **Download Files**:
   - Click "Download Images" to get a ZIP archive of all generated files.

## File Structure

- `app.py`: The Flask application server
- `templates/index.html`: Main HTML template
- `static/css/styles.css`: CSS styles
- `static/js/main.js`: JavaScript for canvas manipulation
- `uploads/`: Directory where generated files are stored

## Output

The application generates the following files in the format specified:
- `landscape_agency.png` (1920x1080, colored top bar)
- `landscape_endcard.png` (1920x1080, full color background)
- `portrait_agency.png` (1080x1920, colored top bar)
- `portrait_endcard.png` (1080x1920, full color background) 