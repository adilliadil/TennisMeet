import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Calendar, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find Your Perfect Tennis Partner
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with players at your skill level. Play matches. Track your progress.
          </p>
          <Link href="/players">
            <Button size="lg" className="text-lg px-8 py-6">
              Find Players Near You
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          How TennisMeet Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-center">Discover Players</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Search for players based on skill level, location, and play style
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <MapPin className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-center">Find Nearby Courts</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Discover tennis courts near you and arrange matches
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Calendar className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-center">Schedule Matches</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Coordinate match times that work for both players
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-center">Track Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Monitor your stats, Elo rating, and match history
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of tennis enthusiasts and start playing today
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/players">
              <Button size="lg">Browse Players</Button>
            </Link>
            <Link href="/design-system">
              <Button size="lg" variant="outline">
                View Design System
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
