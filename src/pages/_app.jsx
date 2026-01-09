import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import ImportModal from "@/components/modals/ImportModal";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        variables: {
          colorPrimary: "#a3e635",
        },
        layout: {
          socialButtonsPlacement: "bottom",
        },
      }}
    >
      <div className="min-h-screen bg-stone-900 flex flex-col items-center">
        <main className="w-full max-w-2xl flex flex-col items-center pb-12">
          {/* SIGNED OUT */}
          <SignedOut>
            <div className="w-full mt-20 p-6 bg-stone-800 rounded-2xl shadow-lg border border-stone-700">
              <h1 className="text-white text-2xl font-semibold text-center mb-6">
                Welcome to the Climbing App
              </h1>

              <SignInButton mode="modal">
                <button className="w-full py-3 bg-lime-500 text-black font-semibold rounded-xl hover:bg-lime-400 transition">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          {/* SIGNED IN */}
          <SignedIn>
            <div className="w-full">
              <Component {...pageProps} />
            </div>

            {/* Slide-up modal layer */}
            <AnimatePresence>
              {router.pathname === "/import" && <ImportModal />}
            </AnimatePresence>
          </SignedIn>
        </main>
      </div>
    </ClerkProvider>
  );
}
