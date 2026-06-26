# TeamSphere — Claude Design Prompt Library

A modular prompt doc for building a distinctive, production-grade UI for TeamSphere in Claude Design. Each section is a self-contained prompt you can paste, iterate on, then move to the next. Building screen-by-screen (instead of one mega-prompt) is what keeps the output from looking vibe-coded — Claude Design has room to be intentional about each surface, and you stay in control of the design language.

---

## How to use this doc

1. **Start with Prompt 0 (Design System).** This sets the foundation — colors, type, spacing, theming. Get it right before touching screens.
2. **Then build screens in order:** Auth → App Shell → Dashboard → Projects → Tasks → Teams → Attendance.
3. **After each screen, iterate** with the refinement prompts at the bottom rather than regenerating from scratch.
4. **Reuse the design tokens.** Every screen prompt references the system from Prompt 0 so the language stays consistent. Don't let each screen invent its own palette — that's the #1 tell of vibe-coded UI.
5. **Paste real data shapes.** The Data Models from your README are included where relevant so the components reflect actual fields, not lorem ipsum.

---

## Prompt 0 — The Design System (do this first)

> I'm building the design language for **TeamSphere**, a team & project management SaaS (teams, projects, tasks, employee attendance). I want a distinctive, production-grade visual system — not a generic dashboard template. Before building any screens, establish a complete design system as a single reference artifact.
>
> **Brand personality:** calm, precise, trustworthy, slightly editorial. Think "operational clarity" — a tool serious teams use all day. Avoid the overused indigo-gradient-glassmorphism SaaS look. I want something with a point of view.
>
> **Deliver a design system page that includes:**
>
> **1. Color system (light + dark)**
> - A primary brand color that isn't default-Tailwind-blue. Pick something with character — a deep teal, a warm slate-and-amber pairing, or a muted forest/clay combination. Give me one option you'd actually ship and commit to it.
> - Full neutral ramp (50→950) used for surfaces, borders, text.
> - Semantic colors: success, warning, danger, info — tuned to sit in the palette, not stock.
> - Define both themes as CSS custom properties (`--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-muted`, `--color-primary`, etc.) so light/dark is a token swap, not duplicated styles.
> - The dark theme must be genuinely contrasting and gorgeous — not just inverted. Use a near-black or deep-desaturated base, elevated surfaces with subtle layering, and primary color that glows slightly against the dark.
>
> **2. Typography**
> - Pick an eye-catching but legible type pairing. A characterful display/heading font (something like a modern grotesque or a refined serif for headings) + a clean readable sans for body/UI. Avoid plain system-ui everywhere — give it identity. Suggest specific Google Fonts.
> - Define a full type scale (display, h1–h4, body, small, caption) with line-heights and weights.
>
> **3. Spacing, radii, elevation**
> - 4px-based spacing scale, radius scale (I lean toward soft-but-not-pill — ~8–12px on cards), and a restrained shadow system that works in both themes (shadows barely show in dark mode — use borders + surface elevation there instead).
>
> **4. Core components, themed in both modes:**
> - Buttons (primary, secondary, ghost, danger, icon-only) with hover/active/focus/disabled states
> - Inputs, selects, textareas with focus rings
> - Cards
> - Badges/pills (for task status: todo / in_progress / done, and roles: admin / manager / member)
> - Modal shell
> - Toast/notification
> - Avatar + avatar stack
>
> **Constraints:**
> - React functional components, Tailwind CSS v4, theming via CSS custom properties + the `dark:` variant.
> - Responsive and accessible (visible focus states, WCAG-AA contrast in both themes).
> - Render every component in a clean showcase with a light/dark toggle so I can see the full system at once.
>
> Show me the system first. Once I approve it, we'll build screens on top of it.

**Why this matters:** Lock the tokens here and every later screen inherits them. This single step is what separates "designed" from "vibe-coded."

---

## Prompt 1 — Auth Screens (Login / Register / Forgot Password)

> Using the TeamSphere design system we established (same colors, fonts, tokens, light/dark theming), design the **authentication screens**: Login, Register, and Forgot Password.
>
> **Layout direction — make it distinctive, not a centered card on a gradient:**
> - Split-screen: form on one side, an expressive brand panel on the other. The brand panel should *show* the product's value — an abstract, animated-feeling composition (subtle layered cards, a faint project-board motif, or a soft data-grid texture) in the brand colors. Not a stock photo. Not a meaningless blob.
> - On mobile, the brand panel collapses gracefully to a slim header and the form takes the full width.
>
> **Login:** email + password, "remember me", forgot-password link, submit, link to register. Show inline validation states (error under field, not just red border).
>
> **Register:** username + email + password (with a password-strength hint), submit, link to login.
>
> **Forgot Password:** email input + send-reset button + a success state ("check your inbox") that replaces the form.
>
> **Details:**
> - Use React Hook Form + Zod patterns in spirit — show real validation/error/loading states (disabled button + spinner on submit).
> - Smooth entry animation on the form (Framer Motion feel).
> - Full light/dark support with the theme toggle accessible on the auth screen.
> - Fully responsive down to ~360px.
>
> Give me all three screens in one artifact with a way to switch between them.

