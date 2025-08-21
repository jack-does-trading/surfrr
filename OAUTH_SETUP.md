# OAuth Setup Guide for Surfrr

This guide will help you set up secure OAuth authentication for Reddit, X (Twitter), and YouTube to access user data for AI training and content recommendations.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Reddit OAuth Credentials
NEXT_PUBLIC_REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret

# Twitter/X OAuth Credentials
NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# YouTube OAuth Credentials
NEXT_PUBLIC_YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
```

## Platform-Specific Setup

### 1. Reddit OAuth Setup

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in the details:
   - **Name**: Surfrr
   - **App Type**: Web app
   - **Description**: AI-powered content recommendation platform
   - **About URL**: Your website URL
   - **Redirect URI**: `http://localhost:3000/api/auth/callback?platform=reddit`
4. Copy the Client ID and Client Secret to your `.env.local`

### 2. Twitter/X OAuth Setup

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create a new app or use existing one
3. Go to "Keys and Tokens" section
4. Enable OAuth 2.0
5. Set the callback URL: `http://localhost:3000/api/auth/callback?platform=twitter`
6. Copy the Client ID and Client Secret to your `.env.local`

### 3. YouTube OAuth Setup

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback?platform=youtube`
7. Copy the Client ID and Client Secret to your `.env.local`

## Security Best Practices

### For Production:

1. **Encrypt Tokens**: Store access tokens encrypted in your database
2. **Use HTTPS**: Always use HTTPS in production
3. **Token Refresh**: Implement token refresh logic for long-term access
4. **Rate Limiting**: Implement rate limiting for API calls
5. **User Consent**: Always get explicit user consent for data usage
6. **Data Minimization**: Only request necessary scopes and data

### Data Usage Compliance:

1. **GDPR Compliance**: Implement data deletion and export features
2. **CCPA Compliance**: Provide opt-out mechanisms
3. **Privacy Policy**: Create a clear privacy policy explaining data usage
4. **User Control**: Allow users to disconnect accounts and delete data

## API Scopes Requested

### Reddit:

- `identity`: Access to user identity
- `read`: Read public posts and comments
- `history`: Access to user's post/comment history

### Twitter/X:

- `tweet.read`: Read user's tweets
- `users.read`: Read user profile information
- `offline.access`: Refresh tokens for long-term access

### YouTube:

- `https://www.googleapis.com/auth/youtube.readonly`: Read YouTube data
- `https://www.googleapis.com/auth/userinfo.profile`: Read user profile

## Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/onboarding`
3. Click "Connect" on any platform
4. Complete the OAuth flow
5. Verify the connection status updates

## Troubleshooting

### Common Issues:

1. **Redirect URI Mismatch**: Ensure the redirect URI in your OAuth app matches exactly
2. **Invalid Client ID**: Double-check your environment variables
3. **CORS Issues**: Make sure your domain is whitelisted in OAuth apps
4. **Scope Issues**: Verify you're requesting the correct scopes

### Debug Mode:

Enable debug logging by adding to your `.env.local`:

```env
DEBUG=oauth:*
```

## Next Steps

After setting up OAuth:

1. **Data Collection**: Implement data fetching from connected accounts
2. **AI Training**: Use collected data to train recommendation models
3. **Content Analysis**: Analyze user preferences and behavior patterns
4. **Recommendations**: Build recommendation algorithms
5. **Privacy Controls**: Implement user privacy controls and data management
