import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Plus, User, LogOut, Crown, Menu, Info } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { currentUser, userData, isPremium, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MenuContent = () => (
    <div className="flex flex-col space-y-4">
      <Link 
        to="/" 
        className="flex items-center space-x-2 hover:text-primary transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>
      
      <Link 
        to="/about" 
        className="flex items-center space-x-2 hover:text-primary transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        <Info className="h-5 w-5" />
        <span>About Us</span>
      </Link>

      {currentUser && isPremium && (
        <Link 
          to="/add-property"
          className="flex items-center space-x-2 hover:text-primary transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          <Plus className="h-5 w-5" />
          <span>Add Property</span>
        </Link>
      )}

      {currentUser && (
        <>
          <Link 
            to="/profile"
            className="flex items-center space-x-2 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>

          <button
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="flex items-center space-x-2 hover:text-destructive transition-colors text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </>
      )}

      {!currentUser && (
        <Link 
          to="/auth"
          className="flex items-center space-x-2 hover:text-primary transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          <User className="h-5 w-5" />
          <span>Login / Sign Up</span>
        </Link>
      )}
    </div>
  );

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ZamProperty
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader className="mb-6">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <MenuContent />
            </SheetContent>
          </Sheet>

          {currentUser ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={userData?.photoURL} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userData?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userData?.displayName}</p>
                      <p className="text-xs text-muted-foreground">{userData?.email}</p>
                      {isPremium && (
                        <div className="flex items-center text-xs text-primary">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium Member
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader className="mb-6">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <MenuContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
