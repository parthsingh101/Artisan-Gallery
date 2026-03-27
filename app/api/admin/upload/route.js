import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

/**
 * API Route Handler for Admin Image Uploads
 * Expects FormData with one or more 'files' keys.
 */
export async function POST(req) {
  try {
    // 1. Auth Check (Admin Only)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    // 3. Process Uploads
    const uploadPromises = files.map(async (file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`Invalid file type: ${file.name}`);
      }

      // Convert file to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary
      const result = await uploadImage(buffer);
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        name: file.name
      };
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      message: "Images uploaded successfully",
      images: results
    }, { status: 200 });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ 
      error: "Failed to upload images", 
      details: error.message 
    }, { status: 500 });
  }
}

// Config to handle large file uploads
export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser for FormData
  },
};
