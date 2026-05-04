import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';

function deriveCallbackUrl(baseUrl, fallbackPath) {
  if (!baseUrl) {
    return `http://localhost:3000${fallbackPath}`;
  }

  if (baseUrl.includes('/admin/auth/google/callback')) {
    return baseUrl.replace('/admin/auth/google/callback', fallbackPath);
  }

  return baseUrl;
}

const ADMIN_GOOGLE_CALLBACK_URL = process.env.GOOGLE_ADMIN_CALLBACK_URL || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/admin/auth/google/callback';
const USER_GOOGLE_CALLBACK_URL = process.env.GOOGLE_USER_CALLBACK_URL || deriveCallbackUrl(process.env.GOOGLE_CALLBACK_URL, '/auth/google/callback');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      if (user.provider !== 'local') {
        return done(null, false, { message: 'Please sign in with Google' });
      }

      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  // Google Strategy
  const handleGoogleProfile = async (profile, done, expectedRole = null) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        if (expectedRole && user.role !== expectedRole) {
          return done(null, false, { message: 'Please sign in through the correct portal.' });
        }
        return done(null, user);
      }

      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          if (expectedRole && user.role !== expectedRole) {
            return done(null, false, { message: 'Please sign in through the correct portal.' });
          }
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }
      }

      const newUser = new User({
        googleId: profile.id,
        email,
        displayName: profile.displayName,
        provider: 'google',
        role: expectedRole || 'user'
      });
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  };

  passport.use('admin-google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: ADMIN_GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => handleGoogleProfile(profile, done, 'admin')));

  passport.use('user-google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: USER_GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => handleGoogleProfile(profile, done, 'user')));

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  });
}

export default initialize;
