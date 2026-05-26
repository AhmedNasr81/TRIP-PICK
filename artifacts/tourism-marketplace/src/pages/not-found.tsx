import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Map className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Looks like you're lost</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          We couldn't find the page you're looking for. The map might be outdated, or the page has moved.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
