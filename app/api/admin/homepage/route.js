import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import HomepageSetting from "@/models/HomepageSetting";

export async function GET() {
  try {
    await dbConnect();
    let settings = await HomepageSetting.findOne().lean();
    
    if (!settings) {
      // Create defaults if none exist
      settings = await HomepageSetting.create({});
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch homepage settings" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    let settings = await HomepageSetting.findOne();
    if (!settings) {
      settings = await HomepageSetting.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }
    
    return NextResponse.json({ message: "Homepage settings updated", settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update homepage settings" }, { status: 500 });
  }
}
