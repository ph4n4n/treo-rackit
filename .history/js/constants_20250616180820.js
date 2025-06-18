const COMPONENT_TYPES = {
    PIPE_SEGMENT: 'pipe-segment',
    ELBOW_JOINT: 'elbow-joint',
    TEE_JOINT: 'tee-joint',
    WALL_MOUNT: 'wall-mount'
};

const GRID_SIZE = 20; // pixels

const COMPONENT_DEFAULTS = {
    [COMPONENT_TYPES.PIPE_SEGMENT]: {
        width: 100,
        height: 20,
        color: '#6c757d'
    },
    [COMPONENT_TYPES.ELBOW_JOINT]: {
        width: 40,
        height: 40,
        color: '#0d6efd'
    },
    [COMPONENT_TYPES.TEE_JOINT]: {
        width: 40,
        height: 60,
        color: '#198754'
    },
    [COMPONENT_TYPES.WALL_MOUNT]: {
        width: 30,
        height: 30,
        color: '#dc3545'
    }
}; 