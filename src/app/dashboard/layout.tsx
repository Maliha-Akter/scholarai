// src/app/dashboard/layout.tsx
import React from 'react';
import DashboardLayoutClient from './DashboardLayoutClient';
import { requireRole } from '../lib/security/session'; // Adjust path if not using "@/" alias (e.g., "../../lib/security/session")

// ✅ Metadata stays here cleanly without throwing Client Component errors!
export const metadata = {
    title: {
        default: "Dashboard | HomeVault",
        template: "%s | HomeVault",
    },
    description: "Manage your inventory items, categories, and track home asset statistics cleanly.",
};

// 1. Make the layout function async
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 2. Enforce authentication and role verification on the server
    // If they aren't logged in or lack the 'user' role, requireRole() automatically redirects them!
    const user = await requireRole('user');

    // 3. Render the client wrapper and children if the check passes
    return (
        <DashboardLayoutClient>
            {children}
        </DashboardLayoutClient>
    );
}