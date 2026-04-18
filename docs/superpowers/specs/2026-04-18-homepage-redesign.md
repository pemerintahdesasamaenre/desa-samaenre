# Homepage Redesign - Design Spec

**Date:** 2026-04-18
**Status:** Approved
**Topic:** Complete redesign of the public-facing homepage to create a modern, informative, and engaging "Village Dashboard".

## 1. Objective
To transform the homepage from a static page into a dynamic dashboard that showcases key village information, recent activities, and introduces the village leadership, thereby increasing transparency and community engagement.

## 2. Overall Layout
The new homepage will be a single-column, vertically scrolling page composed of four distinct, full-width sections.

1.  **Hero Section:** A full-screen, visually impactful introduction.
2.  **Key Statistics Section:** A row of data cards highlighting important village metrics.
3.  **Latest News & Agenda Section:** A grid of cards for the most recent articles.
4.  **Village Apparatus Section:** A selection of profile cards for key village officials.

---

## 3. Component & Section Design

### 3.1. Hero Section
- **Objective:** Create a strong, professional first impression.
- **Background:** A full-width, high-quality photograph representing the village. An overlay will be applied to darken the image slightly for text readability.
- **Content:**
    -   **Main Title (h1):** Centered, large, modern font. Text: "Selamat Datang di Desa [Nama Desa]".
    -   **Subtitle (p):** Centered, smaller text below the title. Text: "Situs resmi untuk informasi, transparansi, dan layanan publik Desa [Nama Desa]."
    -   **Primary Button (Call to Action):** Centered, below the subtitle. A prominent button with the text "Jelajahi Profil Desa", linking to the `/tentang` page.
- **Data Source:** `village_info.name` for the village name.

### 3.2. Key Statistics Section
- **Objective:** Provide a quick, data-driven overview of the village.
- **Layout:** A horizontal row of four individual "StatCard" components, displayed below the Hero Section.
- **Card Design:** Each card will have a light background, subtle shadow, an icon, a label, and the numerical value.
- **Content (4 Cards):**
    1.  **Card 1: Total Population:**
        -   Icon: `Users` (from lucide-react).
        -   Label: "Total Penduduk".
        -   Value: Sourced from `demographics` where `category` is 'Populasi' and `label` is 'Total Populasi'.
    2.  **Card 2: Village Budget:**
        -   Icon: `Wallet` (from lucide-react).
        -   Label: "Anggaran Desa [Tahun]".
        -   Value: Sum of `amount` from `finances` where `type` is 'income' for the current year.
    3.  **Card 3: Number of Hamlets (Dusun):**
        -   Icon: `MapPin` (from lucide-react).
        -   Label: "Jumlah Dusun".
        -   Value: Count of rows from `demographics` where `category` is 'Dusun'.
    4.  **Card 4: Village Apparatus:**
        -   Icon: `Users` (from lucide-react).
        -   Label: "Aparatur Desa".
        -   Value: Count of all rows in the `staff_members` table.
- **Data Sources:** `demographics`, `finances`, `staff_members`.

### 3.3. Latest News & Agenda Section
- **Objective:** Showcase recent activity and important information.
- **Layout:** A section with a main title and a 3-column grid of article cards.
- **Content:**
    -   **Section Title (h2):** "Informasi Terkini dari Desa".
    -   **"View All" Link:** A link in the top-right corner of the section with text "Lihat Semua Berita ->" pointing to the `/posts` page.
    -   **Article Cards (3 total):** Display the three most recent `posts` where `status` is 'published'. Each card contains:
        -   `image_url` (if available).
        -   `categories.name` as a small label.
        -   `title` (bold, clickable, links to `/posts/[slug]`).
        -   `created_at` date, formatted.
- **Data Source:** `posts` table, joined with `categories`.

### 3.4. Village Apparatus Section
- **Objective:** Introduce the village leadership and build trust.
- **Layout:** A section with a main title and a row of 3-4 profile cards.
- **Content:**
    -   **Section Title (h2):** "Kenali Perangkat Desa Anda".
    -   **Profile Cards:** Display profile information for key staff members (e.g., where `position` is 'Kepala Desa' or 'Sekretaris Desa'). Each card contains:
        -   `photo_url` (circular frame).
        -   `name` (bold).
        -   `position`.
    -   **"View Full Structure" Button:** A button at the bottom of the section with text "Lihat Struktur Lengkap", linking to the `/tentang` page where the full `OrgChartTree` is displayed.
- **Data Source:** `staff_members` table.

## 4. Implementation Notes
- All data fetching will be done via Server Components in `src/app/page.tsx`.
- Existing components like `StatCard` should be reused if possible.
- New, single-purpose components should be created for the homepage sections (e.g., `HeroSection.tsx`, `HomePagePosts.tsx`) to keep the main page component clean.
- The page must be fully responsive and look good on both desktop and mobile devices.
