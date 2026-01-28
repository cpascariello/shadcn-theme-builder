"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, AlertCircle } from "lucide-react";

export function ComponentShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Showcase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Buttons */}
        <div>
          <h4 className="text-sm font-medium mb-3">Buttons</h4>
          <div className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h4 className="text-sm font-medium mb-3">Badges</h4>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        {/* Inputs */}
        <div>
          <h4 className="text-sm font-medium mb-3">Form Elements</h4>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="showcase-email">Email</Label>
              <Input id="showcase-email" type="email" placeholder="name@example.com" className="w-64" />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="showcase-switch" />
              <Label htmlFor="showcase-switch">Dark mode</Label>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div>
          <h4 className="text-sm font-medium mb-3">Alerts</h4>
          <div className="space-y-3">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You can customize all these components using the color editor.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Something went wrong. This is a destructive alert example.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <h4 className="text-sm font-medium mb-3">Tabs</h4>
          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="text-sm text-muted-foreground p-2">
              Manage your account settings and preferences.
            </TabsContent>
            <TabsContent value="password" className="text-sm text-muted-foreground p-2">
              Change your password and security settings.
            </TabsContent>
            <TabsContent value="settings" className="text-sm text-muted-foreground p-2">
              Configure your application preferences.
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
