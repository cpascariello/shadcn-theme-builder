"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

const events = [
  { title: "Team Standup", time: "10:00 AM", tag: "Daily" },
  { title: "Design Review", time: "2:00 PM", tag: "Weekly" },
  { title: "Sprint Planning", time: "4:00 PM", tag: "Biweekly" },
];

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event) => (
          <div key={event.title} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.time}
              </p>
            </div>
            <Badge variant="secondary">{event.tag}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
