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
│   ├── favicon.ico
│   ├── login/              # Outside route groups (no header/footer)
│   │   └── page.js
│   ├── (website)/          # Route group (no URL impact)
│   │   ├── layout.js       # Layout for this group
│   │   ├── page.js         # This group's homepage
│   │   ├── about-us/
│   │   │   └── page.js
│   │   ├── cart/
│   │   │   └── page.js     # Cart page route
│   │   └── mens/
│   │       └── [...slug]/
│   │           └── page.js # Dynamic catch-all route
│   └── (marketing)/        # Another route group
│       └── landing-pages/
│           └── page.js
├── components/             # All your components
│   └── website/
│       ├── CommonLayout.jsx  # Layout wrapper (not in common/)
│       ├── Homepage.jsx
│       ├── ViewCart.jsx       # Cart page component
│       └── common/           # Reusable UI pieces
│           ├── Header.jsx
│           ├── Footer.jsx
│           └── ProductCard.jsx
├── reduxStore/             # Redux store & slices (one store per app)
│   ├── store.js
│   ├── loginSlice.jsx
│   └── cartSlice.jsx
├── services/               # API call functions
│   └── homePageAPI.js
├── styles/                 # All your CSS files
│   └── website.css
└── proxy.js                # Middleware (auth redirects etc.)
```

**Rule of thumb:**

- `app/` folder = routing only. Components, styles, and services go outside `app/`.
- Pages that don't need a group's layout (like login) go directly under `app/`, outside any route group.
- API/service functions go in `src/services/`, NOT inside `app/`.
- Redux store and slices go in `src/reduxStore/`, NOT inside `app/`.

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

## 8. Redux Toolkit (Global State Management)

Redux Toolkit lets you manage global state (like login status, cart items) that multiple components need to access.

### Install

```bash
npm install @reduxjs/toolkit react-redux js-cookie
```

`js-cookie` is optional — only needed if you want to persist state in cookies.

### Step 1: Create a Slice

A slice = one piece of state + its actions. Each slice goes in its own file inside `src/reduxStore/`.

```jsx
// src/reduxStore/loginSlice.jsx
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isLogin: Cookies.get("login") || 0,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state) => {
      state.isLogin = 1;
      Cookies.set("login", 1);
    },
    logout: (state) => {
      state.isLogin = 0;
      Cookies.remove("login");
    },
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
```

### Step 2: Create the Store

One store per app. All slices are combined here.

```jsx
// src/reduxStore/store.js
import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import cartSlice from "./cartSlice";

export const reduxStore = configureStore({
  reducer: {
    login: loginSlice,
    cart: cartSlice,
  },
});
```

### Step 3: Wrap Your App with Provider

The `<Provider>` must be in a Client Component (`"use client"`). Wrap it in your layout wrapper:

```jsx
// src/components/website/CommonLayout.jsx
"use client";
import { Provider } from "react-redux";
import { reduxStore } from "@/reduxStore/store";

export default function CommonLayout({ children }) {
  return (
    <Provider store={reduxStore}>
      {children}
    </Provider>
  );
}
```

### Step 4: Use State in Components

```jsx
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "@/reduxStore/loginSlice";

export default function Header() {
  const isLogin = useSelector((state) => state.login.isLogin);
  const dispatch = useDispatch();

  return isLogin ? (
    <button onClick={() => dispatch(logout())}>Logout</button>
  ) : (
    <button onClick={() => dispatch(login())}>Login</button>
  );
}
```

### Cart Slice (with duplicate detection & quantity limit)

The cart slice uses `findIndex` to check if a product already exists before adding:

```jsx
// src/reduxStore/cartSlice.jsx
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const cart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];

