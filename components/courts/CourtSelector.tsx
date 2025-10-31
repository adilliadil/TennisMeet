'use client';

import { useState, useMemo } from 'react';
import { Court, CourtFilters, CourtSearchResult } from '@/types';
import { CourtManager } from '@/lib/courtManager';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MapPin,
  Star,
  DollarSign,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface CourtSelectorProps {
  onSelect: (court: Court) => void;
  selectedCourtId?: string;
  courts: Court[];
  triggerLabel?: string;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

export function CourtSelector({
  onSelect,
  selectedCourtId,
  courts,
  triggerLabel = 'Select Court',
  userLocation,
}: CourtSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const courtManager = useMemo(() => new CourtManager(courts), [courts]);

  const selectedCourt = courts.find((c) => c.id === selectedCourtId);

  const searchResults: CourtSearchResult[] = useMemo(() => {
    const filters: CourtFilters = {
      searchTerm: searchTerm || undefined,
      userLocation,
    };
    return courtManager.searchCourts(filters);
  }, [courtManager, searchTerm, userLocation]);

  const handleSelect = (court: Court) => {
    onSelect(court);
    setOpen(false);
  };

  const formatPrice = (rate?: number) => {
    if (!rate || rate === 0) return 'Free';
    return `$${rate}/hr`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedCourt ? (
            <div className="flex items-center gap-2 w-full">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div className="flex-1 text-left truncate">
                <div className="font-medium truncate">{selectedCourt.name}</div>
                <div className="text-xs text-gray-500">
                  {selectedCourt.location.city}, {selectedCourt.location.state}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-gray-500">{triggerLabel}</span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select a Court</DialogTitle>
          <DialogDescription>
            Choose from available tennis courts in your area
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, city, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results */}
          <ScrollArea className="h-[400px] pr-4">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No courts found matching your search
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map(({ court, distance }) => (
                  <button
                    key={court.id}
                    onClick={() => handleSelect(court)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-green-300 hover:bg-green-50 ${
                      selectedCourtId === court.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">{court.name}</h4>
                          {selectedCourtId === court.id && (
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {court.location.city}, {court.location.state}
                          </span>
                          {distance && (
                            <span className="text-gray-400 flex-shrink-0">
                              • {distance.toFixed(1)} km
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {court.surface.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {court.numberOfCourts}{' '}
                            {court.numberOfCourts === 1 ? 'Court' : 'Courts'}
                          </Badge>
                          {court.isIndoor && (
                            <Badge variant="outline" className="text-xs">
                              Indoor
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          {court.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {court.rating.averageRating}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign className="h-3 w-3" />
                            {formatPrice(court.pricing?.hourlyRate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
