import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Play, Heart, Brain, Calendar, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_URL = import.meta.env.VITE_API_URL;

const Landing = () => {
  // State for API data
  const [newsData, setNewsData] = useState([]);
  const [liveSessionData, setLiveSessionData] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);

  // Fetch all data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_URL}/public/latest-news`);
        const data = await response.json();
        setNewsData(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    const fetchLiveSession = async () => {
      try {
        const response = await fetch(`${API_URL}/public/latest-live-session`);
        const data = await response.json();
        setLiveSessionData(data);
      } catch (error) {
        console.error('Error fetching live session:', error);
      }
    };

    const fetchAbout = async () => {
      try {
        const response = await fetch(`${API_URL}/public/about`);
        const data = await response.json();
        setAboutData(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    const fetchContact = async () => {
      try {
        const response = await fetch(`${API_URL}/public/contact`);
        const data = await response.json();
        setContactData(data);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }
    };

    Promise.all([fetchNews(), fetchLiveSession(), fetchAbout(), fetchContact()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleReadMore = (news) => {
    setSelectedNews(news);
    setIsNewsModalOpen(true);
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
    setIsNewsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--health-primary))]/10 via-background to-[hsl(var(--health-primary))]/5">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[hsl(var(--health-primary))] mb-6">
              W.O.M.B
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Wellness Optimal Mind Body
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {aboutData?.hero_description || "Revolutionizing healthcare through innovative technology and expert therapeutic care. Experience the future of wellness management today."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--health-primary))] mb-4 flex items-center justify-center">
              <Heart className="mr-3 h-8 w-8" />
              About Our Mission
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how we're transforming healthcare delivery through innovation
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {loading ? (
              // Loading state
              <>
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
                    <div className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
                  </div>
                </div>
                <div className="w-full h-80 bg-gray-200 animate-pulse rounded-lg"></div>
              </>
            ) : (
              <>
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground">
                    {aboutData?.title || "About W.O.M.B"}
                  </h3>
                  
                  {(aboutData?.heading && aboutData?.content) && (
                    <div className="bg-[hsl(var(--health-primary))]/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-[hsl(var(--health-primary))] mb-2">{aboutData.heading}</h4>
                      <p className="text-sm text-muted-foreground">{aboutData.content}</p>
                    </div>
                  )}
                  {(aboutData?.heading_2 && aboutData?.content_2) && (
                    <div className="bg-[hsl(var(--health-primary))]/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-[hsl(var(--health-primary))] mb-2">{aboutData.heading_2}</h4>
                      <p className="text-sm text-muted-foreground">{aboutData.content_2}</p>
                    </div>
                  )}
                </div>
                
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <img 
                      src={aboutData?.image_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"} 
                      alt={aboutData?.title || "Healthcare Technology"} 
                      className="w-full h-80 object-cover"
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* News Preview Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--health-primary))] mb-4 flex items-center justify-center">
              <Brain className="mr-3 h-8 w-8" />
              Latest News & Updates
            </h2>
            <p className="text-lg text-muted-foreground">
              Stay informed about breakthrough developments in therapeutic care
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              // Loading state
              Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              newsData.map((news) => (
                <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <img 
                      src={news.image_url || "https://picsum.photos/400/200"} 
                      alt={news.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {news.summary}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {new Date(news.publish_date).toLocaleDateString()}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReadMore(news)}
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Want to read more and stay updated?
            </p>
            <Button variant="outline" asChild>
              <Link to="/signup">Join Now for Full Access</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Session Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--health-primary))] mb-4 flex items-center justify-center">
              <Calendar className="mr-3 h-8 w-8" />
              Live Sessions & Training
            </h2>
            <p className="text-lg text-muted-foreground">
              Join expert-led sessions and expand your knowledge
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden bg-gradient-to-r from-[hsl(var(--health-primary))]/5 to-[hsl(var(--health-primary))]/10">
              <CardContent className="p-8">
                {loading ? (
                  // Loading state
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
                      <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded mb-6"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    </div>
                    <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"></div>
                  </div>
                ) : liveSessionData ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">
                        {liveSessionData.livestatus ? "Live Now" : "Next Live Session"}
                      </h3>
                      <h4 className="text-xl font-medium text-[hsl(var(--health-primary))] mb-2">
                        {liveSessionData.session_title}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        Hosted by {liveSessionData.host}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground mb-6">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date(liveSessionData.date_time).toLocaleDateString()} at{" "}
                        {new Date(liveSessionData.date_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{liveSessionData.duration_minutes} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="font-medium">{liveSessionData.livestatus ? "Live" : "Scheduled"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <img 
                        src={liveSessionData.image_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"} 
                        alt="Live Session" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                        <div className="bg-white/90 p-4 rounded-full">
                          <Play className="h-8 w-8 text-[hsl(var(--health-primary))]" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No live session available at the moment</p>
                  </div>
                )}
                
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Access live sessions and our complete library
                  </p>
                  <Button asChild>
                    <Link to="/signup">Sign Up to Join Sessions</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Preview Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--health-primary))] mb-4 flex items-center justify-center">
              <Mail className="mr-3 h-8 w-8" />
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground">
              Ready to start your healthcare transformation journey?
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {loading ? (
              // Loading state
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Contact Us</h3>
                    <div className="space-y-4">
                      {contactData?.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-[hsl(var(--health-primary))]" />
                          <div>
                            <p className="font-medium">Email</p>
                            <a href={`mailto:${contactData.email}`} className="text-[hsl(var(--health-primary))] hover:underline">
                              {contactData.email}
                            </a>
                          </div>
                        </div>
                      )}
                      {contactData?.support_email && contactData.support_email !== contactData.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-[hsl(var(--health-primary))]" />
                          <div>
                            <p className="font-medium">Support Email</p>
                            <a href={`mailto:${contactData.support_email}`} className="text-[hsl(var(--health-primary))] hover:underline">
                              {contactData.support_email}
                            </a>
                          </div>
                        </div>
                      )}
                      {contactData?.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-[hsl(var(--health-primary))]" />
                          <div>
                            <p className="font-medium">Phone</p>
                            <a href={`tel:${contactData.phone}`} className="text-[hsl(var(--health-primary))] hover:underline">
                              {contactData.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      {contactData?.address && (
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-[hsl(var(--health-primary))] mt-1" />
                          <div>
                            <p className="font-medium">Address</p>
                            <p className="text-muted-foreground text-sm">{contactData.address}</p>
                          </div>
                        </div>
                      )}
                      {contactData?.office_hours && (
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-[hsl(var(--health-primary))] mt-1" />
                          <div>
                            <p className="font-medium">Office Hours</p>
                            <p className="text-muted-foreground text-sm whitespace-pre-line">{contactData.office_hours}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden bg-gradient-to-br from-[hsl(var(--health-primary))]/5 to-[hsl(var(--health-primary))]/10">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Connect?</h3>
                    <p className="text-muted-foreground mb-6">
                      Join our community of healthcare professionals and discover how W.O.M.B can transform your practice.
                    </p>
                    <div className="space-y-4">
                      <Button asChild className="w-full">
                        <Link to="/signup">
                          Get Started Today
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
            
                    </div>
                    <div className="mt-6 p-4 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground text-center">
                        Have questions? Our support team is here to help you get started.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[hsl(var(--health-primary))]/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--health-primary))] mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who trust W.O.M.B for their therapeutic and wellness needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/signup">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/login">Already Have an Account?</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Reading Modal */}
      <Dialog open={isNewsModalOpen} onOpenChange={closeNewsModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedNews && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedNews.title}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {selectedNews.image_url && (
                  <div className="w-full h-64 bg-gray-100 rounded-md mb-4 overflow-hidden">
                    <img 
                      src={selectedNews.image_url}
                      alt={selectedNews.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500 mb-4">
                  Published: {selectedNews.publish_date ? new Date(selectedNews.publish_date).toLocaleDateString() : ''}
                </p>
                <p className="font-semibold mb-4">{selectedNews.summary}</p>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{selectedNews.content}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;