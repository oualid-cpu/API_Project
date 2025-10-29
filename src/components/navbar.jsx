"use client";
import { useState } from "react";
import UserAvatar from "./UserAvatar";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { LoginModal } from "@/components/LoginModal";
import { getToken, logout } from "@/lib/auth";

export function Nav() {
  const navItems = [];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [token, setTokenState] = useState(getToken());

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Nav */}
        <NavBody className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <NavbarLogo />
          <NavItems
            items={navItems}
            className="flex gap-6 text-gray-700 dark:text-gray-100"
            itemClassName="hover:text-coolBlue transition-colors duration-200"
          />

          <div className="flex items-center gap-4">
            {token ? (
              <UserAvatar />
            ) : (
              <LoginModal onLogin={() => setTokenState(getToken())} />
            )}
            {token && (
              <NavbarButton
                variant="dark"
                onClick={() => {
                  logout();
                  setTokenState(null);
                }}
              >
                Logout
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Nav */}
        <MobileNav>
          <MobileNavHeader className="px-4 py-3 flex items-center justify-between bg-white shadow-md">
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="bg-white p-4 space-y-4 shadow-lg"
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-coolBlue transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}

            <div className="flex w-full flex-col gap-4 mt-2">
              {token ? (
                <UserAvatar />
              ) : (
                <LoginModal onLogin={() => setTokenState(getToken())} />
              )}
              {token && (
                <NavbarButton
                  variant="dark"
                  onClick={() => {
                    logout();
                    setTokenState(null);
                  }}
                >
                  Logout
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
