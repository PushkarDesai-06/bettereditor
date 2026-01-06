import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Image from "@/models/Image";

// GET all images for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    await dbConnect();

    let query: any = { userId: session.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const images = await Image.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Get images error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create a new image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, tags, imageData, originalSize } = await request.json();

    if (!title || !imageData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check image count limit (10 images max)
    const imageCount = await Image.countDocuments({ userId: session.user.id });
    if (imageCount >= 10) {
      return NextResponse.json(
        {
          error:
            "You have reached the maximum limit of 10 images in the free tier",
        },
        { status: 400 }
      );
    }

    const image = await Image.create({
      userId: session.user.id,
      title,
      tags: tags || [],
      imageData,
      originalSize,
    });

    return NextResponse.json(
      { message: "Image created successfully", image },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create image error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
