import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json(); // Get amount from the frontend
    const accessToken = "sandbox_EpZ230NNXMXBxjeGizx9YWrlx9iw-I-BpUMLU67Q";
    const redirectUri = "http://localhost:3000/success";

    if (!accessToken) {
      throw new Error("GoCardless Access Token is missing");
    }

    const API_URL = accessToken.startsWith("sandbox_")
      ? "https://api-sandbox.gocardless.com"
      : "https://api.gocardless.com";

    const response = await axios.post(
      `${API_URL}/redirect_flows`,
      {
        redirect_flows: {
          description: `Pay £${amount / 100}`, // Show the amount in the description
          session_token: "random_session_token",
          success_redirect_url: redirectUri,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "GoCardless-Version": "2015-07-06",
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ 
      redirectUrl: response.data.redirect_flows.redirect_url, 
      amount 
    });
  } catch (error: any) {
    console.error("GoCardless Mandate Error:", error.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
