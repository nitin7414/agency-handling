export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard/:path*", "/customers/:path*", "/tasks/:path*", "/reports/:path*", "/settings/:path*"] };
