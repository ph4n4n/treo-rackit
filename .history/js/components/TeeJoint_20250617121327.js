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

    createTeeJointSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 40 60');
        
        // Main T-junction body
        const teeBody = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        teeBody.setAttribute('d', 'M 14 0 L 26 0 L 26 18 L 40 18 L 40 30 L 26 30 L 26 60 L 14 60 L 14 30 L 0 30 L 0 18 L 14 18 Z');
        teeBody.setAttribute('fill', '#198754');
        teeBody.setAttribute('stroke', '#157347');
        teeBody.setAttribute('stroke-width', '1');
        
        // Central reinforcement (thicker at junction)
        const junction = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        junction.setAttribute('x', '12');
        junction.setAttribute('y', '16');
        junction.setAttribute('width', '16');
        junction.setAttribute('height', '16');
        junction.setAttribute('fill', '#0d6efd');
        junction.setAttribute('stroke', '#0b5ed7');
        junction.setAttribute('stroke-width', '1');
        
        // Inner highlights cho depth effect
        const innerHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        innerHighlight.setAttribute('d', 'M 16 2 L 24 2 L 24 20 L 38 20 L 38 28 L 24 28 L 24 58 L 16 58 L 16 28 L 2 28 L 2 20 L 16 20 Z');
        innerHighlight.setAttribute('fill', '#d1e7dd');
        
        // Threaded socket ends
        const sockets = [
            // Top socket
            { x: 12, y: -2, w: 16, h: 4 },
            // Bottom socket  
            { x: 12, y: 58, w: 16, h: 4 },
            // Left socket
            { x: -2, y: 16, w: 4, h: 16 },
            // Right socket
            { x: 38, y: 16, w: 4, h: 16 }
        ];
        
        sockets.forEach(socket => {
            const socketElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            socketElement.setAttribute('x', socket.x);
            socketElement.setAttribute('y', socket.y);
            socketElement.setAttribute('width', socket.w);
            socketElement.setAttribute('height', socket.h);
            socketElement.setAttribute('fill', '#495057');
            svg.appendChild(socketElement);
        });
        
        // Threading details
        const threadGroups = [
            // Top threads
            { startX: 14, startY: 1, direction: 'horizontal', count: 4 },
            // Bottom threads  
            { startX: 14, startY: 57, direction: 'horizontal', count: 4 },
            // Left threads
            { startX: 1, startY: 18, direction: 'vertical', count: 4 },
            // Right threads
            { startX: 37, startY: 18, direction: 'vertical', count: 4 }
        ];
        
        threadGroups.forEach(group => {
            for (let i = 0; i < group.count; i++) {
                const thread = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                if (group.direction === 'horizontal') {
                    thread.setAttribute('x', group.startX + i * 3);
                    thread.setAttribute('y', group.startY);
                    thread.setAttribute('width', '1');
                    thread.setAttribute('height', '2');
                } else {
                    thread.setAttribute('x', group.startX);
                    thread.setAttribute('y', group.startY + i * 3);
                    thread.setAttribute('width', '2');
                    thread.setAttribute('height', '1');
                }
                thread.setAttribute('fill', '#6c757d');
                svg.appendChild(thread);
            }
        });
        
        svg.appendChild(teeBody);
        svg.appendChild(innerHighlight);
        svg.appendChild(junction);
        
        this.element.appendChild(svg);
    }
} 