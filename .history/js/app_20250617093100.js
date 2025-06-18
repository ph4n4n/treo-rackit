class TreoRackitApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.sidebar = document.querySelector('.components-grid');
        this.propertiesPanel = document.getElementById('propertiesPanel');
        this.bomContainer = document.querySelector('.bom-content');
        this.mouseCoords = document.getElementById('mouseCoords');
        this.componentCounter = document.getElementById('componentCount');
        
        this.selectedComponent = null;
        this.components = [];
        this.dragDrop = new DragDrop(this);
        this.snapGuides = new SnapGuides(this);
        this.bom = new BOM(this);
        
        this.gridSize = 20;
        this.isGridEnabled = true;
        this.isSnapEnabled = true;
        this.zoomLevel = 1;
        
        this.currentTool = null; // For click-to-add mode
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupSidebar();
        this.setupToolbar();
        this.setupKeyboardShortcuts();
        this.setupMouseTracking();
        this.updateComponentCounter();
    }

    setupCanvas() {
        this.canvas.addEventListener('click', (e) => {
            // If we have a tool selected, add component at click position
            if (this.currentTool) {
                const rect = this.canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) / this.zoomLevel;
                const y = (e.clientY - rect.top) / this.zoomLevel;
                
                this.addComponentAtPosition(this.currentTool, x, y);
                return;
            }
            
            // Otherwise handle selection
            if (e.target === this.canvas) {
                this.selectComponent(null);
            }
        });

        // Mouse tracking for coordinates
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.round((e.clientX - rect.left) / this.zoomLevel);
            const y = Math.round((e.clientY - rect.top) / this.zoomLevel);
            this.mouseCoords.textContent = `${x}, ${y}`;
        });
    }

    setupSidebar() {
        // Create component buttons
        Object.values(COMPONENT_TYPES).forEach(type => {
            const button = document.createElement('div');
            button.className = 'component-item';
            button.draggable = true;
            button.dataset.componentType = type.id;
            
            // Add icon
            const icon = document.createElement('i');
            icon.className = type.icon;
            button.appendChild(icon);
            
            // Add label
            const label = document.createElement('span');
            label.textContent = type.name;
            button.appendChild(label);
            
            // Drag events
            button.addEventListener('dragstart', (e) => {
                this.dragDrop.handleDragStart(e);
            });
            
            // Click to select tool
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectTool(type);
            });
            
            this.sidebar.appendChild(button);
        });
    }

    selectTool(componentType) {
        // Clear previous selection
        this.sidebar.querySelectorAll('.component-item').forEach(item => {
            item.classList.remove('active');
        });
        
        if (this.currentTool === componentType) {
            // Deselect if clicking same tool
            this.currentTool = null;
            this.canvas.style.cursor = 'default';
        } else {
            // Select new tool
            this.currentTool = componentType;
            this.canvas.style.cursor = 'crosshair';
            
            // Highlight selected tool
            const toolButton = this.sidebar.querySelector(`[data-component-type="${componentType.id}"]`);
            if (toolButton) {
                toolButton.classList.add('active');
            }
        }
    }

    addComponentAtPosition(componentType, x, y) {
        let component;
        
        switch (componentType.id) {
            case 'pipe-segment':
                component = new PipeSegment(x, y);
                break;
            case 'elbow-joint':
                component = new ElbowJoint(x, y);
                break;
            case 'tee-joint':
                component = new TeeJoint(x, y);
                break;
            case 'wall-mount':
                component = new WallMount(x, y);
                break;
        }
        
        if (component) {
            this.addComponent(component);
        }
    }

    setupToolbar() {
        // Grid toggle
        const gridToggle = document.getElementById('gridToggle');
        if (gridToggle) {
            gridToggle.addEventListener('click', () => {
                this.isGridEnabled = !this.isGridEnabled;
                this.canvas.classList.toggle('grid-enabled', this.isGridEnabled);
                gridToggle.classList.toggle('active', this.isGridEnabled);
            });
        }

        // Snap toggle
        const snapToggle = document.getElementById('snapToggle');
        if (snapToggle) {
            snapToggle.addEventListener('click', () => {
                this.isSnapEnabled = !this.isSnapEnabled;
                snapToggle.classList.toggle('active', this.isSnapEnabled);
            });
        }

        // Zoom controls
        const zoomIn = document.getElementById('zoomIn');
        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
                this.updateZoom();
            });
        }

        const zoomOut = document.getElementById('zoomOut');
        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5);
                this.updateZoom();
            });
        }

        // Clear all
        const clearCanvas = document.getElementById('clearCanvas');
        if (clearCanvas) {
            clearCanvas.addEventListener('click', () => {
                if (confirm('Xóa tất cả các thành phần?')) {
                    this.clearAll();
                }
            });
        }

        // Export
        const saveDesign = document.getElementById('saveDesign');
        if (saveDesign) {
            saveDesign.addEventListener('click', () => {
                this.exportDesign();
            });
        }
    }

    updateZoom() {
        this.canvas.style.transform = `scale(${this.zoomLevel})`;
        this.canvas.style.transformOrigin = 'top left';
        const zoomDisplay = document.querySelector('.zoom-level');
        if (zoomDisplay) {
            zoomDisplay.textContent = Math.round(this.zoomLevel * 100) + '%';
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC to deselect tool
            if (e.key === 'Escape') {
                this.selectTool(null);
                this.selectComponent(null);
            }
            
            // Delete selected component
            if (e.key === 'Delete' && this.selectedComponent) {
                this.removeComponent(this.selectedComponent);
            }
            
            // Grid toggle with G
            if (e.key === 'g' || e.key === 'G') {
                const gridToggle = document.getElementById('gridToggle');
                if (gridToggle) gridToggle.click();
            }
            
            // Snap toggle with S
            if (e.key === 's' || e.key === 'S') {
                const snapToggle = document.getElementById('snapToggle');
                if (snapToggle) snapToggle.click();
            }
        });
    }

    setupMouseTracking() {
        // Already implemented in setupCanvas
    }

    addComponent(component) {
        this.components.push(component);
        this.canvas.appendChild(component.create());
        this.updateComponentCounter();
        this.bom.updateBOM();
        this.selectComponent(component);
    }

    removeComponent(component) {
        const index = this.components.indexOf(component);
        if (index > -1) {
            this.components.splice(index, 1);
            if (component.element && component.element.parentNode) {
                component.element.parentNode.removeChild(component.element);
            }
            if (this.selectedComponent === component) {
                this.selectComponent(null);
            }
            this.updateComponentCounter();
            this.bom.updateBOM();
        }
    }

    selectComponent(component) {
        // Clear previous selection
        if (this.selectedComponent) {
            this.selectedComponent.setSelected(false);
        }
        
        this.selectedComponent = component;
        
        if (component) {
            component.setSelected(true);
            this.showProperties(component);
        } else {
            this.hideProperties();
        }
    }

    showProperties(component) {
        const content = this.propertiesPanel.querySelector('.properties-content');
        content.innerHTML = '';
        
        // Component type
        const typeDiv = document.createElement('div');
        typeDiv.className = 'property-group';
        typeDiv.innerHTML = `
            <label>Loại linh kiện:</label>
            <span>${component.type.name}</span>
        `;
        content.appendChild(typeDiv);
        
        // Position
        const posDiv = document.createElement('div');
        posDiv.className = 'property-group';
        posDiv.innerHTML = `
            <label>Vị trí:</label>
            <div class="position-inputs">
                <input type="number" id="pos-x" value="${Math.round(component.x)}" placeholder="X">
                <input type="number" id="pos-y" value="${Math.round(component.y)}" placeholder="Y">
            </div>
        `;
        content.appendChild(posDiv);
        
        // Position change handlers
        document.getElementById('pos-x').addEventListener('change', (e) => {
            component.x = parseInt(e.target.value) || 0;
            component.updateStyle();
        });
        
        document.getElementById('pos-y').addEventListener('change', (e) => {
            component.y = parseInt(e.target.value) || 0;
            component.updateStyle();
        });
        
        // Rotation
        const rotDiv = document.createElement('div');
        rotDiv.className = 'property-group';
        rotDiv.innerHTML = `
            <label>Góc xoay:</label>
            <input type="number" id="rotation" value="${component.rotation}" min="0" max="360" step="90">
        `;
        content.appendChild(rotDiv);
        
        document.getElementById('rotation').addEventListener('change', (e) => {
            component.rotation = parseInt(e.target.value) || 0;
            component.updateStyle();
        });
        
        // Length for pipe segments
        if (component.type.id === 'pipe-segment') {
            const lengthDiv = document.createElement('div');
            lengthDiv.className = 'property-group';
            lengthDiv.innerHTML = `
                <label>Chiều dài (cm):</label>
                <input type="number" id="pipe-length" value="${component.length}" min="10" max="300">
            `;
            content.appendChild(lengthDiv);
            
            document.getElementById('pipe-length').addEventListener('change', (e) => {
                component.length = parseInt(e.target.value) || 100;
                component.updateStyle();
                this.bom.updateBOM();
            });
        }
        
        // Delete button
        const deleteDiv = document.createElement('div');
        deleteDiv.className = 'property-group';
        deleteDiv.innerHTML = `
            <button class="btn btn-danger" id="delete-component">
                <i class="bi bi-trash"></i> Xóa
            </button>
        `;
        content.appendChild(deleteDiv);
        
        document.getElementById('delete-component').addEventListener('click', () => {
            this.removeComponent(component);
        });
        
        this.propertiesPanel.style.display = 'block';
    }

    hideProperties() {
        this.propertiesPanel.style.display = 'none';
    }

    updateComponentCounter() {
        this.componentCounter.textContent = this.components.length;
    }

    clearAll() {
        this.components.forEach(component => {
            if (component.element && component.element.parentNode) {
                component.element.parentNode.removeChild(component.element);
            }
        });
        this.components = [];
        this.selectComponent(null);
        this.updateComponentCounter();
        this.bom.updateBOM();
    }

    exportDesign() {
        const data = {
            components: this.components.map(c => ({
                type: c.type.id,
                x: c.x,
                y: c.y,
                rotation: c.rotation,
                length: c.length || undefined
            })),
            bom: this.bom.generateBOM()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'treo-rackit-design.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TreoRackitApp();
}); 