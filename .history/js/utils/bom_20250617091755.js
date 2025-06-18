class BOM {
    constructor(app) {
        this.app = app;
        this.bomContent = document.querySelector('.bom-content');
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
        this.bomContent.innerHTML = '';

        let totalItems = 0;

        // Render pipe segments
        if (counts[COMPONENT_TYPES.PIPE_SEGMENT].size > 0) {
            const pipeSection = document.createElement('div');
            pipeSection.className = 'bom-section';
            
            const title = document.createElement('h6');
            title.innerHTML = '<i class="bi bi-pipe me-1"></i>Ống sắt';
            pipeSection.appendChild(title);

            const pipeList = document.createElement('div');
            pipeList.className = 'bom-list';
            
            Array.from(counts[COMPONENT_TYPES.PIPE_SEGMENT].entries())
                .sort(([a], [b]) => a - b)
                .forEach(([length, count]) => {
                    const item = document.createElement('div');
                    item.className = 'bom-item';
                    
                    const name = document.createElement('span');
                    name.className = 'bom-item-name';
                    name.textContent = `Ống ${length}cm`;
                    
                    const countSpan = document.createElement('span');
                    countSpan.className = 'bom-item-count';
                    countSpan.textContent = `${count}`;
                    
                    item.appendChild(name);
                    item.appendChild(countSpan);
                    pipeList.appendChild(item);
                    
                    totalItems += count;
                });

            pipeSection.appendChild(pipeList);
            this.bomContent.appendChild(pipeSection);
        }

        // Render other components
        const otherComponents = [
            { type: COMPONENT_TYPES.ELBOW_JOINT, label: 'Co 90°', icon: 'bi-arrow-90deg-right' },
            { type: COMPONENT_TYPES.TEE_JOINT, label: 'Khớp T', icon: 'bi-signpost-split' },
            { type: COMPONENT_TYPES.WALL_MOUNT, label: 'Chân đế', icon: 'bi-bookmark-check' }
        ];

        otherComponents.forEach(({ type, label, icon }) => {
            if (counts[type] > 0) {
                const section = document.createElement('div');
                section.className = 'bom-section';
                
                const title = document.createElement('h6');
                title.innerHTML = `<i class="${icon} me-1"></i>${label}`;
                section.appendChild(title);
                
                const item = document.createElement('div');
                item.className = 'bom-item';
                
                const name = document.createElement('span');
                name.className = 'bom-item-name';
                name.textContent = label;
                
                const countSpan = document.createElement('span');
                countSpan.className = 'bom-item-count';
                countSpan.textContent = `${counts[type]}`;
                
                item.appendChild(name);
                item.appendChild(countSpan);
                section.appendChild(item);
                this.bomContent.appendChild(section);
                
                totalItems += counts[type];
            }
        });

        // Show empty state if no components
        if (totalItems === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'text-center text-muted py-4';
            emptyState.innerHTML = `
                <i class="bi bi-inbox display-6 d-block mb-2"></i>
                <small>Chưa có component nào<br>Kéo thả để thêm</small>
            `;
            this.bomContent.appendChild(emptyState);
        }
    }
} 