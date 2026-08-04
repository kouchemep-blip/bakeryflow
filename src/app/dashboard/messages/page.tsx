import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Inbox, type InboxConversation } from "@/components/dashboard/messages/Inbox";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/");

  let adminId: number;
  try {
    const payload = verifyToken(token) as { id: number; role: string };
    if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") redirect("/customers");
    adminId = payload.id;
  } catch {
    redirect("/");
  }

  const admins = await prisma.user.findMany({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } }, select: { id: true } });
  const adminIds = admins.map((admin) => admin.id);
  const data = await prisma.conversation.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true, avatar: true } },
      message: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { message: { where: { isRead: false, senderId: { notIn: adminIds } } } } },
    },
  });
  const conversations: InboxConversation[] = data.map((conversation) => ({
    id: conversation.id,
    customer: conversation.user,
    lastMessage: conversation.message[0] ?? null,
    unreadCount: conversation._count.message,
  })).sort((a, b) => Number(b.lastMessage?.createdAt ?? 0) - Number(a.lastMessage?.createdAt ?? 0));

  void adminId;
  return <Inbox conversations={conversations} />;
}