---

## Prompt 2 — The App Shell (Sidebar + Topbar + Layout)

> Design the **authenticated app shell** for TeamSphere — the persistent frame every page lives inside. This is the most important screen because it sets the tone for the whole product.
>
> **Sidebar (collapsible):**
> - Nav items: Dashboard, Projects, Tasks, Teams, Attendance. Each with a Lucide icon + label.
> - Active route gets a clear, elegant highlight (not just a background fill — consider an accent bar + tinted surface + slightly bolder label).
> - Collapsible to an icon-only rail with tooltips on hover. Smooth width transition.
> - Bottom section: user avatar + name + role badge, with a popover menu (profile, theme toggle, logout).
> - On mobile: sidebar becomes an off-canvas drawer with a backdrop, toggled from the topbar.
>
> **Topbar:**
> - Page title / breadcrumb on the left.
> - Right side: a search affordance, a notifications bell with an unread dot, theme toggle, and the user avatar.
>
> **Content area:**
> - Comfortable max-width, generous padding, with a placeholder page inside so I can see the proportions.
>
> **Requirements:**
> - Use the established design system (colors, type, tokens).
> - Beautiful in both light and dark — the dark theme shell especially should feel premium (layered surfaces, subtle borders instead of heavy shadows).
> - Fully responsive: desktop (full sidebar), tablet (collapsed rail), mobile (drawer).
> - React functional components, Tailwind v4, Framer Motion for the transitions.
>
> Build the shell with working collapse + mobile drawer behavior and a dummy content slot.

---

## Prompt 3 — Dashboard

> Design the **TeamSphere Dashboard** inside the app shell, using our design system.
>
> **Content:**
> - Four animated **stat cards** at the top: Projects, Tasks, Teams, Attendance records — each with a live count, a small trend indicator, and an icon. Counts should count-up on mount (Framer Motion). Give each card subtle individual identity via the semantic/brand colors without breaking cohesion.
> - A **recent activity** feed or a **tasks-by-status** breakdown (todo / in_progress / done) — visualized as an elegant segmented bar or a compact chart, not a heavy library default.
> - A **recent projects** strip (cards showing name + description + a tiny meta row).
> - A loading state (skeletons, not a spinner) and a friendly empty/error state.
>
> **Direction:**
> - This is the first thing users see — make it feel calm and information-dense without clutter. Strong visual hierarchy, lots of intentional whitespace.
> - The stat cards are the hero — make them genuinely eye-catching in both themes. In dark mode they should subtly glow.
> - Responsive: 4-up on desktop → 2-up on tablet → stacked on mobile.
>
> React functional components, Tailwind v4, Framer Motion, Lucide icons. Include realistic dummy data.

---

## Prompt 4 — Projects Page

> Design the **Projects** page for TeamSphere, using our design system and inside the app shell.
>
> **Data per project:** `name`, `description`, `owner` (user), optional `team`, `created_at`.
>
> **Layout:**
> - Page header with title, a project count, and a prominent "New Project" button.
> - A responsive **card grid** of projects. Each card: project name (display font), description (truncated with line-clamp), an owner avatar, an optional team badge, and a created-at meta. Hover state with a subtle lift/border-accent. A kebab menu for edit/delete.
> - A **create-project modal**: name + description fields, with validation, loading state on submit, and a clean cancel/confirm footer. Use our modal shell.
> - States: loading (skeleton cards), empty ("No projects yet" with an illustration-feel and a CTA), error.
>
> Responsive grid: 3-up desktop → 2-up tablet → 1-up mobile. Both themes. React functional components, Tailwind v4, Framer Motion, Lucide.

---

## Prompt 5 — Tasks Page

