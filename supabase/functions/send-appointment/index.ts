
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAILJET_API_KEY = Deno.env.get("MAILJET_API_KEY");
const MAILJET_SECRET_KEY = Deno.env.get("MAILJET_SECRET_KEY");
const RECIPIENT_EMAIL = "nlbt3000@gmail.com"; // Hidden from frontend
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

interface AppointmentRequest {
  name: string;
  email: string;
  phone: string;
  sessionType: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
      throw new Error("Mailjet credentials are not configured");
    }

    const { name, email, phone, sessionType, message }: AppointmentRequest = await req.json();
    
    // Validate required fields
    if (!name || !email || !phone || !sessionType || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Format session type for better readability
    const formattedSessionType = sessionType === "personal" ? "Personal Session" : "Executive Session";
    
    // 1. Store the appointment request in Supabase for admin access
    const { error: dbError } = await supabase
      .from('appointment_requests')
      .insert([
        { 
          name, 
          email, 
          phone, 
          session_type: formattedSessionType,
          message,
          status: 'new'
        }
      ]);
    
    if (dbError) {
      console.error("Error storing appointment in database:", dbError);
      throw new Error("Failed to save appointment request");
    }

    // 2. Send email notification via Mailjet
    const mailjetRequest = {
      Messages: [
        {
          From: {
            Email: "noreply@submindmastery.com",
            Name: "Mastering Subconscious",
          },
          To: [
            {
              Email: RECIPIENT_EMAIL,
              Name: "N.L BHATTARAI",
            },
          ],
          Subject: `New ${formattedSessionType} Request from ${name}`,
          TextPart: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Session Type: ${formattedSessionType}
            
            Message:
            ${message}
          `,
          HTMLPart: `
            <h3>New Session Request</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Session Type:</strong> ${formattedSessionType}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        },
      ],
    };

    // Send email via Mailjet API
    const mailjetResponse = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)}`,
      },
      body: JSON.stringify(mailjetRequest),
    });

    if (!mailjetResponse.ok) {
      const errorData = await mailjetResponse.text();
      console.error("Mailjet API error:", errorData);
      // We still succeeded in storing the request in the database, so this isn't a fatal error
      console.log("Email delivery failed but appointment was saved in database");
    } else {
      const mailjetData = await mailjetResponse.json();
      console.log("Email sent successfully:", mailjetData);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Appointment request sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-appointment function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
