
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Package, Award, Zap, Shield, Map } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  
  const adminCards = [
    {
      title: "Character Management",
      description: "Create and manage superhero profiles and attributes",
      icon: <User className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-100"
    },
    {
      title: "Inventory Management",
      description: "Manage items, equipment and resources",
      icon: <Package className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-100"
    },
    {
      title: "Mission Management",
      description: "Create, assign and track superhero missions",
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      color: "bg-yellow-100"
    },
    {
      title: "Ability Management",
      description: "Create and configure superhero abilities and powers",
      icon: <Zap className="h-6 w-6 text-green-500" />,
      color: "bg-green-100"
    },
    {
      title: "RBAC Management",
      description: "Manage roles, permissions and access control",
      icon: <Shield className="h-6 w-6 text-red-500" />,
      color: "bg-red-100"
    },
    {
      title: "Map Management",
      description: "Configure city map, locations and points of interest",
      icon: <Map className="h-6 w-6 text-indigo-500" />,
      color: "bg-indigo-100"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your superhero game settings and configurations</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <Card key={index} className="border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>
                  {card.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 min-h-[3rem]">
                {card.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={() => navigate('/')}
              >
                Manage
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
