class TreoRackitApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.canvas3D = document.getElementById('canvas3D');
        this.sidebar = document.querySelector('.components-grid');
        this.propertiesPanel = document.getElementById('propertiesPanel');
        this.bomContent = document.querySelector('.bom-content');
        this.mouseCoords = document.getElementById('mouseCoords');
        this.componentCount = document.getElementById('componentCount');
        this.zoomLevel = 1;
        this.components = [];
        this.selectedComponent = null;
        this.currentTool = null;
        this.nextId = 1;
        this.gridVisible = true;
        this.snapEnabled = true;
        this.is3DMode = false;
        
        // Initialize utilities
        this.dragDrop = new DragDrop(this);
        this.snapGuides = new SnapGuides(this);
        this.bom = new BOM(this);
        this.viewer3D = new Viewer3D(this.canvas3D, this);
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupSidebar();
        this.setupToolbar();
        this.setupKeyboardShortcuts();
        this.setupMouseTracking();
        this.updateComponentCounter();
        this.updateUI(); // Apply i18n
    }

    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = t(key);
        });

        // Update toolbar button tooltips
        const gridToggle = document.getElementById('gridToggle');
        if (gridToggle) gridToggle.title = t('gridTooltip');
        
        const snapToggle = document.getElementById('snapToggle');
        if (snapToggle) snapToggle.title = t('snapTooltip');
        
        const zoomIn = document.getElementById('zoomIn');
        if (zoomIn) zoomIn.title = t('zoomInTooltip');
        
        const zoomOut = document.getElementById('zoomOut');
        if (zoomOut) zoomOut.title = t('zoomOutTooltip');
        
        const clearCanvas = document.getElementById('clearCanvas');
        if (clearCanvas) clearCanvas.title = t('clearAllTooltip');
        
        const saveDesign = document.getElementById('saveDesign');
        if (saveDesign) saveDesign.title = t('saveTooltip');
        
        const exportPNG = document.getElementById('exportPNG');
        if (exportPNG) {
            exportPNG.title = t('exportPNGTooltip');
            exportPNG.addEventListener('click', () => {
                this.exportPNG();
            });
        }

        // Shortcuts help
        const shortcutsHelp = document.getElementById('shortcutsHelp');
        if (shortcutsHelp) {
            shortcutsHelp.title = 'Keyboard Shortcuts';
            shortcutsHelp.addEventListener('click', () => {
                this.showShortcutsHelp();
            });
        }

        // Re-render sidebar components
        this.setupSidebar();
        
        // Update properties panel if component is selected
        if (this.selectedComponent) {
            this.showProperties(this.selectedComponent);
        }
        
        // Update BOM
        this.bom.updateBOM();
    }

    setupCanvas() {
        this.canvas.addEventListener('click', (e) => {
            // Handle selection when no tool is selected
            if (!this.currentTool && e.target === this.canvas) {
                this.selectComponent(null);
            }
        });

        this.canvas.addEventListener('dblclick', (e) => {
            // If we have a tool selected, add component at double-click position
            if (this.currentTool) {
                const rect = this.canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) / this.zoomLevel;
                const y = (e.clientY - rect.top) / this.zoomLevel;
                
                this.addComponentAtPosition(this.currentTool, x, y);
                return;
            }
        });

        // Mouse tracking for coordinates
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.round((e.clientX - rect.left) / this.zoomLevel);
            const y = Math.round((e.clientY - rect.top) / this.zoomLevel);
            this.mouseCoords.textContent = t('mouseCoords', { x, y });
        });
    }

    setupSidebar() {
        // Clear existing components
        this.sidebar.innerHTML = '';
        
        // Create component buttons
        Object.values(COMPONENT_TYPES).forEach(type => {
            const button = document.createElement('div');
            button.className = 'component-item';
            button.draggable = true;
            button.dataset.componentType = type.id;
            button.title = `${type.name} - ${t('selectToolFirst')}`;
            
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
            this.canvas.classList.remove('tool-active');
            this.hideCanvasInstructions();
        } else {
            // Select new tool
            this.currentTool = componentType;
            this.canvas.style.cursor = 'crosshair';
            this.canvas.classList.add('tool-active');
            
            // Highlight selected tool
            const toolButton = this.sidebar.querySelector(`[data-component-type="${componentType.id}"]`);
            if (toolButton) {
                toolButton.classList.add('active');
            }
            
            this.showCanvasInstructions();
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
            gridToggle.title = t('gridTooltip');
            gridToggle.addEventListener('click', () => {
                this.gridVisible = !this.gridVisible;
                this.canvas.classList.toggle('grid-enabled', this.gridVisible);
                gridToggle.classList.toggle('active', this.gridVisible);
            });
        }

        // Snap toggle
        const snapToggle = document.getElementById('snapToggle');
        if (snapToggle) {
            snapToggle.title = t('snapTooltip');
            snapToggle.addEventListener('click', () => {
                this.snapEnabled = !this.snapEnabled;
                snapToggle.classList.toggle('active', this.snapEnabled);
            });
        }

        // Zoom controls
        const zoomIn = document.getElementById('zoomIn');
        if (zoomIn) {
            zoomIn.title = t('zoomInTooltip');
            zoomIn.addEventListener('click', () => {
                this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
                this.updateZoom();
            });
        }

        const zoomOut = document.getElementById('zoomOut');
        if (zoomOut) {
            zoomOut.title = t('zoomOutTooltip');
            zoomOut.addEventListener('click', () => {
                this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5);
                this.updateZoom();
            });
        }

        // Clear all
        const clearCanvas = document.getElementById('clearCanvas');
        if (clearCanvas) {
            clearCanvas.title = t('clearAllTooltip');
            clearCanvas.addEventListener('click', () => {
                if (confirm(t('confirmClearAll'))) {
                    this.clearAll();
                }
            });
        }

        // Export
        const saveDesign = document.getElementById('saveDesign');
        if (saveDesign) {
            saveDesign.title = t('saveTooltip');
            saveDesign.addEventListener('click', () => {
                this.exportDesign();
            });
        }

        // Export PNG
        const exportPNG = document.getElementById('exportPNG');
        if (exportPNG) {
            exportPNG.title = t('exportPNGTooltip');
            exportPNG.addEventListener('click', () => {
                this.exportPNG();
            });
        }

        // Shortcuts help
        const shortcutsHelp = document.getElementById('shortcutsHelp');
        if (shortcutsHelp) {
            shortcutsHelp.title = 'Keyboard Shortcuts';
            shortcutsHelp.addEventListener('click', () => {
                this.showShortcutsHelp();
            });
        }

        // 3D View Toggle
        const view3DToggle = document.getElementById('view3DToggle');
        if (view3DToggle) {
            view3DToggle.title = t('view3DTooltip');
            view3DToggle.addEventListener('click', () => {
                this.toggle3DView();
            });
        }
    }

    updateZoom() {
        this.canvas.style.transform = `scale(${this.zoomLevel})`;
        this.canvas.style.transformOrigin = 'top left';
        const zoomDisplay = document.querySelector('.zoom-level');
        if (zoomDisplay) {
            zoomDisplay.textContent = t('zoomLevel', { level: Math.round(this.zoomLevel * 100) });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key.toLowerCase()) {
                case 'g':
                    e.preventDefault();
                    this.toggleGrid();
                    break;
                case 's':
                    e.preventDefault();
                    this.toggleSnap();
                    break;
                case 'escape':
                    e.preventDefault();
                    this.currentTool = null;
                    this.canvas.style.cursor = 'default';
                    this.canvas.classList.remove('tool-active');
                    this.hideCanvasInstructions();
                    // Deselect all tools
                    this.sidebar.querySelectorAll('.component-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    this.zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    this.resetZoom();
                    break;
                case 'delete':
                case 'backspace':
                    e.preventDefault();
                    this.deleteSelected();
                    break;
                case '3':
                    e.preventDefault();
                    this.toggle3DView();
                    break;
            }
        });
    }

    setupMouseTracking() {
        // Already implemented in setupCanvas
    }

    addComponent(component) {
        this.components.push(component);
        this.canvas.appendChild(component.element);
        this.updateComponentCounter();
        this.bom.updateBOM();
        
        // Update 3D view if active
        if (this.is3DMode) {
            this.viewer3D.updateFrom2D();
        }
    }

    removeComponent(component) {
        const index = this.components.indexOf(component);
        if (index > -1) {
            this.components.splice(index, 1);
            component.element.remove();
            this.updateComponentCounter();
            this.bom.update();
            
            // Update 3D view if active
            if (this.is3DMode) {
                this.viewer3D.updateFrom2D();
            }
            
            if (this.selectedComponent === component) {
                this.selectedComponent = null;
                this.hideProperties();
            }
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
        const content = document.querySelector('.properties-content');
        if (!content) return;
        content.innerHTML = '';
        
        // Component type
        const typeDiv = document.createElement('div');
        typeDiv.className = 'property-group';
        typeDiv.innerHTML = `
            <label>${t('componentType')}</label>
            <span>${component.type.name}</span>
        `;
        content.appendChild(typeDiv);
        
        // Position
        const posDiv = document.createElement('div');
        posDiv.className = 'property-group';
        posDiv.innerHTML = `
            <label>${t('position')}</label>
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
            <label>${t('rotation')}</label>
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
                <label>${t('length')}</label>
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
                <i class="bi bi-trash"></i> ${t('delete')}
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
        this.componentCount.textContent = t('componentCount', { count: this.components.length });
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
        
        // Clear 3D view
        if (this.viewer3D) {
            this.viewer3D.clearComponents();
        }
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
        a.download = t('exportFilename');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportPNG() {
        // Create a temporary canvas for export
        const exportCanvas = document.createElement('canvas');
        const ctx = exportCanvas.getContext('2d');
        
        // Get canvas bounds
        const canvasRect = this.canvas.getBoundingClientRect();
        const padding = 50;
        
        // Calculate content bounds
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        if (this.components.length === 0) {
            // Default size if no components
            exportCanvas.width = 800;
            exportCanvas.height = 600;
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        } else {
            // Calculate bounds from components
            this.components.forEach(component => {
                const rect = component.element.getBoundingClientRect();
                const x = component.x;
                const y = component.y;
                const width = component.element.offsetWidth;
                const height = component.element.offsetHeight;
                
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x + width);
                maxY = Math.max(maxY, y + height);
            });
            
            // Set canvas size with padding
            const contentWidth = maxX - minX;
            const contentHeight = maxY - minY;
            exportCanvas.width = contentWidth + (padding * 2);
            exportCanvas.height = contentHeight + (padding * 2);
            
            // Fill background
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
            
            // Draw grid if enabled
            if (this.gridVisible) {
                ctx.strokeStyle = '#dee2e6';
                ctx.lineWidth = 1;
                
                for (let x = 0; x <= exportCanvas.width; x += this.gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, exportCanvas.height);
                    ctx.stroke();
                }
                
                for (let y = 0; y <= exportCanvas.height; y += this.gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(exportCanvas.width, y);
                    ctx.stroke();
                }
            }
            
            // Draw components
            this.components.forEach(component => {
                const x = component.x - minX + padding;
                const y = component.y - minY + padding;
                
                ctx.save();
                ctx.translate(x + component.element.offsetWidth/2, y + component.element.offsetHeight/2);
                ctx.rotate(component.rotation * Math.PI / 180);
                ctx.translate(-component.element.offsetWidth/2, -component.element.offsetHeight/2);
                
                // Draw component based on type
                this.drawComponent(ctx, component, 0, 0);
                
                ctx.restore();
            });
        }
        
        // Download the image
        const link = document.createElement('a');
        link.download = 'treo-rackit-design.png';
        link.href = exportCanvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    drawComponent(ctx, component, x, y) {
        const width = component.element.offsetWidth;
        const height = component.element.offsetHeight;
        
        switch (component.type.id) {
            case 'pipe-segment':
                ctx.fillStyle = '#6c757d';
                ctx.fillRect(x, y + 2, width, height - 4);
                ctx.fillStyle = '#adb5bd';
                ctx.fillRect(x + 2, y + 4, width - 4, 6);
                break;
                
            case 'elbow-joint':
                ctx.fillStyle = '#0d6efd';
                ctx.fillRect(x + 8, y, width - 16, 8);
                ctx.fillRect(x + width - 8, y, 8, height - 8);
                ctx.fillRect(x + 8, y + height - 8, width - 8, 8);
                ctx.fillRect(x, y + 8, 8, height - 16);
                break;
                
            case 'tee-joint':
                ctx.fillStyle = '#198754';
                ctx.fillRect(x + 12, y, width - 24, 20);
                ctx.fillRect(x, y + 20, width, 20);
                ctx.fillRect(x + 12, y + 40, width - 24, height - 40);
                break;
                
            case 'wall-mount':
                ctx.fillStyle = '#dc3545';
                ctx.fillRect(x, y + 5, 15, 20);
                ctx.fillRect(x + 15, y + 12, 15, 6);
                // Draw screw holes
                ctx.fillStyle = '#6c757d';
                ctx.beginPath();
                ctx.arc(x + 7.5, y + 12, 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + 7.5, y + 18, 2, 0, 2 * Math.PI);
                ctx.fill();
                break;
        }
    }

    showShortcutsHelp() {
        const shortcuts = [
            t('shortcuts.escape'),
            t('shortcuts.delete'),
            t('shortcuts.grid'),
            t('shortcuts.snap')
        ];
        
        const message = shortcuts.join('\n');
        alert(message);
    }

    showCanvasInstructions() {
        // Remove existing instructions
        this.hideCanvasInstructions();
        
        // Create instruction overlay
        const instructions = document.createElement('div');
        instructions.id = 'canvas-instructions';
        instructions.className = 'canvas-instructions';
        instructions.innerHTML = `
            <div class="instruction-content">
                <i class="bi bi-hand-index-thumb"></i>
                <span>${t('canvasInstructions')}</span>
            </div>
        `;
        
        this.canvas.appendChild(instructions);
    }

    hideCanvasInstructions() {
        const existing = document.getElementById('canvas-instructions');
        if (existing) {
            existing.remove();
        }
    }

    toggle3DView() {
        this.is3DMode = !this.is3DMode;
        const view3DToggle = document.getElementById('view3DToggle');
        const icon = view3DToggle.querySelector('i');
        const text = view3DToggle.querySelector('span');
        
        if (this.is3DMode) {
            // Switch to 3D
            this.canvas.style.display = 'none';
            this.viewer3D.show();
            view3DToggle.classList.add('active');
            icon.className = 'bi bi-square';
            text.textContent = t('toggle2D');
            view3DToggle.title = t('toggle2DTooltip');
        } else {
            // Switch to 2D
            this.canvas.style.display = 'block';
            this.viewer3D.hide();
            view3DToggle.classList.remove('active');
            icon.className = 'bi bi-box';
            text.textContent = t('view3D');
            view3DToggle.title = t('view3DTooltip');
        }
    }

    updateComponent(component) {
        this.bom.update();
        
        // Update 3D view if active
        if (this.is3DMode) {
            this.viewer3D.updateFrom2D();
        }
    }

    clearCanvas() {
        this.components = [];
        this.canvas.innerHTML = '';
        this.selectedComponent = null;
        this.hideProperties();
        this.updateComponentCounter();
        this.bom.update();
        
        // Clear 3D view
        if (this.viewer3D) {
            this.viewer3D.clearComponents();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TreoRackitApp();
}); 