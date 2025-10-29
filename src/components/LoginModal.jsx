"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/animate-ui/components/radix/dialog";
import { NavbarButton } from "@/components/ui/resizable-navbar";
import { LoginSignUpForms } from "@/components/LoginTabs";

export function LoginModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <NavbarButton
          variant="primary"
          className="bg-coolBlue text-cream hover:bg-teal active:bg-coral transition-colors duration-200"
        >
          Login
        </NavbarButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
            Welcome Back!
          </DialogTitle>
        </DialogHeader>

        <LoginSignUpForms isModal />

        <DialogClose asChild>
          <Button variant="outline" className="mt-4 w-full hover:bg-gray-100">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
