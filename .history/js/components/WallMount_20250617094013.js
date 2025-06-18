class WallMount extends BaseComponent {
    constructor(x, y) {
        super(COMPONENT_TYPES.WALL_MOUNT, x, y);
    }

    create() {
        super.create();
        this.element.classList.add('wall-mount');
        
        // Create SVG wall mount
        this.createWallMountSVG();
        
        // Add rotation controls
        const controls = document.createElement('div');
        controls.className = 'rotation-controls';
        
        const rotateLeft = document.createElement('button');
        rotateLeft.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
        rotateLeft.title = t('rotateLeft');
        rotateLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            this.rotate(-90);
        });
        
        const rotateRight = document.createElement('button');
        rotateRight.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
        rotateRight.title = 'Xoay phải 90°';
        rotateRight.addEventListener('click', (e) => {
            e.stopPropagation();
            this.rotate(90);
        });
        
        controls.appendChild(rotateLeft);
        controls.appendChild(rotateRight);
        this.element.appendChild(controls);
        
        return this.element;
    }

    createWallMountSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 30 30');
        
        // Wall plate (back)
        const wallPlate = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        wallPlate.setAttribute('x', '0');
        wallPlate.setAttribute('y', '5');
        wallPlate.setAttribute('width', '15');
        wallPlate.setAttribute('height', '20');
        wallPlate.setAttribute('rx', '2');
        wallPlate.setAttribute('fill', '#dc3545');
        wallPlate.setAttribute('stroke', '#c82333');
        wallPlate.setAttribute('stroke-width', '1');
        
        // Mounting bracket (arm)
        const bracket = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bracket.setAttribute('x', '15');
        bracket.setAttribute('y', '12');
        bracket.setAttribute('width', '15');
        bracket.setAttribute('height', '6');
        bracket.setAttribute('fill', '#dc3545');
        bracket.setAttribute('stroke', '#c82333');
        bracket.setAttribute('stroke-width', '1');
        
        // Screw holes
        const hole1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        hole1.setAttribute('cx', '7.5');
        hole1.setAttribute('cy', '12');
        hole1.setAttribute('r', '2');
        hole1.setAttribute('fill', '#6c757d');
        
        const hole2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        hole2.setAttribute('cx', '7.5');
        hole2.setAttribute('cy', '18');
        hole2.setAttribute('r', '2');
        hole2.setAttribute('fill', '#6c757d');
        
        // Highlight
        const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        highlight.setAttribute('x', '2');
        highlight.setAttribute('y', '7');
        highlight.setAttribute('width', '11');
        highlight.setAttribute('height', '3');
        highlight.setAttribute('rx', '1');
        highlight.setAttribute('fill', '#f8d7da');
        
        svg.appendChild(wallPlate);
        svg.appendChild(bracket);
        svg.appendChild(hole1);
        svg.appendChild(hole2);
        svg.appendChild(highlight);
        
        this.element.appendChild(svg);
    }
} 