import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { JobApplication } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface JobApplicationPayload extends JobApplication {
  recaptchaToken: string;
}

export function useJobApplication() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (payload: JobApplicationPayload) => {
      const response = await fetch("/api/send-job-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao enviar cadastro");
      }

      return response.json();
    },
    onSuccess: () => {
      setShowSuccessMessage(true);
      toast({
        title: "Sucesso",
        description: "Seu cadastro foi enviado com sucesso!",
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
    sendApplication: mutation.mutate,
    isLoading: mutation.isPending,
    showSuccessMessage,
  };
}