const initialState = {
  cart_items: cart,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, product) => {
      const existingIndex = state.cart_items.findIndex(
        (v) => v.id === product.payload.id,
      );
      if (existingIndex === -1) {
        // Product not in cart — add it
        const newProduct = {
          id: product.payload.id,
          name: product.payload.name,
          image: product.payload.image,
          price: product.payload.price,
          quantity: 1,
        };
        state.cart_items.push(newProduct);
        Cookies.set("cart", JSON.stringify(state.cart_items));
        toast.success("Item added successfully!");
      } else {
        // Product exists — increase quantity (max 5)
        if (state.cart_items[existingIndex].quantity < 5) {
          state.cart_items[existingIndex].quantity += 1;
          Cookies.set("cart", JSON.stringify(state.cart_items));
          toast.success("Item quantity added");
        } else {
          toast.error("Order limit reached!");
        }
      }
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
```

**How `findIndex` works for duplicate detection:**

- `findIndex` returns the **index** of the first matching item, or `-1` if not found
- `existingIndex === -1` → product is new → add it with quantity 1
- `existingIndex >= 0` → product exists → increment quantity (up to max 5)
- Unlike `forEach`, `findIndex` gives you the exact position to update the item directly

**Why not use `forEach` for this?**

- `forEach` always returns `undefined` — you can't get a result from it
- If you use a variable inside `forEach` to track state, the last iteration overwrites previous ones
- `forEach` cannot be broken early — `return` inside it only skips one iteration, it doesn't stop the loop
- Use a `for` loop with `break` if you need early exit with a loop, or `findIndex`/`find`/`some` for searching

### Persisting State in Cookies

`js-cookie` stores everything as a **string**. When saving arrays/objects, you must use `JSON.stringify()` to save and `JSON.parse()` to read:

```jsx
// SAVING — convert to JSON string
Cookies.set("cart", JSON.stringify(finalCart));

// READING — parse back to array/object, with fallback for first visit
const cart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
```

**Common mistakes:**
- `Cookies.set("cart", finalCart)` — saves `[object Object]` (garbage), NOT the actual data
- `JSON.parse(Cookies.get("cart"))` without checking first — crashes when cookie doesn't exist (`JSON.parse(undefined)` throws SyntaxError)
- If you see `"[object Obj"... is not valid JSON` error — clear the bad cookie from browser DevTools → Application → Cookies, then refresh

For simple values (like login status `0` or `1`), you don't need JSON — `Cookies.set("login", 1)` and `Cookies.get("login")` work fine.

**Key points:**
- `useSelector` = read state from the store
- `useDispatch` = get the dispatch function to trigger actions
- Only **one store** per app, but you can have **many slices**
- `<Provider>` needs `"use client"` — it uses React context internally
- Reading cookies at module level (`Cookies.get()`) causes a hydration warning because cookies don't exist on the server. The app still works, but you'll see a warning in the console.

---

## 9. Server-Side Data Fetching

Fetch data on the server in `page.js` and pass it to client components as props:

```jsx
// src/services/homePageAPI.js (runs on server)
import axios from "axios";

export const menProducts = () => {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/products.php`, {
      params: { limit: 8, categories: "mens-shirts, mens-shoes" },
    })
    .then((result) => result.data.data)
    .catch((err) => {
      console.error(err); // NOT toast.error — toast won't work on server
      return [];
    });
};

export const ladiesProducts = () => {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/products.php`, {
      params: { limit: 8, categories: "beauty, tops" },
    })
    .then((result) => result.data.data)
    .catch((err) => {
      console.error(err);
      return [];
    });
};
```

You can export multiple functions from a single service file. Each function fetches different data.

```jsx
// app/(website)/page.js (server component)
import Homepage from "@/components/website/Homepage";
import { ladiesProducts, menProducts } from "@/services/homePageAPI";

export default async function Home() {
  const getMenProducts = await menProducts();
  const getLadiesProducts = await ladiesProducts();

  return <Homepage menData={getMenProducts} ladiesData={getLadiesProducts} />;
}
```

```jsx
// components/website/Homepage.jsx (client component)
"use client";
import { useState } from "react";

export default function Homepage({ menData, ladiesData }) {
  const [menProducts, setMenProducts] = useState(menData);
  const [ladiesProducts, setLadiesProducts] = useState(ladiesData);
  // now you can use state, effects, and browser features
}
```

**The pattern:** Server fetches data → passes as props → Client component receives and manages it.

**Do NOT use `toast`, `localStorage`, `window`, or any browser API in service files.** They run on the server. Use `console.error` for error logging there.

---

## 10. Proxy / Middleware (Route Protection)

Create `src/proxy.js` to intercept requests before they reach your pages. Use it for auth redirects, route protection, etc.

```jsx
import { NextResponse } from "next/server";

