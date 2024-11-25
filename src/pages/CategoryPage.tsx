import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Export the category data structure
export const categoryData = {
  writing: {
    title: 'Writing & Literature',
    icon: '✍️',
    description: 'Prompts for creative writing, storytelling, and literary content',
    subcategories: [
      'Creative Writing',
      'Story Development',
      'Character Creation',
      'Poetry',
      'Scriptwriting',
      'Blog Posts',
      'Academic Writing',
      'Technical Writing',
      'Content Marketing',
      'Book Summaries'
    ]
  },
  art: {
    title: 'Art & Design',
    icon: '🎨',
    description: 'Prompts for visual arts, digital design, and creative projects',
    subcategories: [
      'Digital Art',
      'Illustration',
      'Character Design',
      'Concept Art',
      'UI/UX Design',
      'Logo Design',
      'Brand Identity',
      'Pattern Design',
      'Animation',
      'Photography'
    ]
  },
  coding: {
    title: 'Coding & Technology',
    icon: '💻',
    description: 'Prompts for programming, development, and technical tasks',
    subcategories: [
      'Web Development',
      'Mobile Apps',
      'Game Development',
      'AI & Machine Learning',
      'Data Science',
      'DevOps',
      'Cybersecurity',
      'Code Review',
      'System Architecture',
      'Database Design'
    ]
  },
  business: {
    title: 'Business & Marketing',
    icon: '💼',
    description: 'Prompts for business strategy, marketing, and professional content',
    subcategories: [
      'Marketing Strategy',
      'Social Media',
      'Email Marketing',
      'Business Plans',
      'Market Analysis',
      'Sales Copy',
      'Product Descriptions',
      'Brand Strategy',
      'Customer Service',
      'Presentations'
    ]
  },
  education: {
    title: 'Education & Learning',
    icon: '📚',
    description: 'Prompts for educational content and learning materials',
    subcategories: [
      'Lesson Plans',
      'Course Content',
      'Study Guides',
      'Educational Games',
      'Assessments',
      'Tutorial Scripts',
      'Research Papers',
      'Learning Resources',
      'Teaching Materials',
      'Student Exercises'
    ]
  },
  lifestyle: {
    title: 'Lifestyle & Personal',
    icon: '🌟',
    description: 'Prompts for personal development and lifestyle content',
    subcategories: [
      'Self Improvement',
      'Health & Wellness',
      'Travel Planning',
      'Food & Recipes',
      'Fashion & Style',
      'Home Decor',
      'Personal Finance',
      'Relationships',
      'Hobbies',
      'Life Goals'
    ]
  },
  entertainment: {
    title: 'Entertainment & Media',
    icon: '🎬',
    description: 'Prompts for entertainment and media content creation',
    subcategories: [
      'Video Scripts',
      'Podcast Content',
      'Game Narratives',
      'Movie Reviews',
      'Music Production',
      'Stream Planning',
      'Entertainment News',
      'Show Concepts',
      'Media Analysis',
      'Event Planning'
    ]
  },
  science: {
    title: 'Science & Research',
    icon: '🔬',
    description: 'Prompts for scientific and research-based content',
    subcategories: [
      'Research Design',
      'Data Analysis',
      'Scientific Writing',
      'Lab Reports',
      'Research Proposals',
      'Literature Review',
      'Methodology',
      'Experiment Design',
      'Science Communication',
      'Grant Writing'
    ]
  }
};

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const category = categoryId ? categoryData[categoryId as keyof typeof categoryData] : null;

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <button 
          onClick={() => navigate('/categories')}
          className="text-primary hover:text-accent"
        >
          Return to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/categories')}
        className="flex items-center gap-2 text-primary hover:text-accent mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Categories
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-4xl">{category.icon}</span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent inline-block text-transparent bg-clip-text">
            {category.title}
          </h1>
        </div>
        <p className="text-foreground-secondary max-w-2xl mx-auto">
          {category.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.subcategories.map((subcategory) => (
          <Link
            key={subcategory}
            to={`/category/${categoryId}/${encodeURIComponent(subcategory.toLowerCase().replace(/ /g, '-'))}`}
            className="group"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-background-secondary p-6 rounded-lg transform transition-all duration-200 group-hover:scale-105"
            >
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary">
                {subcategory}
              </h3>
              <p className="text-foreground-secondary text-sm">
                Browse {subcategory} prompts
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
