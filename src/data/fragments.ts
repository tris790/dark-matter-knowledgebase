
import { KnowledgeFragment } from "../types";

export const fragments: KnowledgeFragment[] = [
  {
    id: "f1",
    title: "Understanding React Hooks",
    content: "React Hooks were introduced in React 16.8 to allow developers to use state and other React features without writing a class component. They enable better code reuse, organization, and allow splitting one component into smaller functions based on related pieces.",
    type: "text",
    tags: ["programming", "react", "web development"],
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z"
  },
  {
    id: "f2",
    title: "How to Build a Neural Network from Scratch",
    content: "https://www.youtube.com/watch?v=Wo5dMEP_BbI",
    type: "video",
    tags: ["machine learning", "programming", "python", "neural networks"],
    createdAt: "2023-02-20T10:30:00Z",
    updatedAt: "2023-02-20T10:30:00Z"
  },
  {
    id: "f3",
    title: "MDN Web Docs - JavaScript Reference",
    content: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
    type: "website",
    tags: ["programming", "javascript", "web development", "reference"],
    createdAt: "2023-03-05T14:45:00Z",
    updatedAt: "2023-03-05T14:45:00Z"
  },
  {
    id: "f4",
    title: "Optimizing React Performance with useMemo",
    content: `
\`\`\`jsx
function ExpensiveComponent({ data }) {
  // This calculation will only re-run when data changes
  const processedData = React.useMemo(() => {
    return data.map(item => {
      // Expensive calculation here
      return { ...item, calculated: item.value * 2 };
    });
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.calculated}</div>
      ))}
    </div>
  );
}
\`\`\`
    `,
    type: "code",
    tags: ["programming", "react", "web development", "optimization"],
    createdAt: "2023-04-10T09:20:00Z",
    updatedAt: "2023-04-10T09:20:00Z"
  },
  {
    id: "f5",
    title: "Gymnopédie No.1 - Erik Satie",
    content: "https://www.youtube.com/watch?v=S-Xm7s9eGxU",
    type: "song",
    tags: ["music", "classical", "piano", "relaxing"],
    createdAt: "2023-05-18T16:15:00Z",
    updatedAt: "2023-05-18T16:15:00Z"
  },
  {
    id: "f6",
    title: "Advanced CSS Grid Techniques",
    content: "CSS Grid is a powerful layout system that allows for complex two-dimensional layouts. Some advanced techniques include named grid areas, auto-fit/auto-fill with minmax, and masonry-style layouts using grid-template-rows: masonry (experimental).",
    type: "text",
    tags: ["programming", "css", "web development", "layout"],
    createdAt: "2023-06-22T11:10:00Z",
    updatedAt: "2023-06-22T11:10:00Z"
  },
  {
    id: "f7",
    title: "Setup Docker for Development Environment",
    content: `
\`\`\`bash
# Create a Docker Compose file
cat > docker-compose.yml << EOF
version: '3'
services:
  app:
    image: node:16
    volumes:
      - ./:/app
    working_dir: /app
    ports:
      - "3000:3000"
    command: npm start
  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: example
      POSTGRES_USER: user
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# Start the containers
docker-compose up -d
\`\`\`
    `,
    type: "code",
    tags: ["programming", "docker", "devops", "environment setup"],
    createdAt: "2023-07-30T15:40:00Z",
    updatedAt: "2023-07-30T15:40:00Z"
  },
  {
    id: "f8",
    title: "Meditation Basics for Beginners",
    content: "Meditation is a practice where an individual uses a technique – such as mindfulness, or focusing the mind on a particular object, thought, or activity – to train attention and awareness, and achieve a mentally clear and emotionally calm and stable state.",
    type: "text",
    tags: ["wellness", "meditation", "mindfulness", "health"],
    createdAt: "2023-08-14T08:25:00Z",
    updatedAt: "2023-08-14T08:25:00Z"
  }
];

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  fragments.forEach(fragment => {
    fragment.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};
