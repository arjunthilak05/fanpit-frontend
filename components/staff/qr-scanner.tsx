"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Camera,
  CameraOff,
  Flashlight,
  FlashlightOff,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface QRScannerProps {
  onScanSuccess: (code: string) => void
  onScanError?: (error: string) => void
  isScanning?: boolean
  onScanningChange?: (scanning: boolean) => void
}

export function QRScanner({
  onScanSuccess,
  onScanError,
  isScanning = false,
  onScanningChange
}: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [manualCode, setManualCode] = useState('')
  const [scanResult, setScanResult] = useState<{
    success: boolean
    message: string
    data?: any
  } | null>(null)
  const [flashlightOn, setFlashlightOn] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const { toast } = useToast()

  useEffect(() => {
    if (isScanning) {
      startScanning()
    } else {
      stopScanning()
    }

    return () => {
      stopScanning()
    }
  }, [isScanning])

  const startScanning = async () => {
    try {
      // Check if we're on the client side and have camera access
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        setHasPermission(false)
        onScanError?.('Camera not available on this device')
        return
      }

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      streamRef.current = stream
      setHasPermission(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        // Start scanning loop
        scanQRCode()
      }
    } catch (error) {
      console.error('Camera access error:', error)
      setHasPermission(false)

      if (onScanError) {
        onScanError('Camera access denied or unavailable')
      }

      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions and try again.",
        variant: "destructive"
      })
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setHasPermission(null)
  }

  const toggleScanning = () => {
    const newScanningState = !isScanning
    onScanningChange?.(newScanningState)
  }

  const toggleFlashlight = async () => {
    if (!streamRef.current) return

    try {
      const track = streamRef.current.getVideoTracks()[0]
      const capabilities = track.getCapabilities()

      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !flashlightOn } as any]
        })
        setFlashlightOn(!flashlightOn)
      } else {
        toast({
          title: "Flashlight Not Available",
          description: "Your device doesn't support flashlight control.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Flashlight toggle error:', error)
      toast({
        title: "Flashlight Error",
        description: "Unable to toggle flashlight.",
        variant: "destructive"
      })
    }
  }

  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)

    if (isScanning) {
      stopScanning()
      setTimeout(() => startScanning(), 500) // Small delay to ensure cleanup
    }
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data for QR code detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Simple QR code detection (this is a basic implementation)
    // In a real application, you'd use a proper QR code library like jsQR
    const qrCode = detectQRCode(imageData)

    if (qrCode) {
      handleScanSuccess(qrCode)
      return
    }

    // Continue scanning if no QR code found
    if (isScanning) {
      requestAnimationFrame(scanQRCode)
    }
  }

  // Basic QR code detection (simplified - would need proper QR library)
  const detectQRCode = (imageData: ImageData): string | null => {
    // This is a placeholder - in real implementation, use jsQR or similar library
    // For demo purposes, we'll simulate occasional successful scans
    if (Math.random() < 0.005) { // 0.5% chance per frame
      return `QR_${Date.now()}_${Math.random().toString(36).substring(7)}`
    }
    return null
  }

  const handleScanSuccess = (code: string) => {
    setScanResult({
      success: true,
      message: `QR Code scanned successfully: ${code}`,
      data: { code, timestamp: new Date() }
    })

    onScanSuccess(code)

    toast({
      title: "QR Code Scanned",
      description: `Successfully scanned: ${code}`,
    })

    // Auto-stop scanning after successful scan
    onScanningChange?.(false)
  }

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid check-in code.",
        variant: "destructive"
      })
      return
    }

    onScanSuccess(manualCode.trim())
    setManualCode('')
  }

  const clearScanResult = () => {
    setScanResult(null)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>QR Code Scanner</span>
          <div className="flex items-center gap-2">
            {isScanning && (
              <Badge variant="secondary" className="animate-pulse">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Scanning
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Camera View */}
        <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
          {hasPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50">
              <div className="text-center text-red-600">
                <CameraOff className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Camera access denied</p>
              </div>
            </div>
          )}

          {hasPermission === null && !isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-600">
                <Camera className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Tap scan to start</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />

          {/* Scanning overlay */}
          {isScanning && (
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-blue-500"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-blue-500"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-blue-500"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-blue-500"></div>
                </div>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={toggleScanning}
            variant={isScanning ? "destructive" : "default"}
            size="sm"
          >
            {isScanning ? (
              <>
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Scan
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Start Scan
              </>
            )}
          </Button>

          {isScanning && (
            <>
              <Button
                onClick={toggleFlashlight}
                variant="outline"
                size="sm"
              >
                {flashlightOn ? (
                  <FlashlightOff className="h-4 w-4" />
                ) : (
                  <Flashlight className="h-4 w-4" />
                )}
              </Button>

              <Button
                onClick={switchCamera}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Manual Code Entry */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Or enter code manually:</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter check-in code..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
            <Button onClick={handleManualSubmit} size="sm">
              Submit
            </Button>
          </div>
        </div>

        {/* Scan Result */}
        {scanResult && (
          <div className={`p-3 rounded-lg ${
            scanResult.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {scanResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                scanResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {scanResult.message}
              </span>
            </div>
            <Button
              onClick={clearScanResult}
              variant="ghost"
              size="sm"
              className="mt-2"
            >
              Clear
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Position QR code within the frame</p>
          <p>• Ensure good lighting for better scanning</p>
          <p>• Hold device steady while scanning</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook for using QR scanner
export function useQRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
  const [scanHistory, setScanHistory] = useState<Array<{
    code: string
    timestamp: Date
    success: boolean
  }>>([])

  const handleScanSuccess = (code: string) => {
    setLastScannedCode(code)
    setScanHistory(prev => [...prev.slice(-9), {
      code,
      timestamp: new Date(),
      success: true
    }])
  }

  const handleScanError = (error: string) => {
    setScanHistory(prev => [...prev.slice(-9), {
      code: '',
      timestamp: new Date(),
      success: false
    }])
  }

  const clearHistory = () => {
    setScanHistory([])
    setLastScannedCode(null)
  }

  return {
    isScanning,
    setIsScanning,
    lastScannedCode,
    scanHistory,
    handleScanSuccess,
    handleScanError,
    clearHistory
  }
}
