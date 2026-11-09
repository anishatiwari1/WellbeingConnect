import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Book, 
  ExternalLink, 
  Download, 
  Calendar,
  User,
  Star,
  Clock,
  Tag,
  ChevronRight,
  Heart,
  Share2,
  Bookmark
} from "lucide-react";
import { SEO } from "@/components/SEO";
import blogRelationships from "@/assets/blog-relationships.jpg";
import blogBurnout from "@/assets/blog-burnout.jpg";
import blogNutrition from "@/assets/blog-nutrition.jpg";
import blogSleep from "@/assets/blog-sleep.svg";
import blogResilience from "@/assets/blog-resilience.svg";
import bookTrauma from "@/assets/book-trauma.svg";
import bookCBT from "@/assets/book-cbt.svg";
import bookMindfulness from "@/assets/book-mindfulness.svg";
import bookAttachment from "@/assets/book-attachment.svg";

// Real-world examples for different content types
// Currency conversion helpers for displaying prices meaningfully in INR
const USD_TO_INR_RATE = 83; // Approximate; adjust or externalize as needed
const formatINR = (amountInInr: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amountInInr);
const usdStringToInr = (usdString: string) => {
  const usd = parseFloat(usdString.replace(/[^0-9.]/g, "")) || 0;
  return Math.round(usd * USD_TO_INR_RATE);
};

const researchPapers = [
  {
    id: 1,
    title: "The Efficacy of Cognitive Behavioral Therapy: A Review of Meta-analyses",
    authors: ["Stefan G. Hofmann", "Anu Asnaani", "Imke J. J. Vonk", "Alice T. Sawyer", "Angela A. Fang"],
    journal: "Cognitive Therapy and Research",
    year: 2012,
    doi: "10.1007/s10608-012-9476-1",
    abstract: "A synthesis of meta-analyses examining the efficacy of cognitive behavioral therapy across anxiety disorders, depression, substance abuse, and other conditions.",
    tags: ["CBT", "Meta-Analysis", "Anxiety", "Depression"],
    citations: 8000,
    rating: 4.8,
    readTime: "14 min",
    pdfUrl: "https://link.springer.com/article/10.1007/s10608-012-9476-1",
    isOpenAccess: false
  },
  {
    id: 2,
    title: "Mindfulness-based stress reduction and health benefits: A meta-analysis",
    authors: ["Paul Grossman", "Ludger Niemann", "Stefan W. Walach"],
    journal: "Journal of Psychosomatic Research",
    year: 2004,
    doi: "10.1016/S0022-3999(03)00573-7",
    abstract: "Meta-analysis demonstrating that mindfulness-based stress reduction (MBSR) programs improve both mental and physical health outcomes.",
    tags: ["Mindfulness", "MBSR", "Meta-Analysis"],
    citations: 12000,
    rating: 4.7,
    readTime: "12 min",
    pdfUrl: "https://www.sciencedirect.com/science/article/abs/pii/S0022399903005737",
    isOpenAccess: false
  },
  {
    id: 3,
    title: "Internet-based cognitive behavior therapy for depression: A systematic review and meta-analysis",
    authors: ["Gerhard Andersson", "Pim Cuijpers"],
    journal: "Cognitive Behaviour Therapy",
    year: 2009,
    doi: "10.1080/16506070902980649",
    abstract: "Review and meta-analysis indicating internet-based CBT is an effective treatment for depression with moderate to large effects.",
    tags: ["CBT", "Digital Health", "Depression", "Meta-Analysis"],
    citations: 3500,
    rating: 4.6,
    readTime: "11 min",
    pdfUrl: "https://www.tandfonline.com/doi/abs/10.1080/16506070902980649",
    isOpenAccess: false
  },
  {
    id: 4,
    title: "Computer-based psychological treatments for depression: A systematic review and meta-analysis",
    authors: ["Derek Richards", "Thomas Richardson"],
    journal: "PLOS ONE",
    year: 2012,
    doi: "10.1371/journal.pone.0033182",
    abstract: "Systematic review of e-health interventions for depression showing significant effectiveness versus controls.",
    tags: ["Digital Health", "Depression", "E-Health"],
    citations: 1700,
    rating: 4.5,
    readTime: "10 min",
    pdfUrl: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0033182",
    isOpenAccess: true
  }
];

