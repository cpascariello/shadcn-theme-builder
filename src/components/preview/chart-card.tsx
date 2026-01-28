"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/context/theme-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", total: 4500 },
  { name: "Feb", total: 3200 },
  { name: "Mar", total: 6100 },
  { name: "Apr", total: 4800 },
  { name: "May", total: 7200 },
  { name: "Jun", total: 5900 },
];

export function ChartCard() {
  const { previewMode, light, dark } = useTheme();
  const colors = previewMode === "light" ? light : dark;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis
              dataKey="name"
              stroke={colors["muted-foreground"]}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={colors["muted-foreground"]}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.popover,
                borderColor: colors.border,
                color: colors["popover-foreground"],
                borderRadius: "0.5rem",
              }}
            />
            <Bar dataKey="total" fill={colors["chart-1"]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
