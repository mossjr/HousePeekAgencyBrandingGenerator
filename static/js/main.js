document.addEventListener('DOMContentLoaded', function() {
    // Initialize Fabric.js canvases
    const landscapeAgencyCanvas = new fabric.Canvas('landscape-agency-canvas', {
        preserveObjectStacking: true
    });
    const landscapeEndcardCanvas = new fabric.Canvas('landscape-endcard-canvas', {
        preserveObjectStacking: true
    });
    const portraitAgencyCanvas = new fabric.Canvas('portrait-agency-canvas', {
        preserveObjectStacking: true
    });
    const portraitEndcardCanvas = new fabric.Canvas('portrait-endcard-canvas', {
        preserveObjectStacking: true
    });
    
    // Store canvas references
    const canvases = {
        'landscape-agency': landscapeAgencyCanvas,
        'landscape-endcard': landscapeEndcardCanvas,
        'portrait-agency': portraitAgencyCanvas,
        'portrait-endcard': portraitEndcardCanvas
    };
    
    // Store logo objects for each canvas
    const logos = {
        'landscape-agency': null,
        'landscape-endcard': null,
        'portrait-agency': null,
        'portrait-endcard': null
    };
    
    // Canvas sizing
    const sizes = {
        'landscape-agency': { width: 1920, height: 1080 },
        'landscape-endcard': { width: 1920, height: 1080 },
        'portrait-agency': { width: 1080, height: 1920 },
        'portrait-endcard': { width: 1080, height: 1920 }
    };
    
    // Initialize all canvases
    function initializeCanvases(backgroundColor) {
        // Landscape Agency
        landscapeAgencyCanvas.clear();
        const landscapeAgencyBg = new fabric.Rect({
            width: 1920,
            height: 134,
            left: 0,
            top: 0,
            fill: backgroundColor,
            selectable: false
        });
        landscapeAgencyCanvas.add(landscapeAgencyBg);
        
        // Landscape Endcard
        landscapeEndcardCanvas.clear();
        const landscapeEndcardBg = new fabric.Rect({
            width: 1920,
            height: 1080,
            left: 0,
            top: 0,
            fill: backgroundColor,
            selectable: false
        });
        landscapeEndcardCanvas.add(landscapeEndcardBg);
        
        // Portrait Agency
        portraitAgencyCanvas.clear();
        const portraitAgencyBg = new fabric.Rect({
            width: 1080,
            height: 134,
            left: 0,
            top: 0,
            fill: backgroundColor,
            selectable: false
        });
        portraitAgencyCanvas.add(portraitAgencyBg);
        
        // Portrait Endcard
        portraitEndcardCanvas.clear();
        const portraitEndcardBg = new fabric.Rect({
            width: 1080,
            height: 1920,
            left: 0,
            top: 0,
            fill: backgroundColor,
            selectable: false
        });
        portraitEndcardCanvas.add(portraitEndcardBg);
        
        // Add center lines to all canvases (vertical and horizontal)
        addCenterLines();
    }
    
    // Add center lines to canvases
    function addCenterLines() {
        Object.keys(canvases).forEach(canvasKey => {
            const canvas = canvases[canvasKey];
            const size = sizes[canvasKey];
            
            // Vertical center line
            const verticalLine = new fabric.Line([size.width / 2, 0, size.width / 2, size.height], {
                stroke: 'rgba(255, 0, 0, 0.5)',
                selectable: false,
                evented: false,
                visible: false
            });
            
            // Horizontal center line
            const horizontalLine = new fabric.Line([0, size.height / 2, size.width, size.height / 2], {
                stroke: 'rgba(255, 0, 0, 0.5)',
                selectable: false,
                evented: false,
                visible: false
            });
            
            canvas.add(verticalLine);
            canvas.add(horizontalLine);
            
            // Store references to the lines
            canvas.centerLines = {
                vertical: verticalLine,
                horizontal: horizontalLine
            };
        });
    }
    
    // Upload logo
    document.getElementById('logo-upload').addEventListener('change', function(e) {
        if (e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            fabric.Image.fromURL(event.target.result, function(img) {
                // Scale the logo to fit within constraints
                scaleLogoToFit(img);
                
                // Add the logo to each canvas
                Object.keys(canvases).forEach(canvasKey => {
                    const canvas = canvases[canvasKey];
                    const clonedImg = fabric.util.object.clone(img);
                    
                    // Position the logo in the center top
                    const size = sizes[canvasKey];
                    clonedImg.set({
                        left: size.width / 2,
                        top: 50,
                        originX: 'center',
                        originY: 'top'
                    });
                    
                    // Remove any existing logo
                    if (logos[canvasKey]) {
                        canvas.remove(logos[canvasKey]);
                    }
                    
                    // Add the new logo
                    canvas.add(clonedImg);
                    logos[canvasKey] = clonedImg;
                    
                    // Make sure the logo stays on top
                    canvas.bringToFront(clonedImg);
                    canvas.renderAll();
                    
                    // Setup object moving events for snapping
                    setupObjectMovingEvents(clonedImg, canvas);
                });
            });
        };
        
        reader.readAsDataURL(file);
    });
    
    // Scale logo to fit within constraints
    function scaleLogoToFit(img) {
        const maxWidth = 300;
        const maxHeight = 100;
        
        let scale = 1;
        
        if (img.width > maxWidth) {
            scale = maxWidth / img.width;
        }
        
        if (img.height * scale > maxHeight) {
            scale = maxHeight / img.height;
        }
        
        img.scale(scale);
    }
    
    // Setup object moving events for snapping
    function setupObjectMovingEvents(obj, canvas) {
        obj.on('moving', function() {
            const size = { width: canvas.width, height: canvas.height };
            const threshold = 10;
            
            // Get object center point
            const center = obj.getCenterPoint();
            
            // Check for horizontal center
            if (Math.abs(center.x - size.width / 2) < threshold) {
                obj.set({
                    left: size.width / 2,
                    originX: 'center'
                });
                canvas.centerLines.vertical.set('visible', true);
            } else {
                canvas.centerLines.vertical.set('visible', false);
            }
            
            // Check for vertical center
            if (Math.abs(center.y - size.height / 2) < threshold) {
                obj.set({
                    top: size.height / 2,
                    originY: 'center'
                });
                canvas.centerLines.horizontal.set('visible', true);
            } else {
                canvas.centerLines.horizontal.set('visible', false);
            }
            
            canvas.renderAll();
        });
        
        obj.on('modified', function() {
            canvas.centerLines.vertical.set('visible', false);
            canvas.centerLines.horizontal.set('visible', false);
            canvas.renderAll();
        });
    }
    
    // Color picker
    document.getElementById('color-picker').addEventListener('input', function(e) {
        const color = e.target.value;
        updateBackgroundColor(color);
    });
    
    // Update background color for all canvases
    function updateBackgroundColor(color) {
        // Update Landscape Agency
        landscapeAgencyCanvas.forEachObject(function(obj) {
            if (!obj.selectable && obj !== landscapeAgencyCanvas.centerLines?.vertical && obj !== landscapeAgencyCanvas.centerLines?.horizontal) {
                obj.set('fill', color);
            }
        });
        
        // Update Landscape Endcard
        landscapeEndcardCanvas.forEachObject(function(obj) {
            if (!obj.selectable && obj !== landscapeEndcardCanvas.centerLines?.vertical && obj !== landscapeEndcardCanvas.centerLines?.horizontal) {
                obj.set('fill', color);
            }
        });
        
        // Update Portrait Agency
        portraitAgencyCanvas.forEachObject(function(obj) {
            if (!obj.selectable && obj !== portraitAgencyCanvas.centerLines?.vertical && obj !== portraitAgencyCanvas.centerLines?.horizontal) {
                obj.set('fill', color);
            }
        });
        
        // Update Portrait Endcard
        portraitEndcardCanvas.forEachObject(function(obj) {
            if (!obj.selectable && obj !== portraitEndcardCanvas.centerLines?.vertical && obj !== portraitEndcardCanvas.centerLines?.horizontal) {
                obj.set('fill', color);
            }
        });
        
        // Render all canvases
        Object.values(canvases).forEach(canvas => canvas.renderAll());
    }
    
    // Center buttons event listeners
    document.querySelectorAll('.center-horizontal-btn').forEach(button => {
        button.addEventListener('click', function() {
            const canvasKey = this.dataset.canvas;
            const canvas = canvases[canvasKey];
            const logo = logos[canvasKey];
            
            if (logo) {
                logo.set({
                    left: sizes[canvasKey].width / 2,
                    originX: 'center'
                });
                canvas.renderAll();
            }
        });
    });
    
    document.querySelectorAll('.center-vertical-btn').forEach(button => {
        button.addEventListener('click', function() {
            const canvasKey = this.dataset.canvas;
            const canvas = canvases[canvasKey];
            const logo = logos[canvasKey];
            
            if (logo) {
                logo.set({
                    top: 50,
                    originY: 'top'
                });
                canvas.renderAll();
            }
        });
    });
    
    // Reset logo buttons
    document.querySelectorAll('.reset-logo-btn').forEach(button => {
        button.addEventListener('click', function() {
            const canvasKey = this.dataset.canvas;
            const canvas = canvases[canvasKey];
            const logo = logos[canvasKey];
            
            if (logo) {
                logo.set({
                    left: sizes[canvasKey].width / 2,
                    top: 50,
                    originX: 'center',
                    originY: 'top',
                    scaleX: logo.scaleX,
                    scaleY: logo.scaleY
                });
                canvas.renderAll();
            }
        });
    });
    
    // Generate Images
    document.getElementById('generate-btn').addEventListener('click', function() {
        const agencyId = document.getElementById('agency-id').value.trim();
        if (!agencyId) {
            alert('Please enter an Agency ID');
            return;
        }
        
        // Hide center lines if visible
        Object.values(canvases).forEach(canvas => {
            if (canvas.centerLines) {
                canvas.centerLines.vertical.set('visible', false);
                canvas.centerLines.horizontal.set('visible', false);
            }
            canvas.renderAll();
        });
        
        // Prepare the images
        const images = {
            'landscape_agency': landscapeAgencyCanvas.toDataURL(),
            'landscape_endcard': landscapeEndcardCanvas.toDataURL(),
            'portrait_agency': portraitAgencyCanvas.toDataURL(),
            'portrait_endcard': portraitEndcardCanvas.toDataURL()
        };
        
        // Send to the server
        fetch('/save-images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                agency_id: agencyId,
                images: images
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Images generated successfully!');
                document.getElementById('download-btn').disabled = false;
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
    
    // Download button
    document.getElementById('download-btn').addEventListener('click', function() {
        const agencyId = document.getElementById('agency-id').value.trim();
        if (!agencyId) {
            alert('Please enter an Agency ID');
            return;
        }
        
        window.location.href = '/download/' + agencyId;
    });
    
    // Initialize canvases with default color
    initializeCanvases('#ffffff');
}); 