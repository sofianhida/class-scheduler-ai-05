
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4">
      <div className="text-center max-w-md animate-fade-up">
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center border border-border">
            <span className="text-5xl">🔍</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-foreground mb-6">We couldn't find the page you were looking for.</p>
        <p className="text-muted-foreground mb-8">
          The page at <code className="bg-secondary/50 px-2 py-1 rounded text-sm">{location.pathname}</code> doesn't exist.
        </p>
        <Button asChild className="gap-2 animate-fade-in delay-200">
          <a href="/">
            <HomeIcon className="h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
