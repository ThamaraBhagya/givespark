import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      take: 6, 
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


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    
    if (!session || !session.user) {
      return NextResponse.json({ error: "You must be signed in to leave a review." }, { status: 401 });
    }

    const { content, rating } = await req.json();

    
    if (!content || content.length < 10) {
      return NextResponse.json({ error: "Testimonial content is too short." }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating. Must be between 1 and 5 stars." }, { status: 400 });
    }

    
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