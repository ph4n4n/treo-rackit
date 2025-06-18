class PipeSegment extends BaseComponent {
    constructor(x, y) {
        super(COMPONENT_TYPES.PIPE_SEGMENT, x, y);
        this.length = 100; // default length in cm
        this.isResizing = false;
        this.resizeHandle = null;
    }

    create() {
        super.create();
        this.element.classList.add('pipe-segment');
        
        // Create SVG pipe
        this.createPipeSVG();
        
        // Add rotation controls
        const controls = document.createElement('div');
        controls.className = 'rotation-controls';
        
        const rotateLeft = document.createElement('button');
        rotateLeft.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
        rotateLeft.title = 'Xoay trái 90°';
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
        
        // Add resize handles
        this.createResizeHandles();
        
        this.element.appendChild(controls);
        
        return this.element;
    }

    createResizeHandles() {
        // Left handle
        const leftHandle = document.createElement('div');
        leftHandle.className = 'resize-handle resize-handle-left';
        leftHandle.addEventListener('mousedown', (e) => this.startResize(e, 'left'));
        this.element.appendChild(leftHandle);
        
        // Right handle
        const rightHandle = document.createElement('div');
        rightHandle.className = 'resize-handle resize-handle-right';
        rightHandle.addEventListener('mousedown', (e) => this.startResize(e, 'right'));
        this.element.appendChild(rightHandle);
    }

    startResize(e, direction) {
        e.stopPropagation();
        e.preventDefault();
        
        this.isResizing = true;
        this.resizeDirection = direction;
        this.startX = e.clientX;
        this.startLength = this.length;
        this.startPosX = this.x;
        
        document.body.style.cursor = 'ew-resize';
        
        const mouseMoveHandler = (e) => this.handleResize(e);
        const mouseUpHandler = () => this.stopResize(mouseMoveHandler, mouseUpHandler);
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }

    handleResize(e) {
        if (!this.isResizing) return;
        
        const deltaX = (e.clientX - this.startX) / window.app.zoomLevel;
        const deltaLength = deltaX / 2; // 1cm = 2px
        
        if (this.resizeDirection === 'right') {
            // Resize from right, keep left position fixed
            this.length = Math.max(10, Math.min(300, this.startLength + deltaLength));
        } else {
            // Resize from left, adjust position and length
            const newLength = Math.max(10, Math.min(300, this.startLength - deltaLength));
            const lengthDiff = this.length - newLength;
            this.length = newLength;
            this.x = this.startPosX + (lengthDiff * 2) / 2; // Adjust position
        }
        
        this.updateStyle();
        window.app.bom.updateBOM();
        
        // Update properties panel if this component is selected
        if (window.app.selectedComponent === this) {
            const lengthInput = document.getElementById('pipe-length');
            if (lengthInput) {
                lengthInput.value = this.length;
            }
        }
    }

    stopResize(mouseMoveHandler, mouseUpHandler) {
        this.isResizing = false;
        document.body.style.cursor = 'default';
        
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    }

    createPipeSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 200 20');
        
        // Outer pipe
        const outerPipe = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        outerPipe.setAttribute('x', '0');
        outerPipe.setAttribute('y', '2');
        outerPipe.setAttribute('width', '200');
        outerPipe.setAttribute('height', '16');
        outerPipe.setAttribute('rx', '8');
        outerPipe.setAttribute('fill', '#6c757d');
        outerPipe.setAttribute('stroke', '#495057');
        outerPipe.setAttribute('stroke-width', '1');
        
        // Inner highlight
        const innerHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        innerHighlight.setAttribute('x', '2');
        innerHighlight.setAttribute('y', '4');
        innerHighlight.setAttribute('width', '196');
        innerHighlight.setAttribute('height', '6');
        innerHighlight.setAttribute('rx', '3');
        innerHighlight.setAttribute('fill', '#adb5bd');
        
        // Shadow
        const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        shadow.setAttribute('x', '2');
        shadow.setAttribute('y', '12');
        shadow.setAttribute('width', '196');
        shadow.setAttribute('height', '4');
        shadow.setAttribute('rx', '2');
        shadow.setAttribute('fill', '#495057');
        
        svg.appendChild(outerPipe);
        svg.appendChild(innerHighlight);
        svg.appendChild(shadow);
        
        this.element.appendChild(svg);
    }

    updateStyle() {
        super.updateStyle();
        if (this.element) {
            // Update width based on length (1cm = 2px)
            const newWidth = this.length * 2;
            this.element.style.width = `${newWidth}px`;
            
            // Update SVG viewBox
            const svg = this.element.querySelector('svg');
            if (svg) {
                svg.setAttribute('viewBox', `0 0 ${newWidth} 20`);
                
                // Update all rect elements
                const rects = svg.querySelectorAll('rect');
                rects[0].setAttribute('width', newWidth); // outer pipe
                rects[1].setAttribute('width', newWidth - 4); // highlight
                rects[2].setAttribute('width', newWidth - 4); // shadow
            }
            
            // Update resize handle positions
            const rightHandle = this.element.querySelector('.resize-handle-right');
            if (rightHandle) {
                rightHandle.style.right = '-5px';
            }
        }
    }

    setSelected(selected) {
        super.setSelected(selected);
        
        // Show/hide resize handles based on selection
        const handles = this.element.querySelectorAll('.resize-handle');
        handles.forEach(handle => {
            handle.style.display = selected ? 'block' : 'none';
        });
    }
} 