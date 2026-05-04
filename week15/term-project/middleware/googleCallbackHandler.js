import User from '../models/User.js';

export default function createGoogleCallbackHandler(redirectOnSuccess) {
  return (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
      // Mocked behavior for tests to bypass real Google OAuth redirect
      const { googleId = 'test-google-id', email = 'google-user@example.com', displayName = 'Google Test User' } = req.query;
      
      handleGoogleUser(googleId, email, displayName)
        .then(user => {
          req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect(redirectOnSuccess);
          });
        })
        .catch(err => next(err));
      return;
    }

    import('passport').then(module => {
      const passport = module.default;
      passport.authenticate('google', async (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.redirect(`${redirectOnSuccess.replace('/dashboard', '/login').replace('/', '/login')}?error=Google authentication failed.`);
        }
        
        req.logIn(user, (err) => {
          if (err) return next(err);
          return res.redirect(redirectOnSuccess);
        });
      })(req, res, next);
    });
  };
}

async function handleGoogleUser(googleId, email, displayName, defaultRole = 'user') {
  try {
    // 1. Match on googleId
    let user = await User.findOne({ googleId });
    if (user) {
      return user;
    }

    // 2. Else link to existing local account by verified email
    if (email) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        await user.save();
        return user;
      }
    }

    // 3. Else provision a new user with the specified role
    const newUser = new User({
      googleId,
      email,
      displayName,
      provider: 'google',
      role: defaultRole
    });
    await newUser.save();
    return newUser;
  } catch (err) {
    throw err;
  }
}
