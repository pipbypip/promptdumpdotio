import React, { useState, useEffect } from 'react';
import { DicesIcon } from 'lucide-react';

const prompts = [
  // Art & Creativity
  "Stable Diffusion Masterpiece Generator: Create a masterpiece in the style of Van Gogh...",
  "MidJourney Surreal Landscape: Generate a landscape with floating mountains and a dreamy twilight...",
  "Creative Writing Companion: Write a captivating short story set on a distant planet colonized by humans...",
  "Digital Portrait Creator: Design a futuristic portrait blending elements of Renaissance art and cyberpunk aesthetics...",
  "AI Poem Creator: Write a heartfelt poem in the style of Emily Dickinson...",
  
  // Business & Strategy
  "Claude Business Strategy Advisor: Act as a seasoned business strategy consultant...",
  "Startup Pitch Deck Helper: Draft a compelling pitch deck for an AI-powered home assistant startup...",
  "Market Research Analyst: Analyze the growth potential of the electric vehicle market...",
  "Customer Feedback Analyzer: Summarize and categorize customer reviews to identify improvement areas for a SaaS platform...",
  "Advertising Slogan Creator: Generate 5 creative slogans for an eco-friendly clothing brand...",
  
  // Fitness & Wellness
  "Personalized Workout Planner: Create a 4-week fitness plan for weight loss and muscle gain...",
  "Mindfulness Guide: Develop a 10-minute daily mindfulness exercise to reduce stress and improve focus...",
  "Diet Planner: Plan a high-protein vegetarian meal plan for a week...",
  "Running Coach: Provide a detailed training schedule to prepare for a marathon in 3 months...",
  "Sleep Optimization Tips: Share 5 scientifically-backed tips to improve sleep quality...",
  
  // Education & Learning
  "History Explainer: Describe the key causes and consequences of the French Revolution in simple terms...",
  "Math Tutor: Explain how to calculate compound interest for a beginner...",
  "Language Learning Assistant: Teach basic greetings and phrases in Japanese for a traveler...",
  "Science Quiz Maker: Generate a 10-question multiple-choice quiz on basic physics concepts...",
  "Homework Assistant: Solve and explain this algebra equation step by step...",
  
  // Technology & Programming
  "GPT-4 Code Review Expert: Review the following code snippet for clean code principles...",
  "SQL Query Optimizer: Analyze and improve the performance of this SQL query...",
  "Cybersecurity Advisor: Identify vulnerabilities in this network configuration and suggest improvements...",
  "Web Design Consultant: Provide tips to improve the usability and aesthetics of this website design...",
  "Data Science Assistant: Write a Python script to visualize data trends in a CSV file...",
  
  // Travel & Leisure
  "Custom Travel Itinerary: Plan a 7-day trip to Japan focusing on cultural experiences...",
  "Local Adventure Finder: Suggest hidden gems and must-see places for a weekend trip to New York City...",
  "Travel Budget Planner: Calculate the estimated budget for a 10-day trip to Italy...",
  "Foodie Explorer: Recommend unique dishes to try in Thailand and where to find them...",
  "Eco-Friendly Travel Tips: Share tips for reducing the environmental impact while traveling...",
  
  // Entertainment & Fun
  "Movie Plot Generator: Create a thrilling plot for a sci-fi action movie set in 2084...",
  "Dungeons & Dragons Storyline: Craft an intriguing backstory for a chaotic good rogue in a medieval fantasy setting...",
  "Music Recommendation Bot: Suggest 5 upbeat songs for a morning run...",
  "Video Game Concept Creator: Develop an idea for an open-world RPG with underwater exploration...",
  "Stand-Up Comedy Writer: Generate a humorous monologue about modern technology...",
  
  // Science & Philosophy
  "Alternate History Scenario: Imagine a world where the Roman Empire never fell...",
  "Philosophical Debate Starter: Discuss the implications of AI surpassing human intelligence...",
  "Astrophysics Explainer: Explain black holes in simple terms for a curious teenager...",
  "Environmental Impact Analyst: Analyze the benefits and challenges of renewable energy adoption...",
  "Ethics Consultant: Debate the ethical dilemmas of cloning in medical science...",
  
  // Career & Productivity
  "Resume Optimizer: Rewrite this resume to highlight transferable skills for a career change...",
  "Interview Coach: Provide answers to common interview questions for a software engineering position...",
  "Time Management Planner: Suggest a daily routine to maximize productivity for a remote worker...",
  "Freelance Proposal Writer: Draft a professional proposal for a graphic design project...",
  "Goal-Setting Advisor: Help create an actionable plan to achieve a personal 6-month fitness goal...",
  
  // Relationships & Social Life
  "Wedding Speech Generator: Write a heartfelt speech for the father of the bride...",
  "Friendship Letter: Draft a sincere letter to reconnect with an old friend...",
  "Conflict Resolution Advisor: Provide tips to handle a disagreement with a coworker diplomatically...",
  "Date Night Planner: Suggest creative date ideas for a couple celebrating their anniversary...",
  "Social Media Content Creator: Generate 5 engaging Instagram post ideas for a personal travel blog...",
  
  // Miscellaneous
  "Pet Care Guide: Provide tips for taking care of a new golden retriever puppy...",
  "Home Renovation Planner: Suggest budget-friendly ideas to renovate a small kitchen...",
  "Gardening Tips: Share advice for growing tomatoes in a home garden...",
  "Event Organizer: Plan a surprise birthday party for a 10-year-old with a space theme...",
  "Personal Finance Advisor: Share tips for saving money on a monthly budget of $3,000...",
];

export function TerminalOutput() {
  const [output, setOutput] = useState("");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const getRandomPrompt = () => {
    const newIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPromptIndex(newIndex);
    setCharIndex(0);
    setOutput("");
    setIsTyping(true);
  };

  useEffect(() => {
    if (!isTyping) return;

    const typeEffect = () => {
      const currentPrompt = prompts[currentPromptIndex];
      if (charIndex < currentPrompt.length) {
        setOutput(prev => prev + currentPrompt[charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setIsTyping(false);
      }
    };

    const timer = setTimeout(typeEffect, 25);
    return () => clearTimeout(timer);
  }, [currentPromptIndex, charIndex, isTyping]);

  return (
    <div className="relative min-h-[200px] bg-black/10 dark:bg-black/50 rounded-lg p-4">
      <div className="text-[#32CD32] whitespace-pre-wrap font-mono">
        {output}
        <span className="animate-pulse">_</span>
      </div>
      <button
        onClick={getRandomPrompt}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/20 dark:hover:bg-white/10 transition-colors"
        aria-label="Generate random prompt"
      >
        <DicesIcon className="w-5 h-5 text-[#32CD32]" />
      </button>
    </div>
  );
}
