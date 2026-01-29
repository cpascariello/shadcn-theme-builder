"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const activities = [
  { id: "INV-001", user: "Alice Martin", action: "Created invoice", status: "completed", date: "2 min ago" },
  { id: "USR-042", user: "Bob Smith", action: "Updated profile", status: "completed", date: "15 min ago" },
  { id: "ORD-789", user: "Carol White", action: "New order placed", status: "pending", date: "1 hr ago" },
  { id: "PAY-156", user: "David Lee", action: "Payment failed", status: "failed", date: "2 hrs ago" },
  { id: "DEP-023", user: "Eva Chen", action: "Deployed to prod", status: "completed", date: "3 hrs ago" },
];

function getStatusVariant(status: string) {
  switch (status) {
    case "completed":
      return "default" as const;
    case "pending":
      return "secondary" as const;
    case "failed":
      return "destructive" as const;
    default:
      return "default" as const;
  }
}

export function RecentActivityTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm">ID</TableHead>
              <TableHead className="text-sm">User</TableHead>
              <TableHead className="text-sm">Action</TableHead>
              <TableHead className="text-sm">Status</TableHead>
              <TableHead className="text-sm">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-mono text-xs">{activity.id}</TableCell>
                <TableCell className="text-sm">{activity.user}</TableCell>
                <TableCell className="text-sm">{activity.action}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(activity.status)}>
                    {activity.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
