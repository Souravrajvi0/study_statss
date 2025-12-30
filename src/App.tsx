import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Check for required environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const MissingEnvVars = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-card border border-destructive rounded-lg p-6 space-y-4">
      <h1 className="text-xl font-bold text-destructive">Configuration Error</h1>
      <p className="text-muted-foreground">
        Missing required environment variables. Please set the following in Netlify:
      </p>
      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
        <li><code className="bg-muted px-1 rounded">VITE_SUPABASE_URL</code> {supabaseUrl ? "✓" : "✗ Missing"}</li>
        <li><code className="bg-muted px-1 rounded">VITE_SUPABASE_ANON_KEY</code> {supabaseAnonKey ? "✓" : "✗ Missing"}</li>
      </ul>
      <p className="text-sm text-muted-foreground">
        Go to: <strong>Netlify Dashboard → Site Settings → Environment Variables</strong>
      </p>
    </div>
  </div>
);

const App = () => {
  // Debug: Log environment variables (will show in browser console)
  console.log('Environment check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
    key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'missing'
  });

  // Show error if environment variables are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing environment variables!');
    return <MissingEnvVars />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
