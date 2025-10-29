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

export function LoginSignUpForms() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    if (location.pathname.includes("sign-up")) setActiveTab("sign-up");
    else setActiveTab("login");
  }, [location.pathname]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(`/user/${value}`);
  };
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContents className="py-6">
          <TabsContent value="login" className="flex flex-col gap-6">
            <LoginForm />
          </TabsContent>
          <TabsContent value="sign-up" className="flex flex-col gap-6">
            <SignupForm />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
}
