class DragDrop {
    constructor(app) {
        this.app = app;
        this.draggedItem = null;
        this.init();
    }

    init() {
        // Drag over canvas
        this.app.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        // Drop on canvas
        this.app.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const componentTypeId = e.dataTransfer.getData('text/plain');
            if (componentTypeId) {
                const rect = this.app.canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) / this.app.zoomLevel;
                const y = (e.clientY - rect.top) / this.app.zoomLevel;
                this.createComponent(componentTypeId, x, y);
            }
        });
    }

    handleDragStart(e) {
        this.draggedItem = e.target;
        const componentTypeId = e.target.dataset.componentType;
        e.dataTransfer.setData('text/plain', componentTypeId);
        e.dataTransfer.effectAllowed = 'copy';
    }

    createComponent(componentTypeId, x, y) {
        let component;
        
        switch (componentTypeId) {
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
            default:
                return;
        }

        if (component) {
            this.app.addComponent(component);
        }
    }
} 