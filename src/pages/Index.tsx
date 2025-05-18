
import React, { useState, useEffect } from 'react';
import { useKnowledge } from '@/context/KnowledgeContext';
import { searchFragments } from '@/utils/searchUtils';
import SearchBar from '@/components/SearchBar';
import TagsSelector from '@/components/TagsSelector';
import FragmentCard from '@/components/FragmentCard';
import FragmentForm from '@/components/FragmentForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  const { 
    fragments, 
    searchQuery, 
    selectedTags,
    isCreatingFragment,
    setIsCreatingFragment
  } = useKnowledge();
  
  const [searchResults, setSearchResults] = useState(fragments);
  
  // Update search results when query, tags, or fragments change
  useEffect(() => {
    setSearchResults(searchFragments(fragments, searchQuery, selectedTags));
  }, [fragments, searchQuery, selectedTags]);
  
  // Variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {/* Hero section with search */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
                  <span className="text-primary">Personal Knowledge</span> Database
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Your centralized repository for everything you know and want to remember.
                </p>
              </div>
              <div className="w-full max-w-2xl mx-auto">
                <SearchBar autoFocus={true} className="mt-6" />
                <div className="mt-4">
                  <TagsSelector />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Results section */}
        <section className="container px-4 py-8 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              {searchQuery || selectedTags.length > 0 
                ? `Search Results (${searchResults.length})` 
                : `All Knowledge Fragments (${fragments.length})`}
            </h2>
            <Button 
              onClick={() => setIsCreatingFragment(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add New
            </Button>
          </div>
          
          {searchResults.length === 0 ? (
            <div className="py-12 text-center">
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query or selected tags.
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {searchResults.map((fragment) => (
                <motion.div key={fragment.id} variants={itemVariants}>
                  <FragmentCard 
                    fragment={fragment} 
                    highlight={searchQuery}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
      
      {/* Create Fragment Dialog */}
      <FragmentForm 
        open={isCreatingFragment}
        onOpenChange={setIsCreatingFragment}
      />
    </div>
  );
};

export default Index;
