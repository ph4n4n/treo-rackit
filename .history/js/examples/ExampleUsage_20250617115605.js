// Example usage of the new 3D component system
// This shows how to use the remodeled components with Three.js

// Basic setup
const viewer3D = new Viewer3D(document.getElementById('canvas-3d'), window.app);

// Example 1: Create components programmatically
function createPipeSystem() {
    const factory = viewer3D.componentFactory;
    
    // Create pipe segments
    const pipe1 = factory.create3DComponent({
        id: 'pipe-1',
        type: COMPONENT_TYPES.PIPE_SEGMENT,
        x: 200,
        y: 200,
        rotation: 0,
        length: 150 // cm
    });
    
    const pipe2 = factory.create3DComponent({
        id: 'pipe-2', 
        type: COMPONENT_TYPES.PIPE_SEGMENT,
        x: 400,
        y: 200,
        rotation: 90,
        length: 100
    });
    
    // Create elbow joint
    const elbow = factory.create3DComponent({
        id: 'elbow-1',
        type: COMPONENT_TYPES.ELBOW_JOINT,
        x: 350,
        y: 200,
        rotation: 0
    });
    
    // Connect components
    factory.connectComponents('pipe-1', 'right', 'elbow-1', 'left');
    factory.connectComponents('elbow-1', 'bottom', 'pipe-2', 'left');
    
    console.log('Created pipe system with connections');
}

// Example 2: Update component properties
function updateComponentProperties() {
    const factory = viewer3D.componentFactory;
    const pipe = factory.get3DComponent('pipe-1');
    
    if (pipe) {
        // Change pipe length with animation
        pipe.animateProperty('length', 2.5, 1000).then(() => {
            console.log('Pipe length animation completed');
        });
        
        // Rotate component
        pipe.animateProperty('rotation', { x: 0, y: Math.PI / 4, z: 0 }, 500);
        
        // Show connection ports for debugging
        pipe.showConnectionPorts(true);
    }
}

// Example 3: Export/Import scene
function exportScene() {
    const factory = viewer3D.componentFactory;
    const sceneData = factory.exportScene();
    
    // Save to localStorage or send to server
    localStorage.setItem('pipeSystemData', JSON.stringify(sceneData));
    console.log('Scene exported:', sceneData);
}

function importScene() {
    const factory = viewer3D.componentFactory;
    const sceneData = JSON.parse(localStorage.getItem('pipeSystemData'));
    
    if (sceneData) {
        factory.importScene(sceneData);
        console.log('Scene imported');
    }
}

// Example 4: Component selection and interaction
function handleComponentSelection() {
    const factory = viewer3D.componentFactory;
    
    // Mouse interaction with 3D scene
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    viewer3D.renderer.domElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        const rect = viewer3D.renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Raycast from camera through mouse position
        raycaster.setFromCamera(mouse, viewer3D.camera);
        
        // Get all 3D component groups
        const componentGroups = factory.getAll3DComponents().map(comp => comp.group);
        const intersects = raycaster.intersectObjects(componentGroups, true);
        
        if (intersects.length > 0) {
            // Find the component that was clicked
            let clickedComponent = null;
            for (const intersect of intersects) {
                let obj = intersect.object;
                while (obj && !obj.userData.component) {
                    obj = obj.parent;
                }
                if (obj && obj.userData.component) {
                    clickedComponent = obj.userData.component;
                    break;
                }
            }
            
            if (clickedComponent) {
                // Select component
                factory.selectComponent(clickedComponent.id);
                
                // Show component info
                displayComponentInfo(clickedComponent);
            }
        } else {
            // Deselect all
            factory.deselectAll();
        }
    });
}

