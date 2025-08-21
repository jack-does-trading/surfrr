"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ConnectedAccount {
  platform: string;
  username: string;
  connected: boolean;
  accessToken?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [interests, setInterests] = useState<string[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<
    ConnectedAccount[]
  >([
    { platform: "reddit", username: "", connected: false },
    { platform: "twitter", username: "", connected: false },
    { platform: "youtube", username: "", connected: false },
  ]);

  const availableInterests = [
    "Technology",
    "Science",
    "Sports",
    "Music",
    "Movies",
    "Books",
    "Travel",
    "Food",
    "Fitness",
    "Art",
    "Gaming",
    "Politics",
    "Business",
    "Education",
    "Health",
    "Fashion",
    "Photography",
  ];

  // Handle OAuth callback results
  useEffect(() => {
    const success = searchParams.get("success");
    const platform = searchParams.get("platform");
    const data = searchParams.get("data");
    const error = searchParams.get("error");

    if (success === "true" && platform && data) {
      try {
        const tokenData = JSON.parse(Buffer.from(data, "base64").toString());

        setConnectedAccounts((prev) =>
          prev.map((account) => {
            if (account.platform === platform) {
              return {
                ...account,
                connected: true,
                username:
                  tokenData.userData.name ||
                  tokenData.userData.username ||
                  "Connected",
                accessToken: tokenData.accessToken,
              };
            }
            return account;
          })
        );

        // Store the connection data
        localStorage.setItem(
          `${platform}_connection`,
          JSON.stringify(tokenData)
        );

        // Clean up URL
        router.replace("/onboarding");
      } catch (error) {
        console.error("Error parsing OAuth data:", error);
      }
    }

    if (error) {
      console.error("OAuth error:", error);
      // You could show a toast notification here
    }
  }, [searchParams, router]);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const initiateOAuth = (platform: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/callback?platform=${platform}`;

    let authUrl = "";

    switch (platform) {
      case "reddit":
        authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${
          process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID
        }&response_type=code&state=${Math.random()
          .toString(36)
          .substring(7)}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&duration=permanent&scope=identity,read,history`;
        break;
      case "twitter":
        const state = Math.random().toString(36).substring(7);
        authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${
          process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID
        }&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&scope=tweet.read%20users.read%20offline.access&state=${state}&code_challenge_method=S256&code_challenge=${state}`;
        break;
      case "youtube":
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
          process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID
        }&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline`;
        break;
    }

    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  const disconnectAccount = (platform: string) => {
    setConnectedAccounts((prev) =>
      prev.map((account) => {
        if (account.platform === platform) {
          return {
            ...account,
            connected: false,
            username: "",
            accessToken: undefined,
          };
        }
        return account;
      })
    );

    localStorage.removeItem(`${platform}_connection`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Save user preferences to localStorage (in real app, save to database)
    localStorage.setItem("user_interests", JSON.stringify(interests));

    // Save connected accounts
    localStorage.setItem(
      "connected_accounts",
      JSON.stringify(connectedAccounts)
    );

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <main style={{ padding: 24 }}>
      {/* Top image for navigation */}
      <div className="mb-6">
        <Link href="/dashboard">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
            <Image
              src="/surfrr-logo.png"
              alt="Surfrr Logo"
              width={80}
              height={20}
              className="my-[-20px] mx-[-5px] ml-[-30px]"
            />
            <span className="text-5xl font-bold">Surfrr</span>
          </div>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Welcome! Let&apos;s personalize your experience
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Interests Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              What are your interests?
            </h2>
            <p className="text-gray-600 mb-4">
              Select topics that interest you (select multiple)
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    interests.includes(interest)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Social Media Connections */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Connect your social media accounts
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your accounts to get personalized content recommendations.
              We&apos;ll use this data to train AI models and provide better
              recommendations.
            </p>

            {/* Reddit */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">R</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Reddit</h3>
                    <p className="text-sm text-gray-600">
                      {connectedAccounts.find(
                        (acc) => acc.platform === "reddit"
                      )?.connected
                        ? `Connected as ${
                            connectedAccounts.find(
                              (acc) => acc.platform === "reddit"
                            )?.username
                          }`
                        : "Connect your Reddit account to access your posts and preferences"}
                    </p>
                  </div>
                </div>
                {connectedAccounts.find((acc) => acc.platform === "reddit")
                  ?.connected ? (
                  <button
                    type="button"
                    onClick={() => disconnectAccount("reddit")}
                    className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => initiateOAuth("reddit")}
                    className="px-4 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>

            {/* Twitter/X */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">X</span>
                  </div>
                  <div>
                    <h3 className="font-medium">X (Twitter)</h3>
                    <p className="text-sm text-gray-600">
                      {connectedAccounts.find(
                        (acc) => acc.platform === "twitter"
                      )?.connected
                        ? `Connected as ${
                            connectedAccounts.find(
                              (acc) => acc.platform === "twitter"
                            )?.username
                          }`
                        : "Connect your X account to access your tweets and preferences"}
                    </p>
                  </div>
                </div>
                {connectedAccounts.find((acc) => acc.platform === "twitter")
                  ?.connected ? (
                  <button
                    type="button"
                    onClick={() => disconnectAccount("twitter")}
                    className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => initiateOAuth("twitter")}
                    className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>

            {/* YouTube */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">YT</span>
                  </div>
                  <div>
                    <h3 className="font-medium">YouTube</h3>
                    <p className="text-sm text-gray-600">
                      {connectedAccounts.find(
                        (acc) => acc.platform === "youtube"
                      )?.connected
                        ? `Connected as ${
                            connectedAccounts.find(
                              (acc) => acc.platform === "youtube"
                            )?.username
                          }`
                        : "Connect your YouTube account to access your watch history and preferences"}
                    </p>
                  </div>
                </div>
                {connectedAccounts.find((acc) => acc.platform === "youtube")
                  ?.connected ? (
                  <button
                    type="button"
                    onClick={() => disconnectAccount("youtube")}
                    className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => initiateOAuth("youtube")}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Complete Setup
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
