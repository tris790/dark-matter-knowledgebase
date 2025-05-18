
import React, { useState, useEffect } from "react";
import { useKnowledge } from "@/context/KnowledgeContext";
import { KnowledgeFragment, FragmentType } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TagsSelector from "./TagsSelector";
import { X } from "lucide-react";

interface FragmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editFragment?: KnowledgeFragment | null;
}

const FragmentForm: React.FC<FragmentFormProps> = ({ open, onOpenChange, editFragment = null }) => {
  const { addFragment, updateFragment } = useKnowledge();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<FragmentType>("text");
  const [tags, setTags] = useState<string[]>([]);
  
  // Reset form or populate with fragment data when opened
  useEffect(() => {
    if (open) {
      if (editFragment) {
        setTitle(editFragment.title);
        setContent(editFragment.content);
        setType(editFragment.type);
        setTags([...editFragment.tags]);
      } else {
        // Reset form for new fragment
        setTitle("");
        setContent("");
        setType("text");
        setTags([]);
      }
    }
  }, [open, editFragment]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    const fragmentData = {
      title: title.trim(),
      content: content.trim(),
      type,
      tags
    };
    
    if (editFragment) {
      updateFragment({
        ...fragmentData, 
        id: editFragment.id,
        createdAt: editFragment.createdAt,
        updatedAt: new Date().toISOString()
      });
    } else {
      addFragment(fragmentData);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editFragment ? "Edit Knowledge Fragment" : "Add New Knowledge Fragment"}</DialogTitle>
          <DialogDescription>
            {editFragment 
              ? "Update your knowledge fragment details below." 
              : "Fill in the details to add a new knowledge fragment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <RadioGroup 
              value={type} 
              onValueChange={(value) => setType(value as FragmentType)}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="type-text" />
                <Label htmlFor="type-text" className="cursor-pointer">Text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="type-video" />
                <Label htmlFor="type-video" className="cursor-pointer">YouTube Video</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="website" id="type-website" />
                <Label htmlFor="type-website" className="cursor-pointer">Website</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="code" id="type-code" />
                <Label htmlFor="type-code" className="cursor-pointer">Code</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="song" id="type-song" />
                <Label htmlFor="type-song" className="cursor-pointer">Song</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">
              {type === "video" && "YouTube URL"}
              {type === "website" && "Website URL"}
              {type === "song" && "Song URL or Embed Code"}
              {type === "code" && "Code (use ```language syntax for formatting)"}
              {type === "text" && "Content"}
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === "video" ? "Paste YouTube URL" :
                type === "website" ? "Paste website URL" :
                type === "song" ? "Paste song URL or embed code" :
                type === "code" ? "```js\nconst example = 'code here';\n```" :
                "Enter text content"
              }
              rows={8}
              required
              className={type === "code" ? "font-mono" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagsSelector 
              selectedTags={tags} 
              onTagsChange={setTags} 
              showCreateNew={true} 
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editFragment ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FragmentForm;
