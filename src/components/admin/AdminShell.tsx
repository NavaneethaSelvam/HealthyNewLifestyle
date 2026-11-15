import Link from "next/link";
import type { ReactNode } from "react";

const modules = [
  "Products",
  "Categories",
  "Pages",
  "Navigation",
  "Policies",
  "Orders",
  "Settings",
];

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="hnl-admin">
      <header className="hnl-admin-header">
        <Link className="hnl-admin-title" href="/admin">
          HealthyNewLifestyle
        </Link>
        <span>OrganicandNutrition</span>
      </header>
      <div className="hnl-admin-layout">
        <aside className="hnl-admin-sidebar" aria-label="Administration">
          <p>Administration</p>
          <ul>
            <li aria-current="page">Overview</li>
            {modules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
        </aside>
        <main className="hnl-admin-content">{children}</main>
      </div>
    </div>
  );
}
