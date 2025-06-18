import * as THREE from 'three';
import { BaseComponent3D } from '../components/BaseComponent3D.js';
import { PipeSegment3D } from '../components/PipeSegment3D.js';
import { ElbowJoint3D } from '../components/ElbowJoint3D.js';
// import { TeeJoint3D } from '../components/TeeJoint3D.js';
// import { WallMount3D } from '../components/WallMount3D.js';

export class ComponentFactory {
    constructor(viewer3D) {
        this.viewer3D = viewer3D;
        this.components2D = new Map(); // 2D component ID -> 2D component
        this.components3D = new Map(); // 2D component ID -> 3D component
        this.syncEnabled = true;
        
        // Component type mappings
        this.componentMap3D = {
            'pipe-segment': PipeSegment3D,
            'elbow-joint': ElbowJoint3D,
            // 'tee-joint': TeeJoint3D,
            // 'wall-mount': WallMount3D
        };
    }

    // Create 3D component from 2D component
    create3DComponent(component2D) {
        const ComponentClass = this.componentMap3D[component2D.type.id];
        if (!ComponentClass) {
            console.warn(`No 3D implementation for component type: ${component2D.type.id}`);
            return null;
        }

        // Convert 2D position to 3D
        const position = this.convert2DTo3DPosition(component2D);
        const rotation = this.convert2DTo3DRotation(component2D);

        let component3D;
        if (component2D.type.id === 'pipe-segment') {
            const length = (component2D.length || 100) / 100; // Convert cm to meters
            component3D = new ComponentClass(position, rotation, length);
        } else {
            component3D = new ComponentClass(position, rotation);
        }

        // Store mapping
        this.components2D.set(component2D.id, component2D);
        this.components3D.set(component2D.id, component3D);

        // Add to 3D scene
        if (this.viewer3D && this.viewer3D.scene) {
            this.viewer3D.scene.add(component3D.group);
        }

        return component3D;
    }

    // Update 3D component from 2D component changes
    update3DFromComponent2D(component2D) {
        const component3D = this.components3D.get(component2D.id);
        if (component3D && this.syncEnabled) {
            component3D.updateFrom2D(component2D);
            
            // Store updated 2D component
            this.components2D.set(component2D.id, component2D);
        }
    }

    // Update 2D component from 3D component changes
    update2DFromComponent3D(component3D) {
        const component2D = this.components2D.get(component3D.id);
        if (component2D && this.syncEnabled) {
            const updated2D = component3D.to2D();
            
            // Update 2D component properties
            Object.assign(component2D, updated2D);
            
            // Update visual representation if available
            if (component2D.updateStyle) {
                component2D.updateStyle();
            }
            
            // Notify application of change
            if (window.app && window.app.updateComponent) {
                window.app.updateComponent(component2D);
            }
        }
    }

    // Remove component
    removeComponent(componentId) {
        const component3D = this.components3D.get(componentId);
        if (component3D) {
            // Remove from 3D scene
            if (this.viewer3D && this.viewer3D.scene) {
                this.viewer3D.scene.remove(component3D.group);
            }
            
            // Dispose resources
            component3D.dispose();
            
            // Remove from maps
            this.components3D.delete(componentId);
            this.components2D.delete(componentId);
        }
    }

    // Get all 3D components
    getAll3DComponents() {
        return Array.from(this.components3D.values());
    }

    // Get all 2D components
    getAll2DComponents() {
        return Array.from(this.components2D.values());
    }

    // Get specific component
    get3DComponent(componentId) {
        return this.components3D.get(componentId);
    }

    get2DComponent(componentId) {
        return this.components2D.get(componentId);
    }

    // Sync all components from 2D to 3D
    syncFrom2D(components2D) {
        // Remove components that no longer exist in 2D
        const existing2DIds = new Set(components2D.map(c => c.id));
        for (const [id, component3D] of this.components3D) {
            if (!existing2DIds.has(id)) {
                this.removeComponent(id);
            }
        }

        // Update or create 3D components
        components2D.forEach(component2D => {
            const existing3D = this.components3D.get(component2D.id);
            if (existing3D) {
                this.update3DFromComponent2D(component2D);
            } else {
                this.create3DComponent(component2D);
            }
        });
    }

    // Sync all components from 3D to 2D
    syncFrom3D() {
        this.getAll3DComponents().forEach(component3D => {
            this.update2DFromComponent3D(component3D);
        });
    }

    // Position conversion utilities
    convert2DTo3DPosition(component2D) {
        // Convert 2D canvas coordinates to 3D world coordinates
        const scale = 1 / 40; // 40 pixels = 1 meter
        const offsetX = 400; // Canvas center offset
        const offsetZ = 300;
        
        return {
            x: (component2D.x - offsetX) * scale,
            y: 0.5, // Default height
            z: (component2D.y - offsetZ) * scale
        };
    }

    convert2DTo3DRotation(component2D) {
        // Convert 2D rotation (degrees) to 3D rotation (radians)
        const yRotation = (component2D.rotation || 0) * Math.PI / 180;
        
        return {
            x: 0,
            y: yRotation,
            z: 0
        };
    }

    convert3DTo2DPosition(component3D) {
        // Convert 3D world coordinates to 2D canvas coordinates
        const scale = 40; // 1 meter = 40 pixels
        const offsetX = 400;
        const offsetZ = 300;
        
        return {
            x: component3D.position.x * scale + offsetX,
            y: component3D.position.z * scale + offsetZ
        };
    }

    convert3DTo2DRotation(component3D) {
        // Convert 3D rotation (radians) to 2D rotation (degrees)
        return (component3D.rotation.y * 180 / Math.PI) % 360;
    }

