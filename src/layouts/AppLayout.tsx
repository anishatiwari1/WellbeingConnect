import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isLanding = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const shouldShowHeader = (!isLanding && !isLogin) || user;

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-bg">
      {shouldShowHeader && (
        <header className="sticky top-0 z-20 h-14 flex items-center gap-2 border-b bg-gradient-card/70 backdrop-blur supports-[backdrop-filter]:bg-gradient-card/70 px-3">
          <HamburgerMenu />
          <div className="font-semibold tracking-tight ml-2">WellBeingConnect</div>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      )}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-80" style={{ background: "var(--gradient-soft)" }} />
        <Outlet />
      </div>
    </div>
  );
}
