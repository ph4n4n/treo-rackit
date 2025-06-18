class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.componentsList = document.querySelector('.components-list');
        this.selectedComponent = null;
        this.components = new Map(); // Store component instances
        
        this.init();
    }

    init() {
        // Add grid to canvas
        this.addGrid();
        
        // Initialize components list
        this.initComponentsList();
        
        // Initialize drag and drop
        this.dragDrop = new DragDrop(this);
        
        // Initialize snap guides
        this.snapGuides = new SnapGuides(this);
        
        // Initialize BOM
        this.bom = new BOM(this);
        
        // Add event listeners
        this.addEventListeners();
    }

    addGrid() {
        const grid = document.createElement('div');
        grid.className = 'grid';
        this.canvas.appendChild(grid);
    }

    initComponentsList() {
        Object.entries(COMPONENT_TYPES).forEach(([key, type]) => {
            const item = document.createElement('div');
            item.className = 'component-item';
            item.draggable = true;
            item.dataset.type = type;
            
            // Add SVG preview
            this.addComponentPreview(item, type);
            
            // Add label
            const label = document.createElement('div');
            label.textContent = this.getComponentLabel(type);
            item.appendChild(label);
            
            this.componentsList.appendChild(item);
        });
    }

    addComponentPreview(item, type) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        
        switch (type) {
            case COMPONENT_TYPES.PIPE_SEGMENT:
                svg.setAttribute('viewBox', '0 0 40 8');
                const pipe = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                pipe.setAttribute('x', '0');
                pipe.setAttribute('y', '1');
                pipe.setAttribute('width', '40');
                pipe.setAttribute('height', '6');
                pipe.setAttribute('rx', '3');
                pipe.setAttribute('fill', '#6c757d');
                pipe.setAttribute('stroke', '#495057');
                svg.appendChild(pipe);
                break;
                
            case COMPONENT_TYPES.ELBOW_JOINT:
                svg.setAttribute('viewBox', '0 0 20 20');
                const elbow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                elbow.setAttribute('d', 'M 4 0 L 16 0 L 16 4 L 20 4 L 20 16 L 16 16 L 16 20 L 4 20 L 4 16 L 0 16 L 0 4 L 4 4 Z');
                elbow.setAttribute('fill', '#0d6efd');
                elbow.setAttribute('stroke', '#0b5ed7');
                svg.appendChild(elbow);
                break;
                
            case COMPONENT_TYPES.TEE_JOINT:
                svg.setAttribute('viewBox', '0 0 20 30');
                const tee = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                tee.setAttribute('d', 'M 6 0 L 14 0 L 14 10 L 20 10 L 20 20 L 14 20 L 14 30 L 6 30 L 6 20 L 0 20 L 0 10 L 6 10 Z');
                tee.setAttribute('fill', '#198754');
                tee.setAttribute('stroke', '#157347');
                svg.appendChild(tee);
                break;
                
            case COMPONENT_TYPES.WALL_MOUNT:
                svg.setAttribute('viewBox', '0 0 15 15');
                const mount = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                mount.setAttribute('x', '0');
                mount.setAttribute('y', '2');
                mount.setAttribute('width', '8');
                mount.setAttribute('height', '11');
                mount.setAttribute('fill', '#dc3545');
                mount.setAttribute('stroke', '#c82333');
                const arm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                arm.setAttribute('x', '8');
                arm.setAttribute('y', '6');
                arm.setAttribute('width', '7');
                arm.setAttribute('height', '3');
                arm.setAttribute('fill', '#dc3545');
                arm.setAttribute('stroke', '#c82333');
                svg.appendChild(mount);
                svg.appendChild(arm);
                break;
        }
        
        item.appendChild(svg);
    }

    getComponentLabel(type) {
        const labels = {
            [COMPONENT_TYPES.PIPE_SEGMENT]: 'Ống',
            [COMPONENT_TYPES.ELBOW_JOINT]: 'Co 90°',
            [COMPONENT_TYPES.TEE_JOINT]: 'Khớp T',
            [COMPONENT_TYPES.WALL_MOUNT]: 'Chân đế'
        };
        return labels[type] || type;
    }

    addEventListeners() {
        // Canvas click to deselect
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas || e.target.classList.contains('grid')) {
                this.deselectComponent();
            }
        });

        // Delete selected component with Delete key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.selectedComponent) {
                this.selectedComponent.delete();
            }
        });
    }

    deselectComponent() {
        if (this.selectedComponent) {
            this.selectedComponent.deselect();
            this.selectedComponent = null;
        }
    }

    selectComponent(component) {
        this.deselectComponent();
        this.selectedComponent = component;
        component.select();
    }

    addComponent(component) {
        this.components.set(component.id, component);
        this.bom.updateBOM();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 