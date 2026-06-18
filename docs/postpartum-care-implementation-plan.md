# Postpartum Care Implementation Plan

## Core Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Account model | **Same account, phase-based** | A pregnancy-profile seamlessly transitions to postpartum after delivery — no second login, no data loss |
| New user type | `"postpartum"` role + pregnancy profile with `phase='postpartum'` | Distinguishes "never pregnant here, starting postpartum" from "pregnant user who transitioned" |
| Role vs. Phase | **`phase` is a field on `PregnancyProfile`**, not a new role | Keeps `mother` role for nav/permissions; `phase` drives what content is shown |
| Content model | New `PostpartumWeekContent` table (weeks 1–52) | Separate from pregnancy's `WeekContent` (1–42) to avoid schema conflicts |
| Transition trigger | User records delivery date → system auto-calculates postpartum week | Mirrors existing LMP → week calculation pattern |

---

## Phase Transition Flow

```
                         ┌─────────────────────────────┐
                         │   User signs up as mother    │
                         └─────────────┬───────────────┘
                                       │
                              ┌────────┴────────┐
                              │ Has due date /  │
                              │     LMP?        │
                              └───┬─────────┬───┘
                                  │         │
                          Yes ┌───┘         └───┐ No, is postpartum
                              │                  │
                     ┌────────▼────────┐  ┌──────▼──────────────┐
                     │ Pregnancy Phase │  │ Sign up with        │
                     └────────┬────────┘  │ postpartum role     │
                              │            └──────┬──────────────┘
                     ┌────────▼────────┐         │
                     │Pregnancy        │  ┌──────▼──────────────┐
                     │Dashboard        │  │Postpartum Profile   │
                     └────────┬────────┘  │Completion           │
                              │            └──────┬──────────────┘
                     ┌────────▼────────┐         │
                     │Weekly Journey   │  ┌──────▼──────────────┐
                     │weeks 1-42       │  │Enter delivery date  │
                     └────────┬────────┘  └──────┬──────────────┘
                              │                  │
                     ┌────────▼────────┐  ┌──────▼──────────────┐
                     │User records     │  │Postpartum Phase     │
                     │delivery ────────┼──►phase = postpartum   │
                     └─────────────────┘  └──────┬──────────────┘
                                                  │
              ┌───────────────────┐      ┌────────▼────────┐
              │ auto-detect: due  │      │Postpartum        │
              │ date passed?      │      │Dashboard         │
              │ + 14 days         │      └────────┬────────┘
              └────────┬──────────┘               │
                       │                 ┌────────▼────────┐
              ┌────────▼────────┐       │Postpartum Journey│
              │Prompt: Did you  │       │weeks 1-52        │
              │deliver? ────────┼───Yes──►                  │
              └─────────────────┘       └───────────────────┘
```

---

## Phase 1: Database Schema Changes

### 1a. Extend `PregnancyProfile`

Add 3 fields to the existing model:

```prisma
model PregnancyProfile {
  // ... existing fields ...
  deliveryDate          DateTime? @map("delivery_date")  // when baby was born
  phase                 String    @default("pregnancy") @map("phase") // 'pregnancy' | 'postpartum'
  postpartumWeek        Int?      @map("postpartum_week") // 1-52, weeks since delivery
}
```

### 1b. New `PostpartumWeekContent` Table

```prisma
model PostpartumWeekContent {
  id              String   @id @default(uuid())
  weekNumber      Int      @map("week_number")       // 1-52
  languageId      String   @map("language_id")
  title           String
  summary         String
  bodyMarkdown    String   @map("body_markdown")
  recoveryNotes   String?  @map("recovery_notes")     // pelvic floor, c-section healing
  babyCareNotes   String?  @map("baby_care_notes")    // feeding, sleeping, milestones
  mentalHealthNotes String? @map("mental_health_notes") // baby blues, PPD screening
  activityNotes   String?  @map("activity_notes")
  warningSigns    String?  @map("warning_signs")
  createdBy       String   @map("created_by")
  updatedBy       String?  @map("updated_by")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  language      Language
  createdByUser User     @relation("PostpartumCreatedBy")
  updatedByUser User?    @relation("PostpartumUpdatedBy")

  @@unique([weekNumber, languageId])
  @@map("postpartum_week_content")
}
```

### 1c. Seed `'postpartum'` Role

Insert `'postpartum'` into the `Role` table via migration.

---

## Phase 2: Auth & Signup Changes

### 2a. Signup Route

File: `src/app/api/v1/auth/signup/route.ts`

```ts
role: z.enum(['mother', 'partner', 'caregiver', 'family', 'admin', 'postpartum']).default('mother'),
```

### 2b. Signup Page

File: `src/app/[locale]/(public)/signup/page.tsx`

Add postpartum role option with `deliveryDate` field that appears when `postpartum` is selected.

