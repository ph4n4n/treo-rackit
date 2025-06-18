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

    createElbowSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 40 40');
        
        // Main elbow body (curved pipe)
        const elbowBody = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        elbowBody.setAttribute('d', 'M 12 0 L 20 0 L 20 12 L 40 12 L 40 20 L 28 20 L 28 40 L 20 40 L 20 28 L 0 28 L 0 20 L 12 20 Z');
        elbowBody.setAttribute('fill', '#dc3545');
        elbowBody.setAttribute('stroke', '#c82333');
        elbowBody.setAttribute('stroke-width', '1');
        
        // Curved inner part để tạo pipe bend
        const innerCurve = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        innerCurve.setAttribute('d', 'M 16 2 L 18 2 L 18 16 L 38 16 L 38 18 L 26 18 L 26 38 L 24 38 L 24 26 L 2 26 L 2 24 L 16 24 Z');
        innerCurve.setAttribute('fill', '#f8d7da');
        
        // Threaded ends
        const threads1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        for (let i = 0; i < 4; i++) {
            const thread = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            thread.setAttribute('x', '13 + ' + i);
            thread.setAttribute('y', i % 2 === 0 ? '1' : '3');
            thread.setAttribute('width', '1');
            thread.setAttribute('height', '2');
            thread.setAttribute('fill', '#6c757d');
            threads1.appendChild(thread);
        }
        
        const threads2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        for (let i = 0; i < 4; i++) {
            const thread = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            thread.setAttribute('x', i % 2 === 0 ? '37' : '35');
            thread.setAttribute('y', '13 + ' + i);
            thread.setAttribute('width', '2');
            thread.setAttribute('height', '1');
            thread.setAttribute('fill', '#6c757d');
            threads2.appendChild(thread);
        }
        
        // Socket reinforcements
        const socket1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        socket1.setAttribute('x', '10');
        socket1.setAttribute('y', '-2');
        socket1.setAttribute('width', '12');
        socket1.setAttribute('height', '4');
        socket1.setAttribute('fill', '#495057');
        
        const socket2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        socket2.setAttribute('x', '38');
        socket2.setAttribute('y', '10');
        socket2.setAttribute('width', '4');
        socket2.setAttribute('height', '12');
        socket2.setAttribute('fill', '#495057');
        
        svg.appendChild(socket1);
        svg.appendChild(socket2);
        svg.appendChild(elbowBody);
        svg.appendChild(innerCurve);
        svg.appendChild(threads1);
        svg.appendChild(threads2);
        
        this.element.appendChild(svg);
    }
} 