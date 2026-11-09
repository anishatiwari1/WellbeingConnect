import { useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Calendar,
  Settings,
  Users,
  NotebookPen,
  X,
} from "lucide-react";

const items = [
  { title: "My Sanctuary", url: "/dashboard", icon: Home },
  { title: "Thought Garden", url: "/journal", icon: NotebookPen },
  { title: "The Calm Corner", url: "/blog", icon: BookOpen },
  { title: "My Calendar", url: "/calendar", icon: Calendar },
  { title: "The Expert Network", url: "/psychologists", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function HamburgerMenu() {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const hoverCloseTimer = useRef<number | null>(null);
  const location = useLocation();

  const clearHoverTimer = () => {
    if (hoverCloseTimer.current) {
      window.clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  };

  const scheduleHoverClose = () => {
    clearHoverTimer();
    hoverCloseTimer.current = window.setTimeout(() => {
      setIsHovered(false);
    }, 150); // small delay to allow moving cursor into menu
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-gradient-primary text-primary-foreground font-medium shadow-sm"
      : "hover:bg-gradient-accent hover:shadow-sm transition-all duration-200";

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    setIsHovered(false); // Hide hover menu when clicking
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsExpanded(false);
    setIsHovered(false);
  };

  const handleNavClick = () => {
    setIsExpanded(false); // Close sidebar when navigating
    setIsHovered(false);
  };

  return (
    <div className="relative">
      {/* Hamburger Icon - Three Lines */}
      <div
        className="flex flex-col items-center justify-center w-10 h-10 rounded-md hover:bg-gradient-accent transition-all duration-200 cursor-pointer gap-1"
        onMouseEnter={() => {
          clearHoverTimer();
          if (!isExpanded) setIsHovered(true);
        }}
        onMouseLeave={scheduleHoverClose}
        onClick={handleClick}
      >
        <div className="w-5 h-0.5 bg-current rounded-full transition-all duration-200"></div>
        <div className="w-5 h-0.5 bg-current rounded-full transition-all duration-200"></div>
        <div className="w-5 h-0.5 bg-current rounded-full transition-all duration-200"></div>
      </div>

      {/* Hover Dropdown Menu - Only show when not expanded */}
      {isHovered && !isExpanded && (
        <div
          className="absolute top-12 left-0 z-50 min-w-64 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl py-3 animate-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => {
            clearHoverTimer();
            setIsHovered(true);
          }}
          onMouseLeave={scheduleHoverClose}
        >
          <div className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Navigation Menu</h3>
          </div>
          
          <div className="space-y-1 px-3 pt-2">
            {items.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-red-600 text-white font-medium shadow-sm"
                      : "text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-50"
                  }`}
                  onClick={handleNavClick}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* Expanded (Click) Menu - same as hover, persistent */}
      {isExpanded && (
        <>
          {/* Invisible overlay to capture outside clicks */}
          <div className="fixed inset-0 z-40" onClick={handleClose} />

          <div
            className="absolute top-12 left-0 z-50 min-w-64 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Navigation Menu</h3>
            </div>

            <div className="space-y-1 px-3 pt-2">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-red-600 text-white font-medium shadow-sm"
                        : "text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-50"
                    }`}
                    onClick={handleNavClick}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
