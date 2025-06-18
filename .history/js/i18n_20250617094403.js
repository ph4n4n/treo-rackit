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
        zoomIn: 'Phóng to',
        zoomOut: 'Thu nhỏ',
        
        // Toolbar tooltips with shortcuts
        gridTooltip: 'Bật/tắt lưới (G)',
        snapTooltip: 'Bật/tắt căn chỉnh (S)',
        zoomInTooltip: 'Phóng to khung vẽ',
        zoomOutTooltip: 'Thu nhỏ khung vẽ',
        clearAllTooltip: 'Xóa tất cả linh kiện',
        saveTooltip: 'Lưu thiết kế',
        exportPNGTooltip: 'Xuất hình ảnh PNG',
        
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
        exportFilename: 'treo-rackit-design.json',
        
        // Keyboard shortcuts
        shortcuts: {
            escape: 'ESC - Bỏ chọn công cụ/linh kiện',
            delete: 'Delete - Xóa linh kiện đã chọn',
            grid: 'G - Bật/tắt lưới',
            snap: 'S - Bật/tắt căn chỉnh'
        }
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
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        
        // Toolbar tooltips with shortcuts
        gridTooltip: 'Toggle grid (G)',
        snapTooltip: 'Toggle snap (S)',
        zoomInTooltip: 'Zoom in canvas',
        zoomOutTooltip: 'Zoom out canvas',
        clearAllTooltip: 'Clear all components',
        saveTooltip: 'Save design',
        exportPNGTooltip: 'Export as PNG image',
        
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
        exportFilename: 'treo-rackit-design.json',
        
        // Keyboard shortcuts
        shortcuts: {
            escape: 'ESC - Deselect tool/component',
            delete: 'Delete - Remove selected component',
            grid: 'G - Toggle grid',
            snap: 'S - Toggle snap'
        }
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
        // Update language indicator
        const langIndicator = document.getElementById('languageDropdown');
        if (langIndicator) {
            langIndicator.innerHTML = `<i class="bi bi-globe"></i> ${lang.toUpperCase()}`;
        }
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