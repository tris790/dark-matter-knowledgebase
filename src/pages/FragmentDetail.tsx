
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKnowledge } from '@/context/KnowledgeContext';
import { KnowledgeFragment } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import FragmentForm from '@/components/FragmentForm';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const FragmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fragments, deleteFragment, addTag, setSearchQuery } = useKnowledge();
  
  const [fragment, setFragment] = useState<KnowledgeFragment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const foundFragment = fragments.find(f => f.id === id);
    if (foundFragment) {
      setFragment(foundFragment);
    } else {
      navigate('/not-found', { replace: true });
    }
  }, [id, fragments, navigate]);

  const handleDelete = () => {
    if (fragment) {
      deleteFragment(fragment.id);
      navigate('/', { replace: true });
    }
  };

  // Handle tag click to search by tag
  const handleTagClick = (tag: string) => {
    setSearchQuery(""); // Clear any existing search
    addTag(tag);
    navigate('/');
  };
  
  if (!fragment) {
    return (
      <div className="container py-8 text-center">
        Loading...
      </div>
    );
  }
  
  const renderContent = () => {
    switch (fragment.type) {
      case 'video':
        const videoId = fragment.content.includes('youtube.com') 
          ? fragment.content.split('v=')[1]?.split('&')[0]
          : fragment.content.includes('youtu.be')
            ? fragment.content.split('youtu.be/')[1]?.split('?')[0]
            : null;
            
        if (videoId) {
          return (
            <div className="aspect-video w-full mb-4">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={fragment.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-md"
              ></iframe>
            </div>
          );
        } else {
          return <div className="text-destructive">Invalid YouTube URL</div>;
        }
        
      case 'website':
        return (
          <div className="mb-4">
            <a 
              href={fragment.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 transition-colors"
            >
              {fragment.content}
            </a>
            
            {/* Render markdown content if it starts with html/md markers */}
            {fragment.content.includes('<!--html-->') && (
              <div className="mt-4 p-4 bg-secondary/30 rounded-md">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: fragment.content
                      .replace('<!--html-->', '')
                      .replace('<!--/html-->', '')
                  }} 
                />
              </div>
            )}
            
            {fragment.content.includes('<!--md-->') && (
              <div className="mt-4 p-4 bg-secondary/30 rounded-md">
                <ReactMarkdown 
                  className="prose prose-invert max-w-none"
                  remarkPlugins={[remarkGfm]}
                >
                  {fragment.content
                    .replace('<!--md-->', '')
                    .replace('<!--/md-->', '')
                  }
                </ReactMarkdown>
              </div>
            )}
          </div>
        );
        
      case 'code':
        // Extract language from code block if specified
        const codeContent = fragment.content.replace(/```[a-z]*\n|```/g, '');
        const langMatch = fragment.content.match(/```([a-z]*)\n/);
        const language = langMatch ? langMatch[1] : 'javascript';
        
        return (
          <div className="mb-4">
            <SyntaxHighlighter 
              language={language} 
              style={vscDarkPlus}
              className="rounded-md"
              wrapLines={true}
              showLineNumbers={true}
            >
              {codeContent}
            </SyntaxHighlighter>
          </div>
        );
        
      case 'song':
        if (fragment.content.includes('youtube.com') || fragment.content.includes('youtu.be')) {
          const videoId = fragment.content.includes('youtube.com') 
            ? fragment.content.split('v=')[1]?.split('&')[0]
            : fragment.content.includes('youtu.be')
              ? fragment.content.split('youtu.be/')[1]?.split('?')[0]
              : null;
              
          if (videoId) {
            return (
              <div className="aspect-video w-full mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={fragment.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-md"
                ></iframe>
              </div>
            );
          }
        }
        return (
          <div className="mb-4">
            <a 
              href={fragment.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 transition-colors"
            >
              Listen to this song
            </a>
          </div>
        );
        
      default:
        // Text content with markdown support
        return (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {fragment.content}
            </ReactMarkdown>
          </div>
        );
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)} 
            className="flex items-center"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleting(true)} 
            className="flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="p-6 relative overflow-hidden">
        <div 
          className="fragment-type-indicator" 
          style={{ 
            backgroundColor: `var(--knowledge-${fragment.type})`,
            opacity: 0.8 
          }} 
        />
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{fragment.title}</h1>
          <div className="flex gap-2 mb-4 flex-wrap">
            {fragment.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          {renderContent()}
          
          <div className="mt-6 text-sm text-muted-foreground">
            <p>
              Created: {new Date(fragment.createdAt || "").toLocaleString()}
              {fragment.updatedAt !== fragment.createdAt && (
                <> · Updated: {new Date(fragment.updatedAt || "").toLocaleString()}</>
              )}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Edit Dialog */}
      <FragmentForm
        open={isEditing}
        onOpenChange={setIsEditing}
        editFragment={fragment}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this knowledge fragment. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FragmentDetail;