const articles = [
  {
    id: 1,
    title: "What Is Cognitive Behavioral Therapy?",
    author: "American Psychological Association",
    category: "CBT",
    image: bookCBT,
    excerpt: "An introduction to the principles of CBT and how it can help with depression, anxiety, and other conditions.",
    readTime: "8 min",
    publishDate: "2023-10-01",
    likes: 1240,
    comments: 42,
    tags: ["CBT", "Therapy", "Depression", "Anxiety"],
    isBookmarked: false,
    url: "https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral"
  },
  {
    id: 2,
    title: "Mindfulness: Your guide to meditation",
    author: "Harvard Health Publishing",
    category: "Mindfulness",
    image: bookMindfulness,
    excerpt: "Evidence-based overview of mindfulness meditation and how to get started.",
    readTime: "10 min",
    publishDate: "2024-02-12",
    likes: 980,
    comments: 30,
    tags: ["Mindfulness", "Meditation", "Stress"],
    isBookmarked: true,
    url: "https://www.health.harvard.edu/mind-and-mood/mindfulness-meditation"
  },
  {
    id: 3,
    title: "Coping with Stress",
    author: "Centers for Disease Control and Prevention (CDC)",
    category: "Stress",
    image: blogResilience,
    excerpt: "Practical strategies and resources for managing stress in healthy ways.",
    readTime: "6 min",
    publishDate: "2024-03-05",
    likes: 765,
    comments: 18,
    tags: ["Stress", "Wellness", "Resilience"],
    isBookmarked: false,
    url: "https://www.cdc.gov/mentalhealth/stress-coping"
  },
  {
    id: 4,
    title: "Sleep and mental health",
    author: "National Institutes of Health",
    category: "Sleep",
    image: blogSleep,
    excerpt: "How sleep impacts mental health and tips to improve sleep quality.",
    readTime: "9 min",
    publishDate: "2023-11-21",
    likes: 1120,
    comments: 27,
    tags: ["Sleep", "Mental Health", "Habits"],
    isBookmarked: false,
    url: "https://www.nimh.nih.gov/health/topics/sleep"
  },
  {
    id: 5,
    title: "Mental health: strengthening our response",
    author: "World Health Organization",
    category: "Public Health",
    image: blogRelationships,
    excerpt: "Key actions to promote, protect, and restore mental health at population scale.",
    readTime: "7 min",
    publishDate: "2022-06-17",
    likes: 860,
    comments: 21,
    tags: ["Public Health", "Policy", "WHO"],
    isBookmarked: true,
    url: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"
  }
];

const books = [
  {
    id: 1,
    title: "The Body Keeps the Score: Brain, Mind, and Body in the Healing of Trauma",
    author: "Bessel van der Kolk",
    category: "Trauma",
    coverImage: bookTrauma,
    description: "A groundbreaking exploration of how trauma affects the body and mind, and innovative approaches to healing.",
    rating: 4.9,
    reviews: 2847,
    pages: 464,
    publishYear: 2014,
    isbn: "978-0143127741",
    price: "$16.99",
    isAvailable: true,
    tags: ["Trauma", "Healing", "Psychology", "Neuroscience"]
  },
  {
    id: 2,
    title: "Feeling Good: The New Mood Therapy",
    author: "David D. Burns",
    category: "CBT",
    coverImage: bookCBT,
    description: "The classic guide to cognitive behavioral therapy techniques for overcoming depression and anxiety.",
    rating: 4.7,
    reviews: 1923,
    pages: 736,
    publishYear: 1999,
    isbn: "978-0380810338",
    price: "$14.99",
    isAvailable: true,
    tags: ["CBT", "Depression", "Anxiety", "Self-Help"]
  },
  {
    id: 3,
    title: "The Mindful Way Through Depression",
    author: "Mark Williams, John Teasdale, Zindel Segal, Jon Kabat-Zinn",
    category: "Mindfulness",
    coverImage: bookMindfulness,
    description: "A practical guide to using mindfulness meditation to break free from depression and anxiety.",
    rating: 4.6,
    reviews: 1456,
    pages: 273,
    publishYear: 2007,
    isbn: "978-1593851286",
    price: "$18.99",
    isAvailable: true,
    tags: ["Mindfulness", "Depression", "Meditation", "Self-Help"]
  },
  {
    id: 4,
    title: "Attached: The New Science of Adult Attachment",
    author: "Amir Levine, Rachel Heller",
    category: "Relationships",
    coverImage: bookAttachment,
    description: "Revolutionary research on adult attachment theory and how it affects our relationships and love lives.",
    rating: 4.8,
    reviews: 3214,
    pages: 304,
    publishYear: 2010,
    isbn: "978-1585429134",
    price: "$15.99",
    isAvailable: true,
    tags: ["Relationships", "Attachment Theory", "Psychology", "Love"]
  }
];

