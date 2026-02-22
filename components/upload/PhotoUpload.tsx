'use client'

import { useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { UploadedFile } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface PhotoUploadProps {
  files: UploadedFile[]
  onChange: (files: UploadedFile[]) => void
  fileType: 'photo' | 'floorplan'
  maxFiles?: number
  title: string
  description: string
}

export default function PhotoUpload({
  files,
  onChange,
  fileType,
  maxFiles = 10,
  title,
  description,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: UploadedFile[] = []
      const remaining = maxFiles - files.length

      Array.from(fileList)
        .slice(0, remaining)
        .forEach(file => {
          if (!file.type.startsWith('image/') && !file.type.includes('pdf')) return
          const previewUrl = URL.createObjectURL(file)
          newFiles.push({
            id: uuidv4(),
            url: previewUrl,
            previewUrl,
            fileName: file.name,
            fileType,
            file,
          })
        })

      onChange([...files, ...newFiles])
    },
    [files, onChange, maxFiles, fileType]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleRemove = useCallback(
    (id: string) => {
      onChange(files.filter(f => f.id !== id))
    },
    [files, onChange]
  )

  const handleLabelChange = useCallback(
    (id: string, label: string) => {
      onChange(files.map(f => (f.id === id ? { ...f, label } : f)))
    },
    [files, onChange]
  )

  return (
    <div>
      <h3 className="font-serif text-lg sm:text-xl text-text-dark mb-1">{title}</h3>
      <p className="text-sm text-text-muted mb-4">{description}</p>

      {files.length < maxFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border-dark rounded-xl p-8 sm:p-12
                     text-center cursor-pointer hover:border-brand-green/50 hover:bg-sage-100/50
                     transition-all duration-300 group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-sage-200 flex items-center justify-center
                          group-hover:bg-brand-green/10 transition-colors">
              <svg className="w-6 h-6 text-text-muted group-hover:text-brand-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-dark">
                Drop {fileType === 'photo' ? 'photos' : 'files'} here or click to browse
              </p>
              <p className="text-xs text-text-muted mt-1">
                {files.length}/{maxFiles} uploaded · JPG, PNG, WebP{fileType === 'floorplan' ? ', PDF' : ''}
              </p>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={fileType === 'floorplan' ? 'image/*,.pdf' : 'image/*'}
            multiple
            className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4"
          >
            {files.map(file => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group rounded-lg overflow-hidden aspect-square bg-sage-100"
              >
                <Image
                  src={file.previewUrl}
                  alt={file.label || file.fileName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                <button
                  onClick={() => handleRemove(file.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-red-500
                           rounded-full flex items-center justify-center opacity-0
                           group-hover:opacity-100 transition-all"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50">
                  <input
                    type="text"
                    placeholder="Add label..."
                    value={file.label || ''}
                    onChange={e => handleLabelChange(file.id, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="w-full text-xs text-white bg-transparent border-none
                             placeholder-white/60 focus:outline-none focus:ring-0"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
