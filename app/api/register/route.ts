import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(
    request: Request
) {
    try {

        const body = await request.json(); // Lấy dữ liệu từ yêu cầu POST
        console.log('body', body); // Ghi lại dữ liệu yêu cầu để kiểm tra
        const { email, name, password } = body; // Giải nén các trường từ dữ liệu yêu cầu

        if (!email || !name || !password) {
            return new NextResponse("Missing info" , { status: 400 }); // Trả về lỗi nếu thiếu trường
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Mã hóa mật khẩu với độ dài 12

        const user = await prisma.user.create({ // Tạo người dùng mới trong cơ sở dữ liệu
            data: {
                email,
                name,
                hashedPassword
            }
        });

        return NextResponse.json(user); // Trả về thông tin người dùng mới tạo
    } catch (error: any) {
        console.log(error, "REGISTRATION_ERROR"); // Ghi lại lỗi nếu có
        return new NextResponse("Internal error", { status: 500 }); // Trả về lỗi nội bộ
    }
}