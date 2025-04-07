"use client";

import Input from "@/app/components/inputs/Input";
import React, { useCallback, useState } from "react";
import {
  Field,
  FieldValues,
  set,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { PassThrough } from "stream";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const [variant, setVatiant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVatiant("REGISTER");
    } else {
      setVatiant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      else: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      // axios register
    }
    if (variant === "LOGIN") {
      // axios login
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    // NextAuth social login
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={false}
            />
          )}
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={false}
          />
          {/* <div>
            <Button>Test</Button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
