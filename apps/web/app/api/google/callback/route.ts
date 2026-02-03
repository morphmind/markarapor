import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import {
  exchangeCodeForTokens,
  getOAuthState,
  createConnectionWithTokens,
} from "~/lib/google-oauth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(
        new URL("/login?error=unauthorized", request.url)
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      console.error("Google OAuth error:", error);
      return NextResponse.redirect(
        new URL(`/connections?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    // Validate code and state
    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/connections?error=invalid_request", request.url)
      );
    }

    // Get OAuth state data
    const stateData = getOAuthState(state);

    if (!stateData) {
      return NextResponse.redirect(
        new URL("/connections?error=invalid_state", request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL("/connections?error=no_access_token", request.url)
      );
    }

    // Create connection with tokens
    await createConnectionWithTokens({
      workspaceId: stateData.workspaceId,
      brandId: stateData.brandId,
      provider: stateData.provider,
      name: stateData.name,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date ? tokens.expiry_date / 1000 : undefined,
      propertyId: stateData.propertyId,
      propertyName: stateData.propertyName,
    });

    // Redirect to connections page with success message
    return NextResponse.redirect(
      new URL("/connections?success=connected", request.url)
    );
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/connections?error=callback_failed", request.url)
    );
  }
}
