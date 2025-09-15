"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Image as ImageIcon, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  onDelete?: (index: number) => Promise<void>
  existingFiles?: string[]
  maxFiles?: number
  maxFileSize?: number // in MB
  accept?: string
  className?: string
  disabled?: boolean
  label?: string
  description?: string
}

interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

export function FileUpload({
  onUpload,
  onDelete,
  existingFiles = [],
  maxFiles = 10,
  maxFileSize = 5,
  accept = "image/*",
  className,
  disabled = false,
  label = "Upload Files",
  description = "Drag and drop files here or click to browse"
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingFiles)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [disabled])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }, [disabled])

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    const totalFiles = previewUrls.length + validFiles.length
    if (totalFiles > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`)
      return
    }

    // Create preview URLs for valid files
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])

    // Start upload process
    const uploadProgress: UploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }))

    setUploads(uploadProgress)

    try {
      await onUpload(validFiles)

      // Update upload status to completed
      setUploads(prev =>
        prev.map(upload => ({
          ...upload,
          progress: 100,
          status: 'completed'
        }))
      )

      // Clear uploads after successful completion
      setTimeout(() => {
        setUploads([])
      }, 2000)

    } catch (error) {
      // Update upload status to error
      setUploads(prev =>
        prev.map(upload => ({
          ...upload,
          progress: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        }))
      )
    }
  }

  const handleDelete = async (index: number) => {
    try {
      if (onDelete) {
        await onDelete(index)
      }

      // Remove from preview URLs
      const newPreviewUrls = [...previewUrls]
      const deletedUrl = newPreviewUrls.splice(index, 1)[0]

      // Revoke object URL if it was created for preview
      if (deletedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(deletedUrl)
      }

      setPreviewUrls(newPreviewUrls)
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const totalFiles = previewUrls.length
  const canUploadMore = totalFiles < maxFiles

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-sm font-medium">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">
          Max {maxFiles} files, {maxFileSize}MB each
        </p>
      </div>

      {/* Upload Area */}
      {canUploadMore && (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            dragActive && "border-primary bg-primary/5",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">{label}</p>
            <p className="text-xs text-muted-foreground text-center">
              {accept === "image/*" ? "PNG, JPG, GIF up to" : "Files up to"} {maxFileSize}MB
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              disabled={disabled}
            >
              Choose Files
            </Button>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploading...</h4>
          {uploads.map((upload, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                {upload.status === 'uploading' && (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
                {upload.status === 'completed' && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
                {upload.status === 'error' && (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{upload.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {upload.error && (
                  <p className="text-xs text-red-500">{upload.error}</p>
                )}
              </div>
              {upload.status === 'uploading' && (
                <div className="flex-1 max-w-24">
                  <Progress value={upload.progress} className="h-2" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* File Previews */}
      {previewUrls.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Files ({totalFiles}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  {url.includes('placeholder') || url.includes('blob:') ? (
                    <Image
                      src={url}
                      alt={`File ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(index)}
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </Button>
                <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                  {index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