> Design the **Tasks** page for TeamSphere, using our design system, inside the app shell.
>
> **Data per task:** `title`, `description`, `project` (name shown), `assignee` (user, optional), `status` (todo / in_progress / done), `due_date` (optional), `created_at`.
>
> **Give me two views the user can toggle between:**
> 1. **Board view (Kanban):** three columns — To Do, In Progress, Done — with task cards that show title, project badge, assignee avatar, and a due-date chip (highlight if overdue). Columns scroll independently. Cards have a drag-handle affordance (visual only is fine).
> 2. **List/table view:** a clean, dense table — title, project, assignee, status pill, due date, created. Sortable-looking headers, row hover.
>
> **Plus:**
> - Header with title + view toggle + "New Task" button + a status filter.
> - **Create-task modal:** title, description, project dropdown, assignee dropdown, status, due-date picker — with validation and loading state.
> - Status pills must use our semantic colors consistently across both views.
> - Loading skeletons + empty + error states.
>
> Responsive (board scrolls horizontally on mobile; table collapses to stacked cards). Both themes. React functional components, Tailwind v4, Framer Motion, Lucide.

---

## Prompt 6 — Teams Page

> Design the **Teams** page for TeamSphere, using our design system, inside the app shell.
>
> **Data per team:** `name`, `members` (many users), `created_at`.
>
> **Layout:**
> - Header with title, team count, "New Team" button.
> - A responsive card grid. Each team card: team name, a **member avatar stack** (overflow shows "+N"), member count, created-at, and a kebab menu. Make the avatar stack a focal point.
> - Clicking a card opens a **team detail** drawer/panel: full member list with roles (admin/manager/member badges), and an add-member affordance.
> - **Create-team modal:** name field + optional member multi-select (chips). Validation + loading state.
> - Loading / empty / error states.
>
> Responsive grid. Both themes. React functional components, Tailwind v4, Framer Motion, Lucide.

---

## Prompt 7 — Attendance Page

> Design the **Attendance** page for TeamSphere, using our design system, inside the app shell.
>
> **Data per record:** `user`, `date`, `check_in` (datetime), `check_out` (optional datetime).
>
> **Layout:**
> - Header with title, a date-range selector, and a "Check In / Check Out" primary action that reflects the current user's state (shows "Check In" or, if already in, "Check Out" with elapsed time).
> - A summary row: present today, average hours, etc. — small stat chips.
> - The main view: a clean **attendance table** grouped by date — user avatar + name, check-in time, check-out time, computed duration, and a status indicator (present / incomplete / absent). Highlight missing check-outs.
> - Optionally a compact **calendar heatmap** of attendance density for the selected user/range.
> - Loading / empty / error states.
>
> Responsive: table collapses to stacked record cards on mobile. Both themes. React functional components, Tailwind v4, Framer Motion, Lucide.

---

## Refinement prompts (iterate, don't regenerate)

Use these *after* a screen exists to push it from good to distinctive:

- **"The dark theme feels flat. Add depth: layered surface elevations, subtle 1px borders that catch light, and make the primary color glow slightly against the dark base. Keep light mode unchanged."**
- **"This reads a bit generic / templated. Give it more editorial character — stronger type contrast between the display font and body, more intentional whitespace, and one signature detail that makes it unmistakably TeamSphere."**
- **"Tighten the responsive behavior: show me exactly how this looks at 360px, 768px, and 1440px. Fix anything that breaks or feels cramped on mobile."**
- **"The color usage is inconsistent with our system. Audit every color against the design tokens from Prompt 0 and replace any one-off values."**
- **"Add the micro-interactions: hover lifts, focus rings, button press states, and entry animations. Subtle and fast (150–250ms), never bouncy or distracting."**
- **"Improve the empty and loading states — skeletons that match the real layout, and empty states with personality and a clear CTA."**
- **"Run an accessibility pass: contrast ratios in both themes, focus order, visible focus indicators, and aria labels on icon-only buttons."**

---

## Anti-"vibe-coded" checklist

Paste this as a final review prompt once all screens are built:

> Review the entire TeamSphere design against these criteria and fix any failures:
> 1. **Consistent tokens** — every color, font, radius, and spacing value traces back to the design system. No one-off hardcoded values.
> 2. **No default-template smell** — not stock Tailwind blue, not generic glassmorphism, not the default shadcn look untouched. It has a clear point of view.
> 3. **Type has identity** — distinct, intentional display/body pairing with real hierarchy.
> 4. **Dark mode is designed, not inverted** — layered, contrasting, premium.
> 5. **Responsive at 360 / 768 / 1024 / 1440** — nothing breaks, nothing feels cramped.
> 6. **States everywhere** — loading, empty, error, hover, focus, active, disabled.
> 7. **Accessible** — AA contrast, visible focus, labeled controls.
> 8. **Micro-interactions** — present but restrained.
>
> Give me a short report on what passed and what you fixed.

---

## A note on order & scope

Don't try to one-shot the whole app in a single prompt — that's exactly what produces flat, samey output. Build the system (Prompt 0), approve it, then layer screens on top. Each screen prompt deliberately re-states "using our design system" so Claude Design keeps inheriting the same language instead of reinventing it every time. That repetition is the trick: consistency *is* the polish.
