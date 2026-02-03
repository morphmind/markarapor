import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import { prisma } from "@markarapor/database";
import {
  generateAuthUrl,
  createOAuthState,
  type ConnectionProvider,
} from "~/lib/google-oauth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { workspaceId, brandId, provider, name, propertyId, propertyName } =
      body;

    // Validate required fields
    if (!workspaceId || !provider || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate provider
    const validProviders: ConnectionProvider[] = [
      "GOOGLE_ADS",
      "GOOGLE_ANALYTICS",
      "GOOGLE_SEARCH_CONSOLE",
      "GOOGLE_SLIDES",
      "GOOGLE_SHEETS",
      "GOOGLE_DRIVE",
    ];

    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: "Invalid provider" },
        { status: 400 }
      );
    }

    // Check workspace access
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // If brandId provided, verify it belongs to the workspace
    if (brandId) {
      const brand = await prisma.brand.findFirst({
        where: {
          id: brandId,
          workspaceId,
        },
      });

      if (!brand) {
        return NextResponse.json(
          { error: "Brand not found in workspace" },
          { status: 404 }
        );
      }
    }

    // Create OAuth state
    const state = createOAuthState({
      workspaceId,
      brandId,
      provider,
      name,
      propertyId,
      propertyName,
    });

    // Generate OAuth URL
    const authUrl = generateAuthUrl(provider, state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Google connect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
