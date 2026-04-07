import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { ContactForm } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ContactPayload extends ContactForm {
  recaptchaToken: string;
}

export function useContact() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (payload: ContactPayload) => {
      const response = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao enviar mensagem");
      }

      return response.json();
    },
    onSuccess: () => {
      setShowSuccessMessage(true);
      toast({
        title: "Sucesso",
        description: "Sua mensagem foi enviada com sucesso!",
      });
      setTimeout(() => setShowSuccessMessage(false), 3000);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    sendContact: mutation.mutate,
    isLoading: mutation.isPending,
    showSuccessMessage,
  };
}
