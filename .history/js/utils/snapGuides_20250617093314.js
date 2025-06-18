class SnapGuides {
    constructor(app) {
        this.app = app;
        this.guides = [];
        this.snapDistance = 10; // pixels
    }

    showGuides(draggedComponent) {
        this.clearGuides();
        
        const components = this.app.components.filter(c => c !== draggedComponent);
        
        const draggedRect = {
            x: draggedComponent.x,
            y: draggedComponent.y,
            width: draggedComponent.element ? draggedComponent.element.offsetWidth : 40,
            height: draggedComponent.element ? draggedComponent.element.offsetHeight : 40
        };

        components.forEach(component => {
            const rect = {
                x: component.x,
                y: component.y,
                width: component.element ? component.element.offsetWidth : 40,
                height: component.element ? component.element.offsetHeight : 40
            };

            // Vertical alignment guides
            if (Math.abs(draggedRect.x - rect.x) < this.snapDistance) {
                this.createVerticalGuide(rect.x);
            }
            if (Math.abs(draggedRect.x + draggedRect.width - rect.x - rect.width) < this.snapDistance) {
                this.createVerticalGuide(rect.x + rect.width);
            }

            // Horizontal alignment guides
            if (Math.abs(draggedRect.y - rect.y) < this.snapDistance) {
                this.createHorizontalGuide(rect.y);
            }
            if (Math.abs(draggedRect.y + draggedRect.height - rect.y - rect.height) < this.snapDistance) {
                this.createHorizontalGuide(rect.y + rect.height);
            }
        });
    }

    createVerticalGuide(x) {
        const guide = document.createElement('div');
        guide.className = 'snap-guide vertical';
        guide.style.left = `${x}px`;
        guide.style.top = '0';
        this.app.canvas.appendChild(guide);
        this.guides.push(guide);
    }

    createHorizontalGuide(y) {
        const guide = document.createElement('div');
        guide.className = 'snap-guide horizontal';
        guide.style.top = `${y}px`;
        guide.style.left = '0';
        this.app.canvas.appendChild(guide);
        this.guides.push(guide);
    }

    clearGuides() {
        this.guides.forEach(guide => guide.remove());
        this.guides = [];
    }

    snapToGuides(component) {
        if (!this.app.isSnapEnabled) return { x: component.x, y: component.y };
        
        const components = this.app.components.filter(c => c !== component);
        
        let snappedX = component.x;
        let snappedY = component.y;

        components.forEach(other => {
            const otherWidth = other.element ? other.element.offsetWidth : 40;
            const otherHeight = other.element ? other.element.offsetHeight : 40;
            
            // Snap to left edge
            if (Math.abs(component.x - other.x) < this.snapDistance) {
                snappedX = other.x;
            }
            // Snap to right edge
            if (Math.abs(component.x - (other.x + otherWidth)) < this.snapDistance) {
                snappedX = other.x + otherWidth;
            }
            
            // Snap to top edge
            if (Math.abs(component.y - other.y) < this.snapDistance) {
                snappedY = other.y;
            }
            // Snap to bottom edge
            if (Math.abs(component.y - (other.y + otherHeight)) < this.snapDistance) {
                snappedY = other.y + otherHeight;
            }
        });

        return { x: snappedX, y: snappedY };
    }
} 