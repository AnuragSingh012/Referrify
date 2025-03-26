import React from "react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <PageLayout className="flex items-center justify-center">
      <div className="max-w-md text-center mx-auto py-16">
        <h1 className="text-8xl font-display font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
        </p>
        <Button asChild>
          <Link to="/">
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </PageLayout>
  );
};

export default NotFound;
