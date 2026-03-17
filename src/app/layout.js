import "./globals.css";

export const metadata = {
  title: "Sonish",
  description: "Full-Stack Developer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}