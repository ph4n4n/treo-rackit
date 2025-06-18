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
        let component;
        
        switch (type) {
            case COMPONENT_TYPES.PIPE_SEGMENT:
                component = new PipeSegment(x, y);
                break;
            case COMPONENT_TYPES.ELBOW_JOINT:
                component = new ElbowJoint(x, y);
                break;
            case COMPONENT_TYPES.TEE_JOINT:
                component = new TeeJoint(x, y);
                break;
            case COMPONENT_TYPES.WALL_MOUNT:
                component = new WallMount(x, y);
                break;
            default:
                return;
        }

        const element = component.create();
        this.app.canvas.appendChild(element);
        this.app.addComponent(component);
    }
} 