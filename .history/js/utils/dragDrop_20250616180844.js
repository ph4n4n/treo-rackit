class DragDrop {
    constructor(app) {
        this.app = app;
        this.draggedItem = null;
        this.init();
    }

    init() {
        // Drag start from components list
        this.app.componentsList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('component-item')) {
                this.draggedItem = e.target;
                e.dataTransfer.setData('text/plain', e.target.dataset.type);
                e.dataTransfer.effectAllowed = 'copy';
            }
        });

        // Drag over canvas
        this.app.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        // Drop on canvas
        this.app.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('text/plain');
            if (type) {
                this.createComponent(type, e.offsetX, e.offsetY);
            }
        });
    }

    createComponent(type, x, y) {
        // Snap to grid
        const gridX = Math.round(x / GRID_SIZE) * GRID_SIZE;
        const gridY = Math.round(y / GRID_SIZE) * GRID_SIZE;

        const component = document.createElement('div');
        component.className = 'component';
        component.dataset.type = type;
        component.style.left = `${gridX}px`;
        component.style.top = `${gridY}px`;

        // Add component specific styles
        const defaults = COMPONENT_DEFAULTS[type];
        component.style.width = `${defaults.width}px`;
        component.style.height = `${defaults.height}px`;
        component.style.backgroundColor = defaults.color;

        // Add click handler
        component.addEventListener('click', (e) => {
            e.stopPropagation();
            this.app.deselectComponent();
            component.classList.add('selected');
            this.app.selectedComponent = component;
        });

        this.app.canvas.appendChild(component);
    }
} 