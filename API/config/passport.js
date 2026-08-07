const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Reusable function to handle OAuth login
const handleOAuthLogin = async (provider, profile, done) => {
  try {
    // Check if user already exists based on provider ID
    let user = await User.findOne({ providerId: profile.id, provider });

    if (user) {
      return done(null, user);
    }

    // Try finding by email if available to avoid duplicates
    let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    
    if (email) {
      let existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        // Link account
        existingEmailUser.provider = provider;
        existingEmailUser.providerId = profile.id;
        if (!existingEmailUser.name && profile.displayName) existingEmailUser.name = profile.displayName;
        await existingEmailUser.save();
        return done(null, existingEmailUser);
      }
    }

    // Create new user
    const newUser = await User.create({
      provider,
      providerId: profile.id,
      email: email || `${provider}_${profile.id}@noemail.com`,
      name: profile.displayName || profile.username || 'Unknown Operator',
      avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
      role: 'Security Analyst' // Default role
    });

    done(null, newUser);
  } catch (error) {
    console.error(`Error in ${provider} strategy:`, error);
    done(error, null);
  }
};

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => handleOAuthLogin('google', profile, done)
));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/auth/github/callback'
  },
  (accessToken, refreshToken, profile, done) => handleOAuthLogin('github', profile, done)
));

// Discord Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/auth/discord/callback',
    scope: ['identify', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    // Discord stores avatar hash in profile.avatar, we need to construct the URL
    if (profile.avatar) {
      if (!profile.photos) profile.photos = [];
      profile.photos.push({ value: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` });
    }
    // Convert Discord email format
    if (profile.email) {
       if (!profile.emails) profile.emails = [];
       profile.emails.push({ value: profile.email });
    }
    handleOAuthLogin('discord', profile, done);
  }
));

module.exports = passport;
