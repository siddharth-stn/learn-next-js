# Next.js Project Setup Guide & Cheat Sheet

## 1. Create a New Project

```bash
npx create-next-app@latest project-name
```

It will ask you questions. Recommended answers:

```
TypeScript?        No  (choose Yes if you want types)
ESLint?            Yes
Tailwind CSS?      Yes
`src/` directory?  Yes  (keeps things clean)
App Router?        Yes  (this is the modern way)
Import alias?      Yes, keep @/* (default)
```

Then:

```bash
cd project-name
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 2. Folder Structure (How to Organize)

After setup, clean up and organize like this:

```
src/
├── app/                    # ONLY routing files go here
│   ├── layout.js           # Root layout (wraps everything)
│   ├── page.js             # Homepage (/)
│   ├── favicon.ico
│   ├── (website)/          # Route group (no URL impact)
│   │   ├── layout.js       # Layout for this group
│   │   ├── page.js         # This group's homepage
│   │   └── mens/
│   │       └── [...slug]/
│   │           └── page.js # Dynamic catch-all route
│   └── (marketing)/        # Another route group
│       └── landing-pages/
│           └── page.js
├── components/             # All your components
│   └── website/
│       ├── CommonLayout.jsx
│       ├── Homepage.jsx
│       └── common/
│           ├── Header.jsx
│           ├── Footer.jsx
│           └── ProductCard.jsx
└── styles/                 # All your CSS files
    └── website.css
