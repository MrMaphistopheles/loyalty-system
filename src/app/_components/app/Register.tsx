"use client";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export default function Register() {
  const [email, setEmail] = useState<string>();
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();

  const searchPram = useSearchParams();
  const id = searchPram.get("id");
  console.log(id);

  const { mutate, isLoading } = api.manager.createClientUser.useMutation({
    onSuccess: () => {
      router.push("/signin");
    },
  });

  const handleRegister = () => {
    if (email && id) {
      mutate({
        email: email,
        id: id,
      });
    }
  };

  useEffect(() => {
    checkMail();
  }, [email]);

  const checkMail = () => {
    const mail = email?.toLowerCase();
    if (mail?.includes("@gmail")) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3">
      <Input
        size="sm"
        variant="bordered"
        label="Gmail"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        size="lg"
        className="w-full bg-black text-white"
        isLoading={isLoading}
        isDisabled={isDisabled}
        onClick={handleRegister}
      >
        {isDisabled
          ? "Працюю тільки з Gmail"
          : isLoading
            ? "Реєструємо"
            : "Зареєструватися"}
      </Button>
    </div>
  );
}
