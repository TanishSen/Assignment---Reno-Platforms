import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  Plus, 
  Search, 
  GraduationCap, 
  MapPin, 
  Users,
  BookOpen,
  Award,
  ArrowRight
} from "lucide-react";

const Index = () => {
  // Dynamic stats state
  const [stats, setStats] = useState([
    { icon: Building2, label: "Schools", value: "...", color: "text-blue-600" },
    { icon: Users, label: "Students", value: "...", color: "text-blue-600" },
    { icon: MapPin, label: "Cities", value: "...", color: "text-blue-600" },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        
        // Update stats with real data
        setStats([
          { icon: Building2, label: "Schools", value: data.totalSchools?.toString() || "0", color: "text-blue-600" },
          { icon: Users, label: "Students", value: data.totalStudents || "0", color: "text-blue-600" },
          { icon: MapPin, label: "Cities", value: data.totalCities?.toString() || "0", color: "text-blue-600" },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to default values if API fails
        setStats([
          { icon: Building2, label: "Schools", value: "0", color: "text-blue-600" },
          { icon: Users, label: "Students", value: "0", color: "text-blue-600" },
          { icon: MapPin, label: "Cities", value: "0", color: "text-blue-600" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: Search,
      title: "Find Schools",
      description: "Search for schools in your area with filters"
    },
    {
      icon: BookOpen,
      title: "School Details",
      description: "View information about facilities, programs and more"
    },
    {
      icon: Award,
      title: "Reviews & Ratings",
      description: "Read reviews from other parents and students"
    }
  ];

  // Handle navigation - simple for now
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Hero Section */}
      <section className="relative bg-blue-600">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 mx-auto">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              School Directory
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Find the best schools in your area.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3"
                onClick={() => handleNavigate('/schools')}
              >
                <Search className="mr-2 h-5 w-5" />
                Browse Schools
              </Button>
              
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3"
                onClick={() => handleNavigate('/add-school')}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add School
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats cards */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4 mx-auto">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold mb-2">
                      {loading ? (
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Features
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Everything you need to find the right school
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4 mx-auto">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-lg p-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Get Started Today
            </h3>
            <p className="text-lg text-blue-100 mb-6 max-w-lg mx-auto">
              Start exploring schools in your area or add your school to our directory
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3"
                size="lg"
                onClick={() => handleNavigate('/schools')}
              >
                <Search className="mr-2 h-4 w-4" />
                Find Schools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3"
                size="lg"
                onClick={() => handleNavigate('/add-school')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your School
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=" text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-right">
            <p className="text-blue-400">
              Assignment for Reno Platforms
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
