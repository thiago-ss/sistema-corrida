import {
  BadgePlus,
  Home,
  CircleUser,
  Trophy,
  BookOpenText,
  KeySquare,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const adminLinks = [
  {
    href: "/",
    icon: <Home className="w-[1.2rem] h-[1.2rem]" />,
  },
  {
    href: "/cadastrar-equipe",
    icon: <BadgePlus className="w-[1.2rem] h-[1.2rem]" />,
  },
  {
    href: "/cadastrar-aluno",
    icon: <CircleUser className="w-[1.2rem] h-[1.2rem]" />,
  },
  {
    href: "/podio",
    icon: <Trophy className="w-[1.2rem] h-[1.2rem]" />,
  },
  {
    href: "/notas",
    icon: <BookOpenText className="w-[1.2rem] h-[1.2rem]" />,
  },
];

const userLinks = [
  {
    href: "/podio",
    icon: <Trophy className="w-[1.2rem] h-[1.2rem]" />,
  },
  {
    href: "/notas",
    icon: <BookOpenText className="w-[1.2rem] h-[1.2rem]" />,
  },
];

const Header = () => {
  const { userId } = auth();

  return (
    <header className="flex justify-between items-center py-10 bg-transparent px-20">
      <Image alt="Logo UTP" src="/utp.webp" width={150} height={150} />
      <div className="flex gap-2 items-center">
        {userId ? (
          <>
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button key={link.href} variant="outline" size="icon">
                  {link.icon}
                </Button>
              </Link>
            ))}
          </>
        ) : (
          <>
            {userLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button key={link.href} variant="outline" size="icon">
                  {link.icon}
                </Button>
              </Link>
            ))}
          </>
        )}
        <SignedOut>
          <Button variant="outline" size="icon">
            <Link href="/sign-in">
              <KeySquare className="w-[1.2rem] h-[1.2rem]" />
            </Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button variant="ghost" size="icon">
            <UserButton />
          </Button>
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
