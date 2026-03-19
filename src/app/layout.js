// Root layout — wraps the entire app. Must contain <html> and <body> tags.
// Every page (all route groups) passes through this layout.
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
