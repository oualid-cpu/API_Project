import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";

import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";

export function LoginSignUpForms({ isModal = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  // Only watch the route if this isn't used in a modal
  useEffect(() => {
    if (!isModal) {
      if (location.pathname.includes("sign-up")) setActiveTab("sign-up");
      else setActiveTab("login");
    }
  }, [location.pathname, isModal]);

  const handleTabChange = (value) => {
    setActiveTab(value);

    // Navigate only if not in a modal
    if (!isModal) navigate(`/user/${value}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContents className="py-6">
        <TabsContent value="login" className="flex flex-col gap-6">
          <LoginForm isModal={isModal} />
        </TabsContent>
        <TabsContent value="sign-up" className="flex flex-col gap-6">
          <SignupForm isModal={isModal} />
        </TabsContent>
      </TabsContents>
    </Tabs>
  );
}
