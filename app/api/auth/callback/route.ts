import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const platform = searchParams.get("platform");
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/onboarding?error=oauth_denied", request.url)
    );
  }

  if (!code || !platform) {
    return NextResponse.redirect(
      new URL("/onboarding?error=invalid_request", request.url)
    );
  }

  try {
    let accessToken = "";
    let userData = {};

    switch (platform) {
      case "reddit":
        const redditResponse = await fetch(
          "https://www.reddit.com/api/v1/access_token",
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
              ).toString("base64")}`,
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent": "Surfrr/1.0.0",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?platform=reddit`,
            }),
          }
        );

        if (!redditResponse.ok) {
          throw new Error("Reddit OAuth failed");
        }

        const redditTokenData = await redditResponse.json();
        accessToken = redditTokenData.access_token;

        // Get Reddit user data
        const redditUserResponse = await fetch(
          "https://oauth.reddit.com/api/v1/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "User-Agent": "Surfrr/1.0.0",
            },
          }
        );

        if (redditUserResponse.ok) {
          userData = await redditUserResponse.json();
        }
        break;

      case "twitter":
        // Twitter OAuth 2.0 with PKCE
        const twitterResponse = await fetch(
          "https://api.twitter.com/2/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${Buffer.from(
                `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
              ).toString("base64")}`,
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?platform=twitter`,
              code_verifier: state || "", // Using state as code_verifier for simplicity
            }),
          }
        );

        if (!twitterResponse.ok) {
          throw new Error("Twitter OAuth failed");
        }

        const twitterTokenData = await twitterResponse.json();
        accessToken = twitterTokenData.access_token;

        // Get Twitter user data
        const twitterUserResponse = await fetch(
          "https://api.twitter.com/2/users/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (twitterUserResponse.ok) {
          userData = await twitterUserResponse.json();
        }
        break;

      case "youtube":
        const youtubeResponse = await fetch(
          "https://oauth2.googleapis.com/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              client_id: process.env.YOUTUBE_CLIENT_ID!,
              client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
              redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?platform=youtube`,
            }),
          }
        );

        if (!youtubeResponse.ok) {
          throw new Error("YouTube OAuth failed");
        }

        const youtubeTokenData = await youtubeResponse.json();
        accessToken = youtubeTokenData.access_token;

        // Get YouTube user data
        const youtubeUserResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${accessToken}`
        );

        if (youtubeUserResponse.ok) {
          const youtubeData = await youtubeUserResponse.json();
          userData = youtubeData.items?.[0] || {};
        }
        break;

      default:
        throw new Error("Invalid platform");
    }

    // Store tokens securely (in production, encrypt these and store in database)
    const tokenData = {
      platform,
      accessToken,
      userData,
      timestamp: new Date().toISOString(),
    };

    // For demo purposes, storing in localStorage via URL params
    // In production, store in secure database with user session
    const encodedData = Buffer.from(JSON.stringify(tokenData)).toString(
      "base64"
    );

    return NextResponse.redirect(
      new URL(
        `/onboarding?success=true&platform=${platform}&data=${encodedData}`,
        request.url
      )
    );
  } catch (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(
      new URL("/onboarding?error=oauth_failed", request.url)
    );
  }
}
