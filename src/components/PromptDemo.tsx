import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const demoPrompt = {
  title: "Create a sci-fi story opening",
  category: "Creative Writing",
  prompt: "Write the opening paragraph of a science fiction story where humanity discovers an ancient alien artifact on Mars. The discovery should be both exciting and slightly ominous. Include vivid descriptions of the Martian landscape and the artifact itself."
}

const typingSpeed = 50 // ms per character

export function PromptDemo() {
  console.log('PromptDemo rendering') // Debug log
  const [typedTitle, setTypedTitle] = useState("")
  const [showCategory, setShowCategory] = useState(false)
  const [typedPrompt, setTypedPrompt] = useState("")
  const [showSave, setShowSave] = useState(false)

  useEffect(() => {
    console.log('PromptDemo effect running') // Debug log
    let mounted = true

    const sequence = async () => {
      if (!mounted) return

      // Reset states
      setTypedTitle("")
      setShowCategory(false)
      setTypedPrompt("")
      setShowSave(false)

      // Animate in
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Type title
      for (let i = 0; i <= demoPrompt.title.length; i++) {
        if (!mounted) return
        setTypedTitle(demoPrompt.title.slice(0, i))
        await new Promise(resolve => setTimeout(resolve, typingSpeed))
      }
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Show category selection
      if (!mounted) return
      setShowCategory(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Type prompt
      for (let i = 0; i <= demoPrompt.prompt.length; i++) {
        if (!mounted) return
        setTypedPrompt(demoPrompt.prompt.slice(0, i))
        await new Promise(resolve => setTimeout(resolve, typingSpeed))
      }
      
      // Show save button
      if (!mounted) return
      await new Promise(resolve => setTimeout(resolve, 500))
      setShowSave(true)
      
      // Reset after completion
      await new Promise(resolve => setTimeout(resolve, 3000))
      if (mounted) {
        sequence() // Restart the sequence
      }
    }
    
    sequence()
    return () => { mounted = false }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg relative z-10"
    >
      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Title</label>
          <input
            type="text"
            value={typedTitle}
            readOnly
            className="w-full p-2 bg-[#2a2a2a] text-white rounded-lg border border-[#3a3a3a]"
            placeholder="Enter a title..."
          />
        </div>

        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showCategory ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-medium mb-1 text-white">Category</label>
          <select
            value={demoPrompt.category}
            readOnly
            className="w-full p-2 bg-[#2a2a2a] text-white rounded-lg border border-[#3a3a3a]"
          >
            <option value={demoPrompt.category}>{demoPrompt.category}</option>
          </select>
        </motion.div>

        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Prompt</label>
          <textarea
            value={typedPrompt}
            readOnly
            rows={6}
            className="w-full p-2 bg-[#2a2a2a] text-white rounded-lg border border-[#3a3a3a] resize-none"
            placeholder="Enter your prompt..."
          />
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showSave ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-end"
        >
          <button className="matrix-gradient px-4 py-2 rounded-lg font-medium">
            Save Prompt
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
