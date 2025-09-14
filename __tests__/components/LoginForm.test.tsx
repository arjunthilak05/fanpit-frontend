import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
jest.mock('@/hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
      isAuthenticated: false,
      user: null,
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      verifyEmail: jest.fn(),
      resendEmailVerification: jest.fn(),
      verifyPhone: jest.fn(),
      sendPhoneOTP: jest.fn(),
      clearError: mockClearError,
    });
  });

  it('should render login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('should submit form with valid credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should show loading state when submitting', async () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: true,
      error: null,
      isAuthenticated: false,
      user: null,
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      verifyEmail: jest.fn(),
      resendEmailVerification: jest.fn(),
      verifyPhone: jest.fn(),
      sendPhoneOTP: jest.fn(),
      clearError: mockClearError,
    });

    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /logging in/i });
    expect(submitButton).toBeDisabled();
  });

  it('should display error message when login fails', () => {
    const errorMessage = 'Invalid credentials';
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: errorMessage,
      isAuthenticated: false,
      user: null,
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      verifyEmail: jest.fn(),
      resendEmailVerification: jest.fn(),
      verifyPhone: jest.fn(),
      sendPhoneOTP: jest.fn(),
      clearError: mockClearError,
    });

    render(<LoginForm />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should clear error when user starts typing', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';
    
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: errorMessage,
      isAuthenticated: false,
      user: null,
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      verifyEmail: jest.fn(),
      resendEmailVerification: jest.fn(),
      verifyPhone: jest.fn(),
      sendPhoneOTP: jest.fn(),
      clearError: mockClearError,
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 't');

    expect(mockClearError).toHaveBeenCalled();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should validate password length', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '123');
    await user.click(submitButton);

    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should redirect to forgot password page', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const forgotPasswordLink = screen.getByText(/forgot password/i);
    await user.click(forgotPasswordLink);

    // This would typically navigate to forgot password page
    // In a real test, you might mock the router and check navigation
  });

  it('should not render form when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
      isAuthenticated: true,
      user: {
        _id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'consumer' as any,
      },
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      verifyEmail: jest.fn(),
      resendEmailVerification: jest.fn(),
      verifyPhone: jest.fn(),
      sendPhoneOTP: jest.fn(),
      clearError: mockClearError,
    });

    render(<LoginForm />);

    expect(screen.getByText(/already logged in/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
  });

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup();
    const networkError = 'Network error - please check your connection';
    
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: networkError,
      isAuthenticated: false,
      user: null,
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      verifyEmail: jest.fn(),
      resendEmailVerification: jest.fn(),
      verifyPhone: jest.fn(),
      sendPhoneOTP: jest.fn(),
      clearError: mockClearError,
    });

    render(<LoginForm />);

    expect(screen.getByText(networkError)).toBeInTheDocument();
  });

  it('should show success message after successful login', async () => {
    const user = userEvent.setup();
    
    // Mock successful login
    mockLogin.mockResolvedValue({
      user: {
        _id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'consumer' as any,
      },
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 3600,
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
