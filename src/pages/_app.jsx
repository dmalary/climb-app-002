import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        variables: {
          colorPrimary: "#a3e635",     // lime-400 accent (optional styling)
        },
        layout: {
          socialButtonsPlacement: "bottom",
        },
      }}
    >
      <div className="min-h-screen bg-stone-900 flex flex-col items-center">
        
        {/* Top nav (when signed in) */}
        <SignedIn>
          <nav className="w-full max-w-3xl px-4 py-4 flex justify-end">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "ring-2 ring-lime-400 rounded-full",
                },
              }}
            />
          </nav>
        </SignedIn>

        {/* Main content wrapper */}
        <main className="w-full max-w-2xl flex flex-col items-center pb-12">
          
          {/* Signed-out card */}
          <SignedOut>
            <div className="w-full mt-20 p-6 bg-stone-800 rounded-2xl shadow-lg border border-stone-700">
              <h1 className="text-white text-2xl font-semibold text-center mb-6">
                Welcome to the Climbing App
              </h1>

              <SignInButton mode="modal">
                <button className="w-full py-3 bg-lime-500 text-black font-semibold rounded-xl hover:bg-lime-400 transition">
                  Sign In
                   {/* to Continue */}
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          {/* Signed-in pages */}
          <SignedIn>
            <div className="w-full">
              <Component {...pageProps} />
            </div>
          </SignedIn>

        </main>
      </div>
    </ClerkProvider>
  );
}
