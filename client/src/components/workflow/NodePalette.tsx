import React from 'react';
import { useDrag } from 'react-dnd';
import { NodeType } from '../../types/workflow';
import {
  Play,
  Square,
  Settings,
  GitBranch,
  MessageSquare,
  Github,
  Clock,
  Filter,
  Workflow,
  Merge,
} from 'lucide-react';

interface DraggableNodeProps {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({
  type,
  label,
  icon,
  description,
  color,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'node',
    item: { type, label },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`
        flex items-center gap-3 p-3 rounded-lg border-2 border-dashed cursor-grab
        hover:bg-gray-800/50 transition-all duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${color}
      `}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white text-sm">{label}</div>
        <div className="text-gray-400 text-xs truncate">{description}</div>
      </div>
    </div>
  );
};

export const NodePalette: React.FC = () => {
  const nodeTypes = [
    {
      type: NodeType.START,
      label: 'بداية',
      description: 'نقطة بداية سير العمل',
      icon: <Play className="w-5 h-5 text-green-400" />,
      color: 'border-green-400/50 hover:border-green-400',
    },
    {
      type: NodeType.END,
      label: 'نهاية',
      description: 'نقطة نهاية سير العمل',
      icon: <Square className="w-5 h-5 text-red-400" />,
      color: 'border-red-400/50 hover:border-red-400',
    },
    {
      type: NodeType.PROCESS,
      label: 'عملية',
      description: 'تنفيذ عملية معينة',
      icon: <Settings className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-400/50 hover:border-blue-400',
    },
    {
      type: NodeType.DECISION,
      label: 'قرار',
      description: 'اتخاذ قرار بناءً على شرط',
      icon: <GitBranch className="w-5 h-5 text-yellow-400" />,
      color: 'border-yellow-400/50 hover:border-yellow-400',
    },
    {
      type: NodeType.SLACK,
      label: 'Slack',
      description: 'إرسال رسالة إلى Slack',
      icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-400/50 hover:border-purple-400',
    },
    {
      type: NodeType.DISCORD,
      label: 'Discord',
      description: 'إرسال رسالة إلى Discord',
      icon: <MessageSquare className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-400/50 hover:border-indigo-400',
    },
    {
      type: NodeType.GITHUB_ACTION,
      label: 'GitHub Actions',
      description: 'تشغيل GitHub Action',
      icon: <Github className="w-5 h-5 text-gray-400" />,
      color: 'border-gray-400/50 hover:border-gray-400',
    },
    {
      type: NodeType.DELAY,
      label: 'تأخير',
      description: 'تأخير التنفيذ لفترة معينة',
      icon: <Clock className="w-5 h-5 text-orange-400" />,
      color: 'border-orange-400/50 hover:border-orange-400',
    },
    {
      type: NodeType.CONDITION,
      label: 'شرط',
      description: 'فحص شرط معين',
      icon: <Filter className="w-5 h-5 text-pink-400" />,
      color: 'border-pink-400/50 hover:border-pink-400',
    },
    {
      type: NodeType.PARALLEL,
      label: 'متوازي',
      description: 'تنفيذ متوازي للمهام',
      icon: <Workflow className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-400/50 hover:border-cyan-400',
    },
    {
      type: NodeType.MERGE,
      label: 'دمج',
      description: 'دمج عدة مسارات',
      icon: <Merge className="w-5 h-5 text-teal-400" />,
      color: 'border-teal-400/50 hover:border-teal-400',
    },
  ];

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          عناصر سير العمل
        </h2>
        <p className="text-gray-400 text-sm">
          اسحب العناصر إلى لوحة الرسم لإنشاء سير العمل
        </p>
      </div>

      <div className="space-y-3">
        {/* عقد أساسية */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 px-1">
            عقد أساسية
          </h3>
          <div className="space-y-2">
            {nodeTypes.slice(0, 4).map(node => (
              <DraggableNode key={node.type} {...node} />
            ))}
          </div>
        </div>

        {/* تكاملات APIs */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 px-1">
            تكاملات APIs
          </h3>
          <div className="space-y-2">
            {nodeTypes.slice(4, 7).map(node => (
              <DraggableNode key={node.type} {...node} />
            ))}
          </div>
        </div>

        {/* عقد متقدمة */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 px-1">
            عقد متقدمة
          </h3>
          <div className="space-y-2">
            {nodeTypes.slice(7).map(node => (
              <DraggableNode key={node.type} {...node} />
            ))}
          </div>
        </div>
      </div>

      {/* نصائح الاستخدام */}
      <div className="mt-8 p-3 bg-gray-700/50 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">💡 نصائح</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• اسحب العقد إلى لوحة الرسم</li>
          <li>• اربط العقد بالنقر والسحب</li>
          <li>• انقر على العقدة لتعديلها</li>
          <li>• تحقق من صحة سير العمل</li>
        </ul>
      </div>
    </div>
  );
};
