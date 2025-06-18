class BaseComponent {
    constructor(type, x, y) {
        this.id = this.generateId();
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.element = null;
        this.defaults = COMPONENT_DEFAULTS[type];
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
            this.element.style.backgroundColor = this.defaults.color;
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

    addEventListeners() {
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            window.app.selectComponent(this);
        });
    }
} 