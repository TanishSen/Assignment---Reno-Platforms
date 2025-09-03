import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Plus, GraduationCap, Search, Loader2 } from "lucide-react";

type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image: string | null;
  created_at: string;
};

export default function ShowSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/schools');
      
      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }
      
      const data = await response.json();
      setSchools(data);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setError('Failed to load schools. Please make sure the server is running.');
      // Fallback to mock data if API fails
      setSchools([
        {
          id: 1,
          name: "Green Valley High School",
          address: "123 Education Street, Learning District",
          city: "Mumbai",
          state: "Maharashtra",
          contact: "9876543210",
          email_id: "contact@greenvalley.edu",
          image: "/placeholder.svg",
          created_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          name: "Sunrise Academy",
          address: "456 Knowledge Avenue, Academic Zone",
          city: "Delhi",
          state: "Delhi",
          contact: "9876543211",
          email_id: "info@sunriseacademy.edu",
          image: "/placeholder.svg",
          created_at: "2024-01-16T11:30:00Z"
        },
        {
          id: 3,
          name: "Oak Tree International",
          address: "789 Wisdom Boulevard, Education Hub",
          city: "Bangalore",
          state: "Karnataka",
          contact: "9876543212",
          email_id: "admissions@oaktree.edu",
          image: "/placeholder.svg",
          created_at: "2024-01-17T09:30:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSchool = () => {
    window.location.href = '/add-school';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              School Directory
            </h1>
            
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover quality educational institutions in your area
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search schools by name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 bg-white text-gray-900 border-0 focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleGoHome}
                
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Back to Home
              </Button>
              
              <Button
                onClick={handleAddSchool}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your School
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
            <p className="font-medium">Notice:</p>
            <p>{error}</p>
            <p className="text-sm mt-2">Showing sample data instead.</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg text-gray-600">Loading schools...</span>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'No schools found' : 'No schools available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Be the first to add a school to our directory'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleAddSchool} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add First School
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm ? 'Search Results' : 'All Schools'}
              </h2>
              <p className="text-gray-600">
                {searchTerm 
                  ? `Found ${filteredSchools.length} school${filteredSchools.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                  : `Showing ${filteredSchools.length} school${filteredSchools.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>

            {/* Schools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <Card key={school.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-blue-100">
                  <div className="aspect-video relative bg-gray-200">
                    {school.image ? (
                      <img
                        src={school.image.startsWith('http') ? school.image : `http://localhost:3001${school.image}`}
                        alt={school.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-blue-100">
                        <Building2 className="h-12 w-12 text-blue-400" />
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {school.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {school.address}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {school.city}, {school.state}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info - Only show if available */}
                      {school.contact && (
                        <div className="text-xs text-gray-500">
                          Contact: {school.contact}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}