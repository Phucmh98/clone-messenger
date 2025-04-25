import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

// Cấu trúc tham số params để Next.js nhận diện đúng
interface IParams {
    conversationId?: string;  // Tham số phải có kiểu bắt buộc
}

// Xử lý API DELETE
export async function DELETE(
    request: Request,
    { params }: { params: Promise<IParams> } // Chắc chắn params có kiểu chính xác
) {
    try {
        const { conversationId } = await params; // Truy xuất conversationId từ params
        const currentUser = await getCurrentUser(); // Lấy người dùng hiện tại

        if (!currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId, // Tìm cuộc trò chuyện theo ID
            },
            include: {
                users: true,
            },
        });

        if (!existingConversation) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        // Xóa cuộc trò chuyện nếu người dùng có quyền
        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id], // Kiểm tra xem người dùng có tham gia cuộc trò chuyện không
                },
            },
        });

        // Gửi thông báo qua Pusher cho mỗi người dùng liên quan
        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, "conversation:remove", existingConversation);
            }
        });

        return NextResponse.json(deletedConversation); // Trả về kết quả xóa cuộc trò chuyện
    } catch (error: any) {
        console.log(error, "ERROR_CONVERSATION_DELETE");
        return new NextResponse("Internal Error", { status: 500 });
    }
}
