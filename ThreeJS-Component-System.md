# Three.js Component System

Hệ thống component mới được thiết kế để tương thích hoàn toàn với Three.js, cung cấp:

## 🚀 Tính năng chính

### 1. **BaseComponent3D** - Component cơ sở
- **Quản lý geometry & material**: Tự động tạo và dispose resources
- **Connection system**: Hỗ trợ male/female ports với validation
- **Animation support**: Built-in animation cho properties
- **2D/3D sync**: Chuyển đổi tự động giữa 2D và 3D coordinates
- **Selection & interaction**: Visual feedback khi select

### 2. **Realistic 3D Models**
- **PipeSegment3D**: Ống với threading chi tiết, end caps, và adjustable length
- **ElbowJoint3D**: Khớp nối 90° với socket và threading thực tế
- **Connection ports**: Chính xác về vị trí và hướng

### 3. **ComponentFactory** - Quản lý tập trung
- **Sync 2D ↔ 3D**: Tự động đồng bộ giữa 2 view
- **Connection management**: Tạo và quản lý kết nối giữa components
- **Export/Import**: Save/load toàn bộ scene
- **Performance optimization**: Resource management và cleanup

## 📦 Cấu trúc file

```
js/
├── components/
│   ├── BaseComponent3D.js          # Base class cho tất cả 3D components
│   ├── PipeSegment3D.js           # Pipe với threading và end caps
│   ├── ElbowJoint3D.js            # Elbow 90° với sockets
│   └── [TeeJoint3D.js]            # T-joint (future)
├── utils/
│   ├── ComponentFactory.js        # Factory pattern cho component management
│   └── viewer3D.js               # Updated với ComponentFactory
└── examples/
    └── ExampleUsage.js            # Ví dụ sử dụng đầy đủ
```

## 🔧 Cách sử dụng

### Tạo components
```javascript
const factory = viewer3D.componentFactory;

// Tạo pipe segment
const pipe = factory.create3DComponent({
    id: 'pipe-1',
    type: COMPONENT_TYPES.PIPE_SEGMENT,
    x: 200, y: 200,
    rotation: 0,
    length: 150 // cm
});

// Tạo elbow joint
const elbow = factory.create3DComponent({
    id: 'elbow-1', 
    type: COMPONENT_TYPES.ELBOW_JOINT,
    x: 350, y: 200,
    rotation: 0
});
```

### Kết nối components
```javascript
// Male port kết nối với female port
factory.connectComponents('pipe-1', 'right', 'elbow-1', 'left');
```

### Animation
```javascript
const pipe = factory.get3DComponent('pipe-1');

// Animate length change
pipe.animateProperty('length', 2.5, 1000);

// Animate rotation
pipe.animateProperty('rotation', { x: 0, y: Math.PI/4, z: 0 }, 500);
```

### Sync với 2D system
```javascript
// Auto-sync khi 2D components thay đổi
factory.syncFrom2D(app.components);

// Sync ngược từ 3D về 2D
factory.syncFrom3D();
```

## 🎯 Connection System

### Port Types
- **Male ports** (pipes): Extend ra ngoài với threading
- **Female ports** (joints): Socket để nhận male ports

### Connection Rules
```javascript
// Male ↔ Female connections only
elbow.canConnectTo(pipe, 'left', 'right') // ✅ female ↔ male
pipe.canConnectTo(pipe2, 'right', 'left') // ❌ male ↔ male
```

### Visual Connections
```javascript
// Tự động tạo visual connection lines
factory.connectComponents(comp1Id, port1, comp2Id, port2);
```

## 📊 BOM Integration

Mỗi component tự động generate BOM data:

```javascript
const bomData = pipe.getBOMData();
// {
//   type: 'Pipe Segment',
//   material: 'Stainless Steel 304', 
//   diameter: '50mm',
//   length: '2m',
//   weight: '2.45 kg',
//   partNumber: 'PIPE-50MM-200CM-SS304'
// }
```

## 🛠 Debug Tools

### Visual Helpers
```javascript
// Show connection ports
component.showConnectionPorts(true);

// Show bounding boxes  
component.showBoundingBox(true);

// Scene statistics
const stats = factory.getStats();
```

### Debug Panel
```javascript
enableDebugMode(); // Tự động hiển thị debug panel
```

## 🚀 Performance Features

### Resource Management
- Automatic geometry/material disposal
- Efficient update system với dirty flagging
- Connection pooling

### Optimization
```javascript
// Disable sync temporarily for batch operations
factory.enableSync(false);
// ... batch updates ...
factory.enableSync(true);
```

## 🔄 Migration từ hệ thống cũ

### 1. Update imports
```javascript
// Old
import BaseComponent from './BaseComponent.js';

// New  
import { BaseComponent3D } from './BaseComponent3D.js';
import { ComponentFactory } from './ComponentFactory.js';
```

### 2. Initialize factory
```javascript
// In viewer3D.js
this.componentFactory = new ComponentFactory(this);
```

### 3. Replace component creation
```javascript
// Old
const component = new PipeSegment(x, y);

// New
const component = factory.create3DComponent({
    type: COMPONENT_TYPES.PIPE_SEGMENT,
    x, y, length: 100
});
```

## 📈 Roadmap

### Phase 1 ✅
- BaseComponent3D với full feature set
- PipeSegment3D & ElbowJoint3D
- ComponentFactory với sync system
- Connection management

### Phase 2 🔄
- TeeJoint3D & WallMount3D components
- Advanced animation system
- Physics integration
- Auto-routing for connections

### Phase 3 📋
- Component library expansion
- Material editor
- Advanced BOM features
- Performance profiling tools

## 🎨 Benefits

1. **Realistic 3D models** thay vì simple shapes
2. **Proper connection system** với validation
3. **Seamless 2D/3D sync** không cần manual conversion
4. **Animation support** cho smooth UX
5. **Resource management** tự động
6. **Debug tools** tích hợp sẵn
7. **BOM integration** với weight/material calculations
8. **Export/Import** đầy đủ với connections

Hệ thống này giữ nguyên UX hiện tại nhưng nâng cao đáng kể chất lượng 3D rendering và functionality. 