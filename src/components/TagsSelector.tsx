
import React, { useState } from "react";
import { useKnowledge } from "@/context/KnowledgeContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Plus, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagsSelectorProps {
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  className?: string;
  showCreateNew?: boolean;
}

const TagsSelector: React.FC<TagsSelectorProps> = ({
  selectedTags: externalSelectedTags,
  onTagsChange,
  className = "",
  showCreateNew = true,
}) => {
  const { allTags, selectedTags: contextSelectedTags, addTag, removeTag, clearTags, setSearchQuery } = useKnowledge();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // Use external tags if provided, otherwise use context tags
  const selectedTags = externalSelectedTags !== undefined ? externalSelectedTags : contextSelectedTags;
  
  // Function to handle tag selection/deselection
  const handleTagSelect = (tag: string) => {
    if (onTagsChange) {
      // For external controlled tags
      if (selectedTags.includes(tag)) {
        onTagsChange(selectedTags.filter(t => t !== tag));
      } else {
        onTagsChange([...selectedTags, tag]);
      }
    } else {
      // For context managed tags
      if (selectedTags.includes(tag)) {
        removeTag(tag);
      } else {
        addTag(tag);
      }
    }
    setOpen(false);
  };
  
  // Function to handle tag removal
  const handleRemoveTag = (tag: string) => {
    if (onTagsChange) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      removeTag(tag);
    }
  };
  
  // Function to handle tag clearing
  const handleClearTags = () => {
    if (onTagsChange) {
      onTagsChange([]);
    } else {
      clearTags();
    }
  };
  
  // Function to handle creating a new tag
  const handleCreateTag = () => {
    const newTag = inputValue.trim().toLowerCase();
    if (newTag && !allTags.includes(newTag)) {
      if (onTagsChange) {
        onTagsChange([...selectedTags, newTag]);
      } else {
        addTag(newTag);
      }
      setOpen(false);
      setInputValue("");
    }
  };

  // Function to handle clicking on a tag to search by it
  const handleTagClick = (tag: string) => {
    setSearchQuery("");  // Clear any existing search
    if (!selectedTags.includes(tag)) {
      addTag(tag);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="flex flex-wrap gap-1 items-center">
        {selectedTags.length > 0 ? (
          selectedTags.map(tag => (
            <Badge key={tag} className="px-2 py-1 bg-secondary text-foreground hover:bg-secondary/80">
              {tag}
              <button
                className="ml-1 hover:text-primary"
                onClick={() => handleRemoveTag(tag)}
              >
                <X size={14} />
              </button>
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">No tags selected</span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        {selectedTags.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearTags}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        )}
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 border-dashed border-muted-foreground/50"
            >
              <Tag size={16} className="mr-1" />
              Add tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search tags..." 
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandList>
                <CommandEmpty>
                  {showCreateNew ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center w-full justify-start"
                      onClick={handleCreateTag}
                    >
                      <Plus size={16} className="mr-1" />
                      Create "{inputValue}"
                    </Button>
                  ) : (
                    <span className="p-2 text-sm">No tags found.</span>
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {allTags.filter(tag => tag.toLowerCase().includes(inputValue.toLowerCase()))
                    .map(tag => (
                      <CommandItem 
                        key={tag} 
                        value={tag}
                        onSelect={() => handleTagSelect(tag)}
                        className={cn(
                          "flex items-center justify-between",
                          selectedTags.includes(tag) ? "bg-secondary/50" : ""
                        )}
                      >
                        <span>{tag}</span>
                        {selectedTags.includes(tag) && (
                          <span className="text-primary">Selected</span>
                        )}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TagsSelector;