const TheCalmCorner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<number>>(new Set([2, 5]));

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "anxiety", label: "Anxiety" },
    { value: "depression", label: "Depression" },
    { value: "trauma", label: "Trauma" },
    { value: "relationships", label: "Relationships" },
    { value: "mindfulness", label: "Mindfulness" },
    { value: "cbt", label: "CBT" },
    { value: "sleep", label: "Sleep" },
    { value: "burnout", label: "Burnout" }
  ];

  const toggleBookmark = (id: number) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || 
                           article.category.toLowerCase() === selectedCategory ||
                           article.tags.some(tag => tag.toLowerCase() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const filteredResearchPapers = researchPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || 
                           paper.tags.some(tag => tag.toLowerCase() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || 
                           book.category.toLowerCase() === selectedCategory ||
                           book.tags.some(tag => tag.toLowerCase() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="container py-8 animate-enter">
      <SEO title="The Calm Corner — WellBeingConnect" description="A peaceful space for mental health articles, research papers, and books for your wellbeing journey." />
      
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">The Calm Corner</h1>
        <p className="text-muted-foreground mt-2">
          A peaceful space to discover evidence-based articles, cutting-edge research papers, and transformative books for your mental health journey.
        </p>
      </header>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search articles, papers, books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Research Papers
          </TabsTrigger>
          <TabsTrigger value="books" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Books
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredArticles.length} Article{filteredArticles.length !== 1 ? 's' : ''} Found
            </h2>
            <Link to="/journal">
              <Button className="bg-gradient-primary hover:shadow-lg">
                Start Growing Thoughts
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="relative">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full aspect-[3/2] object-cover" 
                    loading="lazy" 
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => toggleBookmark(article.id)}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarkedItems.has(article.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-gradient-accent">
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-snug line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {article.author}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {article.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.publishDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}>
                        Read More
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Research Papers Tab */}
        <TabsContent value="research" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredResearchPapers.length} Research Paper{filteredResearchPapers.length !== 1 ? 's' : ''} Found
            </h2>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Citations
            </Button>
          </div>

          <div className="space-y-6">
            {filteredResearchPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Research Paper
                        </Badge>
                        {paper.isOpenAccess && (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Open Access
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {paper.rating}
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{paper.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {paper.authors.join(", ")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {paper.year}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {paper.readTime}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        <strong>Journal:</strong> {paper.journal} | <strong>DOI:</strong> {paper.doi}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(paper.id)}
                    >
                      <Bookmark className={`h-4 w-4 ${bookmarkedItems.has(paper.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 line-clamp-3">
                    <strong>Abstract:</strong> {paper.abstract}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {paper.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {paper.citations} citations
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!paper.pdfUrl}
                        onClick={() => paper.pdfUrl && window.open(paper.pdfUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button size="sm" onClick={() => window.open(`https://doi.org/${paper.doi}`, '_blank', 'noopener,noreferrer')}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Paper
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Books Tab */}
        <TabsContent value="books" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredBooks.length} Book{filteredBooks.length !== 1 ? 's' : ''} Found
            </h2>
            <Button variant="outline">
              <Book className="h-4 w-4 mr-2" />
              Reading List
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="flex">
                  <div className="w-32 h-48 bg-muted flex-shrink-0">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="bg-gradient-accent">
                        {book.category}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(book.id)}
                      >
                        <Bookmark className={`h-4 w-4 ${bookmarkedItems.has(book.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <CardTitle className="text-lg leading-snug mb-2 line-clamp-2">
                      {book.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">
                      by {book.author}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({book.reviews} reviews)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {book.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {book.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {book.pages} pages • {book.publishYear}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                        <Button size="sm">
                          {formatINR(usdStringToInr(book.price))}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default TheCalmCorner;
