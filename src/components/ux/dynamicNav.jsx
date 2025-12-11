import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
// import { navConfig } from "@config/nav.js"
import {
  House,
  ChartNoAxesCombined,
  Settings,
  UserRoundPen,
} from "lucide-react";

export const navConfig = {
  home: (id) => [
    {
      href: "/analytics",
      icon: <ChartNoAxesCombined className="w-5 h-5" />,
    },
    {
      href: `/profile/${id}`,
      icon: <UserRoundPen className="w-5 h-5" />,
    },
  ],

  profile: () => [
    {
      href: "/",
      icon: <House className="w-5 h-5" />,
    },
    {
      href: "/analytics",
      icon: <ChartNoAxesCombined className="w-5 h-5" />,
    },
    {
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ],

  analytics: () => [
    {
      href: "/",
      icon: <House className="w-5 h-5" />,
    },
    {
      href: `/profile/${id}`,
      icon: <UserRoundPen className="w-5 h-5" />,
    },
    {
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ],
};

// ---------------------------------------------
// DYNAMIC NAV COMPONENT
// ---------------------------------------------
export default function DynamicNav({ type = "home", userId }) {
  const items =
    type === "home" ? navConfig.home(userId) : navConfig.profile();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item, i) => (
          <NavigationMenuItem key={i}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={item.href}>{item.icon}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}