    // Connection management
    connectComponents(component1Id, port1Id, component2Id, port2Id) {
        const comp1 = this.get3DComponent(component1Id);
        const comp2 = this.get3DComponent(component2Id);
        
        if (comp1 && comp2) {
            const success = comp1.connectTo(comp2, port1Id, port2Id);
            if (success) {
                comp2.connectTo(comp1, port2Id, port1Id);
                
                // Optionally create visual connection (pipe/wire)
                this.createVisualConnection(comp1, port1Id, comp2, port2Id);
                
                return true;
            }
        }
        return false;
    }

    disconnectComponents(component1Id, port1Id) {
        const comp1 = this.get3DComponent(component1Id);
        if (comp1) {
            const connection = comp1.connections.get(port1Id);
            if (connection) {
                // Disconnect both sides
                comp1.disconnect(port1Id);
                connection.component.disconnect(connection.port);
                
                // Remove visual connection
                this.removeVisualConnection(component1Id, port1Id);
                
                return true;
            }
        }
        return false;
    }

    createVisualConnection(comp1, port1Id, comp2, port2Id) {
        // Create a visual pipe/wire between components
        const port1 = comp1.getConnectionPorts().find(p => p.id === port1Id);
        const port2 = comp2.getConnectionPorts().find(p => p.id === port2Id);
        
        if (port1 && port2) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                port1.worldPosition.x, port1.worldPosition.y, port1.worldPosition.z,
                port2.worldPosition.x, port2.worldPosition.y, port2.worldPosition.z
            ]);
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const material = new THREE.LineBasicMaterial({ 
                color: 0x00ff00, 
                linewidth: 3 
            });
            const line = new THREE.Line(geometry, material);
            line.userData = { 
                connection: true, 
                comp1: comp1.id, 
                port1: port1Id,
                comp2: comp2.id,
                port2: port2Id
            };
            
            this.viewer3D.scene.add(line);
        }
    }

    removeVisualConnection(component1Id, port1Id) {
        // Find and remove visual connection line
        const connections = this.viewer3D.scene.children.filter(child => 
            child.userData.connection && 
            child.userData.comp1 === component1Id && 
            child.userData.port1 === port1Id
        );
        
        connections.forEach(connection => {
            this.viewer3D.scene.remove(connection);
            connection.geometry.dispose();
            connection.material.dispose();
        });
    }

    // Selection management
    selectComponent(componentId) {
        // Deselect all
        this.getAll3DComponents().forEach(comp => comp.setSelected(false));
        
        // Select specific component
        const component = this.get3DComponent(componentId);
        if (component) {
            component.setSelected(true);
            return component;
        }
        return null;
    }

    deselectAll() {
        this.getAll3DComponents().forEach(comp => comp.setSelected(false));
    }

    // Export/Import
    exportScene() {
        const data = {
            components: this.getAll2DComponents().map(comp => ({
                id: comp.id,
                type: comp.type,
                ...comp.to2D ? comp.to2D() : comp
            })),
            connections: this.getConnectionData()
        };
        return data;
    }

    importScene(data) {
        // Clear existing components
        this.clearAll();
        
        // Import components
        if (data.components) {
            data.components.forEach(compData => {
                // Create 2D component first (assuming you have the 2D classes)
                // Then create 3D component from it
                this.create3DComponent(compData);
            });
        }
        
        // Import connections
        if (data.connections) {
            data.connections.forEach(conn => {
                this.connectComponents(
                    conn.comp1, conn.port1,
                    conn.comp2, conn.port2
                );
            });
        }
    }

    getConnectionData() {
        const connections = [];
        this.getAll3DComponents().forEach(comp => {
            comp.getConnections().forEach(([portId, connection]) => {
                connections.push({
                    comp1: comp.id,
                    port1: portId,
                    comp2: connection.component.id,
                    port2: connection.port
                });
            });
        });
        return connections;
    }

    clearAll() {
        // Remove all components
        const componentIds = Array.from(this.components3D.keys());
        componentIds.forEach(id => this.removeComponent(id));
        
        // Clear visual connections
        if (this.viewer3D && this.viewer3D.scene) {
            const connections = this.viewer3D.scene.children.filter(child => 
                child.userData.connection
            );
            connections.forEach(connection => {
                this.viewer3D.scene.remove(connection);
                connection.geometry.dispose();
                connection.material.dispose();
            });
        }
    }

    // Performance optimization
    enableSync(enabled = true) {
        this.syncEnabled = enabled;
    }

    // Debug utilities
    showAllConnectionPorts(show = true) {
        this.getAll3DComponents().forEach(comp => {
            if (comp.showConnectionPorts) {
                comp.showConnectionPorts(show);
            }
        });
    }

    showAllBoundingBoxes(show = true) {
        this.getAll3DComponents().forEach(comp => {
            if (comp.showBoundingBox) {
                comp.showBoundingBox(show);
            }
        });
    }

    // Statistics
    getStats() {
        const components = this.getAll3DComponents();
        const stats = {
            totalComponents: components.length,
            byType: {},
            totalConnections: 0,
            boundingBox: this.calculateSceneBounds()
        };

        components.forEach(comp => {
            const type = comp.type.id;
            stats.byType[type] = (stats.byType[type] || 0) + 1;
            stats.totalConnections += comp.getConnections().length;
        });

        return stats;
    }

    calculateSceneBounds() {
        const bounds = new THREE.Box3();
        this.getAll3DComponents().forEach(comp => {
            bounds.expandByObject(comp.group);
        });
        return bounds;
    }
} 