### 2c. Auth Provider

File: `src/components/auth-provider.tsx`

Add `isPostpartum` helper alongside existing `isMother`, `isPartner`, `isAdmin`.

---

## Phase 3: Postpartum Profile Completion

**New page**: `src/app/[locale]/(authenticated)/profile/complete-postpartum/page.tsx`

Fields collected:
- `deliveryDate` (required)
- `deliveryType` (vaginal / c-section / assisted)
- `babyBirthWeight` (kg)
- `babyGender` (boy / girl / prefer-not-say)
- `breastfeedingStatus` (exclusive / mixed / formula)
- `complications` (hemorrhage, infection, preeclampsia, etc.)
- `currentWeight`, `currentHeight` (for BMI recovery tracking)
- `mentalHealthScreening` (EPDS-style quick questions)

Existing `/profile/complete` is unchanged; routing logic directs postpartum users to the new page instead.

---

## Phase 4: Postpartum Calculator Utility

**New file**: `src/lib/postpartum-calculator.ts`

Mirrors the existing `calcPregnancyFromLmp` pattern:

```ts
interface PostpartumWeekInfo {
  week: number;           // 1-52
  day: number;            // days since delivery
  monthsPostpartum: number;
  recoveryPhase: 'immediate' | 'early' | 'late' | 'extended';
  // immediate: weeks 1-2, early: 3-12, late: 13-26, extended: 27-52
  recommendedFollowUp: boolean; // week 6 check-up reminder
}
```

---

## Phase 5: API Routes

### 5a. Extend `/profile/pregnancy`

File: `src/app/api/v1/profile/pregnancy/route.ts`

Add `phase`, `deliveryDate`, `postpartumWeek` to GET/POST/PUT.

### 5b. New `POST /api/v1/profile/pregnancy/transition`

Records delivery, sets `phase='postpartum'`, `postpartumWeek=1`, calculates from `deliveryDate`.

### 5c. Extend `/weekly-journey`

File: `src/app/api/v1/weekly-journey/route.ts`

Add `contentType` query param (`'pregnancy'` | `'postpartum'`). When `postpartum`, queries `PostpartumWeekContent` instead of `WeekContent`.

### 5d. New `/api/v1/profile/postpartum-health`

CRUD for postpartum-specific health data (recovery progress, breastfeeding logs, baby weight tracking).

---

## Phase 6: Postpartum Dashboard

The `mother/page.tsx` will become a **smart router**:

```
if phase === 'pregnancy' → render existing pregnancy dashboard
if phase === 'postpartum' → render postpartum dashboard
```

**Postpartum dashboard components** (replaces pregnancy-specific widgets):
- **Recovery Progress** card — shows postpartum week, recovery phase, 6-week check-up countdown
- **Baby Care** card — feeding log, diaper count, weight tracking
- **Pelvic Floor Exercises** card — daily reminder + exercise guide
- **Mental Health** card — mood tracker (keep existing), PP depression screening link
- **Breastfeeding Support** card — tips, latch guide, common issues
- **Warning Signs** card — postpartum hemorrhage, infection, DVT, PPD red flags
- Keep existing: symptoms, appointments, chat, support requests (all still relevant)

---

## Phase 7: Navigation & Shell Changes

### 7a. Navigation Items

File: `src/components/authenticated-shell.tsx`

The `useNavItems()` function becomes phase-aware:

```ts
// Mother nav items conditionally rendered:
{ labelKey: 'myDashboard', href: '/mother', icon: Heart, roles: ['mother'], phases: ['pregnancy', 'postpartum'] },
{ labelKey: 'weeklyJourney', href: '/weekly-journey', icon: BookOpen, roles: ['mother'], phases: ['pregnancy', 'postpartum'] },
{ labelKey: 'postpartumRecovery', href: '/postpartum-recovery', icon: Activity, roles: ['mother'], phases: ['postpartum'] },
{ labelKey: 'babyTracker', href: '/baby-tracker', icon: Baby, roles: ['mother'], phases: ['postpartum'] },
{ labelKey: 'mealPlanner', href: '/meal-planner', icon: UtensilsCrossed, roles: ['mother'], phases: ['pregnancy', 'postpartum'] },
{ labelKey: 'pelvicFloor', href: '/pelvic-floor', icon: Dumbbell, roles: ['mother'], phases: ['postpartum'] },
```

### 7b. NavItem Interface

The `NavItem` interface gains optional `phases?: string[]`; filtering logic checks both roles and phases.

---

## Phase 8: Weekly Journey (Postpartum)

File: `src/app/[locale]/(authenticated)/weekly-journey/page.tsx`

