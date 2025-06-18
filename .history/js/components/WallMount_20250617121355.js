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
        rotateRight.title = t('rotateRight');
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
        
        // Wall mounting plate
        const wallPlate = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        wallPlate.setAttribute('x', '0');
        wallPlate.setAttribute('y', '6');
        wallPlate.setAttribute('width', '8');
        wallPlate.setAttribute('height', '18');
        wallPlate.setAttribute('rx', '2');
        wallPlate.setAttribute('fill', '#6c757d');
        wallPlate.setAttribute('stroke', '#495057');
        wallPlate.setAttribute('stroke-width', '1');
        
        // Mounting bracket arm
        const bracketArm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bracketArm.setAttribute('x', '8');
        bracketArm.setAttribute('y', '12');
        bracketArm.setAttribute('width', '12');
        bracketArm.setAttribute('height', '6');
        bracketArm.setAttribute('fill', '#6c757d');
        bracketArm.setAttribute('stroke', '#495057');
        bracketArm.setAttribute('stroke-width', '1');
        
        // U-bolt clamp (pipe holder)
        const uBolt = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        uBolt.setAttribute('d', 'M 20 12 C 20 8, 28 8, 28 12 L 28 18 C 28 20, 26 22, 24 22 C 22 22, 20 20, 20 18 Z');
        uBolt.setAttribute('fill', 'none');
        uBolt.setAttribute('stroke', '#495057');
        uBolt.setAttribute('stroke-width', '3');
        uBolt.setAttribute('stroke-linecap', 'round');
        
        // U-bolt threads/nuts
        const nut1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        nut1.setAttribute('x', '19');
        nut1.setAttribute('y', '18');
        nut1.setAttribute('width', '3');
        nut1.setAttribute('height', '2');
        nut1.setAttribute('fill', '#ffc107');
        
        const nut2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        nut2.setAttribute('x', '26');
        nut2.setAttribute('y', '18');
        nut2.setAttribute('width', '3');
        nut2.setAttribute('height', '2');
        nut2.setAttribute('fill', '#ffc107');
        
        // Mounting holes in wall plate
        const hole1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        hole1.setAttribute('cx', '4');
        hole1.setAttribute('cy', '10');
        hole1.setAttribute('r', '1.5');
        hole1.setAttribute('fill', '#343a40');
        
        const hole2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        hole2.setAttribute('cx', '4');
        hole2.setAttribute('cy', '20');
        hole2.setAttribute('r', '1.5');
        hole2.setAttribute('fill', '#343a40');
        
        // Screws in holes
        const screw1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        screw1.setAttribute('cx', '4');
        screw1.setAttribute('cy', '10');
        screw1.setAttribute('r', '0.8');
        screw1.setAttribute('fill', '#dee2e6');
        
        const screw2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        screw2.setAttribute('cx', '4');
        screw2.setAttribute('cy', '20');
        screw2.setAttribute('r', '0.8');
        screw2.setAttribute('fill', '#dee2e6');
        
        // Highlight on wall plate
        const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        highlight.setAttribute('x', '1');
        highlight.setAttribute('y', '7');
        highlight.setAttribute('width', '6');
        highlight.setAttribute('height', '2');
        highlight.setAttribute('rx', '1');
        highlight.setAttribute('fill', '#adb5bd');
        
        // Assembly order for proper layering
        svg.appendChild(wallPlate);
        svg.appendChild(highlight);
        svg.appendChild(hole1);
        svg.appendChild(hole2);
        svg.appendChild(screw1);
        svg.appendChild(screw2);
        svg.appendChild(bracketArm);
        svg.appendChild(uBolt);
        svg.appendChild(nut1);
        svg.appendChild(nut2);
        
        this.element.appendChild(svg);
    }
} 