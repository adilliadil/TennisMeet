'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { mockPlayers } from '@/lib/mockData';
import { User, PlayStyle } from '@/types';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock current user
const CURRENT_USER = mockPlayers[0]!;

const AVAILABILITY_OPTIONS = [
  { id: 'weekday-morning', label: 'Weekday Morning (6am-12pm)' },
  { id: 'weekday-afternoon', label: 'Weekday Afternoon (12pm-5pm)' },
  { id: 'weekday-evening', label: 'Weekday Evening (5pm-9pm)' },
  { id: 'weekend-morning', label: 'Weekend Morning (6am-12pm)' },
  { id: 'weekend-afternoon', label: 'Weekend Afternoon (12pm-5pm)' },
  { id: 'weekend-evening', label: 'Weekend Evening (5pm-9pm)' },
  { id: 'weekend-all', label: 'Weekend All Day' },
];

export default function EditProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<User>>({
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    skillLevel: CURRENT_USER.skillLevel,
    bio: CURRENT_USER.bio || '',
    playStyle: CURRENT_USER.playStyle,
    preferredSurface: CURRENT_USER.preferredSurface,
    availability: CURRENT_USER.availability || [],
    location: CURRENT_USER.location,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof User>(key: K, value: User[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when field is updated
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const toggleAvailability = (slot: string) => {
    const current = formData.availability || [];
    const updated = current.includes(slot)
      ? current.filter(s => s !== slot)
      : [...current, slot];
    updateField('availability', updated);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.skillLevel) {
      newErrors.skillLevel = 'Skill level is required';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be 500 characters or less';
    }

    if (!formData.location?.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.location?.state?.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Saving profile:', formData);
    setIsSaving(false);

    // Redirect to profile page
    router.push(`/players/${CURRENT_USER.id}`);
  };

  const handleCancel = () => {
    router.push(`/players/${CURRENT_USER.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href={`/players/${CURRENT_USER.id}`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image */}
          <div>
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-4 mt-2">
              <img
                src={CURRENT_USER.profileImage || '/placeholder.jpg'}
                alt={CURRENT_USER.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <Button variant="outline" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Photo upload coming soon
            </p>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder="Enter your full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder="your.email@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={e => updateField('bio', e.target.value)}
                placeholder="Tell others about your tennis experience and what you're looking for..."
                rows={4}
                className={errors.bio ? 'border-red-500' : ''}
              />
              <div className="flex justify-between mt-1">
                {errors.bio ? (
                  <p className="text-sm text-red-500">{errors.bio}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {formData.bio?.length || 0}/500 characters
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-semibold">Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.location?.city || ''}
                  onChange={e =>
                    updateField('location', {
                      ...formData.location!,
                      city: e.target.value,
                    })
                  }
                  placeholder="San Francisco"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">
                  State <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="state"
                  value={formData.location?.state || ''}
                  onChange={e =>
                    updateField('location', {
                      ...formData.location!,
                      state: e.target.value,
                    })
                  }
                  placeholder="CA"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-red-500 mt-1">{errors.state}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tennis Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Tennis Details</h3>

            <div>
              <Label htmlFor="skillLevel">
                Skill Level <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.skillLevel}
                onValueChange={value =>
                  updateField('skillLevel', value as User['skillLevel'])
                }
              >
                <SelectTrigger
                  id="skillLevel"
                  className={errors.skillLevel ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select your skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">
                    Beginner - New to tennis
                  </SelectItem>
                  <SelectItem value="intermediate">
                    Intermediate - 1-3 years experience
                  </SelectItem>
                  <SelectItem value="advanced">
                    Advanced - 3+ years, competitive
                  </SelectItem>
                  <SelectItem value="professional">
                    Professional - Tournament level
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.skillLevel && (
                <p className="text-sm text-red-500 mt-1">{errors.skillLevel}</p>
              )}
            </div>

            <div>
              <Label htmlFor="playStyle">Play Style</Label>
              <Select
                value={formData.playStyle || ''}
                onValueChange={value =>
                  updateField('playStyle', value as PlayStyle)
                }
              >
                <SelectTrigger id="playStyle">
                  <SelectValue placeholder="Select your play style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aggressive">
                    Aggressive - Power and winners
                  </SelectItem>
                  <SelectItem value="defensive">
                    Defensive - Consistent and steady
                  </SelectItem>
                  <SelectItem value="all-court">
                    All-Court - Versatile game
                  </SelectItem>
                  <SelectItem value="serve-and-volley">
                    Serve & Volley - Net play
                  </SelectItem>
                  <SelectItem value="baseline">
                    Baseline - Stay back
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="surface">Preferred Surface</Label>
              <Select
                value={formData.preferredSurface || ''}
                onValueChange={value =>
                  updateField(
                    'preferredSurface',
                    value as User['preferredSurface']
                  )
                }
              >
                <SelectTrigger id="surface">
                  <SelectValue placeholder="Select preferred surface" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hard">Hard Court</SelectItem>
                  <SelectItem value="clay">Clay Court</SelectItem>
                  <SelectItem value="grass">Grass Court</SelectItem>
                  <SelectItem value="any">Any Surface</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="font-semibold">Availability</h3>
            <p className="text-sm text-gray-600">
              Select the times when you&apos;re typically available to play
            </p>
            <div className="space-y-3">
              {AVAILABILITY_OPTIONS.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={formData.availability?.includes(option.id)}
                    onCheckedChange={() => toggleAvailability(option.id)}
                  />
                  <Label
                    htmlFor={option.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
