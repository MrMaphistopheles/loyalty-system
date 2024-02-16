import { db } from "@/server/db";

import { type FondyCallback } from "@/gtypes/fondy-res";

export async function POST(req: Request) {
  try {
    const res: FondyCallback = await req.json();
    if (!res) return Response.json({ msg: "no callback data" });

    const tips = await db.tips.findUnique({
      where: {
        orderId: res.order_id,
      },
    });

    const findTipsBlance = await db.tipBalance.findFirst({
      where: {
        userId: tips?.userId,
      },
    });

    const tipBalanceUpdate = await db.tipBalance.updateMany({
      where: {
        userId: tips?.userId,
      },
      data: {
        balance:
          findTipsBlance?.balance !== undefined
            ? findTipsBlance?.balance + parseInt(res.amount)
            : +0,
      },
    });

    const update = await db.tips.update({
      where: {
        orderId: res.order_id,
      },
      data: {
        orderStatus: res.order_status,
        transaction: {
          create: {
            actual_amount: JSON.stringify(res.actual_amount),
            actual_currency: JSON.stringify(res.actual_currency),
            additional_info: Buffer.from(
              JSON.stringify(res.additional_info),
              "utf-8",
            ),
            amount: JSON.stringify(res.amount),
            approval_code: JSON.stringify(res.approval_code),
            card_bin: JSON.stringify(res.card_bin),
            card_type: JSON.stringify(res.card_type),
            currency: JSON.stringify(res.currency),
            eci: JSON.stringify(res.eci),
            fee: JSON.stringify(res.fee),
            get_without_parameters: "true",
            masked_card: JSON.stringify(res.masked_card),
            merchant_data: JSON.stringify(res.merchant_data),
            merchant_id: JSON.stringify(res.merchant_id),
            order_id: JSON.stringify(res.order_id),
            order_status: JSON.stringify(res.order_status),
            order_time: JSON.stringify(res.order_time),
            parent_order_id: JSON.stringify(res.parent_order_id),
            payment_id: JSON.stringify(res.payment_id),
            payment_system: JSON.stringify(res.payment_system),
            product_id: JSON.stringify(res.product_id),
            rectoken: JSON.stringify(res.rectoken),
            rectoken_lifetime: JSON.stringify(res.rectoken_lifetime),
            response_code: JSON.stringify(res.response_code),
            response_description: JSON.stringify(res.response_description),
            response_signature_string: Buffer.from(
              JSON.stringify(res.response_signature_string),
              "utf-8",
            ),
            response_status: JSON.stringify(res.response_status),
            reversal_amount: JSON.stringify(res.reversal_amount),
            rrn: JSON.stringify(res.rrn),
            sender_account: JSON.stringify(res.sender_account),
            sender_cell_phone: JSON.stringify(res.sender_cell_phone),
            sender_email: JSON.stringify(res.sender_email),
            settlement_amount: JSON.stringify(res.settlement_amount),
            settlement_currency: JSON.stringify(res.settlement_currency),
            settlement_date: JSON.stringify(res.settlement_date),
            signature: JSON.stringify(res.signature),
            tran_type: JSON.stringify(res.tran_type),
            verification_status: JSON.stringify(res.verification_status),
          },
        },
      },
    });
    return Response.json({ status: 200 });
  } catch (error) {
    return Response.json({ error, status: 500, msg: "unknow server error" });
  }
}
