# Sidebar Integration

This project uses the [shadcn/ui sidebar component](https://ui.shadcn.com/docs/components/sidebar) for navigation in the dashboard.

## Structure

The sidebar implementation consists of these main components:

- `SidebarProvider` - Handles the sidebar state (expanded/collapsed)
- `Sidebar` - The sidebar container
- `SidebarHeader` - The header section of the sidebar
- `SidebarContent` - The scrollable content area
- `SidebarFooter` - The footer section of the sidebar
- `SidebarGroup` - A section within the content area
- `SidebarMenu` - A navigation menu
- `SidebarTrigger` - The button to toggle the sidebar

## Usage

The sidebar is used in the dashboard layout:

```tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "../components/sidebar-trigger";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-1 min-h-screen">
        <AppSidebar user={user} />
        <div className="flex flex-col flex-1">
          <header className="flex items-center h-14 px-4 border-b">
            <SidebarTrigger />
            <div className="ml-auto"></div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
```

## Customization

The sidebar can be customized in several ways:

1. **Appearance**: The sidebar uses CSS variables for theming. These are defined in `globals.css` and can be modified.

2. **Navigation**: The menu items in the sidebar can be modified in `app-sidebar.tsx`.

3. **Behavior**: The sidebar can be configured to collapse to different states:
   - `offcanvas` - Collapses completely off-screen
   - `icon` - Collapses to just show icons
   - `none` - Doesn't collapse

For more information on customization options, refer to the [shadcn/ui sidebar documentation](https://ui.shadcn.com/docs/components/sidebar). 