import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LeadCapture, leadCaptureSchema } from "@shared/schema";
import { SERVICES } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export function ContactModal({ isOpen, onClose, initialService }: ContactModalProps) {
  const [emailMode, setEmailMode] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  const form = useForm<LeadCapture>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      serviceType: initialService ?? "",
      clientName: "",
      cep: "",
    },
  });

  const serviceValue = form.watch("serviceType");
  if (initialService && serviceValue === "" && isOpen) {
    form.setValue("serviceType", initialService);
  }

  const neighborhood = form.watch("neighborhood");
  const city = form.watch("city");
  const state = form.watch("state");
  const locationResolved = !!(city && state);

  const handleCepChange = async (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const json = await res.json();
      if (!json.erro) {
        form.setValue("neighborhood", json.bairro || "");
        form.setValue("city", json.localidade || "");
        form.setValue("state", json.uf || "");
      }
    } catch {
      // network error — location fields stay empty
    } finally {
      setCepLoading(false);
    }
  };

  const handleWhatsApp = async () => {
    const valid = await form.trigger(["serviceType", "clientName", "cep"]);
    if (!valid) return;

    const values = form.getValues();
    const url = buildWhatsAppUrl({
      clientName: values.clientName,
      serviceType: values.serviceType,
      neighborhood: values.neighborhood,
      city: values.city,
      state: values.state,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    form.reset();
    setEmailMode(false);
    onClose();
  };

  const handleEmailSubmit = async (data: LeadCapture) => {
    setIsSubmitting(true);
    try {
      let recaptchaToken = "";
      if (siteKey) {
        await new Promise<void>((resolve) => grecaptcha.ready(resolve));
        recaptchaToken = await grecaptcha.execute(siteKey, { action: "lead_submit" });
      }
      await apiRequest("POST", "/api/send-lead", { ...data, recaptchaToken });
      toast({ title: "Mensagem enviada!", description: "Entraremos em contato em breve." });
      form.reset();
      setEmailMode(false);
      onClose();
    } catch {
      toast({ title: "Erro ao enviar", description: "Tente novamente ou entre em contato pelo WhatsApp.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setEmailMode(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Solicitar Atendimento
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-4">

            {/* Serviço */}
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço de interesse *</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nome */}
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Como prefere ser chamado(a)?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CEP */}
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="00000-000"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                          const formatted = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
                          field.onChange(formatted);
                          handleCepChange(formatted);
                        }}
                      />
                      {cepLoading && (
                        <i className="fas fa-spinner fa-spin absolute right-3 top-3 text-gray-400 text-sm" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Localização auto-preenchida */}
            {locationResolved && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-sm text-orange-800">
                📍 {neighborhood ? `${neighborhood}, ` : ""}{city} - {state}
              </div>
            )}

            {/* Campos extras do path de e-mail */}
            {emailMode && (
              <div className="space-y-4 pt-1">
                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(13) 99999-9999"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const d = e.target.value.replace(/\D/g, "").slice(0, 11);
                            const masked = d.length <= 10
                              ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
                              : d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
                            field.onChange(masked.replace(/-$/, ""));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu e-mail *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* CTAs */}
            {!emailMode ? (
              <>
                <Button
                  type="button"
                  className="w-full bg-[#25d366] hover:bg-[#1ebe59] text-white font-bold text-base py-6"
                  onClick={handleWhatsApp}
                >
                  💬 Falar no WhatsApp agora
                </Button>
                <p className="text-center text-sm text-gray-400">
                  Prefere receber por e-mail?{" "}
                  <button
                    type="button"
                    className="text-orange-500 underline hover:text-orange-600"
                    onClick={() => setEmailMode(true)}
                  >
                    Clique aqui
                  </button>
                </p>
              </>
            ) : (
              <>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <i className="fas fa-spinner fa-spin mr-2" />
                  ) : "📧 "}
                  Enviar por e-mail
                </Button>
                <p className="text-center text-sm text-gray-400">
                  <button
                    type="button"
                    className="text-[#25d366] font-semibold hover:underline"
                    onClick={() => setEmailMode(false)}
                  >
                    ← Voltar para WhatsApp
                  </button>
                </p>
              </>
            )}

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
