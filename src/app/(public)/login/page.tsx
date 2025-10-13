"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Chama o NextAuth CredentialsProvider
    const res = await signIn("credentials", {
      redirect: false, // evita redirecionamento automático
      email,
      password,
    });

    setIsSubmitting(false);

    if (res?.error) {
      // Login falhou
      setError("Credenciais inválidas.");
    } else {
      // Login OK, redireciona para home ou dashboard
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Acessar sua Conta
        </h1>

        {error && (
          <p className="bg-red-500 text-white text-sm px-3 py-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ECA400]"
            />
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ECA400]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-md font-semibold bg-[#ECA400] text-white hover:bg-[#d49400] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-black">
          Não tem conta?{" "}
          <a
            href="/signup"
            className="text-[#ECA400] hover:underline font-medium"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </main>
  );
}
