class PipeSegment extends BaseComponent {
    constructor(x, y) {
        super(COMPONENT_TYPES.PIPE_SEGMENT, x, y);
        this.length = 100; // default length in cm
    }

    create() {
        super.create();
        this.element.classList.add('pipe-segment');
        
        // Create SVG pipe
        this.createPipeSVG();
        
        // Add length input
        const input = document.createElement('input');
        input.type = 'number';
        input.value = this.length;
        input.min = 10;
        input.max = 300;
        input.className = 'length-input';
        
        input.addEventListener('change', (e) => {
            this.length = parseInt(e.target.value) || 100;
            this.updateStyle();
            window.app.bom.updateBOM();
        });
        
        this.element.appendChild(input);
        return this.element;
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
        }
    }
} 