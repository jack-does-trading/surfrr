import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <header className="flex justify-between items-center px-6 py-4 bg-black text-white">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/surfrr-logo.png" // replace with your actual logo path in /public
            alt="Surfrr Logo"
            width={80}
            height={20}
            className="my-[-20px] mx-[-5px] ml-[-30px]"
          />
          <span className="text-5xl font-bold">Surfrr</span>
        </div>

        {/* Right side - Navigation */}
        <nav className="flex space-x-6">
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
        </nav>
      </header>

      <div className="width-full h-screen bg-black flex justify-center items-center">
        <h1 className="text-white text-4xl font-bold mt-[-190px] mx-auto">
          Your ALL in ONE AI Dashboard
        </h1>
      </div>
    </main>
  );
}
