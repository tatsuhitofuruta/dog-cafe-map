// Environment variable validation

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return value
}

export const env = {
  // Database
  DATABASE_URL: getEnvVar('DATABASE_URL'),

  // NextAuth
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),

  // Node Environment
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),

  // Runtime checks
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
} as const

// Validate all required environment variables at startup
export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file.`
    )
  }
}

// Only validate in server environment
if (typeof window === 'undefined') {
  try {
    validateEnv()
  } catch (error) {
    console.error('Environment validation failed:', error)
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
}
