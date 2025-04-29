import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/libs/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  try {
    const { productId, userId } = await req.json();

    if (!productId || !userId) {
      return NextResponse.json({ message: "productIdかuserIdが不足しています" }, { status: 400 });
    }

    // 商品情報をDBから取得
    const product = await prisma.shopposts.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ message: "商品が存在しません" }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100, // 必ず円→"円未満の整数(cent単位)"にする
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      client_reference_id: userId,
      metadata: {
        productId: productId,
      },
    });

    return NextResponse.json({
      checkout_url: session.url,
      session_id: session.id,
    });

  } catch (err: any) {
    console.error("Checkoutエラー:", err);
    return NextResponse.json({ message: err.message || "サーバーエラー" }, { status: 500 });
  }
}
