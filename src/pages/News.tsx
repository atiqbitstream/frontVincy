
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  publishDate: string;
}

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // This would be an API call in a real app
  useEffect(() => {
    // Simulate loading news data
    const mockNewsItems = [
      {
        id: "1",
        title: "New Therapeutic Technology Breakthrough",
        summary: "Our team has developed a revolutionary approach to burn therapy using LED technology.",
        content: "Our research team, led by Dr. Sarah Johnson, has made significant progress in developing new LED-based therapeutic approaches for burn victims. The novel technology uses specific light wavelengths to stimulate tissue regeneration and reduce inflammation...",
        image: "https://picsum.photos/id/237/600/400",
        publishDate: "2023-09-15"
      },
      {
        id: "2",
        title: "W.O.M.B Platform Wins Healthcare Innovation Award",
        summary: "Our remote monitoring platform was recognized for excellence in healthcare technology.",
        content: "We are proud to announce that the W.O.M.B platform has received the prestigious Healthcare Innovation Award for 2023. The award recognizes our contributions to advancing remote therapeutic care and monitoring...",
        image: "https://picsum.photos/id/238/600/400",
        publishDate: "2023-08-28"
      },
      {
        id: "3",
        title: "Upcoming Webinar: Advances in Remote Therapeutic Care",
        summary: "Join our panel of experts as they discuss the latest developments in remote healthcare.",
        content: "Mark your calendars for our upcoming webinar on 'Advances in Remote Therapeutic Care'. Our distinguished panel will discuss the latest developments in telemedicine, remote monitoring, and how technological innovations are changing the landscape of healthcare delivery...",
        image: "https://picsum.photos/id/239/600/400",
        publishDate: "2023-10-05"
      }
    ];
    
    setNewsItems(mockNewsItems);
  }, []);

  const handleReadMore = (news: NewsItem) => {
    setSelectedNews(news);
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedNews(null);
  };

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
                <p className="text-sm text-foreground/60 mb-4">Published: {new Date(selectedNews.publishDate).toLocaleDateString()}</p>
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
                <div key={news.id} className="bg-card text-card-foreground rounded-lg shadow overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-lg mb-2">{news.title}</h2>
                    <p className="text-foreground/60 text-sm mb-2">Published: {new Date(news.publishDate).toLocaleDateString()}</p>
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
