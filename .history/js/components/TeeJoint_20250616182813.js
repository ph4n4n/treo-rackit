class TeeJoint extends BaseComponent {
    constructor(x, y) {
        super(COMPONENT_TYPES.TEE_JOINT, x, y);
    }

    create() {
        super.create();
        this.element.classList.add('tee-joint');
        
        // Create SVG T-joint
        this.createTeeJointSVG();
        
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

    createTeeJointSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 40 60');
        
        // Create T-joint path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 12 0 L 28 0 L 28 20 L 40 20 L 40 40 L 28 40 L 28 60 L 12 60 L 12 40 L 0 40 L 0 20 L 12 20 Z');
        path.setAttribute('fill', '#198754');
        path.setAttribute('stroke', '#157347');
        path.setAttribute('stroke-width', '1');
        
        // Inner highlight
        const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        highlight.setAttribute('d', 'M 14 2 L 26 2 L 26 22 L 38 22 L 38 38 L 26 38 L 26 58 L 14 58 L 14 38 L 2 38 L 2 22 L 14 22 Z');
        highlight.setAttribute('fill', '#75b798');
        
        svg.appendChild(path);
        svg.appendChild(highlight);
        
        this.element.appendChild(svg);
    }
} 