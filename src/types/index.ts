
export type FragmentType = 'text' | 'video' | 'website' | 'code' | 'song';

export interface KnowledgeFragment {
  id: string;
  title: string;
  content: string;
  type: FragmentType;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchOptions {
  query: string;
  tags: string[];
}
