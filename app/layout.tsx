import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import ToasterProvider from "./providers/ToasterProvider";

import getCurrentUser from "./actions/getCurrentUser";

export const metadata: Metadata = {
  title: "Kanapos",
  description: "Kanapos, leader des canapés dans ton village.",
};

const font = Nunito({
  subsets: ["latin"],
});




export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <RegisterModal />
        <LoginModal />
        <Navbar currentUser={currentUser}/>
        {children}
      </body>
    </html>
  );
}
