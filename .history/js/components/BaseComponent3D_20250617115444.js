// Note: THREE will be loaded via script tag
class BaseComponent3D {
    constructor(type, position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }) {
        this.id = this.generateId();
        this.type = type;
        this.position = { ...position };
        this.rotation = { ...rotation };
        this.scale = { x: 1, y: 1, z: 1 };
        
        // Three.js objects
        this.mesh = null;
        this.group = new THREE.Group();
        this.geometry = null;
        this.material = null;
        
        // Component properties
        this.isSelected = false;
        this.isDragging = false;
        this.connections = new Map(); // Port ID -> Connected component
        
        this.init();
    }

    generateId() {
        return `${this.type.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    init() {
        this.createGeometry();
        this.createMaterial();
        this.createMesh();
        this.setupGroup();
        this.updateTransform();
    }

    createGeometry() {
        // Override trong subclass
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    createMaterial() {
        const color = this.type.color || 0x888888;
        this.material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.7,
            roughness: 0.2,
            transparent: false
        });
    }

    createMesh() {
        if (this.geometry && this.material) {
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.mesh.userData = { component: this };
        }
    }

    setupGroup() {
        this.group.userData = { component: this };
        if (this.mesh) {
            this.group.add(this.mesh);
        }
        this.addConnectionPorts();
    }

    addConnectionPorts() {
        // Override trong subclass để add connection points
    }

    updateTransform() {
        this.group.position.set(this.position.x, this.position.y, this.position.z);
        this.group.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        this.group.scale.set(this.scale.x, this.scale.y, this.scale.z);
    }

    setPosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        this.updateTransform();
    }

    setRotation(x, y, z) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
        this.updateTransform();
    }

    rotate(axis, angle) {
        switch(axis.toLowerCase()) {
            case 'x':
                this.rotation.x += angle;
                break;
            case 'y':
                this.rotation.y += angle;
                break;
            case 'z':
                this.rotation.z += angle;
                break;
        }
        this.updateTransform();
    }

    setScale(x, y, z) {
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
        this.updateTransform();
    }

    setSelected(selected) {
        this.isSelected = selected;
        if (this.material) {
            if (selected) {
                this.material.emissive.setHex(0x333333);
                this.material.emissiveIntensity = 0.2;
            } else {
                this.material.emissive.setHex(0x000000);
                this.material.emissiveIntensity = 0;
            }
        }
    }

    getConnectionPorts() {
        // Override trong subclass để return array of connection points
        return [];
    }

    canConnectTo(otherComponent, thisPort, otherPort) {
        // Override để implement connection logic
        return true;
    }

    connectTo(otherComponent, thisPort, otherPort) {
        if (this.canConnectTo(otherComponent, thisPort, otherPort)) {
            this.connections.set(thisPort, {
                component: otherComponent,
                port: otherPort
            });
            return true;
        }
        return false;
    }

    disconnect(port) {
        return this.connections.delete(port);
    }

    getConnections() {
        return Array.from(this.connections.entries());
    }

    // Convert to 2D representation
    to2D() {
        return {
            id: this.id,
            type: this.type,
            x: this.position.x * 40 + 400, // Scale and offset for 2D canvas
            y: this.position.z * 40 + 300,
            rotation: this.rotation.y * 180 / Math.PI // Convert to degrees
        };
    }

    // Update from 2D component
    updateFrom2D(component2D) {
        this.setPosition(
            (component2D.x - 400) / 40,
            this.position.y,
            (component2D.y - 300) / 40
        );
        this.setRotation(
            this.rotation.x,
            component2D.rotation * Math.PI / 180,
            this.rotation.z
        );
    }

    // Animation methods
    animateProperty(property, targetValue, duration = 1000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const startValue = this[property];
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const eased = progress * progress * (3 - 2 * progress);
                
                if (typeof startValue === 'object') {
                    Object.keys(startValue).forEach(key => {
                        this[property][key] = startValue[key] + (targetValue[key] - startValue[key]) * eased;
                    });
                } else {
                    this[property] = startValue + (targetValue - startValue) * eased;
                }
                
                this.updateTransform();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }

    // Resource cleanup
    dispose() {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
        if (this.mesh && this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
        if (this.group && this.group.parent) {
            this.group.parent.remove(this.group);
        }
        this.connections.clear();
    }

    // Debug helpers
    showBoundingBox(show = true) {
        if (show && !this.boundingBoxHelper) {
            const box = new THREE.Box3().setFromObject(this.group);
            this.boundingBoxHelper = new THREE.Box3Helper(box, 0xffff00);
            this.group.add(this.boundingBoxHelper);
        } else if (!show && this.boundingBoxHelper) {
            this.group.remove(this.boundingBoxHelper);
            this.boundingBoxHelper = null;
        }
    }

    getBounds() {
        const box = new THREE.Box3().setFromObject(this.group);
        return {
            min: { x: box.min.x, y: box.min.y, z: box.min.z },
            max: { x: box.max.x, y: box.max.y, z: box.max.z },
            size: {
                x: box.max.x - box.min.x,
                y: box.max.y - box.min.y,
                z: box.max.z - box.min.z
            }
        };
    }
} 