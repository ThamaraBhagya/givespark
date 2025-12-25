import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, image } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email! },
            data: {
                name: name || undefined,
                image: image || undefined,
            },
        });

        return NextResponse.json({ 
            success: true, 
            user: { name: updatedUser.name, image: updatedUser.image } 
        });

    } catch (error: any) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}