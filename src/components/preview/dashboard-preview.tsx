"use client";

import { QuickStats } from "./quick-stats";
import { NotificationCenter } from "./notification-center";
import { UserProfileCard } from "./user-profile-card";
import { RevenueChart } from "./revenue-chart";
import { QuickActions } from "./quick-actions";
import { PaymentForm } from "./payment-form";
import { SettingsToggles } from "./settings-toggles";
import { ActiveSessions } from "./active-sessions";
import { RecentActivityTable } from "./recent-activity-table";
import { SearchCommand } from "./search-command";
import { TeamMembers } from "./team-members";
import { MiniProgressStats } from "./mini-progress-stats";
import { AlertBanner } from "./alert-banner";
import { QuickLinks } from "./quick-links";
import { UpcomingEvents } from "./upcoming-events";
import { PricingTable } from "./pricing-table";
import { LoginForm } from "./login-form";
import { DeleteDialog } from "./delete-dialog";
import { FileUpload } from "./file-upload";
import { FaqAccordion } from "./faq-accordion";
import { SidebarRail } from "./sidebar-rail";

export function DashboardPreview() {
  return (
    <div className="flex flex-1 min-h-0 bg-background">
      <SidebarRail />
      <div className="flex-1 overflow-y-auto">
      <div className="w-full p-6 space-y-6">
        {/* Section 1: 4-column masonry layout */}
        <div className="columns-1 md:columns-2 lg:columns-4 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {/* Col 1 */}
          <RecentActivityTable />
          <QuickActions />
          <SearchCommand />
          {/* Col 2 */}
          <AlertBanner />
          <NotificationCenter />
          <ActiveSessions />
          {/* Col 3 */}
          <PaymentForm />
          <MiniProgressStats />
          <UpcomingEvents />
          <QuickLinks />
          {/* Col 4 */}
          <SettingsToggles />
          <TeamMembers />
          <UserProfileCard />
          <QuickStats />
        </div>

        {/* Section 2: 2-column paired layout */}
        <div className="columns-1 md:columns-2 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid">
          <RevenueChart />
          <LoginForm />
          <FileUpload />
          <PricingTable />
          <DeleteDialog />
          <FaqAccordion />
        </div>
      </div>
      </div>
    </div>
  );
}
