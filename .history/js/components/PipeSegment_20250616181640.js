class PipeSegment extends BaseComponent {
    constructor(x, y) {
        super(COMPONENT_TYPES.PIPE_SEGMENT, x, y);
        this.length = 100; // default length in cm
    }

    create() {
        super.create();
        this.element.classList.add('pipe-segment');
        
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

    updateStyle() {
        super.updateStyle();
        if (this.element) {
            // Update width based on length (1cm = 2px)
            this.element.style.width = `${this.length * 2}px`;
        }
    }
} 