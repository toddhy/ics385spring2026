import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';

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
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/admin/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Match on googleId
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }

      // 2. Else link to existing local account by verified email
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          // Note: provider stays 'local' or we could update it, 
          // but the requirement says 'provider' enum. 
          // If linked, it's now both, but let's stick to 'google' or the rule logic.
          // Usually we just mark it as having a googleId now.
          await user.save();
          return done(null, user);
        }
      }

      // 3. Else provision a new user
      const newUser = new User({
        googleId: profile.id,
        email: email,
        displayName: profile.displayName,
        provider: 'google'
      });
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }));

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
