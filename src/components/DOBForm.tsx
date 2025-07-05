"use client"

import { useState } from 'react'
import { z } from 'zod'

const dobSchema = z.object({
  dob: z.string().min(1, 'Date of birth is required'),
  lang: z.enum(['vi', 'en']).default('vi')
})

type DOBFormData = z.infer<typeof dobSchema>

interface DOBFormProps {
  onSubmit: ({ data }: { data: DOBFormData }) => Promise<void>
  isLoading?: boolean
  className?: string
}

export function DOBForm({ onSubmit, isLoading = false, className = "" }: DOBFormProps) {
  const [formData, setFormData] = useState<DOBFormData>({
    dob: '',
    lang: 'vi'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = ({ name, value }: { name: string; value: string }) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    try {
      dobSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit({ data: formData })
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ submit: 'Failed to submit form' })
    }
  }

  const maxDate = new Date().toISOString().slice(0, 10)

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="dob" className="block text-gray-700 font-semibold mb-2 text-lg">
            Enter Your Birth Date:
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={({ target }) => handleInputChange({ 
              name: target.name, 
              value: target.value 
            })}
            max={maxDate}
            required
            pattern="\\d{4}-\\d{2}-\\d{2}"
            inputMode="none"
            onKeyDown={event => event.preventDefault()}
            className={`w-full p-2 border rounded pl-10 text-lg ${
              errors.dob ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-describedby={errors.dob ? "dob-error" : undefined}
          />
          {errors.dob && (
            <p id="dob-error" className="text-sm text-red-500">
              {errors.dob}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lang" className="block text-gray-700 font-semibold mb-2">
            Language:
          </label>
          <select
            id="lang"
            name="lang"
            value={formData.lang}
            onChange={({ target }) => handleInputChange({ 
              name: target.name, 
              value: target.value 
            })}
            className="w-full p-2 border border-gray-300 rounded text-lg"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Get My Insights'}
        </button>

        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        )}
      </form>
    </div>
  )
} 