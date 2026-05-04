# Google Authentication Setup - User & Admin Login

## Overview
Both admin and user (guest) authentication now support Google OAuth 2.0 login, in addition to local email/password authentication.

## Setup Instructions

### 1. Google OAuth Configuration
You need to register **two redirect URIs** in your Google OAuth application:

#### For Admin Login:
```
http://localhost:3000/admin/auth/google/callback
```

#### For User/Guest Login:
```
http://localhost:3000/auth/google/callback
```

**Production URLs:**
Replace `localhost:3000` with your deployed domain:
```
https://yourdomain.com/admin/auth/google/callback
https://yourdomain.com/auth/google/callback
```

### 2. Environment Variables
Both callback URLs are already configured in `.env`:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/admin/auth/google/callback
```

**Note:** The `GOOGLE_CALLBACK_URL` is primarily used by the admin route. The user route uses `/auth/google/callback` which should also be registered in Google Console.

## Usage

### Admin Login (Admin Portal)
- Go to: `http://localhost:3000/admin/login`
- Click **"Sign in with Google"** button
- Authenticate with Google
- Redirects to admin dashboard on success

### User/Guest Login (Booking)
- Go to: `http://localhost:3000/login` 
- Click **"Sign in with Google"** button
- Authenticate with Google
- Redirects to booking calendar on success

### User Registration
- Go to: `http://localhost:3000/register`
- Click **"Sign up with Google"** button
- Complete Google authentication
- New user account created with `role: 'user'`

## How It Works

### Authentication Flow
1. User clicks "Sign in/up with Google" button
2. Redirected to Google OAuth login/consent screen
3. Google redirects back to the appropriate callback URL
4. Passport authenticates and finds or creates user:
   - **Existing Google ID:** Logs in existing user
   - **Matching Email:** Links Google ID to existing local account
   - **New User:** Creates new account with `role: 'user'` or `role: 'admin'` (based on route)

### User Roles
- **Admin users** maintain `role: 'admin'` (created via seed script)
- **New Google users** get `role: 'user'` by default
- **Email linking:** If an admin uses Google auth with their email, they keep admin role

### Provider Types
Users can authenticate via:
- `provider: 'local'` - Email/password accounts
- `provider: 'google'` - Google OAuth accounts

## Routes

### Admin Authentication Routes
- `GET /admin/login` - Admin login page
- `GET /admin/register` - Admin registration page
- `POST /admin/register` - Create admin account
- `POST /admin/login` - Login with email/password
- `GET /admin/auth/google` - Initiate Google auth
- `GET /admin/auth/google/callback` - Google OAuth callback

### User/Guest Authentication Routes
- `GET /login` - User login page
- `GET /register` - User registration page
- `POST /register` - Create user account
- `POST /login` - Login with email/password
- `GET /auth/google` - Initiate Google auth (NEW)
- `GET /auth/google/callback` - Google OAuth callback (NEW)
- `GET /logout` - Logout (both GET and POST)

## Database User Schema

```javascript
{
  email: String,                    // Required, unique
  password: String,                 // Required for local provider only
  displayName: String,              // From Google profile
  googleId: String,                 // Google ID for linking
  provider: 'local' | 'google',     // Authentication method
  role: 'user' | 'admin',           // User role
  timestamps: Boolean               // Created/updated dates
}
```

## Troubleshooting

### Google Auth Not Working
1. Verify both callback URLs are registered in Google OAuth Console
2. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct in `.env`
3. Ensure callback URLs match exactly (including domain and path)

### Wrong Redirect After Login
- Admin users should redirect to `/admin/dashboard`
- Guest users should redirect to `/` (booking calendar)
- If redirecting to wrong place, check the route handler

### Duplicate Accounts
- If user has both local and Google accounts with same email
- They can link by authenticating with Google using that email
- The Google ID will be attached to the existing account

## Example: Creating Test Admin with Google

If you want an existing admin to use Google auth:
1. Run `npm run seed-admin` (creates local admin account)
2. Admin goes to `/admin/login`
3. Clicks "Sign in with Google" and authenticates
4. Google ID is linked to their admin account
5. They can now use either local or Google auth

## Security Notes

- Google OAuth credentials are stored server-side only
- Session tokens are HTTP-only cookies
- Passwords are bcrypt-hashed (local provider only)
- User roles prevent unauthorized access
- CORS and CSP headers protect the application