```

**Rule of thumb:** `app/` folder = routing only. Components and styles go outside `app/`.

---

## 3. Key Files Explained

### `app/layout.js` (Root Layout)

This wraps your ENTIRE app. Every page goes through this. Must have `<html>` and `<body>` tags.

```jsx
export const metadata = {
  title: "My App",
  description: "My Next.js App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### `app/page.js` (Homepage)

This is the `/` route. Whatever you return here shows at the root URL.

```jsx
export default function Home() {
  return <h1>Welcome</h1>;
}
```

### Group-Level `layout.js`

Each route group can have its own layout. It wraps all pages inside that group.

```jsx
import CommonLayout from "@/components/website/CommonLayout";
import "@/styles/website.css";

export const metadata = {
  title: "Website",
  description: "Website section",
};

export default function WebsiteLayout({ children }) {
  return <CommonLayout>{children}</CommonLayout>;
}
```

---

## 4. Routing Cheat Sheet

### Basic Route

```
app/about/page.js  -->  /about
app/contact/page.js  -->  /contact
```

Just create a folder with a `page.js` inside it. That's a route.

### Nested Route

```
app/blog/posts/page.js  -->  /blog/posts
```

### Dynamic Route (single param)

```
app/product/[id]/page.js  -->  /product/1, /product/2, etc.
```

Access the param:

```jsx
export default function Product({ params }) {
  return <h1>Product {params.id}</h1>;
}
```

### Catch-All Route (multiple params)

```
app/mens/[...slug]/page.js  -->  /mens/shirts, /mens/shirts/blue, etc.
```

`params.slug` will be an array: `["shirts"]` or `["shirts", "blue"]`

### Optional Catch-All Route

```
app/shop/[[...slug]]/page.js  -->  /shop, /shop/men, /shop/men/shoes
```

Same as catch-all but also matches the base path (`/shop`).

---

## 5. Route Groups — The `( )` Folders

Folders wrapped in `()` do NOT create a URL segment. They are for **organization only**.

```
app/(website)/page.js      -->  /          (NOT /website)
app/(marketing)/deals/page.js  -->  /deals  (NOT /marketing/deals)
```

**Why use them?**

- Apply different layouts to different sections
- Organize related pages together
- Keep your `app/` folder clean

Each group can have its own `layout.js` with different headers, footers, styles, etc.

---

## 6. The `@` Import Alias

Instead of messy relative paths:

```jsx
// BAD - hard to read, breaks if you move the file
import Header from "../../../components/website/common/Header";

// GOOD - always works from src/
import Header from "@/components/website/common/Header";
```

`@` maps to `src/` (configured in `jsconfig.json`):

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 7. Client vs Server Components

By default, every component in Next.js is a **Server Component**.

**Server Component** (default) — runs on the server:

- Can fetch data directly
- Cannot use `useState`, `useEffect`, `onClick`, or any browser APIs

**Client Component** — runs in the browser:

- Add `"use client"` at the TOP of the file
- Can use hooks (`useState`, `useEffect`)
- Can handle user interactions (`onClick`, `onChange`)

```jsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**When to use `"use client"`:**

- Component uses `useState` or `useEffect`
- Component handles clicks, form inputs, or any user interaction
- Component uses browser APIs (localStorage, window, etc.)

**When NOT to use it:**

- Component just displays static content
- Component only receives and renders props

---

## 8. Metadata (Page Titles & SEO)

Export a `metadata` object from any `layout.js` or `page.js`:

```jsx
export const metadata = {
  title: "About Us",
  description: "Learn more about our company",
};
```

- `layout.js` metadata = default for all pages in that group
- `page.js` metadata = overrides layout metadata for that specific page

---

## 9. CSS / Styling

### Option 1: Tailwind CSS (recommended, already set up)

Just use classes directly:

```jsx
<h1 className="text-2xl font-bold text-red-500">Hello</h1>
```

### Option 2: CSS file per section

Create CSS files in `src/styles/` and import in the relevant layout:

```jsx
import "@/styles/website.css";
```

### Option 3: CSS Modules (scoped styles)

```
Button.module.css
```

```css
.primary {
  background: blue;
  color: white;
}
```

```jsx
import styles from "./Button.module.css";
<button className={styles.primary}>Click</button>;
```

---

## 10. Installing & Using Packages

```bash
npm install axios react-toastify
```

Then import and use:

```jsx
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
```

Remember: if the package needs browser features (like toast notifications), the component using it must be a Client Component (`"use client"`).

---

## 11. Environment Variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_KEY=mysecretkey
```

- `NEXT_PUBLIC_` prefix = accessible in browser (client components)
- No prefix = server-only (never exposed to browser)

Access them:

```jsx
process.env.NEXT_PUBLIC_API_URL; // works everywhere
process.env.SECRET_KEY; // server components/API routes only
```

---

## 12. Common Commands

| Command                      | What it does                      |
| ---------------------------- | --------------------------------- |
| `npm run dev`                | Start dev server (localhost:3000) |
| `npm run build`              | Build for production              |
| `npm run start`              | Run production build              |
| `npm install package-name`   | Add a package                     |
| `npm uninstall package-name` | Remove a package                  |

---

## 13. Quick Setup Checklist for New Projects

1. Run `npx create-next-app@latest project-name`
2. Delete default boilerplate from `app/page.js` and `app/globals.css`
3. Create `src/components/` folder for all components
4. Create `src/styles/` folder for CSS files
5. Set up route groups in `app/` if you need multiple layouts — `(website)`, `(admin)`, etc.
6. Create `layout.js` in each route group with its own Header/Footer
7. Add `.env.local` for API URLs and secrets
8. Install packages you need (`npm install axios react-toastify` etc.)
9. Start building pages inside `app/` and components inside `components/`

---

## 14. Confusing Parts Clarified

### "Where does my component go?"

- Is it a **page** that users visit via URL? --> `app/` folder as `page.js`
- Is it a **reusable UI piece** (card, button, header)? --> `src/components/`
- Is it a **layout wrapper**? --> `src/components/` (not inside `common/`)

### "layout.js vs page.js?"

- `layout.js` = wraps pages, persists across navigation (header, footer, sidebar)
- `page.js` = the actual content for that route

### "When do I need a new layout.js?"

Only when a group of pages need a DIFFERENT wrapper (different header, sidebar, etc.). You don't need one in every folder.

### "What's the difference between `[id]`, `[...slug]`, and `[[...slug]]`?"

| Pattern       | Matches               | Example URL            | Params                                |
| ------------- | --------------------- | ---------------------- | ------------------------------------- |
| `[id]`        | Exactly one segment   | `/product/5`           | `{ id: "5" }`                         |
| `[...slug]`   | One or more segments  | `/men/shoes/nike`      | `{ slug: ["men", "shoes", "nike"] }`  |
| `[[...slug]]` | Zero or more segments | `/shop` or `/shop/men` | `{ slug: [] }` or `{ slug: ["men"] }` |

### "Why is my hook/onClick not working?"

You forgot `"use client"` at the top of the file. Server Components can't use hooks or handle events.

### "Why is my env variable undefined?"

- In browser/client component: variable MUST start with `NEXT_PUBLIC_`
- You changed `.env.local`: restart the dev server (`npm run dev`)

### "Can I have two page.js at the same level?"

No. Each folder can only have ONE `page.js`. Use route groups `()` to split them.
