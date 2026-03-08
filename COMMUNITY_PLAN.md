# IMPLEMENTATION PLAN: JIMBO COMNUNITY GRID v1.0

> **OBJECTIVE**: Transform standard blog layout into a dynamic 3-column Community Platform (inspired by `dev.to`), strictly preserving the "Cyberpunk Elite" visual identity.

## 1. VISUAL & STRUCTURAL ARCHITECTURE

We will deploy a responsive **CSS Grid System** (Holy Grail Layout) that adapts to the viewport.

### The Grid (Desktop View)
| LEFT FLANK (20%) | MAIN SECTOR (55%) | RIGHT FLANK (25%) |
| :--- | :--- | :--- |
| **"Nerve Center"** | **"The Feed"** | **"Netrunners & Data"** |
| • Tech Categories (Icons) | • Main Article Stream | • Community Activity |
| • Daily Cyber-News | • Quick Links | • Cross-Promo (Ads) |
| • Scraper Widget | | • Trending Tags |

### The Aesthetic Rules (Immutable)
*   **Glassmorphism**: Sidebars will have heavy blur (`backdrop-blur-xl`) with low opacity (`bg-black/40`) to blend with the animated background.
*   **Borders**: `border-white/5` for structure, `border-red-500/20` for accents.
*   **Typography**: Headers in `Kenyan Coffee`, Data in `SF TransRobotics`.

---

## 2. COMPONENT BREAKDOWN

### A. LEFT SIDEBAR ("Nerve Center")
**Purpose**: Navigation & Quick Intelligence.

1.  **`CategoryNav.jsx`**:
    *   Vertical list of neon icons (React, AI, Python, DevOps).
    *   Effect: Glow on hover (`shadow-[0_0_15px_cyan]`).
2.  **`DailyBrief.jsx`** (The "Scraper" Placeholder):
    *   **Visual**: A terminal-like box or "glitch" card.
    *   **Content**: Random tech quotes, "Daily News" headlines (placeholder data arrays for now), External Tutorial links.
    *   **Backend Prep**: Structure compatible with future AI scraper injection.

### B. CENTER STAGE ("The Feed")
**Purpose**: Core Content Delivery.

1.  **Refactor `Home.jsx`**:
    *   Move existing `BlogCard` list here.
    *   Ensure cards scale correctly to the slightly narrower width.

### C. RIGHT SIDEBAR ("Netrunners")
**Purpose**: Community & Growth.

1.  **`CommunityPulse.jsx`**:
    *   **Visual**: Scrollable container (`max-h-screen`, custom slim scrollbar).
    *   **Content**: List of "Active Agents" (User avatars + names). Mock data until we hit 30-50 users.
2.  **`HoloAd.jsx`**:
    *   **Visual**: High-contrast, animated frame.
    *   **Function**: Permanent promo for the "Second Blog" or internal tools.

---

## 3. IMPLEMENTATION STEPS (CRUSH SQUAD)

### Phase 1: The Frame (Layout)
*   [ ] Create `CommunityLayout.jsx`: The master grid container.
*   [ ] Update `src/index.css`: Add utility classes for the 3-column grid specifics.

### Phase 2: The Components
*   [ ] Build `SidebarLeft` with `CategoryItem` components.
*   [ ] Build `DailyBrief` widget.
*   [ ] Build `SidebarRight` with `MemberRow` components.
*   [ ] Build `PromoWidget` (The "Ad").

### Phase 3: Integration
*   [ ] Replace `Home.jsx` content layout with the new Community Grid.
*   [ ] Verify responsiveness (Collapsible sidebars on Mobile).

---

## 4. VERIFICATION
*   **Visual Check**: Does it look "Super Mega Nice"? (Cyberpunk check).
*   **Grid Check**: Do the 3 columns sit correctly on 1920x1080?
*   **Mobile Check**: Does it stack gracefully on phone?

**AWAITING APPROVAL TO EXECUTE.**