function displayComponentInfo(component) {
    const bomData = component.getBOMData ? component.getBOMData() : {};
    
    const info = `
        Component: ${component.type.id}
        ID: ${component.id}
        Type: ${bomData.type || 'Unknown'}
        Material: ${bomData.material || 'N/A'}
        Part Number: ${bomData.partNumber || 'N/A'}
        Weight: ${bomData.weight || 'N/A'}
    `;
    
    // Display in UI panel
    const infoPanel = document.getElementById('component-info');
    if (infoPanel) {
        infoPanel.textContent = info;
    } else {
        console.log('Component Info:', info);
    }
}

// Example 5: Debug utilities
function enableDebugMode() {
    const factory = viewer3D.componentFactory;
    
    // Show all connection ports
    factory.showAllConnectionPorts(true);
    
    // Show bounding boxes
    factory.showAllBoundingBoxes(true);
    
    // Display scene statistics
    const stats = factory.getStats();
    console.log('Scene Statistics:', stats);
    
    // Add debug UI
    addDebugUI(factory);
}

function addDebugUI(factory) {
    const debugPanel = document.createElement('div');
    debugPanel.style.position = 'fixed';
    debugPanel.style.top = '10px';
    debugPanel.style.right = '10px';
    debugPanel.style.background = 'rgba(0,0,0,0.8)';
    debugPanel.style.color = 'white';
    debugPanel.style.padding = '10px';
    debugPanel.style.borderRadius = '5px';
    debugPanel.style.fontFamily = 'monospace';
    debugPanel.style.fontSize = '12px';
    debugPanel.style.zIndex = '1000';
    
    // Update stats every second
    setInterval(() => {
        const stats = factory.getStats();
        debugPanel.innerHTML = `
            <h4>Debug Info</h4>
            <div>Components: ${stats.totalComponents}</div>
            <div>Connections: ${stats.totalConnections}</div>
            <div>Types:</div>
            ${Object.entries(stats.byType).map(([type, count]) => 
                `<div>&nbsp;&nbsp;${type}: ${count}</div>`
            ).join('')}
            <div>Bounds: ${stats.boundingBox.min.x.toFixed(2)}, ${stats.boundingBox.max.x.toFixed(2)}</div>
        `;
    }, 1000);
    
    document.body.appendChild(debugPanel);
}

// Example 6: Sync with 2D view
function sync2DTo3D() {
    // When 2D components are updated
    if (window.app && window.app.components) {
        viewer3D.updateFrom2D();
    }
}

function sync3DTo2D() {
    // When 3D components are updated
    const factory = viewer3D.componentFactory;
    factory.syncFrom3D();
}

// Usage examples  
function runExamples() {
    console.log('Running 3D Component System Examples...');
    
    // Create initial pipe system
    createPipeSystem();
    
    // Setup interactions
    handleComponentSelection();
    
    // Enable debug mode
    enableDebugMode();
    
    // Example animations after 2 seconds
    setTimeout(() => {
        updateComponentProperties();
    }, 2000);
    
    // Export scene after 5 seconds
    setTimeout(() => {
        exportScene();
    }, 5000);
}

// Utility functions for integration  
function integrateWith2DSystem() {
    // Hook into existing 2D system events
    if (window.app) {
        // Override component creation
        const originalAddComponent = window.app.addComponent;
        window.app.addComponent = function(component) {
            originalAddComponent.call(this, component);
            // Auto-sync to 3D
            viewer3D.updateFrom2D();
        };
        
        // Override component update
        const originalUpdateComponent = window.app.updateComponent;
        window.app.updateComponent = function(component) {
            originalUpdateComponent.call(this, component);
            // Auto-sync to 3D
            if (viewer3D.componentFactory) {
                viewer3D.componentFactory.update3DFromComponent2D(component);
            }
        };
        
        // Override component removal
        const originalRemoveComponent = window.app.removeComponent;
        window.app.removeComponent = function(component) {
            // Remove from 3D first
            if (viewer3D.componentFactory) {
                viewer3D.componentFactory.removeComponent(component.id);
            }
            originalRemoveComponent.call(this, component);
        };
    }
}

// Make functions available globally for script tag usage
window.runExamples = runExamples;
window.integrateWith2DSystem = integrateWith2DSystem; 