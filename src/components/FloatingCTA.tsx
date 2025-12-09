import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingCTA = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Button 
        variant="cta" 
        size="lg" 
        className="rounded-full shadow-2xl"
        asChild
      >
        <a href="https://cal.com/frattis63" target="_blank" rel="noopener noreferrer">
          <Calendar className="w-5 h-5" />
        </a>
      </Button>
    </div>
  );
};

export default FloatingCTA;
