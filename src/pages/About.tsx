
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch about data from API
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('https://backvincy.onrender.com/public/about');
        const data = await response.json();
        setAboutData(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          // Loading state
          <div className="animate-pulse">
            <div className="text-center mb-12">
              <div className="h-10 bg-gray-200 rounded mx-auto mb-4 w-64"></div>
              <div className="h-6 bg-gray-200 rounded mx-auto w-48"></div>
            </div>
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="h-80 bg-gray-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ) : aboutData ? (
          <>
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-health-secondary mb-2">
                {aboutData.title || "About W.O.M.B"}
              </h1>
              <p className="text-xl text-foreground/80">
                {aboutData.subtitle || "Wellness Optimal Mind Body"}
              </p>
            </header>

            <div className="max-w-4xl mx-auto space-y-12">
              {/* Hero image section */}
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={aboutData.image_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"} 
                  alt="WOMB Healthcare Technology" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h2 className="text-2xl font-bold">Transforming Healthcare</h2>
                    <p className="text-white/90">Through innovative technology and expert care</p>
                  </div>
                </div>
              </div>

              {/* Mission section */}
              <section>
                <h2 className="text-2xl font-semibold text-health-primary mb-4">
                  {aboutData.heading || "Our Mission"}
                </h2>
                <div className="prose max-w-none text-foreground/80">
                  <p className="whitespace-pre-line">
                    {aboutData.content || "Our mission content"}
                  </p>
                </div>
              </section>

              {/* Vision section */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-health-primary mb-4">
                    {aboutData.heading_2 || "Our Vision"}
                  </h2>
                  <div className="prose max-w-none text-foreground/80">
                    <p>{aboutData.content_2 || "Our vision content"}</p>
                  </div>
                </div>
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-0">
                    <img 
                      src={aboutData.image_url_2 || "https://images.unsplash.com/photo-1521322800607-8c38375eef04"} 
                      alt="Our vision for healthcare" 
                      className="w-full h-64 object-cover"
                    />
                  </CardContent>
                </Card>
              </section>

              {/* Team section */}
              <section>
                <h2 className="text-2xl font-semibold text-health-primary mb-6">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aboutData.team_members && JSON.parse(aboutData.team_members).map((member, index) => (
                    <div key={index} className="bg-card text-card-foreground rounded-lg shadow p-6">
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-health-primary text-sm mb-2">{member.role}</p>
                      <p className="text-foreground/70 text-sm">{member.bio || "Team member bio"}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          // Error state
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-health-secondary mb-4">Unable to load about information</h1>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
