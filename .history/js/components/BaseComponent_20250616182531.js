class BaseComponent {
    constructor(type, x, y) {
        this.id = this.generateId();
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.element = null;
        this.defaults = COMPONENT_DEFAULTS[type];
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
    }

    generateId() {
        return `${this.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    create() {
        this.element = document.createElement('div');
        this.element.className = 'component';
        this.element.dataset.id = this.id;
        this.element.dataset.type = this.type;
        
        this.updatePosition();
        this.updateStyle();
        this.addDeleteButton();
        this.addEventListeners();
        
        return this.element;
    }

    updatePosition() {
        if (this.element) {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }

    updateStyle() {
        if (this.element) {
            this.element.style.width = `${this.defaults.width}px`;
            this.element.style.height = `${this.defaults.height}px`;
            this.element.style.transform = `rotate(${this.rotation}deg)`;
        }
    }

    rotate(degrees) {
        this.rotation = (this.rotation + degrees) % 360;
        this.updateStyle();
    }

    move(x, y) {
        this.x = Math.round(x / GRID_SIZE) * GRID_SIZE;
        this.y = Math.round(y / GRID_SIZE) * GRID_SIZE;
        this.updatePosition();
    }

    select() {
        this.element.classList.add('selected');
    }

    deselect() {
        this.element.classList.remove('selected');
    }

    addDeleteButton() {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = 'Xóa component';
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.delete();
        });
        
        this.element.appendChild(deleteBtn);
    }

    delete() {
        this.element.remove();
        window.app.components.delete(this.id);
        if (window.app.selectedComponent === this) {
            window.app.selectedComponent = null;
        }
        window.app.bom.updateBOM();
    }

    addEventListeners() {
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            window.app.selectComponent(this);
        });

        // Mouse down to start dragging
        this.element.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
                return; // Don't drag when clicking buttons or inputs
            }
            
            this.isDragging = true;
            this.element.classList.add('dragging');
            
            const rect = this.element.getBoundingClientRect();
            const canvasRect = window.app.canvas.getBoundingClientRect();
            
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            this.element.style.cursor = 'grabbing';
            e.preventDefault();
        });

        // Mouse move to drag
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const canvasRect = window.app.canvas.getBoundingClientRect();
            const newX = e.clientX - canvasRect.left - this.dragOffset.x;
            const newY = e.clientY - canvasRect.top - this.dragOffset.y;
            
            this.move(newX, newY);
        });

        // Mouse up to stop dragging
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.element.classList.remove('dragging');
                this.element.style.cursor = 'move';
            }
        });
    }
} 