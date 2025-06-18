class BaseComponent {
    constructor(type, x, y) {
        this.id = this.generateId();
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.element = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
    }

    generateId() {
        return `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    create() {
        this.element = document.createElement('div');
        this.element.className = 'component';
        this.element.dataset.id = this.id;
        this.element.dataset.type = this.type.id;
        
        this.updateStyle();
        this.addDeleteButton();
        this.addEventListeners();
        
        return this.element;
    }

    updateStyle() {
        if (this.element) {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            this.element.style.transform = `rotate(${this.rotation}deg)`;
        }
    }

    rotate(degrees) {
        this.rotation = (this.rotation + degrees) % 360;
        if (this.rotation < 0) this.rotation += 360;
        this.updateStyle();
    }

    move(x, y) {
        if (window.app.isSnapEnabled) {
            this.x = Math.round(x / window.app.gridSize) * window.app.gridSize;
            this.y = Math.round(y / window.app.gridSize) * window.app.gridSize;
        } else {
            this.x = x;
            this.y = y;
        }
        this.updateStyle();
    }

    setSelected(selected) {
        if (selected) {
            this.element.classList.add('selected');
        } else {
            this.element.classList.remove('selected');
        }
    }

    addDeleteButton() {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="bi bi-x"></i>';
        deleteBtn.title = t('deleteComponent');
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.app.removeComponent(this);
        });
        
        this.element.appendChild(deleteBtn);
    }

    addEventListeners() {
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            window.app.selectComponent(this);
        });

        // Mouse down to start dragging
        this.element.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || 
                e.target.tagName === 'INPUT' || 
                e.target.closest('.rotation-controls') ||
                e.target.closest('.resize-handle')) {
                return; // Don't drag when clicking controls
            }
            
            this.isDragging = true;
            this.element.classList.add('dragging');
            
            const rect = this.element.getBoundingClientRect();
            const canvasRect = window.app.canvas.getBoundingClientRect();
            
            this.dragOffset.x = (e.clientX - rect.left) / window.app.zoomLevel;
            this.dragOffset.y = (e.clientY - rect.top) / window.app.zoomLevel;
            
            this.element.style.cursor = 'grabbing';
            e.preventDefault();
        });

        // Mouse move to drag
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const canvasRect = window.app.canvas.getBoundingClientRect();
            const newX = (e.clientX - canvasRect.left) / window.app.zoomLevel - this.dragOffset.x;
            const newY = (e.clientY - canvasRect.top) / window.app.zoomLevel - this.dragOffset.y;
            
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