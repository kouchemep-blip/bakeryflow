import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const password = "BakeryFlow2026!";

async function upsertProduct(data: { name: string; description: string; price: number; image: string; categoryId: number }) {
  const existing = await prisma.product.findFirst({ where: { name: data.name } });
  return existing
    ? prisma.product.update({ where: { id: existing.id }, data })
    : prisma.product.create({ data });
}

async function main() {
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bakeryflow.test" },
    update: { firstName: "Amina", lastName: "Cheffe", phone: "+33600000001", password: passwordHash, role: "ADMIN", isActive: true },
    create: { firstName: "Amina", lastName: "Cheffe", email: "admin@bakeryflow.test", phone: "+33600000001", password: passwordHash, role: "ADMIN" },
  });
  const clientOne = await prisma.user.upsert({
    where: { email: "lea@bakeryflow.test" },
    update: { firstName: "Léa", lastName: "Martin", phone: "+33600000002", password: passwordHash, role: "CLIENT", isActive: true },
    create: { firstName: "Léa", lastName: "Martin", email: "lea@bakeryflow.test", phone: "+33600000002", password: passwordHash },
  });
  await prisma.user.upsert({
    where: { email: "hugo@bakeryflow.test" },
    update: { firstName: "Hugo", lastName: "Bernard", phone: "+33600000003", password: passwordHash, role: "CLIENT", isActive: true },
    create: { firstName: "Hugo", lastName: "Bernard", email: "hugo@bakeryflow.test", phone: "+33600000003", password: passwordHash },
  });

  const [pizzas, desserts, boissons] = await Promise.all([
    prisma.category.upsert({ where: { name: "Pizzas" }, update: {}, create: { name: "Pizzas" } }),
    prisma.category.upsert({ where: { name: "Desserts" }, update: {}, create: { name: "Desserts" } }),
    prisma.category.upsert({ where: { name: "Boissons" }, update: {}, create: { name: "Boissons" } }),
  ]);
  const image = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
  const products = await Promise.all([
    upsertProduct({ name: "Margherita artisanale", description: "Tomate, mozzarella fondante et basilic frais.", price: 12500, image, categoryId: pizzas.id }),
    upsertProduct({ name: "Pizza quatre fromages", description: "Un mélange généreux de fromages italiens.", price: 14500, image, categoryId: pizzas.id }),
    upsertProduct({ name: "Tiramisu maison", description: "Crème mascarpone, café et cacao intense.", price: 6500, image, categoryId: desserts.id }),
    upsertProduct({ name: "Panna cotta vanille", description: "Dessert onctueux aux fruits rouges de saison.", price: 5500, image, categoryId: desserts.id }),
    upsertProduct({ name: "Limonade citron", description: "Boisson fraîche artisanale au citron pressé.", price: 3000, image, categoryId: boissons.id }),
  ]);

  let order = await prisma.order.findFirst({ where: { userId: clientOne.id }, include: { orderitem: true } });
  if (!order) {
    order = await prisma.order.create({ data: { userId: clientOne.id, status: "DELIVERED", totalPrice: products[0].price + products[2].price, orderitem: { create: [{ productId: products[0].id, quantity: 1, unitPrice: products[0].price }, { productId: products[2].id, quantity: 1, unitPrice: products[2].price }] } }, include: { orderitem: true } });
  }
  const conversation = await prisma.conversation.upsert({ where: { userId: clientOne.id }, update: {}, create: { userId: clientOne.id } });
  if (await prisma.message.count({ where: { conversationId: conversation.id } }) === 0) {
    await prisma.message.createMany({ data: [{ conversationId: conversation.id, senderId: clientOne.id, content: "Bonjour, ma commande est-elle bien confirmée ?" }, { conversationId: conversation.id, senderId: admin.id, content: "Bonjour Léa, oui : elle a été livrée. Merci pour votre confiance !" }] });
  }
  console.log("Seed terminé : 1 admin, 2 clients, 5 plats et une commande de démonstration.");
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
