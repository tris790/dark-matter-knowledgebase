
import React from "react";
import { KnowledgeFragment } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { truncateText } from "@/utils/searchUtils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FragmentCardProps {
  fragment: KnowledgeFragment;
  highlight?: string;
  className?: string;
}

const FragmentCard: React.FC<FragmentCardProps> = ({ fragment, highlight = "", className = "" }) => {
  const { id, title, content, type, tags } = fragment;
  
  // Different rendering based on fragment type
  const renderContent = () => {
    const truncated = truncateText(content, 150);
    
    switch (type) {
      case "video":
        return (
          <div className="flex items-center text-muted-foreground">
            <span className="text-knowledge-video mr-2">▶</span> YouTube Video
          </div>
        );
      case "website":
        return (
          <div className="text-muted-foreground">
            <span className="text-knowledge-website">🔗</span> {truncated}
          </div>
        );
      case "code":
        return (
          <div className="font-mono text-sm bg-secondary/50 p-2 rounded overflow-hidden">
            {truncateText(content.replace(/```[a-z]*\n|```/g, '').trim(), 100)}
          </div>
        );
      case "song":
        return (
          <div className="flex items-center text-muted-foreground">
            <span className="text-knowledge-song mr-2">♪</span> Music Track
          </div>
        );
      default:
        return <p className="text-muted-foreground">{truncated}</p>;
    }
  };

  return (
    <Link to={`/fragment/${id}`}>
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-primary/10 group",
        className
      )}>
        <div 
          className="fragment-type-indicator" 
          style={{ 
            backgroundColor: `var(--knowledge-${type})`,
            opacity: 0.8 
          }} 
        />
        <CardContent className="p-4 pl-5">
          <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="mb-3">
            {renderContent()}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge 
                variant="outline"
                className="text-xs"
              >
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FragmentCard;
