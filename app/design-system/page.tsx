"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Container } from "@/components/layout/container";
import { Grid } from "@/components/layout/grid";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <Container className="py-12 flex-1">
        <div className="space-y-16">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              TennisMeet Design System
            </h1>
            <p className="text-lg text-neutral-600">
              Phase 1: Core components and layouts
            </p>
          </div>

          {/* Colors */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Color Palette</h2>
            <Grid cols={3} gap="md">
              <div>
                <h3 className="text-lg font-semibold mb-3">Primary (Court Green)</h3>
                <div className="space-y-2">
                  {[500, 600, 700].map((shade) => (
                    <div key={shade} className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg bg-primary-${shade} border border-neutral-200`} />
                      <span className="text-sm font-mono">primary-{shade}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Secondary (Clay Orange)</h3>
                <div className="space-y-2">
                  {[500, 600, 700].map((shade) => (
                    <div key={shade} className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg bg-secondary-${shade} border border-neutral-200`} />
                      <span className="text-sm font-mono">secondary-{shade}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Neutral</h3>
                <div className="space-y-2">
                  {[300, 500, 700].map((shade) => (
                    <div key={shade} className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg bg-neutral-${shade} border border-neutral-200`} />
                      <span className="text-sm font-mono">neutral-{shade}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Typography</h2>
            <div className="space-y-4">
              <div>
                <p className="text-6xl font-bold">Heading 1</p>
                <code className="text-sm text-neutral-500">text-6xl font-bold</code>
              </div>
              <div>
                <p className="text-4xl font-bold">Heading 2</p>
                <code className="text-sm text-neutral-500">text-4xl font-bold</code>
              </div>
              <div>
                <p className="text-2xl font-semibold">Heading 3</p>
                <code className="text-sm text-neutral-500">text-2xl font-semibold</code>
              </div>
              <div>
                <p className="text-base">Body text - Regular paragraph text that is easy to read.</p>
                <code className="text-sm text-neutral-500">text-base</code>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Small text - Secondary information.</p>
                <code className="text-sm text-neutral-500">text-sm text-neutral-600</code>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Buttons</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Loading State</h3>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Loading</Button>
                  <Button variant="secondary" loading>Loading</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Disabled State</h3>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button variant="secondary" disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Cards</h2>
            <Grid cols={3} gap="md">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Standard card for general content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">
                    This is the default card variant with subtle shadow.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">View More</Button>
                </CardFooter>
              </Card>

              <Card variant="product">
                <CardHeader>
                  <CardTitle>Product Card</CardTitle>
                  <CardDescription>For player profiles and matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">
                    Product cards have hover effects and stronger shadows.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">View Profile</Button>
                </CardFooter>
              </Card>

              <Card variant="stats">
                <CardHeader>
                  <CardTitle>Stats Card</CardTitle>
                  <CardDescription>For displaying player statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary-700">1850</div>
                  <p className="text-sm text-neutral-600">Elo Rating</p>
                </CardContent>
              </Card>
            </Grid>
          </section>

          {/* Form Components */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Form Components</h2>
            <Card>
              <CardHeader>
                <CardTitle>Sample Form</CardTitle>
                <CardDescription>All form components with labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Skill Level</Label>
                  <Select>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="pro">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself" />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    I accept the terms and conditions
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </section>

          {/* Badges */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Badges</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Available</Badge>
              <Badge variant="secondary">Pending</Badge>
              <Badge variant="success">Confirmed</Badge>
              <Badge variant="warning">Rescheduled</Badge>
              <Badge variant="danger">Cancelled</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </section>

          {/* Loading States */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Loading States</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Spinners</h3>
                <div className="flex items-center gap-6">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Spinner size="xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Skeleton Loaders</h3>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Dialog */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Dialog / Modal</h2>
            <div className="flex gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Small Dialog</Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogHeader>
                    <DialogTitle>Small Dialog</DialogTitle>
                    <DialogDescription>
                      This is a small dialog for quick actions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-neutral-600">
                      Content goes here...
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Medium Dialog</Button>
                </DialogTrigger>
                <DialogContent size="md">
                  <DialogHeader>
                    <DialogTitle>Send Play Request</DialogTitle>
                    <DialogDescription>
                      Send a play request to John Doe for a tennis match.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input id="date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Input id="time" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Add a message (optional)" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Send Request</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Large Dialog</Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogHeader>
                    <DialogTitle>Large Dialog</DialogTitle>
                    <DialogDescription>
                      This is a large dialog for complex forms or detailed content.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-neutral-600">
                      More complex content and forms can go in this larger dialog...
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>

          {/* Layout Components */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Layout Components</h2>
            <div className="space-y-4">
              <p className="text-neutral-600">
                Container and Grid components are used throughout this page.
              </p>
              <p className="text-sm text-neutral-500">
                Header and Footer are visible at the top and bottom of the page.
              </p>
              <p className="text-sm text-neutral-500">
                Sidebar layout is available for admin pages at <code className="px-2 py-1 bg-neutral-100 rounded">/admin</code>
              </p>
            </div>
          </section>
        </div>
      </Container>

      <Footer />
    </div>
  );
}
