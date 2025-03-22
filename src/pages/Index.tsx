
import React from "react";
import ChatUI from "@/components/ChatUI";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm z-10">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center animate-float">
              <span className="text-primary-foreground font-bold">AI</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Study Assistant</h1>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="col-span-1 lg:col-span-7 flex flex-col">
            <div className="h-full min-h-[600px] rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm overflow-hidden">
              <ChatUI />
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-5 space-y-6">
            <div id="features" className="rounded-xl border border-border/40 p-6 bg-card/30 backdrop-blur-sm shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="space-y-3">
                {[
                  { icon: "📚", title: "Find Study Materials", description: "Get recommendations for textbooks, online courses, and resources" },
                  { icon: "🗓️", title: "Schedule Classes", description: "Optimize your class schedule for maximum productivity" },
                  { icon: "💡", title: "Study Tips", description: "Learn effective study techniques and strategies" },
                  { icon: "⏰", title: "Time Management", description: "Get help organizing your study time efficiently" },
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background shadow">
                      {feature.icon}
                    </span>
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div id="about" className="rounded-xl border border-border/40 p-6 bg-card/30 backdrop-blur-sm shadow-sm">
              <h2 className="text-xl font-semibold mb-4">About Study Assistant</h2>
              <p className="text-muted-foreground mb-4">
                Study Assistant uses advanced AI to help students find the right study materials and create optimal class schedules.
                Ask about any subject, and get personalized recommendations tailored to your needs.
              </p>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <p className="text-sm italic">
                  "This AI assistant has completely transformed how I organize my study time and find learning resources."
                </p>
                <p className="text-sm font-medium mt-2">— Student at University</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/30 bg-card/20 py-6 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Study Assistant AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#privacy"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
