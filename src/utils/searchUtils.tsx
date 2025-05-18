import React from 'react';
import { KnowledgeFragment } from "../types";

export const searchFragments = (
  fragments: KnowledgeFragment[],
  query: string,
  selectedTags: string[] = []
): KnowledgeFragment[] => {
  // Convert query to lowercase for case-insensitive matching
  const searchQuery = query.toLowerCase().trim();
  
  // If no query and no tags, return all fragments
  if (!searchQuery && selectedTags.length === 0) {
    return fragments;
  }
  
  return fragments.filter(fragment => {
    // Filter by tags if any are selected
    if (selectedTags.length > 0) {
      const hasAllTags = selectedTags.every(tag => 
        fragment.tags.includes(tag)
      );
      if (!hasAllTags) return false;
    }
    
    // If no query, we've already filtered by tags
    if (!searchQuery) return true;
    
    // Check if the query is an exact match to a tag
    const isTagMatch = fragment.tags.some(tag => 
      tag.toLowerCase() === searchQuery
    );
    
    if (isTagMatch) return true;
    
    // Otherwise check title and content
    return (
      fragment.title.toLowerCase().includes(searchQuery) ||
      fragment.content.toLowerCase().includes(searchQuery)
    );
  });
};

export const highlightText = (text: string, query: string): JSX.Element[] => {
  if (!query.trim()) {
    return [<span key="0">{text}</span>];
  }
  
  const regex = new RegExp(`(${query.trim()})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return <span key={i} className="search-highlight">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';
};
