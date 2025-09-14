import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'

// Mock fetch
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

describe('useAuth', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'consumer',
  }

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Reset localStorage mocks
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})

    // Reset fetch mock
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockUser }),
      } as Response)
    )
  })

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should check auth status on mount', async () => {
    localStorageMock.getItem.mockReturnValue(mockTokens.accessToken)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle login successfully', async () => {
    const mockRouter = { push: jest.fn() }
    jest.mock('next/navigation', () => ({
      useRouter: () => mockRouter,
    }))

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: {
          ...mockUser,
          ...mockTokens,
        },
      }),
    } as Response)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', mockTokens.accessToken)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', mockTokens.refreshToken)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle login failure', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid credentials' }),
    } as Response)

    const { result } = renderHook(() => useAuth())

    await expect(
      act(async () => {
        await result.current.login('test@example.com', 'wrongpassword')
      })
    ).rejects.toThrow('Invalid credentials')

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should handle registration successfully', async () => {
    const mockRouter = { push: jest.fn() }
    jest.mock('next/navigation', () => ({
      useRouter: () => mockRouter,
    }))

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: {
          ...mockUser,
          ...mockTokens,
        },
      }),
    } as Response)

    const { result } = renderHook(() => useAuth())

    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'consumer' as const,
    }

    await act(async () => {
      await result.current.register(registerData)
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', mockTokens.accessToken)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', mockTokens.refreshToken)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle logout', async () => {
    // Set up authenticated state
    localStorageMock.getItem.mockReturnValue(mockTokens.accessToken)
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockUser }),
    } as Response)

    const mockRouter = { push: jest.fn() }
    jest.mock('next/navigation', () => ({
      useRouter: () => mockRouter,
    }))

    const { result } = renderHook(() => useAuth())

    // Wait for initial auth check
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    // Perform logout
    await act(async () => {
      await result.current.logout()
    })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken')
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should handle token refresh', async () => {
    const newTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: newTokens,
      }),
    } as Response)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.refreshToken()
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', newTokens.accessToken)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', newTokens.refreshToken)
  })

  it('should handle profile update', async () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: updatedUser }),
    } as Response)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.updateProfile({ name: 'Updated Name' })
    })

    expect(result.current.user).toEqual(updatedUser)
  })

  it('should handle forgot password', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Reset email sent' }),
    } as Response)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.forgotPassword('test@example.com')
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/forgot-password'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    )
  })

  it('should handle password reset', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Password reset successful' }),
    } as Response)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.resetPassword('token123', 'newpassword123')
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/reset-password'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ token: 'token123', newPassword: 'newpassword123' }),
      })
    )
  })

  it('should handle network errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await expect(result.current.login('test@example.com', 'password')).rejects.toThrow('Network error')
    })

    expect(consoleSpy).toHaveBeenCalled()
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)

    consoleSpy.mockRestore()
  })
})
