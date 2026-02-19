import StartNode from './StartNode';
import EndNode from './EndNode';
import TaskNode from './TaskNode';
import DecisionNode from './DecisionNode';

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  decision: DecisionNode,
};

export const nodeTypeList = [
  { type: 'start', label: 'Start' },
  { type: 'task', label: 'Task' },
  { type: 'decision', label: 'Decision' },
  { type: 'end', label: 'End' },
];
