import { Young_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";

const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "noshd — spin. discover. devour.",
  description: "Every country's cuisine. Your city's restaurants. Spin the wheel and discover authentic global food hiding in your neighborhood.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${youngSerif.variable} ${instrumentSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
