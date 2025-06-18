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
        const components = this.app.components;
        const counts = {
            'pipe-segment': new Map(), // Map of length -> count
            'elbow-joint': 0,
            'tee-joint': 0,
            'wall-mount': 0
        };

        // Count components
        components.forEach(component => {
            if (component.type.id === 'pipe-segment') {
                const length = component.length || 100;
                counts[component.type.id].set(length, (counts[component.type.id].get(length) || 0) + 1);
            } else {
                counts[component.type.id]++;
            }
        });

        // Update UI
        this.renderBOM(counts);
    }

    renderBOM(counts) {
        if (!this.bomContent) return;
        
        this.bomContent.innerHTML = '';

        let totalItems = 0;

        // Render pipe segments
        if (counts['pipe-segment'].size > 0) {
            const pipeSection = document.createElement('div');
            pipeSection.className = 'bom-section mb-3';
            
            const title = document.createElement('h6');
            title.className = 'text-primary mb-2';
            title.innerHTML = `<i class="bi bi-dash-lg me-2"></i>${t('pipeSegment')}`;
            pipeSection.appendChild(title);

            const pipeList = document.createElement('div');
            pipeList.className = 'bom-list';
            
            Array.from(counts['pipe-segment'].entries())
                .sort(([a], [b]) => a - b)
                .forEach(([length, count]) => {
                    const item = document.createElement('div');
                    item.className = 'bom-item d-flex justify-content-between align-items-center py-1';
                    
                    const details = document.createElement('div');
                    details.innerHTML = `
                        <div class="bom-item-name">${t('pipeSegment')} ${length}cm</div>
                        <div class="bom-item-specs text-muted small">${t('pipeSpecs')}</div>
                    `;
                    
                    const quantity = document.createElement('span');
                    quantity.className = 'bom-item-quantity text-primary fw-bold';
                    quantity.textContent = count;
                    
                    item.appendChild(details);
                    item.appendChild(quantity);
                    pipeList.appendChild(item);
                    
                    totalItems += count;
                });

            pipeSection.appendChild(pipeList);
            this.bomContent.appendChild(pipeSection);
        }

        // Render other components
        const otherComponents = [
            { type: 'elbow-joint', labelKey: 'elbowJoint', icon: 'bi-corner-up-right', specsKey: 'pipeSpecs' },
            { type: 'tee-joint', labelKey: 'teeJoint', icon: 'bi-plus', specsKey: 'pipeSpecs' },
            { type: 'wall-mount', labelKey: 'wallMount', icon: 'bi-house', specsKey: 'wallMountSpecs' }
        ];

        otherComponents.forEach(({ type, labelKey, icon, specsKey }) => {
            if (counts[type] > 0) {
                const section = document.createElement('div');
                section.className = 'bom-section mb-3';
                
                const title = document.createElement('h6');
                title.className = 'text-primary mb-2';
                title.innerHTML = `<i class="${icon} me-2"></i>${t(labelKey)}`;
                section.appendChild(title);
                
                const item = document.createElement('div');
                item.className = 'bom-item d-flex justify-content-between align-items-center py-1';
                
                const details = document.createElement('div');
                details.innerHTML = `
                    <div class="bom-item-name">${t(labelKey)}</div>
                    <div class="bom-item-specs text-muted small">${t(specsKey)}</div>
                `;
                
                const quantity = document.createElement('span');
                quantity.className = 'bom-item-quantity text-primary fw-bold';
                quantity.textContent = counts[type];
                
                item.appendChild(details);
                item.appendChild(quantity);
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
                <i class="bi bi-inbox display-6 d-block mb-2 opacity-50"></i>
                <small>${t('bomEmpty')}<br>${t('bomEmptyDesc')}</small>
            `;
            this.bomContent.appendChild(emptyState);
        }
    }

    generateBOM() {
        const components = this.app.components;
        const counts = {
            'pipe-segment': new Map(),
            'elbow-joint': 0,
            'tee-joint': 0,
            'wall-mount': 0
        };

        components.forEach(component => {
            if (component.type.id === 'pipe-segment') {
                const length = component.length || 100;
                counts[component.type.id].set(length, (counts[component.type.id].get(length) || 0) + 1);
            } else {
                counts[component.type.id]++;
            }
        });

        return counts;
    }
} 