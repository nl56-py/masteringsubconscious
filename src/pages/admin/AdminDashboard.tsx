
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import DashboardStats from "@/components/admin/DashboardStats";
import AppointmentsList from "@/components/admin/AppointmentsList";
import NewsletterSubscriptions from "@/components/admin/NewsletterSubscriptions";

type AppointmentRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  session_type: string;
  message: string;
  status: "new" | "contacted" | "completed" | "cancelled";
  created_at: string;
};

type NewsletterSubscription = {
  id: string;
  email: string;
  created_at: string;
};

const AdminDashboard = () => {
  const [blogCount, setBlogCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [hasFacilitator, setHasFacilitator] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get total blog count
        const { count: totalBlogs, error: blogError } = await supabase
          .from("blog_posts")
          .select("*", { count: "exact", head: true });

        if (blogError) throw blogError;
        setBlogCount(totalBlogs || 0);

        // Get published blog count
        const { count: published, error: publishedError } = await supabase
          .from("blog_posts")
          .select("*", { count: "exact", head: true })
          .eq("published", true);

        if (publishedError) throw publishedError;
        setPublishedCount(published || 0);

        // Check if facilitator exists
        const { data: facilitatorData, error: facilitatorError } = await supabase
          .from("facilitator")
          .select("*", { head: true })
          .limit(1);

        if (facilitatorError) throw facilitatorError;
        setHasFacilitator(facilitatorData && facilitatorData.length > 0);
        
        // Get appointment requests
        const { data: appointmentData, error: appointmentError } = await supabase
          .from("appointment_requests")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
          
        if (appointmentError) throw appointmentError;
        setAppointments(appointmentData as AppointmentRequest[] || []);
        
        // Get newsletter subscriptions
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("newsletter_subscriptions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
          
        if (subscriptionError) throw subscriptionError;
        setSubscriptions(subscriptionData as NewsletterSubscription[] || []);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  const updateAppointmentStatus = async (id: string, status: AppointmentRequest["status"]) => {
    try {
      const { error } = await supabase
        .from("appointment_requests")
        .update({ status })
        .eq("id", id);
        
      if (error) throw error;
      
      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status } : app
      ));
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <DashboardStats
            blogCount={blogCount}
            publishedCount={publishedCount}
            hasFacilitator={hasFacilitator}
            newAppointmentsCount={appointments.filter(a => a.status === "new").length}
          />
          <AppointmentsList 
            appointments={appointments}
            onUpdateStatus={updateAppointmentStatus}
          />
          <NewsletterSubscriptions 
            subscriptions={subscriptions}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
