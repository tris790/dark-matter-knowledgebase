
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useKnowledge } from "@/context/KnowledgeContext";

const Header: React.FC = () => {
  const { setIsCreatingFragment } = useKnowledge();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-semibold tracking-tight">
              <span className="text-primary">Knowledge</span>Base
            </h1>
          </Link>
        </div>

        {!isHomePage && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsCreatingFragment(true)}
              variant="default"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              <span>New Fragment</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
