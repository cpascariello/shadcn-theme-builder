"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/context/theme-context";

const monthlyData = [
  { name: "Jan", revenue: 4000, expenses: 2400 },
  { name: "Feb", revenue: 3000, expenses: 1398 },
  { name: "Mar", revenue: 5000, expenses: 3200 },
  { name: "Apr", revenue: 4780, expenses: 2908 },
  { name: "May", revenue: 5890, expenses: 3800 },
  { name: "Jun", revenue: 6390, expenses: 3490 },
  { name: "Jul", revenue: 7490, expenses: 4300 },
];

export function RevenueChart() {
  const { previewMode, light, dark } = useTheme();
  const colors = previewMode === "light" ? light : dark;

  const chart1Color = colors["chart-1"];
  const chart2Color = colors["chart-2"];
  const mutedForeground = colors["muted-foreground"];
  const borderColor = colors.border;
  const popoverBg = colors.popover;
  const popoverFg = colors["popover-foreground"];

  const commonXAxisProps = {
    dataKey: "name",
    stroke: mutedForeground,
    fontSize: 12,
    tickLine: false,
    axisLine: false,
  };

  const commonYAxisProps = {
    stroke: mutedForeground,
    fontSize: 12,
    tickLine: false,
    axisLine: false,
  };

  const tooltipStyle = {
    backgroundColor: popoverBg,
    borderColor: borderColor,
    color: popoverFg,
    borderRadius: "0.5rem",
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                <XAxis {...commonXAxisProps} />
                <YAxis {...commonYAxisProps} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={chart1Color}
                  fill={chart1Color}
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke={chart2Color}
                  fill={chart2Color}
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="revenue">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                <XAxis {...commonXAxisProps} />
                <YAxis {...commonYAxisProps} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={chart1Color}
                  fill={chart1Color}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="expenses">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                <XAxis {...commonXAxisProps} />
                <YAxis {...commonYAxisProps} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke={chart2Color}
                  fill={chart2Color}
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
