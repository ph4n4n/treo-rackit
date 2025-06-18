class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.componentsList = document.querySelector('.components-list');
        this.selectedComponent = null;
        
        this.init();
    }

    init() {
        // Add grid to canvas
        this.addGrid();
        
        // Initialize components list
        this.initComponentsList();
        
        // Initialize drag and drop
        this.dragDrop = new DragDrop(this);
        
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
            item.textContent = this.getComponentLabel(type);
            
            this.componentsList.appendChild(item);
        });
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
            if (e.target === this.canvas) {
                this.deselectComponent();
            }
        });
    }

    deselectComponent() {
        if (this.selectedComponent) {
            this.selectedComponent.classList.remove('selected');
            this.selectedComponent = null;
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 