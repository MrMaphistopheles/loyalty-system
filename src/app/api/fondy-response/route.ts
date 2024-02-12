import { db } from "@/server/db";
//import { getServerAuthSession } from "../../../server/auth";

import { type FondyCallback } from "@/gtypes/fondy-res";

export async function POST(req: Request) {
  try {
    const res: FondyCallback = await req.json();
    if (!res) return { msg: "no callback data" };

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
            actual_amount: res.actual_amount,
            actual_currency: res.actual_currency,
            additional_info: Buffer.from(
              JSON.stringify(res.additional_info),
              "utf-8",
            ),
            amount: res.amount,
            approval_code: res.approval_code,
            card_bin: res.card_bin,
            card_type: res.card_type,
            currency: res.currency,
            eci: res.eci,
            fee: res.fee,
            get_without_parameters: "",
            masked_card: res.masked_card,
            merchant_data: res.merchant_data,
            merchant_id: res.merchant_id,
            order_id: res.order_id,
            order_status: res.order_status,
            order_time: res.order_time,
            parent_order_id: res.parent_order_id,
            payment_id: res.payment_id,
            payment_system: res.payment_system,
            product_id: res.product_id,
            rectoken: res.rectoken,
            rectoken_lifetime: res.rectoken_lifetime,
            response_code: res.response_code,
            response_description: res.response_description,
            response_signature_string: Buffer.from(
              res.response_signature_string,
              "utf-8",
            ),
            response_status: res.response_status,
            reversal_amount: res.reversal_amount,
            rrn: res.rrn,
            sender_account: res.sender_account,
            sender_cell_phone: res.sender_cell_phone,
            sender_email: res.sender_email,
            settlement_amount: res.settlement_amount,
            settlement_currency: res.settlement_currency,
            settlement_date: res.settlement_date,
            signature: res.signature,
            tran_type: res.tran_type,
            verification_status: res.verification_status,
          },
        },
      },
    });
    return { status: 200, update };
  } catch (error) {
    return { error, status: 500, msg: "unknow server error" };
  }
}
