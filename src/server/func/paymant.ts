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
  email,
}: {
  orderId: string;
  orderDesc: string;
  amount: number;
  email: string | null | undefined;
}) {
  const paymentKey = "PhdrLInCK7Ayl4F6Kdt6GsfFDvWdifsU";
  const reqData = {
    order_id: orderId,
    order_desc: orderDesc,
    currency: "UAH",
    amount: `${amount}`,
    merchant_id: "1539840",
    sender_email: email,
    lang: "uk",
    merchant_data: {

    }
  };

  const url = "https://pay.fondy.eu/api/checkout/url/";

  const sortedKeys: string[] = Object.keys(reqData).sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  const joinedString = sortedKeys
    .map((i) => reqData[i as keyof typeof reqData])
    .join("|");
  console.log(joinedString);

  const signatureStringN = `${paymentKey}|${joinedString}`;

  let shasum = crypto.createHash("sha1");
  shasum.update(signatureStringN);
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
