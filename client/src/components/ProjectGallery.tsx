import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'AuraOS Core',
    description:
      'The main operating system interface, built with React and TypeScript.',
    imageUrl:
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=800&auto=format&fit=crop',
    tags: ['React', 'TypeScript', 'Vite'],
  },
  {
    title: 'AI Agent Framework',
    description:
      'A Python-based framework for creating and managing AI agents.',
    imageUrl:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
    tags: ['Python', 'AI', 'Automation'],
  },
  {
    title: 'Neon Design System',
    description: 'The UI library and design tokens for the AuraOS ecosystem.',
    imageUrl:
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop',
    tags: ['TailwindCSS', 'Framer Motion', 'UI/UX'],
  },
  {
    title: 'Real-time Data Pipeline',
    description: 'A WebSocket and Node.js backend for real-time communication.',
    imageUrl:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
    tags: ['Node.js', 'WebSocket', 'Backend'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function ProjectGallery() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold font-heading gradient-title">
          Project Gallery
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          A collection of key projects and components within the AuraOS
          ecosystem.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map(project => (
          <motion.div key={project.title} variants={itemVariants}>
            <Card className="overflow-hidden h-full flex flex-col">
              <CardHeader>
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <CardTitle className="font-heading">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
