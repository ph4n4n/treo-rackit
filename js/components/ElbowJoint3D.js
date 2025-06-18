// Note: THREE and BaseComponent3D will be loaded via script tags
class ElbowJoint3D extends BaseComponent3D {
    constructor(position, rotation) {
        super(COMPONENT_TYPES.ELBOW_JOINT, position, rotation);
        this.diameter = 0.05; // 50mm outer diameter
        this.wallThickness = 0.003; // 3mm wall thickness
        this.bendRadius = 0.075; // 75mm bend radius
        this.socketDepth = 0.03; // 30mm socket depth
        this.init();
    }

    createGeometry() {
        // Create main elbow using TorusGeometry for the bend
        const outerRadius = this.diameter / 2;
        const innerRadius = outerRadius - this.wallThickness;
        const bendRadius = this.bendRadius;

        // Create the elbow bend (90 degrees)
        const elbowShape = new THREE.Shape();
        elbowShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

        const elbowHole = new THREE.Path();
        elbowHole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
        elbowShape.holes.push(elbowHole);

        // Create the bend using a custom geometry
        this.geometry = this.createElbowGeometry();
    }

    createElbowGeometry() {
        const group = new THREE.Group();
        const outerRadius = this.diameter / 2;
        const innerRadius = outerRadius - this.wallThickness;
        const bendRadius = this.bendRadius;
        const segments = 16;
        const bendSegments = 12;

        // Create the main elbow bend
        const bendGeometry = new THREE.TorusGeometry(
            bendRadius,
            this.wallThickness / 2,
            8,
            bendSegments,
            Math.PI / 2
        );

        // Rotate to proper orientation
        bendGeometry.rotateX(-Math.PI / 2);
        bendGeometry.rotateZ(-Math.PI / 2);

        return bendGeometry;
    }

    createMesh() {
        // Create main elbow
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.userData = { component: this };

        // Add socket extensions
        this.addSockets();

        // Add threading
        this.addThreading();
    }

