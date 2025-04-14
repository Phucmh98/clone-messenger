import bcrypt from "bcrypt";

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/app/libs/prismadb";

// Xuất khẩu một đối tượng cấu hình `authOptions` để sử dụng cho xác thực
export const authOptions: AuthOptions = {
    // Sử dụng PrismaAdapter để kết nối với cơ sở dữ liệu thông qua Prisma
    adapter: PrismaAdapter(prisma),
    // Định nghĩa các nhà cung cấp (providers) cho xác thực
    providers: [
        // Nhà cung cấp GitHub, sử dụng clientId và clientSecret từ biến môi trường
        GithubProvider({
            clientId: process.env.GITHUB_ID as string, // ID ứng dụng GitHub
            clientSecret: process.env.GITHUB_SECRET as string, // Secret ứng dụng GitHub
        }),
        // Nhà cung cấp Google, sử dụng clientId và clientSecret từ biến môi trường
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string, // ID ứng dụng Google
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // Secret ứng dụng Google
        }),
        // Nhà cung cấp xác thực bằng thông tin đăng nhập (email và mật khẩu)
        CredentialsProvider({
            name: "credentials", // Tên của provider
            credentials: {
                email: { label: "email", type: "text" }, // Trường nhập email
                password: { label: "password", type: "password" }, // Trường nhập mật khẩu
            },
            // Hàm `authorize` để xử lý logic xác thực
            async authorize(credentials) {
                // Kiểm tra nếu không có email hoặc mật khẩu được cung cấp
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials"); // Ném lỗi nếu thông tin không hợp lệ
                }
                // Tìm người dùng trong cơ sở dữ liệu dựa trên email
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email, // Tìm theo email
                    },
                });
                // Nếu không tìm thấy người dùng hoặc không có mật khẩu đã mã hóa
                if (!user || !user?.hashedPassword) {
                    throw new Error("Invalid credentials"); // Ném lỗi nếu thông tin không hợp lệ
                }
                // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong cơ sở dữ liệu
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password, // Mật khẩu người dùng nhập
                    user.hashedPassword // Mật khẩu đã mã hóa trong cơ sở dữ liệu
                )
                // Nếu mật khẩu không khớp
                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials"); // Ném lỗi nếu thông tin không hợp lệ
                }
                // Trả về thông tin người dùng nếu xác thực thành công
                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === "development", // Bật chế độ gỡ lỗi nếu đang trong môi trường phát triển
    session: {
        strategy: "jwt", // Sử dụng JWT để quản lý phiên làm việc
    },
    secret: process.env.NEXTAUTH_SECRET, // Mã bí mật cho NextAuth
}

const handle = NextAuth(authOptions); // Khởi tạo NextAuth với cấu hình đã định nghĩa


export { handle as GET, handle as POST }; // Xuất khẩu các phương thức GET và POST để sử dụng trong API route