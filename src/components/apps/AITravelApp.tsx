import { useState } from "react";
import { Plane, MapPin, Calendar, Users, DollarSign, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AITravelApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const destinations = [
    {
      id: "tokyo",
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      price: "$1,200",
      duration: "7 days",
      rating: 4.8,
      highlights: ["Cherry Blossoms", "Sushi", "Temples", "Technology"]
    },
    {
      id: "paris",
      name: "Paris, France",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400",
      price: "$900",
      duration: "5 days",
      rating: 4.9,
      highlights: ["Eiffel Tower", "Louvre", "Cafes", "Art"]
    },
    {
      id: "bali",
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400",
      price: "$800",
      duration: "10 days",
      rating: 4.7,
      highlights: ["Beaches", "Temples", "Rice Terraces", "Culture"]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 glass">
        <div className="flex items-center gap-3 mb-4">
          <Plane className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">AI Travel Agency</h2>
            <p className="text-sm text-muted-foreground">Discover your next adventure</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-white/20 bg-white/5"
            />
          </div>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((destination) => (
            <Card
              key={destination.id}
              className="glass border-white/20 hover:border-primary/30 transition-all cursor-pointer hover:scale-105"
              onClick={() => setSelectedDestination(destination.id)}
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-primary/90">
                    {destination.rating} ⭐
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{destination.name}</CardTitle>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {destination.price}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {destination.duration}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Highlights:</p>
                  <div className="flex flex-wrap gap-1">
                    {destination.highlights.map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90">
                  Plan Trip
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
