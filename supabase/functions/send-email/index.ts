import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
}

const createWelcomeEmail = (userEmail: string) => {
  return {
    to: [userEmail],
    subject: "Welcome to Checkin! 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; margin-bottom: 24px;">Welcome to Checkin!</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          We're excited to have you on board! With Checkin, you can:
        </p>
        <ul style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          <li>Create and manage events</li>
          <li>Track participant registrations</li>
          <li>Create surveys</li>
          <li>Run fun lottery draws</li>
        </ul>
        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          Get started by creating your first event in your dashboard.
        </p>
        <a href="https://checkin.love/dashboard" 
           style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Go to Dashboard
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 48px;">
          If you have any questions, feel free to reply to this email.
        </p>
      </div>
    `
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email } = await req.json();
    let emailRequest: EmailRequest;

    // Handle different email types
    if (type === "welcome") {
      emailRequest = createWelcomeEmail(email);
    } else {
      emailRequest = await req.json();
    }

    console.log("Sending email to:", emailRequest.to);
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Checkin <no-reply@checkin.love>",
        to: emailRequest.to,
        subject: emailRequest.subject,
        html: emailRequest.html,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Email sent successfully:", data);

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error("Error from Resend API:", error);
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);