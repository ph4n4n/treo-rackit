const i18n = {
    vi: {
        // Header
        appTitle: 'TreoRackit',
        appSubtitle: 'Thiết kế giá treo quần áo',
        clearAll: 'Clear All',
        save: 'Save',
        exportPNG: 'Export PNG',
        
        // Sidebar
        components: 'Components',
        properties: 'Properties',
        materials: 'Materials (BOM)',
        
        // Component names
        pipeSegment: 'Ống thép',
        elbowJoint: 'Co 90°',
        teeJoint: 'Khớp T',
        wallMount: 'Chân đế',
        
        // Properties panel
        componentType: 'Loại linh kiện:',
        position: 'Vị trí:',
        rotation: 'Góc xoay:',
        length: 'Chiều dài (cm):',
        delete: 'Xóa',
        
        // Toolbar
        grid: 'Grid',
        snap: 'Snap',
        
        // BOM
        bomEmpty: 'Chưa có linh kiện nào',
        bomEmptyDesc: 'Kéo thả hoặc click để thêm',
        pipeSpecs: 'Đường kính 25mm',
        wallMountSpecs: 'Tải trọng 50kg',
        
        // Tooltips
        rotateLeft: 'Xoay trái 90°',
        rotateRight: 'Xoay phải 90°',
        deleteComponent: 'Xóa component',
        
        // Dialogs
        confirmClearAll: 'Xóa tất cả các thành phần?',
        
        // Status
        mouseCoords: 'x: {x}, y: {y}',
        componentCount: '{count} components',
        zoomLevel: '{level}%',
        
        // File operations
        exportFilename: 'treo-rackit-design.json'
    },
    
    en: {
        // Header
        appTitle: 'TreoRackit',
        appSubtitle: 'Clothes Rack Designer',
        clearAll: 'Clear All',
        save: 'Save',
        exportPNG: 'Export PNG',
        
        // Sidebar
        components: 'Components',
        properties: 'Properties',
        materials: 'Materials (BOM)',
        
        // Component names
        pipeSegment: 'Steel Pipe',
        elbowJoint: 'Elbow 90°',
        teeJoint: 'T-Joint',
        wallMount: 'Wall Mount',
        
        // Properties panel
        componentType: 'Component Type:',
        position: 'Position:',
        rotation: 'Rotation:',
        length: 'Length (cm):',
        delete: 'Delete',
        
        // Toolbar
        grid: 'Grid',
        snap: 'Snap',
        
        // BOM
        bomEmpty: 'No components yet',
        bomEmptyDesc: 'Drag & drop or click to add',
        pipeSpecs: 'Diameter 25mm',
        wallMountSpecs: 'Load capacity 50kg',
        
        // Tooltips
        rotateLeft: 'Rotate left 90°',
        rotateRight: 'Rotate right 90°',
        deleteComponent: 'Delete component',
        
        // Dialogs
        confirmClearAll: 'Delete all components?',
        
        // Status
        mouseCoords: 'x: {x}, y: {y}',
        componentCount: '{count} components',
        zoomLevel: '{level}%',
        
        // File operations
        exportFilename: 'treo-rackit-design.json'
    }
};

// Current language
let currentLang = 'vi';

// Translation function
function t(key, params = {}) {
    let text = i18n[currentLang][key] || i18n.vi[key] || key;
    
    // Replace parameters
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

// Set language
function setLanguage(lang) {
    if (i18n[lang]) {
        currentLang = lang;
        // Trigger re-render if needed
        if (window.app) {
            window.app.updateUI();
        }
    }
}

// Get current language
function getCurrentLanguage() {
    return currentLang;
} 