import Link from "next/link";

const ROWS = [
  {
    want: "LinkedIn portal headline, tiers, CTA",
    where: "CTA Management → Social → LinkedIn → editor fields below",
  },
  {
    want: "Default FAQ / social proof for all LinkedIn visitors",
    where: (
      <>
        <code>constants/booking/portalConversionPacks.ts</code> (defaults) + editor overrides on Save
        Draft/Publish
      </>
    ),
  },
  {
    want: "Which platforms appear",
    where: (
      <>
        <code>constants/booking/channelGroups.ts</code> + enable/hide per channel in editor
      </>
    ),
  },
  {
    want: "Form submission labels in dashboard",
    where: (
      <>
        <code>constants/booking/interaction-sources.ts</code> — <code>SOURCE_LABEL</code> map
      </>
    ),
  },
  {
    want: "Google Sheet column layout",
    where: (
      <>
        <code>GOOGLE_SHEETS_RANGE</code> + <code>GOOGLE_SHEETS_HEADERS</code> in same file (Sheets sync
        Phase 2)
      </>
    ),
  },
  {
    want: "Public booking URL",
    where: (
      <>
        <code>/go/&#123;slug&#125;</code> — set <code>slug</code> in channel editor (e.g.{" "}
        <Link href="/go/linkedin" target="_blank" rel="noopener noreferrer">
          /go/linkedin
        </Link>
        )
      </>
    ),
  },
  {
    want: "Calendly URL sitewide",
    where: (
      <Link href="/dashboard/site-system/settings">Site Settings → Calendly URL</Link>
    ),
  },
  {
    want: "Newsletter signups",
    where: (
      <Link href="/dashboard/site-system/newsletter/subscribers">Newsletter → Subscribers</Link>
    ),
  },
];

export function BookingCrmQuickReference() {
  return (
    <div className="booking-crm-quick-ref">
      <h2>Quick reference — what each part controls</h2>
      <table className="dashboard-table booking-crm-quick-ref-table">
        <thead>
          <tr>
            <th>You want to change…</th>
            <th>Where</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.want}>
              <td>{row.want}</td>
              <td>{row.where}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
