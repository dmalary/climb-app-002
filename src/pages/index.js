import Link from "next/link"
import Stream from '../components/nav/stream.js';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { House, ChartNoAxesCombined, UserRoundPen } from 'lucide-react';
import { Geist, Geist_Mono } from "next/font/google";


// load shadcn skeletons on initial load while fecthing data?

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
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href='/'><House /></Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href='/'><ChartNoAxesCombined /></Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}> 
                <Link href='/'><UserRoundPen /></Link>
              </NavigationMenuLink>
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

