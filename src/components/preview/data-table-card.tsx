"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orders = [
  { id: "ORD001", status: "Completed", amount: "$250.00", date: "2024-01-15" },
  { id: "ORD002", status: "Processing", amount: "$150.00", date: "2024-01-14" },
  { id: "ORD003", status: "Failed", amount: "$350.00", date: "2024-01-13" },
  { id: "ORD004", status: "Pending", amount: "$450.00", date: "2024-01-12" },
  { id: "ORD005", status: "Completed", amount: "$550.00", date: "2024-01-11" },
];

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Completed": return "default";
    case "Processing": return "secondary";
    case "Failed": return "destructive";
    case "Pending": return "outline";
    default: return "default";
  }
}

export function DataTableCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell className="text-right">{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
