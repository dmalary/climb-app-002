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
  Share2,
} from "lucide-react";

export const navConfig = {
  home: (id) => [
    {
      href: "/analytics",
      icon: <ChartNoAxesCombined className="w-5 h-5" />,
    },
    {
      href: "/social",
      icon: <Share2 className="w-5 h-5" />,
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
      href: "/social",
      icon: <Share2 className="w-5 h-5" />,
    },
    {
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ],

  analytics: (id) => [
    {
      href: "/",
      icon: <House className="w-5 h-5" />,
    },
    {
      href: "/social",
      icon: <Share2 className="w-5 h-5" />,
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

  social: (id) => [
    {
      href: "/",
      icon: <House className="w-5 h-5" />,
    },
    {
      href: "/analytics",
      icon: <ChartNoAxesCombined className="w-5 h-5" />,
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
  const items = (() => {
    switch (type) {
      case "home":
        return navConfig.home(userId);
      case "profile":
        return navConfig.profile(userId);
      case "analytics":
        return navConfig.analytics(userId);
      case "social":
        return navConfig.social(userId);
      default:
        return navConfig.home(userId);
    }
  })();

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