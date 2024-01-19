"use client";

import { useSearchParams } from "next/navigation";
import Layout from "../_components/app/Layout";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { Loading } from "../_components/waiter/Scaner";
import { type Transaction } from "@prisma/client";

type TransactionObj = Omit<Transaction, "id">;
type TransactionModifiedObj = Omit<TransactionObj, "additional_info">;

type TransactionParams = Omit<
  TransactionModifiedObj,
  "response_signature_string"
> & {
  additional_info: string;
  response_signature_string: string;
};

export default function Fondy() {
  const searchPram = useSearchParams();

  let paramsObj: TransactionParams = {} as TransactionParams;

  for (const [key, value] of searchPram) {
    paramsObj[key as keyof TransactionParams] = value;
  }
  console.log(paramsObj);

  const { mutate, isSuccess } = api.user.updatePaymentDetails.useMutation();

  useEffect(() => {
    if (paramsObj) {
      mutate(paramsObj);
    }
  }, []);

  if (isSuccess) {
    return (
      <Layout gap={8}>
        <div className="w-2/3">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 410 445"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M204.917 364.236C296.723 364.236 371.145 289.813 371.145 198.008C371.145 106.202 296.723 31.7793 204.917 31.7793C113.112 31.7793 38.689 106.202 38.689 198.008C38.689 289.813 113.112 364.236 204.917 364.236Z"
              fill="#3F3D56"
            />
            <path
              d="M100.266 211.351C104.394 206.409 109.558 202.433 115.391 199.705C121.224 196.977 127.586 195.563 134.025 195.563C140.465 195.563 146.827 196.977 152.66 199.705C158.493 202.433 163.657 206.409 167.785 211.351C174.849 204.607 179.732 195.902 181.803 186.358C183.875 176.814 183.041 166.869 179.409 157.803C175.776 148.737 169.512 140.967 161.423 135.494C153.334 130.022 143.792 127.097 134.025 127.097C124.259 127.097 114.717 130.022 106.628 135.494C98.5391 140.967 92.2748 148.737 88.6423 157.803C85.0099 166.869 84.1757 176.814 86.2474 186.358C88.3191 195.902 93.2017 204.607 100.266 211.351Z"
              fill="white"
            />
            <path
              d="M232.271 211.351C236.399 206.409 241.562 202.433 247.396 199.705C253.229 196.977 259.591 195.563 266.03 195.563C272.47 195.563 278.831 196.977 284.665 199.705C290.498 202.433 295.661 206.409 299.79 211.351C306.854 204.607 311.737 195.902 313.808 186.358C315.88 176.814 315.046 166.869 311.413 157.803C307.781 148.737 301.517 140.967 293.428 135.494C285.339 130.022 275.797 127.097 266.03 127.097C256.264 127.097 246.722 130.022 238.633 135.494C230.544 140.967 224.28 148.737 220.647 157.803C217.015 166.869 216.181 176.814 218.252 186.358C220.324 195.902 225.207 204.607 232.271 211.351Z"
              fill="white"
            />
            <path
              d="M117.348 176.157C126.636 176.157 134.166 168.628 134.166 159.339C134.166 150.051 126.636 142.521 117.348 142.521C108.059 142.521 100.53 150.051 100.53 159.339C100.53 168.628 108.059 176.157 117.348 176.157Z"
              fill="#3F3D56"
            />
            <path
              d="M249.348 176.157C258.636 176.157 266.166 168.628 266.166 159.339C266.166 150.051 258.636 142.521 249.348 142.521C240.059 142.521 232.53 150.051 232.53 159.339C232.53 168.628 240.059 176.157 249.348 176.157Z"
              fill="#3F3D56"
            />
            <path
              d="M85.1349 259.12C95.9355 259.12 104.691 250.365 104.691 239.564C104.691 228.763 95.9355 220.008 85.1349 220.008C74.3343 220.008 65.5786 228.763 65.5786 239.564C65.5786 250.365 74.3343 259.12 85.1349 259.12Z"
              fill="#FF6584"
            />
            <path
              d="M310.032 259.12C320.832 259.12 329.588 250.365 329.588 239.564C329.588 228.763 320.832 220.008 310.032 220.008C299.231 220.008 290.476 228.763 290.476 239.564C290.476 250.365 299.231 259.12 310.032 259.12Z"
              fill="#FF6584"
            />
            <path
              d="M197.583 200.451L182.916 264.009L207.361 239.564L197.583 200.451Z"
              fill="#FF6584"
            />
            <path
              d="M272.947 444.906L256.295 430.93L256.683 444.906H251.511L251.098 430.128L228.615 444.906H219.203L250.93 424.052L249.701 380.263L248.783 347.192L253.942 347.05L254.873 380.263L256.101 424.013L280.988 444.906H272.947Z"
              fill="#3F3D56"
            />
            <path
              d="M194.716 444.906L178.064 430.93L178.452 444.906H173.294L172.88 430.128L150.397 444.906H140.985L172.699 424.052L171.471 380.263L170.553 347.192L175.724 347.05L176.655 380.263L177.87 424.013L202.758 444.906H194.716Z"
              fill="#3F3D56"
            />
            <path
              d="M207.362 19.5562C202.801 19.5562 198.777 23.0992 196.087 28.5412C193.716 20.358 188.734 14.6672 182.916 14.6672C182.521 14.7065 182.129 14.7724 181.742 14.8644C179.506 6.12744 174.309 0 168.249 0C160.149 0 153.582 10.9446 153.582 24.4453C153.582 37.9461 160.149 48.8907 168.249 48.8907C168.645 48.8514 169.037 48.7855 169.423 48.6934C171.66 57.4304 176.857 63.5579 182.916 63.5579C187.478 63.5579 191.501 60.0149 194.191 54.5729C196.562 62.756 201.544 68.4469 207.362 68.4469C215.462 68.4469 222.029 57.5023 222.029 44.0015C222.029 30.5008 215.462 19.5562 207.362 19.5562Z"
              fill="#3F3D56"
            />
            <path
              d="M48.8906 261C42.4702 261 36.1127 259.735 30.181 257.278C24.2493 254.821 18.8596 251.22 14.3197 246.68C9.77982 242.14 6.17857 236.751 3.72159 230.819C1.26461 224.887 3.05176e-05 218.53 3.05176e-05 212.109V187.664C3.05176e-05 174.697 5.15096 162.262 14.3197 153.093C23.4885 143.924 35.924 138.773 48.8906 138.773L48.8906 261Z"
              fill="#A0518E"
            />
            <path
              d="M360.944 138.773C367.364 138.773 373.722 140.038 379.654 142.495C385.585 144.952 390.975 148.553 395.515 153.093C400.055 157.633 403.656 163.023 406.113 168.954C408.57 174.886 409.834 181.244 409.834 187.664V212.109C409.834 218.53 408.57 224.887 406.113 230.819C403.656 236.751 400.055 242.14 395.515 246.68C390.975 251.22 385.585 254.821 379.654 257.278C373.722 259.735 367.364 261 360.944 261L360.944 138.773Z"
              fill="#A0518E"
            />
            <path
              d="M386.563 191.506H378.806C378.806 93.1284 298.77 13.0921 200.392 13.0921C102.015 13.0921 21.9783 93.1284 21.9783 191.506H14.2212C14.2212 88.8508 97.7372 5.33496 200.392 5.33496C303.048 5.33496 386.563 88.8508 386.563 191.506Z"
              fill="#A0518E"
            />
          </svg>
        </div>
        <h1 className="text-2xl">Дякуємо за чайові!</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <Loading color="stroke-blue-500" />
    </Layout>
  );
}
