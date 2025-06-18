class BOM {
    constructor(app) {
        this.app = app;
        this.bomList = document.querySelector('.bom-list');
        this.init();
    }

    init() {
        this.updateBOM();
    }

    updateBOM() {
        const components = Array.from(this.app.components.values());
        const counts = {
            [COMPONENT_TYPES.PIPE_SEGMENT]: new Map(), // Map of length -> count
            [COMPONENT_TYPES.ELBOW_JOINT]: 0,
            [COMPONENT_TYPES.TEE_JOINT]: 0,
            [COMPONENT_TYPES.WALL_MOUNT]: 0
        };

        // Count components
        components.forEach(component => {
            if (component.type === COMPONENT_TYPES.PIPE_SEGMENT) {
                const length = component.length;
                counts[component.type].set(length, (counts[component.type].get(length) || 0) + 1);
            } else {
                counts[component.type]++;
            }
        });

        // Update UI
        this.renderBOM(counts);
    }

    renderBOM(counts) {
        this.bomList.innerHTML = '';

        // Render pipe segments
        if (counts[COMPONENT_TYPES.PIPE_SEGMENT].size > 0) {
            const pipeSection = document.createElement('div');
            pipeSection.className = 'mb-3';
            pipeSection.innerHTML = '<h6>Ống</h6>';

            const pipeList = document.createElement('ul');
            pipeList.className = 'list-unstyled';
            
            Array.from(counts[COMPONENT_TYPES.PIPE_SEGMENT].entries())
                .sort(([a], [b]) => a - b)
                .forEach(([length, count]) => {
                    const li = document.createElement('li');
                    li.textContent = `${length}cm: ${count} cái`;
                    pipeList.appendChild(li);
                });

            pipeSection.appendChild(pipeList);
            this.bomList.appendChild(pipeSection);
        }

        // Render other components
        const otherComponents = [
            { type: COMPONENT_TYPES.ELBOW_JOINT, label: 'Co 90°' },
            { type: COMPONENT_TYPES.TEE_JOINT, label: 'Khớp T' },
            { type: COMPONENT_TYPES.WALL_MOUNT, label: 'Chân đế' }
        ];

        otherComponents.forEach(({ type, label }) => {
            if (counts[type] > 0) {
                const div = document.createElement('div');
                div.className = 'mb-2';
                div.textContent = `${label}: ${counts[type]} cái`;
                this.bomList.appendChild(div);
            }
        });
    }
} 