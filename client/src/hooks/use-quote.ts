import { useMutation } from "@tanstack/react-query";
import { QuoteRequest, QuoteResult } from "@shared/schema";
import { calculateQuote } from "@/lib/quote-calculator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "./use-toast";

export function useQuote() {
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async (data: QuoteRequest): Promise<QuoteResult> => {
      // Calculate quote client-side
      const result = calculateQuote(data);
      
      // Send email with quote details
      await apiRequest("POST", "/api/send-quote", {
        quoteData: data,
        quoteResult: result
      });
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Orçamento calculado!",
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
    calculateQuote: mutation.mutate,
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
      toast({
        title: "Mensagem enviada!",
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
