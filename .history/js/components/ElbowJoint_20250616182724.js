class ElbowJoint extends BaseComponent {
    constructor(x, y) {
        super(COMPONENT_TYPES.ELBOW_JOINT, x, y);
    }

    create() {
        super.create();
        this.element.classList.add('elbow-joint');
        
        // Create SVG elbow
        this.createElbowSVG();
        
        // Add rotation controls
        const controls = document.createElement('div');
        controls.className = 'rotation-controls';
        
        const rotateLeft = document.createElement('button');
        rotateLeft.textContent = '↶';
        rotateLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            this.rotate(-90);
        });
        
        const rotateRight = document.createElement('button');
        rotateRight.textContent = '↷';
        rotateRight.addEventListener('click', (e) => {
            e.stopPropagation();
            this.rotate(90);
        });
        
        controls.appendChild(rotateLeft);
        controls.appendChild(rotateRight);
        this.element.appendChild(controls);
        
        return this.element;
    }

    createElbowSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 40 40');
        
        // Create elbow path (90 degree bend)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 8 0 L 32 0 L 32 8 L 40 8 L 40 32 L 32 32 L 32 40 L 8 40 L 8 32 L 0 32 L 0 8 L 8 8 Z');
        path.setAttribute('fill', '#0d6efd');
        path.setAttribute('stroke', '#0b5ed7');
        path.setAttribute('stroke-width', '1');
        
        // Inner highlight
        const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        highlight.setAttribute('d', 'M 10 2 L 30 2 L 30 10 L 38 10 L 38 30 L 30 30 L 30 38 L 10 38 L 10 30 L 2 30 L 2 10 L 10 10 Z');
        highlight.setAttribute('fill', '#6ea8fe');
        
        svg.appendChild(path);
        svg.appendChild(highlight);
        
        this.element.appendChild(svg);
    }
} 