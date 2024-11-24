import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Edit, Share2, Search, Sparkles, Heart } from 'lucide-react'
import { AuthModal } from '../components/AuthModal'
import { useState, useEffect } from 'react'

function FeatureSection({ 
  title, 
  description, 
  steps, 
  icon: Icon 
}: { 
  title: string
  description: string
  steps: { text: string }[]
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="prompt-box"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <p className="text-foreground-secondary mb-6">{description}</p>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <p className="text-foreground-secondary">{step.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function WhyUseSection() {
  const benefits = [
    {
      title: "Organized Workflow",
      description: "Keep all your prompts in one place, sorted and searchable."
    },
    {
      title: "Global Inspiration",
      description: "Discover what others are creating and adapt their ideas to your own needs."
    },
    {
      title: "Recognition and Collaboration",
      description: "Build your profile as a creator while helping others succeed."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mt-16 mb-16"
    >
      <h2 className="text-2xl font-bold mb-8">Why Use PromptDump.io?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="p-6 rounded-lg bg-background-secondary"
          >
            <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
            <p className="text-foreground-secondary">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TypingEffect() {
  const prompts = [
    "Stable Diffusion Masterpiece Generator: Create a masterpiece in the style of Van Gogh...",
    "GPT-4 Code Review Expert: Review the following code snippet for clean code principles...",
    "Claude Business Strategy Advisor: Act as a seasoned business strategy consultant...",
    "Custom Travel Itinerary: Plan a 7-day trip to Japan focusing on cultural experiences...",
    "AI Poem Creator: Write a heartfelt poem in the style of Emily Dickinson...",
    "MidJourney Surreal Landscape: Generate a landscape with floating mountains and a dreamy twilight...",
    "Personalized Workout Planner: Create a 4-week fitness plan for weight loss and muscle gain...",
    "SQL Query Optimizer: Analyze and improve the performance of this SQL query...",
    "Game Narrative Designer: Design a compelling backstory for a stealth-action game...",
    "Alternate History Scenario: Imagine a world where the Roman Empire never fell..."
  ];

  const [displayText, setDisplayText] = useState("");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530); // Blink rate

    return () => clearInterval(cursorInterval);
  }, []);

  // Typing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPromptIndex < prompts.length) {
        const currentPrompt = prompts[currentPromptIndex];
        if (charIndex < currentPrompt.length) {
          setDisplayText(prev => prev + currentPrompt[charIndex]);
          setCharIndex(prev => prev + 1);
        } else {
          // Add a delay before starting the next prompt
          setTimeout(() => {
            setDisplayText(prev => prev + "\n\n> ");
            setCurrentPromptIndex(prev => prev + 1);
            setCharIndex(0);
          }, 1000);
        }
      } else {
        // Add a delay before resetting
        setTimeout(() => {
          setCurrentPromptIndex(0);
          setDisplayText("> ");
          setCharIndex(0);
        }, 2000);
      }
    }, Math.random() * 50 + 30); // Random typing speed for more natural effect

    return () => clearTimeout(timer);
  }, [currentPromptIndex, charIndex]);

  // Initialize with prompt symbol
  useEffect(() => {
    setDisplayText("> ");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="my-16 px-4"
    >
      <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
        {/* Terminal header */}
        <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-400 text-sm ml-2 font-mono">promptdump.io</span>
        </div>
        {/* Terminal content */}
        <pre 
          className="font-['Courier_New'] text-sm md:text-base bg-black p-6 overflow-x-auto whitespace-pre-wrap"
          style={{
            color: '#00ff00',
            textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
            lineHeight: '1.6',
            minHeight: '300px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          <code className="block">
            {displayText}
            <span 
              className="inline-block w-2 h-4 ml-1 relative -top-px"
              style={{ 
                backgroundColor: cursorVisible ? '#00ff00' : 'transparent',
                transition: 'background-color 0.1s'
              }}
            ></span>
          </code>
        </pre>
      </div>
    </motion.div>
  );
}

export function Explore() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const features = [
    {
      title: "Adding Prompts Made Simple",
      description: "Adding your favorite AI prompts is as easy as typing a message.",
      icon: BookOpen,
      steps: [
        { text: "Use the \"Add Prompt\" button on the Dump Feed or your profile page to upload a new prompt. You can paste your prompt, add a title, and choose relevant tags (e.g., #Writing, #Marketing, #Coding)." },
        { text: "Our system suggests categories and tags for your prompt based on its content, ensuring it reaches the right audience." },
        { text: "See how your prompt will look to others before sharing it." }
      ]
    },
    {
      title: "Editing and Copying Prompts",
      description: "We understand that prompts often evolve with time, and that's why we've made editing and copying incredibly straightforward.",
      icon: Edit,
      steps: [
        { text: "All prompts you upload can be edited from your profile. Simply click \"Edit,\" make your changes, and save. Updates are reflected instantly for other users to see." },
        { text: "Found a prompt you love? Use the \"Copy Prompt\" button on any public prompt to instantly copy it to your clipboard. This makes it easy to try out ideas in your favorite AI tools or tweak them for your specific needs." }
      ]
    },
    {
      title: "Smart Organization and Search",
      description: "To make sure you never lose track of a great idea, we've built robust sorting and search functionality powered by AI.",
      icon: Search,
      steps: [
        { text: "When you upload a prompt, our AI analyzes its content and automatically assigns it to the most relevant categories." },
        { text: "Use keywords, tags, or categories to instantly find prompts. Our search engine supports natural language queries." },
        { text: "Bookmark or pin your favorite prompts for quick access later. Your saved prompts are always just a click away on your profile." }
      ]
    },
    {
      title: "Social Sharing and Collaboration",
      description: "PromptDump.io isn't just a library—it's a community of creators.",
      icon: Share2,
      steps: [
        { text: "Share your prompts with the community to gain feedback, upvotes, and recognition. The more your prompt is used and liked, the more exposure it gets in our trending feed." },
        { text: "Comment on prompts, start discussions, and collaborate with like-minded users. Whether you're brainstorming ideas or seeking advice, the community is here to help." },
        { text: "Use our built-in sharing options to post your prompts on Twitter, LinkedIn, or other platforms." }
      ]
    }
  ]

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-primary/25">
                <Sparkles className="w-4 h-4 mr-1" />
                Explore Our Features
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover What Makes
              <br />
              <span className="bg-gradient-to-r from-primary to-accent inline-block text-transparent bg-clip-text">
                PromptDump.io Special
              </span>
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              We aim to provide a seamless and powerful platform for sharing, organizing, and discovering AI prompts.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8">
            {features.map((feature, index) => (
              <FeatureSection key={index} {...feature} />
            ))}
          </div>

          {/* Why Use Section */}
          <WhyUseSection />

          {/* Typing Effect */}
          <TypingEffect />

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-16"
          >
            <h2 className="text-2xl font-bold mb-4">
              Ready to start dumping prompts?
            </h2>
            <p className="text-foreground-secondary mb-8">
              Join us today to explore, create, share and organise.
            </p>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="matrix-gradient px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2"
            >
              <Heart className="w-5 h-5" />
              <span>Get Started</span>
            </button>
          </motion.div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </AnimatePresence>
  )
}
