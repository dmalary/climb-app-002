import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  // return <Component {...pageProps} />;
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        cssLayerName: 'clerk',
      }}
    >
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}