Extended behavior:
- When `phase === 'postpartum'`, fetches from `PostpartumWeekContent` instead of `WeekContent`
- Shows weeks 1–52 (not 1–42)
- **Recovery stage badges**: "Immediate Recovery" (w1-2), "Early Recovery" (w3-12), "Late Recovery" (w13-26), "Extended Recovery" (w27-52)
- Sections: Recovery Notes, Baby Care, Mental Health, Activity Guidelines, Warning Signs
- The existing `parseMarkdownSections()` helper works as-is since the markdown structure is the same

---

## Phase 9: Partner Integration

### 9a. Partner Dashboard

File: `src/app/[locale]/(authenticated)/partner/page.tsx`

Detect mother's phase, show postpartum-specific partner tasks:
- "Help with night feedings"
- "Watch for signs of postpartum depression"
- "Ensure mom gets 6-week checkup"
- "Take over household chores for recovery"

### 9b. Partner Tasks Page

File: `src/app/[locale]/(authenticated)/partner/tasks/page.tsx`

Filter/add postpartum task categories.

### 9c. Mother Health API

File: `src/app/api/v1/partner/mother-health/route.ts`

Include `phase` and `postpartumWeek` in the response.

---

## Phase 10: Translations

All 8 locale files need a `postpartum` section:

```json
{
  "postpartum": {
    "title": "Postpartum Care",
    "recoveryTracker": "Recovery Progress",
    "phaseImmediate": "Immediate Recovery",
    "phaseEarly": "Early Recovery",
    "phaseLate": "Late Recovery",
    "phaseExtended": "Extended Recovery",
    "babyCare": "Baby Care",
    "breastfeeding": "Breastfeeding",
    "pelvicFloor": "Pelvic Floor Exercises",
    "mentalHealth": "Mental Health",
    "checkupReminder": "6-Week Check-up",
    "warningSigns": "Warning Signs",
    "deliveryDate": "Delivery Date",
    "deliveryType": "Delivery Type",
    "babyBirthWeight": "Baby's Birth Weight"
  }
}
```

Files: `en.json`, `bn.json`, `gu.json`, `hi.json`, `mr.json`, `ta.json`, `te.json`

---

## Phase 11: Phase Transition Automation

**Auto-detection approach:**

Since the existing model already calculates `currentPregnancyWeek` dynamically via `calcPregnancyFromLmp`, we can add:

1. **On every mother dashboard load**: check if `dueDate` is in the past by >14 days and `phase === 'pregnancy'`
2. **Show a prompt banner**: "It looks like your due date has passed! Have you delivered? [Yes, record delivery] [Not yet]"
3. **On "Yes"**: call `POST /api/v1/profile/pregnancy/transition` with delivery date → phase flips to `postpartum`
4. **No cron job needed** — the check is lightweight and runs client-side on dashboard mount

---

## Phase 12: Migration & Edge Cases

| Scenario | Handling |
|----------|----------|
| Existing pregnant user gives birth | Dashboard auto-prompts transition (Phase 11) |
| New user who is already postpartum | Signs up with role `postpartum`, completes profile with delivery date |
| User delivers early (preterm) | Delivery date drives calculation, not due date; no special case needed |
| User delivers late (post-term, 42+ weeks) | Existing calc caps at 42; if phase still `pregnancy` past 42 weeks, prompt intensifies |
| User had delivery elsewhere, joins late (e.g., week 20 postpartum) | Delivery date entered at signup → `calcPostpartumWeek(deliveryDate)` computes week 20 → content loaded from week 20 |
| Partner of postpartum mother | Partner detects mother's phase from `/partner/mother-health` → shows postpartum tasks |
| Multiple children (subsequent pregnancy) | `PregnancyProfile` already has `gravida`/`parity`; phase resets to `pregnancy` for next pregnancy |

---

## File Change Summary

| Action | Files |
|--------|-------|
| **Schema** | `prisma/schema.prisma` — extend PregnancyProfile, add PostpartumWeekContent |
| **New files** | `src/lib/postpartum-calculator.ts`, `src/app/[locale]/(authenticated)/profile/complete-postpartum/page.tsx`, `src/app/[locale]/(authenticated)/postpartum-recovery/page.tsx`, `src/app/[locale]/(authenticated)/baby-tracker/page.tsx`, `src/app/[locale]/(authenticated)/pelvic-floor/page.tsx` |
| **Modify** | `signup/route.ts` (role enum), `signup/page.tsx` (form), `auth-provider.tsx` (isPostpartum), `authenticated-shell.tsx` (nav), `mother/page.tsx` (smart router), `weekly-journey/page.tsx` + API (content type), `profile/pregnancy/route.ts` (phase/delivery fields), `profile/complete/page.tsx` (routing), `partner/page.tsx` (phase detection), `partner/mother-health/route.ts` (phase field) |
| **Locale** | All 8 `src/messages/*.json` files — add `postpartum` section |
| **Seed** | Migration inserts + postpartum content seed script |

---

*Plan created: 2026-06-16 | Implementation order: Phase 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12*