export default function proxy(request) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(css|js|png|jpg|jpeg|svg|gif|ico|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  let status = 1; // 1 = logged in, anything else = not logged in

  // Not logged in → force to login page
  if (status != 1 && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in → don't show login page
  if (status == 1 && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
```

**Important:** Always skip `/_next` and static file paths, otherwise CSS/JS won't load on redirected pages.

---

## 11. Metadata (Page Titles & SEO)

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

## 12. Cart Page & Navigation

The cart page lives at `/cart` inside the `(website)` route group, so it gets the site's header and footer.

```jsx
// app/(website)/cart/page.js (server component — just renders the client component)
import ViewCart from "@/components/website/ViewCart";

export const metadata = {
  title: "Cart",
  description: "This is the cart page",
};

export default function page() {
  return <ViewCart />;
}
```

The Header shows a "ViewCart" button that links to `/cart` and displays the current cart item count:

```jsx
import Link from "next/link";
import { useSelector } from "react-redux";

const cart = useSelector((data) => data.cart.cart_items);

<Link href="/cart">
  <button>ViewCart({cart.length})</button>
</Link>
```

**Key points:**
- The cart page is a server component that renders a client component (`ViewCart`)
- `cart.length` shows the number of unique products, not total quantity
- The `<Link>` wrapper gives client-side navigation (no full page reload)

---

## 13. Navigation with `next/link`

Use `<Link>` from `next/link` instead of `<a>` for internal navigation. It does client-side navigation (faster, no full page reload).

```jsx
import Link from "next/link";

<Link href="/">Home</Link>
<Link href="/about-us">About Us</Link>
<Link href="/mens/shirts">Men's Shirts</Link>
```

**When to use `<Link>` vs `<a>`:**
- `<Link>` = internal pages (within your app)
- `<a>` = external URLs (other websites)

---

## 14. CSS / Styling

### Option 1: Tailwind CSS (recommended, already set up)

This project uses **Tailwind CSS v4**. The setup is simpler than v3 — just one import in your CSS file:

```css
/* src/styles/website.css */
@import "tailwindcss";
```

Then use classes directly in JSX:

```jsx
<h1 className="text-2xl font-bold text-red-500">Hello</h1>
```

Tailwind v4 uses `@tailwindcss/postcss` instead of the old `tailwindcss` PostCSS plugin. This is already configured in the project.

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

## 15. Installing & Using Packages

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

## 16. Environment Variables

Create a `.env` file in the project root:

```
NEXT_PUBLIC_API_URL=https://wscubetech.co/ecommerce-api
SECRET_KEY=mysecretkey
```

- `NEXT_PUBLIC_` prefix = accessible in browser (client components)
- No prefix = server-only (never exposed to browser)

Access them:

```jsx
process.env.NEXT_PUBLIC_API_URL; // works everywhere
process.env.SECRET_KEY; // server components/API routes only
```

**Note:** Next.js supports multiple env files — `.env`, `.env.local`, `.env.development`, `.env.production`. `.env.local` overrides `.env` and is usually added to `.gitignore` for secrets. Use `.env` for non-sensitive values shared across the team.

---

## 17. Common Commands

| Command                      | What it does                      |
| ---------------------------- | --------------------------------- |
| `npm run dev`                | Start dev server (localhost:3000) |
| `npm run build`              | Build for production              |
| `npm run start`              | Run production build              |
| `npm install package-name`   | Add a package                     |
| `npm uninstall package-name` | Remove a package                  |

---

## 18. Quick Setup Checklist for New Projects

1. Run `npx create-next-app@latest project-name`
2. Delete default boilerplate from `app/page.js` and `app/globals.css`
3. Create `src/components/` folder for all components
4. Create `src/styles/` folder for CSS files
5. Set up route groups in `app/` if you need multiple layouts — `(website)`, `(admin)`, etc.
6. Create `layout.js` in each route group with its own Header/Footer
7. Create `src/services/` folder for API call functions
8. Add `src/proxy.js` if you need route protection/auth redirects
9. Add `.env` for API URLs and secrets
10. Install packages you need (`npm install axios react-toastify` etc.)
11. If using Redux: `npm install @reduxjs/toolkit react-redux`, create `src/reduxStore/` with `store.js` and slices, wrap layout with `<Provider>`
12. Start building pages inside `app/` and components inside `components/`

---

## 19. Naming Conventions

- **Page components:** PascalCase — `function Login()`, `function AboutUs()`, NOT `function page()`
- **Files in `app/`:** always `page.js`, `layout.js` (lowercase, Next.js requirement)
- **Component files:** PascalCase — `Header.jsx`, `ProductCard.jsx`
- **Service files:** camelCase — `homePageAPI.js`
- **Redux slices:** camelCase — `loginSlice.jsx`, `cartSlice.jsx`
- **Redux store file:** camelCase — `store.js`
- **Non-component folders:** camelCase or kebab-case — `reduxStore/`, `services/`
- **You don't need `import React`** — Next.js auto-imports it

---

## 20. Confusing Parts Clarified

### "Where does my component go?"

- Is it a **page** that users visit via URL? --> `app/` folder as `page.js`
- Is it a **reusable UI piece** (card, button, header)? --> `src/components/common/`
- Is it a **layout wrapper**? --> `src/components/` (not inside `common/`)
- Is it an **API call function**? --> `src/services/`
- Is it **Redux store/slices**? --> `src/reduxStore/`
- Is it **middleware/auth logic**? --> `src/proxy.js`

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
- You changed `.env` / `.env.local`: restart the dev server (`npm run dev`)

### "Can I have two page.js at the same level?"

No. Each folder can only have ONE `page.js`. Use route groups `()` to split them.

### "Where should login/signup pages go?"

Outside route groups, directly under `app/`. They don't need the site's header/footer. Pages inside a route group inherit that group's layout.

### "Why is my CSS not loading after redirect?"

Your proxy/middleware is redirecting CSS/JS requests too. Always skip `/_next` and static file extensions in your `proxy.js`.

### "Where do I put API call functions?"

In `src/services/`, NOT inside `app/`. The `app/` folder is only for routing. Service files run on the server, so don't use browser APIs (`toast`, `localStorage`, etc.) in them.

### "Can I use toast.error in a service file?"

No. Service files called from server components run on the server. `toast` is browser-only. Use `console.error` for server-side error logging. Handle toast notifications in your client components instead.

### "Why is `<Provider>` throwing a Server Component error?"

`<Provider>` from `react-redux` uses React context, which only works in Client Components. The component that wraps `<Provider>` must have `"use client"` at the top.

### "Can I have more than one Redux store?"

No. One app = one store. But you can have as many **slices** as you want. Each slice manages one piece of state (login, cart, user, etc.) and they all combine into the single store.

### "Why am I getting a hydration mismatch with cookies?"

`Cookies.get()` from `js-cookie` only works in the browser. On the server, it returns `undefined`. So server renders one thing, client renders another = hydration error. The app still works — it's just a console warning. To fix it properly, read cookies in a `useEffect` after the page loads, or use `cookies()` from `next/headers` in a server component.

### "Where should Redux store files go?"

In `src/reduxStore/`, NOT inside `app/`. The `app/` folder is only for routing files (`page.js`, `layout.js`, etc.).

### "Why am I getting `[object Obj]... is not valid JSON` error?"

You saved an array/object to a cookie without `JSON.stringify()`. `Cookies.set("cart", myArray)` converts it to the string `"[object Object]"`. When you later try `JSON.parse("[object Object]")`, it crashes. Fix: clear the bad cookie from browser (DevTools → Application → Cookies → delete it), and use `JSON.stringify()` when saving and `JSON.parse()` when reading.

### "Why is `forEach` bad for checking if an item exists?"

`forEach` always returns `undefined` — you can't get a result from it. If you set a variable inside `forEach`, it gets overwritten on every iteration, so only the last item's comparison matters. Also, `forEach` cannot be stopped early — `return` inside it only skips one callback, it doesn't break the loop. Use `findIndex`, `find`, or `some` instead, or a `for` loop with `break`.

### "What's the difference between `find`, `findIndex`, `some`, and `filter`?"

| Method      | Returns                  | Stops early? | Use when                          |
| ----------- | ------------------------ | ------------ | --------------------------------- |
| `find`      | The matching item        | Yes          | You need the item itself          |
| `findIndex` | The index of the match   | Yes          | You need the position to update   |
| `some`      | `true` or `false`        | Yes          | You just need to know if it exists|
| `filter`    | Array of all matches     | No           | You need all matching items       |

### "Why does `!0` return `true` in JavaScript?"

`0` is a **falsy** value in JavaScript. So `!0` is `true`, `!1` is `false`. This is a common bug when using `findIndex` — if the matching item is at index `0`, `!existingIndex` evaluates to `true`, which is the opposite of what you'd expect. Always compare `findIndex` results with `=== -1` instead of using `!` or truthiness checks.
