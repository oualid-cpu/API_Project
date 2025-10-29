"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/animate-ui/components/radix/dialog";
import { NavbarButton } from "@/components/ui/resizable-navbar";
import { LoginSignUpForms } from "./LoginTabs";

export function LoginModal({ onLogin }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <NavbarButton
          variant="primary"
          className="bg-coolBlue text-cream hover:bg-teal active:bg-coral transition-colors duration-200"
        >
          Login
        </NavbarButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <LoginSignUpForms
          isModal={true}
          onLogin={() => {
            if (onLogin) onLogin();
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
