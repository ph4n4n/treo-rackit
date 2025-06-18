import { ComponentFactory } from './ComponentFactory.js';

class Viewer3D {
    constructor(container, app) {
        this.container = container;
        this.app = app;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.isActive = false;
        
        // Initialize component factory
        this.componentFactory = null;
        
        this.init();
        this.initComponentFactory();
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f9fa);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Controls setup
        if (THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 2;
            this.controls.maxDistance = 20;
            this.controls.maxPolarAngle = Math.PI / 2;
        } else {
            console.warn('OrbitControls not available, using basic camera controls');
        }
        
        // Lighting setup
        this.setupLighting();
        
        // Grid and axes
        this.setupGrid();
        
        // Animation loop
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.onResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);
        
        // Point light for fill
        const pointLight = new THREE.PointLight(0xffffff, 0.3);
        pointLight.position.set(-5, 5, -5);
        this.scene.add(pointLight);
    }
    
    setupGrid() {
        // Grid helper
        const gridHelper = new THREE.GridHelper(10, 20, 0x888888, 0xcccccc);
        gridHelper.position.y = 0;
        this.scene.add(gridHelper);
        
        // Axes helper
        const axesHelper = new THREE.AxesHelper(2);
        this.scene.add(axesHelper);
    }
    
    initComponentFactory() {
        this.componentFactory = new ComponentFactory(this);
    }

    updateFrom2D() {
        if (this.componentFactory && this.app.components) {
            this.componentFactory.syncFrom2D(this.app.components);
        }
    }
    
    clearComponents() {
        if (this.componentFactory) {
            this.componentFactory.clearAll();
        }
    }
    
    add3DComponent(component2D) {
        let mesh;
        const position = {
            x: (component2D.x - 400) / 40, // Convert to 3D scale
            y: 0.5, // Default height
            z: (component2D.y - 300) / 40
        };
        
        switch(component2D.type) {
            case 'pipe':
                mesh = this.createPipe(component2D, position);
                break;
            case 'elbow':
                mesh = this.createElbow(component2D, position);
                break;
            case 'tee':
                mesh = this.createTee(component2D, position);
                break;
            case 'wallmount':
                mesh = this.createWallMount(component2D, position);
                break;
        }
        
        if (mesh) {
            mesh.userData = { component2D: component2D };
            this.scene.add(mesh);
            this.components3D.set(component2D.id, mesh);
        }
    }
    
    createPipe(component, position) {
        // Pipe geometry - cylinder
        const length = component.length / 40; // Scale down
        const radius = 0.05; // 25mm pipe radius in 3D scale
        
        const geometry = new THREE.CylinderGeometry(radius, radius, length, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const pipe = new THREE.Mesh(geometry, material);
        
        // Position and rotation
        pipe.position.set(position.x, position.y, position.z);
        
        // Apply rotation based on 2D rotation
        if (component.rotation === 90 || component.rotation === 270) {
            pipe.rotation.z = Math.PI / 2;
        }
        
        pipe.castShadow = true;
        pipe.receiveShadow = true;
        
        return pipe;
    }
    
    createElbow(component, position) {
        // Elbow joint - two perpendicular cylinders
        const group = new THREE.Group();
        const radius = 0.08;
        const length = 0.3;
        
        // Horizontal pipe
        const hGeometry = new THREE.CylinderGeometry(radius, radius, length, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const hPipe = new THREE.Mesh(hGeometry, material);
        hPipe.rotation.z = Math.PI / 2;
        hPipe.castShadow = true;
        
        // Vertical pipe
        const vGeometry = new THREE.CylinderGeometry(radius, radius, length, 8);
        const vPipe = new THREE.Mesh(vGeometry, material);
        vPipe.castShadow = true;
        
        group.add(hPipe);
        group.add(vPipe);
        group.position.set(position.x, position.y, position.z);
        
        // Apply rotation
        group.rotation.y = (component.rotation || 0) * Math.PI / 180;
        
        return group;
    }
    
    createTee(component, position) {
        // Tee joint - three perpendicular cylinders
        const group = new THREE.Group();
        const radius = 0.08;
        const length = 0.3;
        const material = new THREE.MeshLambertMaterial({ color: 0x555555 });
        
        // Main horizontal pipe
        const hGeometry = new THREE.CylinderGeometry(radius, radius, length * 1.5, 8);
        const hPipe = new THREE.Mesh(hGeometry, material);
        hPipe.rotation.z = Math.PI / 2;
        hPipe.castShadow = true;
        
        // Vertical branch
        const vGeometry = new THREE.CylinderGeometry(radius, radius, length, 8);
        const vPipe = new THREE.Mesh(vGeometry, material);
        vPipe.castShadow = true;
        
        group.add(hPipe);
        group.add(vPipe);
        group.position.set(position.x, position.y, position.z);
        
        // Apply rotation
        group.rotation.y = (component.rotation || 0) * Math.PI / 180;
        
        return group;
    }
    
    createWallMount(component, position) {
        // Wall mount - bracket shape
        const group = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({ color: 0x444444 });
        
        // Mounting plate
        const plateGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.05);
        const plate = new THREE.Mesh(plateGeometry, material);
        plate.position.z = -0.1;
        plate.castShadow = true;
        
        // Support arm
        const armGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.2);
        const arm = new THREE.Mesh(armGeometry, material);
        arm.position.z = 0;
        arm.castShadow = true;
        
        // Pipe holder
        const holderGeometry = new THREE.TorusGeometry(0.08, 0.02, 8, 16);
        const holder = new THREE.Mesh(holderGeometry, material);
        holder.position.z = 0.1;
        holder.rotation.x = Math.PI / 2;
        holder.castShadow = true;
        
        group.add(plate);
        group.add(arm);
        group.add(holder);
        group.position.set(position.x, position.y, position.z);
        
        return group;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.isActive) {
            if (this.controls) {
                this.controls.update();
            }
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    onResize() {
        if (!this.isActive) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    show() {
        this.isActive = true;
        this.container.style.display = 'block';
        this.updateFrom2D();
        this.onResize();
    }
    
    hide() {
        this.isActive = false;
        this.container.style.display = 'none';
    }
    
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        this.clearComponents();
    }
} 