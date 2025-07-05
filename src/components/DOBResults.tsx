"use client"

import { useState, useEffect } from 'react'
import { AIAnalysisResponse } from '@/types/user'

interface DOBResultsProps {
  isVisible: boolean
  isProcessing: boolean
  onReset: () => void
  className?: string
}

export function DOBResults({ isVisible, isProcessing, onReset, className = "" }: DOBResultsProps) {
  const [sections, setSections] = useState<AIAnalysisResponse>({
    basicInfo: '',
    personalityTraits: '',
    lifeCycle: '',
    interestingFacts: '',
    shoppingSuggestions: ''
  })
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['basicInfo']))
  const [streamingContent, setStreamingContent] = useState('')

  useEffect(() => {
    if (!isVisible) {
      setSections({
        basicInfo: '',
        personalityTraits: '',
        lifeCycle: '',
        interestingFacts: '',
        shoppingSuggestions: ''
      })
      setVisibleSections(new Set(['basicInfo']))
      setStreamingContent('')
    }
  }, [isVisible])

  const handleStreamData = ({ data }: { data: any }) => {
    if (data.chunk) {
      setStreamingContent(prev => prev + data.chunk)
    }
    
    if (data.end) {
      // Parse the final content into sections
      const finalContent = streamingContent
      this.parseContentIntoSections({ content: finalContent })
      setStreamingContent('')
    }
  }

  const parseContentIntoSections = ({ content }: { content: string }) => {
    const sectionMatches = [...content.matchAll(/##\s*\d*\.?\s*([^\n:]+)(:)?\s*([^\n]*)\n([\s\S]*?)(?=\n##|$)/g)]
    
    const newSections: AIAnalysisResponse = {
      basicInfo: '',
      personalityTraits: '',
      lifeCycle: '',
      interestingFacts: '',
      shoppingSuggestions: ''
    }

    sectionMatches.forEach(match => {
      const section = match[1].trim().toLowerCase()
      const content = (match[3] ? match[3] + '\n' : '') + match[4].trim()
      
      if (section.includes('thông tin cơ bản') || section.includes('basic information')) {
        newSections.basicInfo = content
      } else if (section.includes('tính cách') || section.includes('personality') || section.includes('cung hoàng đạo') || section.includes('zodiac')) {
        newSections.personalityTraits = content
      } else if (section.includes('chu kỳ') || section.includes('life cycle')) {
        newSections.lifeCycle = content
      } else if (section.includes('sự thật') || section.includes('interesting')) {
        newSections.interestingFacts = content
      } else if (section.includes('gợi ý') || section.includes('shopping')) {
        newSections.shoppingSuggestions = content
      }
    })

    setSections(newSections)
    
    // Show sections that have content
    const sectionsWithContent = Object.entries(newSections)
      .filter(([_, content]) => content.trim())
      .map(([key, _]) => key)
    
    setVisibleSections(new Set(sectionsWithContent))
  }

  const toggleSection = ({ section }: { section: string }) => {
    setVisibleSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const renderSection = ({ key, title, content, icon, bgColor, textColor }: {
    key: string
    title: string
    content: string
    icon: string
    bgColor: string
    textColor: string
  }) => {
    if (!content.trim()) return null

    const isVisible = visibleSections.has(key)

    return (
      <div key={key} className="space-y-4">
        <button
          onClick={() => toggleSection({ section: key })}
          className={`modern-btn ${bgColor} ${textColor} font-semibold py-2 px-4 w-full justify-center`}
        >
          <span className="icon">{icon}</span>
          {title}
        </button>
        
        {isVisible && (
          <div className={`${bgColor.replace('100', '50')} p-6 rounded-xl shadow card show`}>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <span className="icon">{icon}</span>
              {title}
            </h3>
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: this.markdownToHtml(content) }}
            />
          </div>
        )}
      </div>
    )
  }

  const markdownToHtml = (markdown: string): string => {
    // Simple markdown to HTML conversion
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/##\s*(.*?)\n/g, '<h3>$1</h3>')
      .replace(/-\s*(.*?)(?=\n|$)/g, '<li>$1</li>')
  }

  if (!isVisible) return null

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 mb-10 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Personal Insights</h2>
        <div className="flex items-center gap-2 text-blue-500 text-lg font-semibold">
          <span>{isProcessing ? 'AI đang phân tích...' : 'Phân tích hoàn tất!'}</span>
          {isProcessing && (
            <span className="inline-block">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </span>
          )}
        </div>
      </div>

      {isProcessing && streamingContent && (
        <div className="bg-blue-50 p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">🤖 AI Analysis</h3>
          <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: this.markdownToHtml(streamingContent) }}
          />
        </div>
      )}

      {!isProcessing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderSection({
            key: 'basicInfo',
            title: 'Basic Information',
            content: sections.basicInfo,
            icon: '📋',
            bgColor: 'bg-indigo-100',
            textColor: 'text-indigo-700'
          })}
          
          {renderSection({
            key: 'personalityTraits',
            title: 'Your Personality Traits',
            content: sections.personalityTraits,
            icon: '🧠',
            bgColor: 'bg-teal-100',
            textColor: 'text-teal-700'
          })}
          
          {renderSection({
            key: 'lifeCycle',
            title: 'Life Cycle Analysis',
            content: sections.lifeCycle,
            icon: '🌱',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700'
          })}
          
          {renderSection({
            key: 'interestingFacts',
            title: 'Interesting Facts',
            content: sections.interestingFacts,
            icon: '✨',
            bgColor: 'bg-pink-100',
            textColor: 'text-pink-700'
          })}
          
          {renderSection({
            key: 'shoppingSuggestions',
            title: 'Shopping Suggestions',
            content: sections.shoppingSuggestions,
            icon: '🛍️',
            bgColor: 'bg-green-100',
            textColor: 'text-green-700'
          })}
        </div>
      )}

      <button
        onClick={onReset}
        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold transition mt-6"
      >
        Try Another Date
      </button>
    </div>
  )
} 