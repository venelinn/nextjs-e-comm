# Supabase Auth (GoTrue) with Next.js - Complete Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Next.js Installation & Configuration](#nextjs-installation--configuration)
5. [Authentication Implementation](#authentication-implementation)
6. [OAuth 2.0 Integration](#oauth-20-integration)
7. [Protected Routes](#protected-routes)
8. [Testing Authentication](#testing-authentication)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- Node.js 18.17 or later
- npm or yarn package manager
- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Basic knowledge of React, Next.js, and OAuth 2.0 concepts

---

## Project Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the project details:
   - **Project Name**: Your project name
   - **Database Password**: Strong password (save this!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (2-3 minutes)

### Step 2: Get Your Supabase Credentials

Once your project is ready:

1. Navigate to **Settings** → **API**
2. Copy and save these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: Your public anonymous key
   - **service_role key**: Your service role key (keep this secret!)

---

## Supabase Configuration

### Step 3: Configure Authentication Settings

1. In your Supabase Dashboard, go to **Authentication** → **Settings**
2. Configure **Site URL**: `http://localhost:3000` (for development)
3. Add **Redirect URLs** (for production later):
   ```
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   ```

### Step 4: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. **Email** provider is enabled by default
3. Configure email templates if needed:
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation, invite, and password recovery emails

---

## Next.js Installation & Configuration

### Step 5: Create Next.js App

```bash
npx create-next-app@latest my-supabase-app
cd my-supabase-app
```

When prompted, choose:
- TypeScript: Yes (recommended)
- ESLint: Yes
- Tailwind CSS: Yes (optional)
- App Router: Yes
- Customize default import alias: No

### Step 6: Install Supabase Packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Step 7: Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit your `.env.local` file. Add it to `.gitignore`.

### Step 8: Create Supabase Client Utilities

#### For Client Components

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### For Server Components

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

#### For Middleware

Create `lib/supabase/middleware.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  return supabaseResponse
}
```

---

## Authentication Implementation

### Step 9: Create Authentication Context (Optional but Recommended)

Create `contexts/AuthContext.tsx`:

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Step 10: Update Root Layout

Update `app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Step 11: Create Sign Up Page

Create `app/auth/signup/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setMessage('An account with this email already exists.')
      } else {
        setMessage('Check your email for the confirmation link!')
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm text-center ${message.includes('error') || message.includes('exists') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </div>

          <div className="text-sm text-center">
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
```

### Step 12: Create Login Page

Create `app/auth/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-center text-red-600">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center">
            Don't have an account?{' '}
            <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
```

### Step 13: Create Auth Callback Handler

Create `app/auth/callback/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
```

---

## OAuth 2.0 Integration

### Step 14: Configure OAuth Providers in Supabase

#### Google OAuth Example

1. **Create Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Navigate to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Web application**
   - Add Authorized redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Copy the **Client ID** and **Client Secret**

2. **Configure in Supabase**:
   - Go to **Authentication** → **Providers** → **Google**
   - Toggle **Enable**
   - Paste **Client ID** and **Client Secret**
   - Click **Save**

#### GitHub OAuth Example

1. **Create GitHub OAuth App**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click **New OAuth App**
   - Fill in:
     - **Application name**: Your app name
     - **Homepage URL**: `http://localhost:3000`
     - **Authorization callback URL**: 
       ```
       https://your-project-id.supabase.co/auth/v1/callback
       ```
   - Copy the **Client ID** and generate **Client Secret**

2. **Configure in Supabase**:
   - Go to **Authentication** → **Providers** → **GitHub**
   - Toggle **Enable**
   - Paste **Client ID** and **Client Secret**
   - Click **Save**

### Step 15: Implement OAuth Login in UI

Update your login page to include OAuth buttons:

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Error logging in with Google:', error.message)
  }

  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Error logging in with GitHub:', error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Email/Password form here (from Step 12) */}
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Google
            </button>
            <button
              onClick={handleGithubLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Protected Routes

### Step 16: Create Middleware for Route Protection

Create or update `middleware.ts` in the root:

```typescript
import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Step 17: Create Protected Dashboard

Create `app/dashboard/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Welcome to your Dashboard
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>You are logged in as: {user.email}</p>
              <p className="mt-1">User ID: {user.id}</p>
            </div>
            <div className="mt-5">
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Step 18: Create Sign Out Handler

Create `app/auth/signout/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
  }

  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
```

---

## Testing Authentication

### Step 19: Manual Testing Checklist

#### Test Email/Password Authentication

1. **Sign Up Flow**:
   ```bash
   npm run dev
   ```
   - Navigate to `http://localhost:3000/auth/signup`
   - Enter email and password
   - Submit form
   - Check your email for confirmation link
   - Click confirmation link
   - Verify redirect to dashboard

2. **Sign In Flow**:
   - Navigate to `http://localhost:3000/auth/login`
   - Enter registered email and password
   - Submit form
   - Verify redirect to dashboard
   - Check that user info is displayed

3. **Sign Out Flow**:
   - From dashboard, click "Sign Out"
   - Verify redirect to login page
   - Attempt to access `/dashboard` directly
   - Verify redirect to login page

#### Test OAuth Flows

1. **Google OAuth**:
   - Click "Continue with Google"
   - Complete Google authentication
   - Verify redirect to dashboard
   - Check user email matches Google account

2. **GitHub OAuth**:
   - Click "Continue with GitHub"
   - Complete GitHub authentication
   - Verify redirect to dashboard
   - Check user email matches GitHub account

### Step 20: Create Automated Tests

Create `__tests__/auth.test.ts`:

```typescript
import { createClient } from '@/lib/supabase/client'

describe('Authentication', () => {
  const supabase = createClient()
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'TestPassword123!'

  it('should sign up a new user', async () => {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    })

    expect(error).toBeNull()
    expect(data.user).toBeDefined()
    expect(data.user?.email).toBe(testEmail)
  })

  it('should sign in an existing user', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })

    expect(error).toBeNull()
    expect(data.user).toBeDefined()
    expect(data.session).toBeDefined()
  })

  it('should sign out the user', async () => {
    await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })

    const { error } = await supabase.auth.signOut()
    expect(error).toBeNull()

    const { data: { session } } = await supabase.auth.getSession()
    expect(session).toBeNull()
  })

  it('should reject invalid credentials', async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: 'WrongPassword',
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('Invalid')
  })
})
```

### Step 21: Test with Supabase CLI (Optional)

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link to your project**:
   ```bash
   supabase link --project-ref your-project-id
   ```

4. **Check auth status**:
   ```bash
   supabase db remote status
   ```

---

## Best Practices

### Security Best Practices

1. **Environment Variables**:
   - Never commit `.env.local` to version control
   - Use different keys for development and production
   - Rotate keys periodically

2. **Password Requirements**:
   - Enforce minimum 6 characters (Supabase default)
   - Consider adding complexity requirements
   - Implement password reset functionality

3. **Session Management**:
   - Sessions expire after 1 hour by default
   - Refresh tokens are valid for 60 days
   - Implement automatic token refresh

4. **Rate Limiting**:
   - Supabase has built-in rate limiting
   - Consider additional client-side throttling
   - Monitor auth attempts in dashboard

### Code Organization Best Practices

1. **Separation of Concerns**:
   ```
   /app
     /auth
       /login
       /signup
       /callback
     /dashboard
   /lib
     /supabase
       client.ts
       server.ts
       middleware.ts
   /contexts
     AuthContext.tsx
   /components
     /auth
       LoginForm.tsx
       SignUpForm.tsx
   ```

2. **Error Handling**:
   ```typescript
   try {
     const { error } = await supabase.auth.signIn(...)
     if (error) throw error
   } catch (error) {
     console.error('Auth error:', error)
     // Show user-friendly error message
   }
   ```

3. **Loading States**:
   - Always show loading indicators during auth operations
   - Disable buttons during processing
   - Provide feedback on success/failure

### Performance Best Practices

1. **Client-side Caching**:
   - Use React Query or SWR for session caching
   - Implement optimistic UI updates

2. **Server-side Rendering**:
   - Fetch user data on server when possible
   - Use Next.js server components for protected routes

3. **Code Splitting**:
   - Lazy load authentication components
   - Separate OAuth provider code

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Email Confirmation Not Working

**Problem**: Users don't receive confirmation emails

**Solutions**:
- Check Supabase email settings
- Verify email provider settings
- Check spam folder
- Use custom SMTP in production

#### Issue 2: OAuth Redirect Loop

**Problem**: After OAuth login, redirects indefinitely

**Solutions**:
- Verify redirect URLs in provider settings
- Check callback route implementation
- Ensure middleware is configured correctly
- Clear browser cookies and try again

#### Issue 3: Session Not Persisting

**Problem**: User logged out on page refresh

**Solutions**:
- Check cookie settings in browser
- Verify middleware is running
- Check for third-party cookie blocking
- Ensure `@supabase/ssr` is properly configured

#### Issue 4: "Invalid Refresh Token" Error

**Problem**: Users get logged out with refresh token error

**Solutions**:
```typescript
// Add refresh logic in AuthContext
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed')
      }
      if (event === 'SIGNED_OUT') {
        // Handle sign out
      }
    }
  )
  return () => subscription.unsubscribe()
}, [])
```

#### Issue 5: CORS Errors

**Problem**: CORS errors during authentication

**Solutions**:
- Add your domain to Supabase redirect URLs
- Check that Site URL is set correctly
- Verify API endpoint configuration

### Debug Mode

Enable debug mode to see detailed logs:

```typescript
// In your client.ts
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      debug: true, // Enable auth debug logs
    },
  }
)
```

### Logging Best Practices

```typescript
// Create a logging utility
export function logAuthEvent(event: string, details?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUTH] ${event}`, details)
  }
}

// Use in your code
logAuthEvent('Sign up attempt', { email: user.email })
```

---

## Additional Resources

### Official Documentation
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Documentation](https://nextjs.org/docs)
- [OAuth 2.0 Specification](https://oauth.net/2/)

### Example Projects
- [Supabase Next.js Example](https://github.com/supabase/examples/tree/main/nextjs)
- [Supabase Auth Helpers](https://github.com/supabase/auth-helpers)

### Support
- [Supabase Discord](https://discord.supabase.com/)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

---

## Conclusion

You now have a fully functional authentication system with:
- Email/password authentication
- OAuth 2.0 integration (Google, GitHub)
- Protected routes
- Session management
- Comprehensive testing strategy

Remember to:
- Keep your environment variables secure
- Regularly update dependencies
- Monitor authentication metrics in Supabase dashboard
- Implement proper error handling and user feedback
- Test thoroughly before deploying to production

Happy coding!