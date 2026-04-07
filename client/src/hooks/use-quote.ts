import { useMutation } from "@tanstack/react-query";
import { QuoteRequest, QuoteResult } from "@shared/schema";
import { calculateQuote } from "@/lib/quote-calculator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "./use-toast";
import { trackQuoteSubmit, trackContactSubmit, trackJobApplicationSubmit } from "@/lib/analytics";

export function useQuote() {
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async ({ quoteData, recaptchaToken }: { quoteData: QuoteRequest; recaptchaToken?: string }): Promise<QuoteResult> => {
      // Calculate quote client-side
      const result = calculateQuote(quoteData);

      // Send email with quote details
      await apiRequest("POST", "/api/send-quote", {
        quoteData,
        quoteResult: result,
        recaptchaToken,
      });

      return result;
    },
    onSuccess: () => {
      trackQuoteSubmit();
      toast({
        description: "Enviamos os detalhes por e-mail. Nossa equipe entrará em contato em breve.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao processar orçamento",
        description: error.message || "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    }
  });
  
  return {
    calculateQuote: (
      data: QuoteRequest,
      recaptchaToken: string,
      options?: Parameters<typeof mutation.mutate>[1],
    ) => mutation.mutate({ quoteData: data, recaptchaToken }, options),
    isLoading: mutation.isPending,
    result: mutation.data,
    error: mutation.error
  };
}

export function useContact() {
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/send-contact", data);
    },
    onSuccess: () => {
      trackContactSubmit();
      toast({
        description: "Recebemos sua mensagem e entraremos em contato em breve.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    }
  });
  
  return {
    sendContact: mutation.mutate,
    isLoading: mutation.isPending
  };
}

export function useJobApplication() {
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/send-job-application", data);
    },
    onSuccess: () => {
      trackJobApplicationSubmit();
      toast({
        description: "Recebemos seu cadastro! Nossa equipe entrará em contato em breve.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar cadastro",
        description: error.message || "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    }
  });
  
  return {
    sendApplication: mutation.mutate,
    isLoading: mutation.isPending
  };
}
