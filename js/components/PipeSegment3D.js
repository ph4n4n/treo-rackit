// Note: THREE and BaseComponent3D will be loaded via script tags
class PipeSegment3D extends BaseComponent3D {
    constructor(position, rotation, length = 2.0) {
        super(COMPONENT_TYPES.PIPE_SEGMENT, position, rotation);
        this.length = length; // meters
        this.diameter = 0.05; // 50mm outer diameter
        this.wallThickness = 0.003; // 3mm wall thickness
        this.init();
    }

    createGeometry() {
        const outerRadius = this.diameter / 2;
        const innerRadius = outerRadius - this.wallThickness;
        const segments = 16;

        // Create pipe geometry using cylinder with hole
        const shape = new THREE.Shape();
        shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
        
        const hole = new THREE.Path();
        hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
        shape.holes.push(hole);

        // Extrude to create pipe
        this.geometry = new THREE.ExtrudeGeometry(shape, {
            depth: this.length,
            bevelEnabled: false,
            curveSegments: segments
        });

        // Rotate to align with X axis (length direction)
        this.geometry.rotateY(Math.PI / 2);
        this.geometry.translate(0, 0, -this.length / 2);
    }

    createMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.8,
            roughness: 0.2,
            transparent: false
        });

        // Create end cap materials
        this.endCapMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.9,
            roughness: 0.1
        });
    }

    createMesh() {
        super.createMesh();
        
        // Add end caps
        this.addEndCaps();
        
        // Add threading detail
        this.addThreading();
    }

    addEndCaps() {
        const outerRadius = this.diameter / 2;
        const innerRadius = outerRadius - this.wallThickness;
        
        // Left end cap
        const leftCapGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 16);
        const leftCap = new THREE.Mesh(leftCapGeometry, this.endCapMaterial);
        leftCap.position.x = -this.length / 2;
        leftCap.rotation.y = Math.PI / 2;
        this.group.add(leftCap);
        
        // Right end cap  
        const rightCapGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 16);
        const rightCap = new THREE.Mesh(rightCapGeometry, this.endCapMaterial);
        rightCap.position.x = this.length / 2;
        rightCap.rotation.y = -Math.PI / 2;
        this.group.add(rightCap);
    }

    addThreading() {
        // Add threading detail near ends
        const threadRadius = this.diameter / 2 + 0.002;
        const threadLength = 0.05; // 5cm threading
        
        [-this.length / 2 + threadLength / 2, this.length / 2 - threadLength / 2].forEach(x => {
            const threadGeometry = new THREE.CylinderGeometry(
                threadRadius, threadRadius, threadLength, 16
            );
            threadGeometry.rotateZ(Math.PI / 2);
            
            const threadMesh = new THREE.Mesh(threadGeometry, this.endCapMaterial);
            threadMesh.position.x = x;
            this.group.add(threadMesh);
            
            // Add thread lines
            for (let i = 0; i < 8; i++) {
                const lineGeometry = new THREE.TorusGeometry(threadRadius, 0.0005, 3, 8);
                lineGeometry.rotateY(Math.PI / 2);
                const lineMesh = new THREE.Mesh(lineGeometry, this.endCapMaterial);
                lineMesh.position.x = x + (i - 4) * 0.006;
                this.group.add(lineMesh);
            }
        });
    }

    addConnectionPorts() {
        // Left connection port
        const leftPort = new THREE.Object3D();
        leftPort.position.set(-this.length / 2, 0, 0);
        leftPort.userData = { 
            type: 'male', 
            id: 'left',
            direction: new THREE.Vector3(-1, 0, 0)
        };
        this.group.add(leftPort);
        
        // Right connection port
        const rightPort = new THREE.Object3D();
        rightPort.position.set(this.length / 2, 0, 0);
        rightPort.userData = { 
            type: 'male', 
            id: 'right',
            direction: new THREE.Vector3(1, 0, 0)
        };
        this.group.add(rightPort);
    }

    getConnectionPorts() {
        return [
            {
                id: 'left',
                type: 'male',
                position: new THREE.Vector3(-this.length / 2, 0, 0),
                direction: new THREE.Vector3(-1, 0, 0),
                worldPosition: this.getWorldPosition('left')
            },
            {
                id: 'right', 
                type: 'male',
                position: new THREE.Vector3(this.length / 2, 0, 0),
                direction: new THREE.Vector3(1, 0, 0),
                worldPosition: this.getWorldPosition('right')
            }
        ];
    }

    getWorldPosition(portId) {
        const port = this.group.children.find(child => 
            child.userData && child.userData.id === portId
        );
        if (port) {
            const worldPos = new THREE.Vector3();
            port.getWorldPosition(worldPos);
            return worldPos;
        }
        return new THREE.Vector3();
    }

    setLength(newLength) {
        this.length = Math.max(0.1, newLength); // Minimum 10cm
        
        // Recreate geometry with new length
        this.dispose();
        this.init();
    }

    // Override to handle length in 2D conversion
    to2D() {
        const base = super.to2D();
        return {
            ...base,
            length: this.length * 100 // Convert to cm for 2D
        };
    }

    updateFrom2D(component2D) {
        super.updateFrom2D(component2D);
        if (component2D.length && component2D.length !== this.length * 100) {
            this.setLength(component2D.length / 100); // Convert from cm
        }
    }

    // Add visual helpers for debugging
    showConnectionPorts(show = true) {
        this.getConnectionPorts().forEach(port => {
            const existing = this.group.children.find(child => 
                child.userData && child.userData.helper && child.userData.portId === port.id
            );
            
            if (show && !existing) {
                const helperGeometry = new THREE.SphereGeometry(0.01, 8, 8);
                const helperMaterial = new THREE.MeshBasicMaterial({ 
                    color: port.type === 'male' ? 0x00ff00 : 0xff0000 
                });
                const helper = new THREE.Mesh(helperGeometry, helperMaterial);
                helper.position.copy(port.position);
                helper.userData = { helper: true, portId: port.id };
                this.group.add(helper);
            } else if (!show && existing) {
                this.group.remove(existing);
                existing.geometry.dispose();
                existing.material.dispose();
            }
        });
    }

    // Get BOM info
    getBOMData() {
        return {
            type: 'Pipe Segment',
            material: 'Stainless Steel 304',
            diameter: `${this.diameter * 1000}mm`,
            length: `${this.length}m`,
            wallThickness: `${this.wallThickness * 1000}mm`,
            weight: this.calculateWeight(),
            partNumber: this.generatePartNumber()
        };
    }

    calculateWeight() {
        const volume = Math.PI * (
            Math.pow(this.diameter / 2, 2) - 
            Math.pow(this.diameter / 2 - this.wallThickness, 2)
        ) * this.length;
        const density = 8000; // kg/m³ for stainless steel
        return (volume * density).toFixed(2) + ' kg';
    }

    generatePartNumber() {
        const dia = Math.round(this.diameter * 1000);
        const len = Math.round(this.length * 100);
        return `PIPE-${dia}MM-${len}CM-SS304`;
    }
}

// Make PipeSegment3D available globally for script tag usage
window.PipeSegment3D = PipeSegment3D; 