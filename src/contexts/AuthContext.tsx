import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user?.id) {
          checkIsAdmin(currentSession.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (error) {
        console.error("Error fetching session:", error.message);
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user?.id) {
        checkIsAdmin(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkIsAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (error) {
        console.error("Error checking admin role:", error.message, error.code);
        setIsAdmin(false);
        return;
      }
      setIsAdmin(!!data);
    } catch (error: any) {
      console.error("Unexpected error checking admin role:", error.message);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        const message = error.message.includes("Invalid login")
          ? "Invalid email or password"
          : error.message;
        toast({
          title: "Login failed",
          description: message,
          variant: "destructive",
        });
        throw new Error(message);
      }
      if (data.user?.id) {
        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (roleError) {
          console.error("Role check error:", roleError.message, roleError.code);
          throw new Error("Error verifying admin status");
        }
        if (!roleData) {
          toast({
            title: "Access denied",
            description: "You do not have admin privileges",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          throw new Error("Not authorized as admin");
        }
        setIsAdmin(true);
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel",
        });
      } else {
        throw new Error("No user data returned");
      }
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
