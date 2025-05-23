import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
interface IParams {
    conversationId: string;
}

export async function POST(
    request: Request,
    { params }: { params: Promise<IParams> }
) {
    try {
        const currentUser = await getCurrentUser();
        const {
            conversationId
        } = await params

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,

            },
            include: {
                messages: {
                    include: {
                        seen: true,
                    }
                },
                users: true

            },

        });

        if (!conversation) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        //Find the last message in the conversation
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        //Update the seen list of the last message
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id,
            },
            include: {
                seen: true,
                sender: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id,
                    }
                }
            }
        });

        await pusherServer.trigger(currentUser.email, "messages:update", {
            id:conversationId,
            messages:[updatedMessage]
        });

        if(lastMessage.seenIds.indexOf(currentUser.id) !== -1){
            return NextResponse.json(conversation);
        }

        await pusherServer.trigger(conversationId!, "messages:update", updatedMessage);

        return NextResponse.json(updatedMessage);

    } catch (error: any) {
        console.log(error, "ERROR_MESSAGES_SEEN")
        return new NextResponse("Internal Error", { status: 500 });
        ;
    }
}