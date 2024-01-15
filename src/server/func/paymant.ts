import axios from "axios";
import crypto from "crypto";

type PaymentResponse = {
  checkout_url: string;
  payment_id: string;
  response_status: string;
};

type ApiData = {
  response: PaymentResponse;
};

export async function Payment({
  orderId,
  orderDesc,
  amount,
}: {
  orderId: string;
  orderDesc: string;
  amount: number;
}) {
  const paymentKey = "PhdrLInCK7Ayl4F6Kdt6GsfFDvWdifsU";
  const reqData = {
    order_id: orderId,
    order_desc: orderDesc,
    currency: "UAH",
    amount: `${amount}`,
    merchant_id: "1539840",
  };

  const url = "https://pay.fondy.eu/api/checkout/url/";

  const signatureString = `${paymentKey}|${reqData.amount}|${reqData.currency}|${reqData.merchant_id}|${reqData.order_desc}|${reqData.order_id}`;

  let shasum = crypto.createHash("sha1");
  shasum.update(signatureString);
  const signature = shasum.digest("hex");

  const { data } = await axios.post<ApiData>(url, {
    request: {
      ...reqData,
      signature: signature,
    },
  });

  //console.log(data);
  return { ...data.response };
}
