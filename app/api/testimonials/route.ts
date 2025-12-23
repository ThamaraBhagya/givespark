import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET: Fetch the latest testimonials to display on the landing page.
 * We include the author's name and image for social proof.
 */
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      take: 6, // Limit to 6 for the landing page grid
      orderBy: { 
        createdAt: 'desc' 
      },
      include: {
        author: {
          select: { 
            name: true, 
            image: true, 
            role: true 
          }
        }
      }
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Testimonial Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

/**
 * POST: Allow a logged-in user to submit a new testimonial.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Check if user is logged in
    if (!session || !session.user) {
      return NextResponse.json({ error: "You must be signed in to leave a review." }, { status: 401 });
    }

    const { content, rating } = await req.json();

    // 2. Simple Validation
    if (!content || content.length < 10) {
      return NextResponse.json({ error: "Testimonial content is too short." }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating. Must be between 1 and 5 stars." }, { status: 400 });
    }

    // 3. Create the record in the database
    const newTestimonial = await prisma.testimonial.create({
      data: {
        content,
        rating: parseInt(rating),
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Testimonial submitted successfully!", 
      testimonial: newTestimonial 
    });

  } catch (error: any) {
    console.error("Testimonial Submission Error:", error);
    return NextResponse.json({ error: "Server error during submission." }, { status: 500 });
  }
}