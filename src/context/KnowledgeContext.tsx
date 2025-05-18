
import React, { createContext, useContext, useState, useEffect } from 'react';
import { KnowledgeFragment } from '../types';
import { fragments as initialFragments, getAllTags } from '../data/fragments';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeContextType {
  fragments: KnowledgeFragment[];
  allTags: string[];
  searchQuery: string;
  selectedTags: string[];
  isCreatingFragment: boolean;
  currentFragment: KnowledgeFragment | null;
  setSearchQuery: (query: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  clearTags: () => void;
  addFragment: (fragment: Omit<KnowledgeFragment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFragment: (fragment: KnowledgeFragment) => void;
  deleteFragment: (id: string) => void;
  setIsCreatingFragment: (isCreating: boolean) => void;
  setCurrentFragment: (fragment: KnowledgeFragment | null) => void;
}

const KnowledgeContext = createContext<KnowledgeContextType | undefined>(undefined);

export const KnowledgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fragments, setFragments] = useState<KnowledgeFragment[]>(initialFragments);
  const [allTags, setAllTags] = useState<string[]>(getAllTags());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreatingFragment, setIsCreatingFragment] = useState<boolean>(false);
  const [currentFragment, setCurrentFragment] = useState<KnowledgeFragment | null>(null);
  
  const { toast } = useToast();

  // Update all tags whenever fragments change
  useEffect(() => {
    const tagSet = new Set<string>();
    fragments.forEach(fragment => {
      fragment.tags.forEach(tag => tagSet.add(tag));
    });
    setAllTags(Array.from(tagSet).sort());
  }, [fragments]);

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  const addFragment = (fragment: Omit<KnowledgeFragment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newFragment: KnowledgeFragment = {
      ...fragment,
      id: `f${fragments.length + 1}`,
      createdAt: now,
      updatedAt: now
    };
    
    setFragments([...fragments, newFragment]);
    toast({
      title: "Fragment created",
      description: "Your knowledge fragment has been added",
    });
  };

  const updateFragment = (updatedFragment: KnowledgeFragment) => {
    const now = new Date().toISOString();
    const updatedFragments = fragments.map(fragment => 
      fragment.id === updatedFragment.id 
        ? { ...updatedFragment, updatedAt: now } 
        : fragment
    );
    
    setFragments(updatedFragments);
    toast({
      title: "Fragment updated",
      description: "Your knowledge fragment has been updated",
    });
  };

  const deleteFragment = (id: string) => {
    setFragments(fragments.filter(fragment => fragment.id !== id));
    toast({
      title: "Fragment deleted",
      description: "Your knowledge fragment has been removed",
      variant: "destructive",
    });
  };

  return (
    <KnowledgeContext.Provider value={{
      fragments,
      allTags,
      searchQuery,
      selectedTags,
      isCreatingFragment,
      currentFragment,
      setSearchQuery,
      addTag,
      removeTag,
      clearTags,
      addFragment,
      updateFragment,
      deleteFragment,
      setIsCreatingFragment,
      setCurrentFragment
    }}>
      {children}
    </KnowledgeContext.Provider>
  );
};

export const useKnowledge = () => {
  const context = useContext(KnowledgeContext);
  if (context === undefined) {
    throw new Error('useKnowledge must be used within a KnowledgeProvider');
  }
  return context;
};
