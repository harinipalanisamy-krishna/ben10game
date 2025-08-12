import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center card-omni p-8">
        <h1 className="font-heading text-4xl mb-2">404</h1>
        <p className="text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="btn-neon">Return to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
