import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const mainCategories = [
  {
    title: "Writing & Literature",
    icon: "📚",
    route: "/category/writing-literature",
    description: "Prompts for creative writing, poetry, and literary works"
  },
  {
    title: "Art & Design",
    icon: "🎨",
    route: "/category/art-design",
    description: "Prompts for digital art, graphic design, and visual creation"
  },
  {
    title: "Coding & Technology",
    icon: "💻",
    route: "/category/coding-technology",
    description: "Prompts for programming, development, and tech solutions"
  },
  {
    title: "Business & Finance",
    icon: "💼",
    route: "/category/business-finance",
    description: "Prompts for business strategy, marketing, and finance"
  },
  {
    title: "Science & Engineering",
    icon: "🔬",
    route: "/category/science-engineering",
    description: "Prompts for scientific research and engineering problems"
  },
  {
    title: "Health & Wellness",
    icon: "🏥",
    route: "/category/health-wellness",
    description: "Prompts for medical, fitness, and wellness topics"
  },
  {
    title: "Education & Learning",
    icon: "📖",
    route: "/category/education-learning",
    description: "Prompts for teaching, studying, and educational content"
  },
  {
    title: "Social Sciences & Humanities",
    icon: "🎭",
    route: "/category/social-sciences",
    description: "Prompts for psychology, sociology, and cultural studies"
  },
  {
    title: "Entertainment & Media",
    icon: "🎬",
    route: "/category/entertainment-media",
    description: "Prompts for film, music, and media content"
  },
  {
    title: "Lifestyle & Personal Development",
    icon: "🌱",
    route: "/category/lifestyle",
    description: "Prompts for personal growth and lifestyle improvement"
  }
];

export function Categories() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent inline-block text-transparent bg-clip-text">
          Browse Categories
        </h1>
        <p className="text-foreground-secondary max-w-2xl mx-auto">
          Explore our extensive collection of AI prompts organized by category
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainCategories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-background-secondary p-6 rounded-xl hover:bg-background-secondary/80 transition-colors cursor-pointer"
            onClick={() => navigate(category.route)}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{category.icon}</span>
              <h2 className="text-xl font-semibold">{category.title}</h2>
            </div>
            <p className="text-foreground-secondary">{category.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
