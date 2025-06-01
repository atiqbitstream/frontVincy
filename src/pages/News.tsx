import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  publishDate: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const News = () => {
  const { token } = useAuth(); // Get the token from useAuth
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/news/user/news/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        setNewsItems(data);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNews();
    } else {
      console.error("No token available");
      toast.error("You are not authorized to view this content.");
    }
  }, [token]);

  const handleReadMore = (news: NewsItem) => {
    setSelectedNews(news);
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedNews(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading news...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {selectedNews ? (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleBackToList}
              className="mb-6 text-health-primary hover:underline flex items-center"
            >
              &larr; Back to News
            </button>

            <div className="bg-card text-card-foreground rounded-lg shadow overflow-hidden">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{selectedNews.title}</h1>
                <p className="text-sm text-foreground/60 mb-4">
                  Published: {new Date(selectedNews.publishDate).toLocaleDateString()}
                </p>
                <p className="font-medium mb-4 text-foreground/80">{selectedNews.summary}</p>
                <div className="prose max-w-none text-foreground/70">
                  <p className="whitespace-pre-line">{selectedNews.content}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-health-secondary mb-2">Latest News</h1>
              <p className="text-xl text-foreground/80">Updates and announcements from W.O.M.B</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsItems.map((news) => (
                <div
                  key={news.id}
                  className="bg-card text-card-foreground rounded-lg shadow overflow-hidden"
                >
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-lg mb-2">{news.title}</h2>
                    <p className="text-foreground/60 text-sm mb-2">
                      Published: {new Date(news.publishDate).toLocaleDateString()}
                    </p>
                    <p className="text-foreground/70 mb-4">{news.summary}</p>
                    <button
                      onClick={() => handleReadMore(news)}
                      className="text-health-primary hover:underline"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default News;