    addSockets() {
        const outerRadius = this.diameter / 2;
        const innerRadius = outerRadius - this.wallThickness;
        const socketDepth = this.socketDepth;

        // Create socket material
        const socketMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.9,
            roughness: 0.1
        });

        // Left socket (negative X direction)
        const leftSocketGeometry = new THREE.CylinderGeometry(
            outerRadius + 0.002, outerRadius + 0.002, socketDepth, 16
        );
        leftSocketGeometry.rotateZ(Math.PI / 2);
        const leftSocket = new THREE.Mesh(leftSocketGeometry, socketMaterial);
        leftSocket.position.set(-this.bendRadius - socketDepth / 2, 0, 0);
        this.group.add(leftSocket);

        // Bottom socket (negative Z direction) 
        const bottomSocketGeometry = new THREE.CylinderGeometry(
            outerRadius + 0.002, outerRadius + 0.002, socketDepth, 16
        );
        const bottomSocket = new THREE.Mesh(bottomSocketGeometry, socketMaterial);
        bottomSocket.position.set(0, 0, -this.bendRadius - socketDepth / 2);
        this.group.add(bottomSocket);

        // Add inner socket holes
        this.addSocketHoles();
    }

    addSocketHoles() {
        const innerRadius = this.diameter / 2 - this.wallThickness;
        const socketDepth = this.socketDepth + 0.001; // Slightly longer for clean boolean

        const holeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.9
        });

        // Left socket hole
        const leftHoleGeometry = new THREE.CylinderGeometry(
            innerRadius, innerRadius, socketDepth, 16
        );
        leftHoleGeometry.rotateZ(Math.PI / 2);
        const leftHole = new THREE.Mesh(leftHoleGeometry, holeMaterial);
        leftHole.position.set(-this.bendRadius - socketDepth / 2, 0, 0);
        this.group.add(leftHole);

        // Bottom socket hole
        const bottomHoleGeometry = new THREE.CylinderGeometry(
            innerRadius, innerRadius, socketDepth, 16
        );
        const bottomHole = new THREE.Mesh(bottomHoleGeometry, holeMaterial);
        bottomHole.position.set(0, 0, -this.bendRadius - socketDepth / 2);
        this.group.add(bottomHole);
    }

    addThreading() {
        const threadRadius = this.diameter / 2 + 0.003;
        const threadLength = 0.02;

        const threadMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            metalness: 0.8,
            roughness: 0.3
        });

        // Left threading
        const leftThreadGeometry = new THREE.CylinderGeometry(
            threadRadius, threadRadius, threadLength, 16
        );
        leftThreadGeometry.rotateZ(Math.PI / 2);
        const leftThread = new THREE.Mesh(leftThreadGeometry, threadMaterial);
        leftThread.position.set(-this.bendRadius - this.socketDepth + threadLength / 2, 0, 0);
        this.group.add(leftThread);

        // Bottom threading
        const bottomThreadGeometry = new THREE.CylinderGeometry(
            threadRadius, threadRadius, threadLength, 16
        );
        const bottomThread = new THREE.Mesh(bottomThreadGeometry, threadMaterial);
        bottomThread.position.set(0, 0, -this.bendRadius - this.socketDepth + threadLength / 2);
        this.group.add(bottomThread);

        // Add thread lines
        this.addThreadLines();
    }

    addThreadLines() {
        const threadRadius = this.diameter / 2 + 0.003;
        const threadMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.9,
            roughness: 0.1
        });

        // Thread lines for left socket
        for (let i = 0; i < 6; i++) {
            const lineGeometry = new THREE.TorusGeometry(threadRadius, 0.0005, 3, 8);
            lineGeometry.rotateY(Math.PI / 2);
            const lineMesh = new THREE.Mesh(lineGeometry, threadMaterial);
            lineMesh.position.set(
                -this.bendRadius - this.socketDepth + 0.01 + i * 0.003,
                0,
                0
            );
            this.group.add(lineMesh);
        }

        // Thread lines for bottom socket
        for (let i = 0; i < 6; i++) {
            const lineGeometry = new THREE.TorusGeometry(threadRadius, 0.0005, 3, 8);
            const lineMesh = new THREE.Mesh(lineGeometry, threadMaterial);
            lineMesh.position.set(
                0,
                0,
                -this.bendRadius - this.socketDepth + 0.01 + i * 0.003
            );
            this.group.add(lineMesh);
        }
    }

    addConnectionPorts() {
        // Left connection port
        const leftPort = new THREE.Object3D();
        leftPort.position.set(-this.bendRadius - this.socketDepth, 0, 0);
        leftPort.userData = {
            type: 'female',
            id: 'left',
            direction: new THREE.Vector3(-1, 0, 0)
        };
        this.group.add(leftPort);

        // Bottom connection port
        const bottomPort = new THREE.Object3D();
        bottomPort.position.set(0, 0, -this.bendRadius - this.socketDepth);
        bottomPort.userData = {
            type: 'female',
            id: 'bottom',
            direction: new THREE.Vector3(0, 0, -1)
        };
        this.group.add(bottomPort);
    }

    getConnectionPorts() {
        const socketDistance = this.bendRadius + this.socketDepth;

        return [
            {
                id: 'left',
                type: 'female',
                position: new THREE.Vector3(-socketDistance, 0, 0),
                direction: new THREE.Vector3(-1, 0, 0),
                worldPosition: this.getWorldPosition('left')
            },
            {
                id: 'bottom',
                type: 'female',
                position: new THREE.Vector3(0, 0, -socketDistance),
                direction: new THREE.Vector3(0, 0, -1),
                worldPosition: this.getWorldPosition('bottom')
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

    canConnectTo(otherComponent, thisPort, otherPort) {
        // Elbow female ports can connect to male ports
        return thisPort && otherPort &&
            this.getConnectionPorts().find(p => p.id === thisPort)?.type === 'female' &&
            otherComponent.getConnectionPorts().find(p => p.id === otherPort)?.type === 'male';
    }

    // Get BOM info
    getBOMData() {
        return {
            type: 'Elbow Joint 90°',
            material: 'Stainless Steel 304',
            diameter: `${this.diameter * 1000}mm`,
            bendRadius: `${this.bendRadius * 1000}mm`,
            wallThickness: `${this.wallThickness * 1000}mm`,
            weight: this.calculateWeight(),
            partNumber: this.generatePartNumber()
        };
    }

    calculateWeight() {
        // Approximate volume calculation for elbow
        const pipeVolume = Math.PI * (
            Math.pow(this.diameter / 2, 2) -
            Math.pow(this.diameter / 2 - this.wallThickness, 2)
        );
        const bendVolume = pipeVolume * this.bendRadius * Math.PI / 2; // Quarter circle
        const socketVolume = pipeVolume * this.socketDepth * 2; // Two sockets

        const totalVolume = bendVolume + socketVolume;
        const density = 8000; // kg/m³ for stainless steel
        return (totalVolume * density).toFixed(2) + ' kg';
    }

    generatePartNumber() {
        const dia = Math.round(this.diameter * 1000);
        const bend = Math.round(this.bendRadius * 1000);
        return `ELBOW-90-${dia}MM-R${bend}-SS304`;
    }

    // Visual helpers
    showConnectionPorts(show = true) {
        this.getConnectionPorts().forEach(port => {
            const existing = this.group.children.find(child =>
                child.userData && child.userData.helper && child.userData.portId === port.id
            );

            if (show && !existing) {
                const helperGeometry = new THREE.SphereGeometry(0.01, 8, 8);
                const helperMaterial = new THREE.MeshBasicMaterial({
                    color: port.type === 'female' ? 0xff0000 : 0x00ff00
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
}

// Make ElbowJoint3D available globally for script tag usage
window.ElbowJoint3D = ElbowJoint3D; 