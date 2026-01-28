"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const sales = [
  { name: "Olivia Martin", email: "olivia@email.com", amount: "+$1,999.00", initials: "OM" },
  { name: "Jackson Lee", email: "jackson@email.com", amount: "+$39.00", initials: "JL" },
  { name: "Isabella Nguyen", email: "isabella@email.com", amount: "+$299.00", initials: "IN" },
  { name: "William Kim", email: "will@email.com", amount: "+$99.00", initials: "WK" },
  { name: "Sofia Davis", email: "sofia@email.com", amount: "+$39.00", initials: "SD" },
];

export function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale.email} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {sale.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.name}</p>
                <p className="text-sm text-muted-foreground">{sale.email}</p>
              </div>
              <div className="font-medium">{sale.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
