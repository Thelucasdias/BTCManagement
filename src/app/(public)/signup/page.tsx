"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  phone: z.string().optional(),
  cpf: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const createClient = trpc.client.create.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const onSubmit = (data: SignupFormData) => {
    setErrorMessage("");
    createClient.mutate(data);
  };

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Criar Conta</h1>

        {errorMessage && (
          <p className="bg-red-500 text-white text-sm px-3 py-2 rounded mb-4 text-center">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 text-black"
            >
              Nome
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Seu nome completo"
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ECA400]"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-black"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Seu email"
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ECA400]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-black"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ECA400]"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium mb-1 text-black"
            >
              Telefone
            </label>
            <input
              id="phone"
              type="text"
              {...register("phone")}
              placeholder="(XX) XXXXX-XXXX"
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ECA400]"
            />
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium mb-1 text-black"
            >
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              {...register("cpf")}
              placeholder="XXX.XXX.XXX-XX"
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ECA400]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || createClient.isPending}
            className="w-full py-2 rounded-md font-semibold bg-[#ECA400] text-white hover:bg-[#d49400] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting || createClient.isPending
              ? "Criando..."
              : "Criar Conta"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-black">
          Já tem uma conta?{" "}
          <a
            href="/login"
            className="text-[#ECA400] hover:underline font-medium"
          >
            Acesse aqui
          </a>
        </p>
      </div>
    </main>
  );
}
