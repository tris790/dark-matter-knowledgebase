
import React, { useRef, useEffect, useState } from "react";
import { useKnowledge } from "@/context/KnowledgeContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Tag } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search your knowledge...", 
  autoFocus = false,
  className = ""
}) => {
  const { searchQuery, setSearchQuery, allTags, addTag } = useKnowledge();
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestedTag, setSuggestedTag] = useState<string | null>(null);

  const handleClear = () => {
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Handle tag suggestion based on query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      // Find matching tag
      const matchingTag = allTags.find(tag => 
        tag.toLowerCase().startsWith(query) && tag.toLowerCase() !== query
      );
      
      if (matchingTag) {
        setSuggestedTag(matchingTag);
      } else {
        setSuggestedTag(null);
      }
    } else {
      setSuggestedTag(null);
    }
  }, [searchQuery, allTags]);
  
  // Handle tab completion
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && suggestedTag) {
      e.preventDefault();
      setSearchQuery("");
      addTag(suggestedTag);
    }
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search size={18} />
      </div>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-10 h-12 bg-secondary text-lg shadow-sm"
      />
      {suggestedTag && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
          <Tag size={14} />
          <span>Tab to add: {suggestedTag}</span>
        </div>
      )}
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <X size={18} />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
