# Frontend API Integration Migration Guide

This guide provides step-by-step instructions for migrating your Next.js frontend from local API routes to the NestJS backend integration.

## Overview

The migration involves:
1. ✅ **Completed**: Updated TypeScript interfaces to match backend schemas
2. ✅ **Completed**: Created centralized API client with JWT management
3. ✅ **Completed**: Updated authentication system to use NestJS backend
4. ✅ **Completed**: Created comprehensive API service files for all modules
5. ✅ **Completed**: Added error handling and loading states
6. ✅ **Completed**: Configured environment variables
7. 🔄 **In Progress**: Update components to use real API calls
8. ⏳ **Pending**: Remove existing Next.js API routes
9. ⏳ **Pending**: Create API integration tests

## Migration Steps

### Phase 1: Environment Setup ✅

1. **Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Update with your actual values
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_RHCtm0tnz9yjuE
   ```

2. **Configuration**
   - ✅ Created `lib/config.ts` with centralized configuration
   - ✅ Environment-specific settings
   - ✅ Feature flags and validation rules

### Phase 2: API Client & Services ✅

1. **API Client** (`lib/api/client.ts`)
   - ✅ Axios-based client with interceptors
   - ✅ Automatic JWT token management
   - ✅ Request/response interceptors
   - ✅ Error handling and retry logic
   - ✅ Token refresh mechanism

2. **Service Classes**
   - ✅ `AuthService` - Authentication operations
   - ✅ `SpacesService` - Space management
   - ✅ `BookingsService` - Booking operations
   - ✅ `PaymentsService` - Payment processing
   - ✅ `StaffService` - Staff operations
   - ✅ `PromoCodesService` - Promo code management

### Phase 3: TypeScript Interfaces ✅

1. **Updated Types** (`types/api.ts`)
   - ✅ User, Space, Booking interfaces
   - ✅ Payment, Staff activity types
   - ✅ API response wrappers
   - ✅ Error response types
   - ✅ Form request interfaces

### Phase 4: Authentication System ✅

1. **Enhanced useAuth Hook** (`hooks/useAuth.ts`)
   - ✅ JWT token management
   - ✅ Automatic token refresh
   - ✅ Role-based permissions
   - ✅ Error handling
   - ✅ Session management

2. **Auth Service Integration**
   - ✅ Login/register with backend
   - ✅ Password reset functionality
   - ✅ Email/phone verification
   - ✅ Two-factor authentication support

### Phase 5: Error Handling ✅

1. **Error Boundary** (`components/ErrorBoundary.tsx`)
   - ✅ Comprehensive error catching
   - ✅ Different error levels (page, component, critical)
   - ✅ Error logging and reporting
   - ✅ User-friendly error messages
   - ✅ Retry mechanisms

2. **Error Handling Patterns**
   - ✅ Service-level error handling
   - ✅ Component error boundaries
   - ✅ Global error logging

### Phase 6: Component Updates 🔄

**Next Steps for Component Migration:**

1. **Authentication Components**
   ```typescript
   // Update: components/auth/LoginForm.tsx
   import { useAuth } from '@/hooks/useAuth';
   
   const { login, loading, error } = useAuth();
   
   const handleSubmit = async (data) => {
     try {
       await login(data.email, data.password);
     } catch (error) {
       // Error is handled by useAuth hook
     }
   };
   ```

2. **Space Components**
   ```typescript
   // Update: components/spaces/SpaceList.tsx
   import { SpacesService } from '@/lib/api/spaces';
   
   const [spaces, setSpaces] = useState([]);
   const [loading, setLoading] = useState(true);
   
   useEffect(() => {
     const fetchSpaces = async () => {
       try {
         const response = await SpacesService.getSpaces();
         setSpaces(response.data);
       } catch (error) {
         // Handle error
       } finally {
         setLoading(false);
       }
     };
     
     fetchSpaces();
   }, []);
   ```

3. **Booking Components**
   ```typescript
   // Update: components/booking/BookingForm.tsx
   import { BookingsService } from '@/lib/api/bookings';
   
   const createBooking = async (bookingData) => {
     try {
       const booking = await BookingsService.createBooking(bookingData);
       // Handle success
     } catch (error) {
       // Handle error
     }
   };
   ```

### Phase 7: Remove API Routes ⏳

**To be completed after component updates:**

1. **Remove Next.js API Routes**
   ```bash
   # Remove the entire API directory
   rm -rf app/api/
   ```

2. **Update Imports**
   - Replace all imports from `@/app/api/*` with service imports
   - Update fetch calls to use service methods

### Phase 8: Testing ⏳

**Create comprehensive tests:**

1. **API Integration Tests**
   ```typescript
   // __tests__/api/auth.test.ts
   import { AuthService } from '@/lib/api/auth';
   
   describe('AuthService', () => {
     it('should login successfully', async () => {
       const result = await AuthService.login({
         email: 'test@example.com',
         password: 'password123'
       });
       
       expect(result.user).toBeDefined();
       expect(result.accessToken).toBeDefined();
     });
   });
   ```

2. **Component Tests**
   ```typescript
   // __tests__/components/LoginForm.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { LoginForm } from '@/components/auth/LoginForm';
   
   describe('LoginForm', () => {
     it('should submit login form', async () => {
       render(<LoginForm />);
       
       fireEvent.change(screen.getByLabelText('Email'), {
         target: { value: 'test@example.com' }
       });
       
       fireEvent.click(screen.getByRole('button', { name: 'Login' }));
       
       // Assert expected behavior
     });
   });
   ```

## Key Changes Made

### 1. API Client Architecture
- **Before**: Direct fetch calls to local API routes
- **After**: Centralized API client with interceptors and error handling

### 2. Authentication Flow
- **Before**: Mock authentication with localStorage
- **After**: JWT-based authentication with automatic token refresh

### 3. Error Handling
- **Before**: Basic try-catch blocks
- **After**: Comprehensive error boundaries and service-level error handling

### 4. Type Safety
- **Before**: Basic TypeScript interfaces
- **After**: Complete type definitions matching backend schemas

### 5. State Management
- **Before**: Local component state
- **After**: Centralized hooks with proper error and loading states

## Usage Examples

### Authentication
```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { login, loading, error, isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <div>Already logged in</div>;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Data Fetching
```typescript
import { SpacesService } from '@/lib/api/spaces';
import { useState, useEffect } from 'react';

function SpacesList() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await SpacesService.getSpaces();
        setSpaces(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpaces();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {spaces.map(space => (
        <div key={space._id}>{space.name}</div>
      ))}
    </div>
  );
}
```

### Error Handling
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary level="page">
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Environment Configuration

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_DEBUG_MODE=false
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for frontend domain
   - Check API URL configuration

2. **Authentication Issues**
   - Verify JWT token format
   - Check token refresh logic
   - Ensure proper error handling

3. **Type Errors**
   - Update component props to match new interfaces
   - Check import paths for updated services

4. **Network Errors**
   - Verify API client configuration
   - Check retry logic and timeout settings

### Debug Mode

Enable debug mode for detailed logging:
```env
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

## Next Steps

1. **Complete Component Updates**: Update all components to use new API services
2. **Remove API Routes**: Delete Next.js API routes after migration
3. **Add Tests**: Create comprehensive test suite
4. **Performance Optimization**: Add caching and optimization
5. **Monitoring**: Set up error tracking and analytics

## Support

For issues or questions:
1. Check the error logs in browser console
2. Verify API client configuration
3. Test API endpoints directly
4. Review component error boundaries

## Migration Checklist

- [x] Update TypeScript interfaces
- [x] Create API client and services
- [x] Update authentication system
- [x] Add error handling
- [x] Configure environment variables
- [ ] Update all components
- [ ] Remove API routes
- [ ] Create tests
- [ ] Performance testing
- [ ] Production deployment
