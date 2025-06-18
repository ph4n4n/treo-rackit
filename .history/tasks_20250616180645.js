const tasks = {
  phase1: {
    name: 'Setup & Core Structure',
    duration: '1-2 days',
    status: 'pending',
    subtasks: [
      {
        id: '1.1',
        name: 'Project Structure Setup',
        description: 'Create basic folder structure and files',
        status: 'pending',
        files: [
          'index.html',
          'css/style.css',
          'js/app.js',
          'js/components/*.js',
          'js/utils/*.js',
          'js/constants.js'
        ]
      },
      {
        id: '1.2',
        name: 'Dependencies Setup',
        description: 'Install and configure required libraries',
        status: 'pending',
        dependencies: [
          'Bootstrap 5',
          'FileSaver.js (optional)'
        ]
      }
    ]
  },
  phase2: {
    name: 'Core Components',
    duration: '2-3 days',
    status: 'pending',
    subtasks: [
      {
        id: '2.1',
        name: 'Base Component Class',
        description: 'Create base class for all components',
        status: 'pending',
        features: [
          'id generation',
          'type definition',
          'position handling',
          'rotation handling',
          'render method',
          'update method',
          'delete method'
        ]
      },
      {
        id: '2.2',
        name: 'Component Implementation',
        description: 'Implement individual components',
        status: 'pending',
        components: [
          {
            name: 'PipeSegment',
            features: ['length input', 'rotation']
          },
          {
            name: 'ElbowJoint',
            features: ['rotation']
          },
          {
            name: 'TeeJoint',
            features: ['rotation']
          },
          {
            name: 'WallMount',
            features: ['rotation']
          }
        ]
      },
      {
        id: '2.3',
        name: 'Drag & Drop System',
        description: 'Implement drag and drop functionality',
        status: 'pending',
        features: [
          'drag from sidebar',
          'drop on canvas',
          'position calculation'
        ]
      }
    ]
  },
  phase3: {
    name: 'Canvas & Interaction',
    duration: '2-3 days',
    status: 'pending',
    subtasks: [
      {
        id: '3.1',
        name: 'Canvas Implementation',
        description: 'Create canvas system',
        status: 'pending',
        features: [
          'grid system',
          'component placement',
          'selection system'
        ]
      },
      {
        id: '3.2',
        name: 'Component Interactions',
        description: 'Implement component interaction features',
        status: 'pending',
        features: [
          'select/deselect',
          'rotate',
          'delete',
          'edit properties'
        ]
      }
    ]
  },
  phase4: {
    name: 'Material Calculator',
    duration: '1-2 days',
    status: 'pending',
    subtasks: [
      {
        id: '4.1',
        name: 'BOM System',
        description: 'Implement Bill of Materials system',
        status: 'pending',
        features: [
          'component counter',
          'pipe length grouping',
          'real-time updates'
        ]
      },
      {
        id: '4.2',
        name: 'BOM UI',
        description: 'Create UI for material calculations',
        status: 'pending',
        features: [
          'material list',
          'length grouping',
          'total calculations'
        ]
      }
    ]
  },
  phase5: {
    name: 'UI/UX & Polish',
    duration: '2-3 days',
    status: 'pending',
    subtasks: [
      {
        id: '5.1',
        name: 'Sidebar Implementation',
        description: 'Create and implement sidebar',
        status: 'pending',
        features: [
          'component list',
          'drag handles',
          'visual feedback'
        ]
      },
      {
        id: '5.2',
        name: 'Canvas Improvements',
        description: 'Enhance canvas functionality',
        status: 'pending',
        features: [
          'grid snapping',
          'visual guides',
          'component alignment'
        ]
      },
      {
        id: '5.3',
        name: 'Responsive Design',
        description: 'Implement responsive features',
        status: 'pending',
        features: [
          'mobile layout',
          'touch interactions',
          'screen size adaptations'
        ]
      }
    ]
  },
  phase6: {
    name: 'Testing & Bug Fixes',
    duration: '1-2 days',
    status: 'pending',
    subtasks: [
      {
        id: '6.1',
        name: 'Unit Tests',
        description: 'Write and implement unit tests',
        status: 'pending',
        tests: [
          'component behavior',
          'calculator accuracy',
          'drag & drop reliability'
        ]
      },
      {
        id: '6.2',
        name: 'Integration Tests',
        description: 'Write and implement integration tests',
        status: 'pending',
        tests: [
          'component interactions',
          'material calculations',
          'UI responsiveness'
        ]
      }
    ]
  },
  phase7: {
    name: 'Export Features (Post-MVP)',
    duration: '2-3 days',
    status: 'pending',
    subtasks: [
      {
        id: '7.1',
        name: 'PNG Export',
        description: 'Implement PNG export functionality',
        status: 'pending',
        features: [
          'canvas to image',
          'quality settings',
          'download handling'
        ]
      },
      {
        id: '7.2',
        name: 'PDF Export',
        description: 'Implement PDF export functionality',
        status: 'pending',
        features: [
          'layout design',
          'component list',
          'material summary'
        ]
      }
    ]
  }
};

// Helper functions
const getTaskStatus = (phaseId, taskId) => {
  const phase = tasks[phaseId];
  if (!phase) return null;
  
  const task = phase.subtasks.find(t => t.id === taskId);
  return task ? task.status : null;
};

const updateTaskStatus = (phaseId, taskId, status) => {
  const phase = tasks[phaseId];
  if (!phase) return false;
  
  const task = phase.subtasks.find(t => t.id === taskId);
  if (!task) return false;
  
  task.status = status;
  return true;
};

const getPhaseProgress = (phaseId) => {
  const phase = tasks[phaseId];
  if (!phase) return 0;
  
  const totalTasks = phase.subtasks.length;
  const completedTasks = phase.subtasks.filter(t => t.status === 'completed').length;
  
  return (completedTasks / totalTasks) * 100;
};

module.exports = {
  tasks,
  getTaskStatus,
  updateTaskStatus,
  getPhaseProgress
}; 