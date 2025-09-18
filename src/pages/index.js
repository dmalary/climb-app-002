import { Geist, Geist_Mono } from "next/font/google";
import Stream from '../components/nav/stream.js'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

// UPDATE WITH CAROUSEL COMPONENT FROM SHADCN

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export async function getServerSideProps() {
//   const streamData = await getUsers(); // replace with /api/stream
//   console.log('streamData', streamData)
//   return { props: { streamData } };
// }

// when i log in and land on this page, i want my user data to load/update db, and update cached? data

// export default function Stream({ streamData }) {
export default function Home() {
  return (
    <div className="flex justify-center p-4 bg-stone-900 min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Stream />
      </div>
    </div>
  )
}

// export async function getServerSideProps() {
//   const data = await getUsers(); // replace with /api/stream
//   return { props: { data } };
// }

