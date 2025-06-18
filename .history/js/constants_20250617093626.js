const COMPONENT_TYPES = {
    PIPE_SEGMENT: {
        id: 'pipe-segment',
        get name() { return t('pipeSegment'); },
        icon: 'bi bi-dash-lg'
    },
    ELBOW_JOINT: {
        id: 'elbow-joint',
        get name() { return t('elbowJoint'); },
        icon: 'bi bi-corner-up-right'
    },
    TEE_JOINT: {
        id: 'tee-joint',
        get name() { return t('teeJoint'); },
        icon: 'bi bi-plus'
    },
    WALL_MOUNT: {
        id: 'wall-mount',
        get name() { return t('wallMount'); },
        icon: 'bi bi-house'
    }
};

const GRID_SIZE = 20; // pixels

const COMPONENT_DEFAULTS = {
    'pipe-segment': {
        width: 100,
        height: 20,
        color: '#6c757d'
    },
    'elbow-joint': {
        width: 40,
        height: 40,
        color: '#0d6efd'
    },
    'tee-joint': {
        width: 40,
        height: 60,
        color: '#198754'
    },
    'wall-mount': {
        width: 30,
        height: 30,
        color: '#dc3545'
    }
}; 