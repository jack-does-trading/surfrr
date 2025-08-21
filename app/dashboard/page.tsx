import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
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

      <h1>Dashboard</h1>
      <p>You got here after login.</p>
      <nav style={{ marginTop: 16 }}>
        <Link href="/">Back to home</Link>
      </nav>
    </main>
  );
}
