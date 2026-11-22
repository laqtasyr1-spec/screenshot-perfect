<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Plan tiers, rates, minimum and return math live only in `src/lib/plans.ts` (tested in `plans.test.ts`); UI must call it rather than re-deriving numbers, so calculator, cards and dashboards never disagree.
- Dashboards run on fictional data from `src/lib/demo-data.ts` through the in-memory `src/lib/demo-store.ts`; replace the store with a secure backend before any real money flows.
- The app is Arabic RTL-first: use logical spacing/position utilities (ps/pe, start/end) and wrap figures in the `num` utility so digits stay left-to-right.
- Motion effects live in `src/components/fx/` and CSS utilities in `src/styles.css` (spotlight, beam, aurora, shine); reuse them instead of one-off animations so the site's motion language stays consistent and respects reduced-motion.
- Money is a JS number only inside the demo store; a real backend must store amounts as integer cents (or a Decimal type), never floats, so rounding never drifts between ledger, returns and withdrawals.
- Plan math in `plans.ts` takes an optional `plans` list (default `PLANS`); store-backed screens pass `state.plans` so admin rate edits apply, while tier boundaries stay fixed constants.
- The brand mark exists once as `PillarEmblem` (detailed, `fx/Pillar.tsx`) and once as `LogoMark` (color / mono / favicon variants, `site/Logo.tsx`); `public/favicon.svg` and `favicon.ico` are generated from the favicon variant, so update all three together.
