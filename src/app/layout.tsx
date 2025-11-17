import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import LoadingOverlay from "../modules/shared/view/LoadingOverlay";
import "./globals.css";
import DialogHost from "../modules/shared/view/DialogHost";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Omnikasir",
  description: "Your all in one cashier solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} font-sans antialiased`}
      >
        <LoadingOverlay>
          <DialogHost>
            <Toaster
              position="bottom-center"
              reverseOrder={false}
            />
            {children}
          </DialogHost>
        </LoadingOverlay>
      </body>
    </html>
  );
}
