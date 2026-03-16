import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { QuoteRequest, quoteRequestSchema } from "@shared/schema";
import { SERVICES } from "@/lib/constants";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuoteRequest, recaptchaToken: string) => void;
  isLoading: boolean;
  initialService?: string;
}

const START_HOURS = Array.from({ length: 18 }, (_, i) => {
  const h = i + 6;
  return { value: String(h), label: `${String(h).padStart(2, "0")}:00` };
});

const DURATION_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} hora${i > 0 ? "s" : ""}`,
}));

const DAILY_HOURS_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10].map((h) => ({
  value: h,
  label: `${h} horas/dia`,
}));

const WEEK_DAYS = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
];

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function QuoteModal({ isOpen, onClose, onSubmit, isLoading, initialService }: QuoteModalProps) {
  const [serviceType, setServiceType] = useState<string>("");
  const [cepLoading, setCepLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  const form = useForm<QuoteRequest>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      childrenCount: 1,
      weekDays: [],
    },
  });

  useEffect(() => {
    if (initialService) {
      setServiceType(initialService);
      form.setValue("serviceType", initialService as any);
    }
  }, [initialService, form]);

  const handleServiceChange = (value: string) => {
    setServiceType(value);
    form.setValue("serviceType", value as any);
  };

  const showTimeFields = !["Acompanhamento em Viagens", "Mensalista"].includes(serviceType);
  const showTravelFields = serviceType === "Acompanhamento em Viagens";
  const showMonthlyFields = serviceType === "Mensalista";

  const handleCepChange = async (formatted: string) => {
    const cleaned = formatted.replace(/\D/g, "");
    if (cleaned.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const json = await res.json();
      if (!json.erro) {
        form.setValue("street", json.logradouro || "");
        form.setValue("neighborhood", json.bairro || "");
        form.setValue("city", json.localidade || "");
        form.setValue("state", json.uf || "");
        setTimeout(() => {
          const el = document.getElementById("quote-street-number");
          if (el) (el as HTMLInputElement).focus();
        }, 150);
      }
    } catch {
      // network error — ignore
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = (data: QuoteRequest) => {
    if (siteKey && !recaptchaToken) {
      setCaptchaError("Por favor, confirme que você não é um robô.");
      return;
    }
    setCaptchaError("");
    onSubmit(data, recaptchaToken ?? "");
    form.reset();
    setServiceType("");
    setRecaptchaToken(null);
    recaptchaRef.current?.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            <i className="fas fa-calculator mr-2 text-coral"></i>
            Solicitar Orçamento
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Serviço */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={() => (
                    <FormItem>
                      <FormLabel>Tipo de Serviço *</FormLabel>
                      <Select onValueChange={handleServiceChange} value={serviceType}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SERVICES.map((service) => (
                            <SelectItem key={service.id} value={service.name}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Nome */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu Nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Como você prefere ser chamado(a)?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email — opcional, para receber confirmação */}
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Seu E-mail
                      <span className="ml-1 text-xs font-normal text-gray-400">(opcional — confirmação por e-mail)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telefone — opcional */}
              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Seu Telefone / WhatsApp
                      <span className="ml-1 text-xs font-normal text-gray-400">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(13) 99999-9999" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Atendimento *</FormLabel>
                    <FormControl>
                      <Input type="date" min={getTomorrow()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Crianças */}
              <FormField
                control={form.control}
                name="childrenCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Crianças *</FormLabel>
                    <Select
                      value={String(field.value ?? 1)}
                      onValueChange={(v) => field.onChange(parseInt(v))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} criança{n > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Horários — serviços por hora e vale night */}
              {showTimeFields && (
                <>
                  <FormField
                    control={form.control}
                    name="startHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A partir das</FormLabel>
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Horário de início" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {START_HOURS.map((h) => (
                              <SelectItem key={h.value} value={h.value}>
                                {h.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="durationHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Por quantas horas</FormLabel>
                        <Select
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(v) => field.onChange(parseInt(v))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Duração" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DURATION_OPTIONS.map((d) => (
                              <SelectItem key={d.value} value={String(d.value)}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Viagens */}
              {showTravelFields && (
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="travelDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Diárias *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Quantos dias?"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Mensalista */}
              {showMonthlyFields && (
                <>
                  <div className="md:col-span-2">
                    <FormLabel className="block mb-3 text-sm font-medium text-gray-700">
                      Dias da semana desejados
                    </FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {WEEK_DAYS.map((day) => {
                        const current = form.watch("weekDays") ?? [];
                        const checked = current.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => {
                              const next = checked
                                ? current.filter((d) => d !== day.id)
                                : [...current, day.id];
                              form.setValue("weekDays", next);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                              checked
                                ? "bg-coral text-white border-coral"
                                : "bg-white text-gray-600 border-gray-300 hover:border-coral"
                            }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="dailyHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carga horária diária</FormLabel>
                          <Select
                            value={field.value ? String(field.value) : ""}
                            onValueChange={(v) => field.onChange(parseInt(v))}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Horas por dia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DAILY_HOURS_OPTIONS.map((d) => (
                                <SelectItem key={d.value} value={String(d.value)}>
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Endereço — CEP primeiro */}
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Endereço do Atendimento
                  <span className="text-gray-400 font-normal ml-1">(opcional)</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="00000-000"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                                const formatted =
                                  raw.length > 5
                                    ? `${raw.slice(0, 5)}-${raw.slice(5)}`
                                    : raw;
                                field.onChange(formatted);
                                handleCepChange(formatted);
                              }}
                            />
                            {cepLoading && (
                              <i className="fas fa-spinner fa-spin absolute right-3 top-3 text-gray-400 text-sm"></i>
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rua</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Preenchido automaticamente"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="streetNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input
                            id="quote-street-number"
                            placeholder="Nº"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="streetComplement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apto, Bloco…"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Preenchido automaticamente"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Preenchido automaticamente"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="SP" {...field} value={field.value ?? ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações ou Necessidades Especiais</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Rotinas especiais, necessidades específicas das crianças, etc."
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* reCAPTCHA */}
            {siteKey && (
              <div className="flex flex-col items-center gap-1">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={siteKey}
                  hl="pt-BR"
                  onChange={(token) => {
                    setRecaptchaToken(token);
                    if (token) setCaptchaError("");
                  }}
                  onExpired={() => setRecaptchaToken(null)}
                />
                {captchaError && (
                  <p className="text-sm text-red-500">{captchaError}</p>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-coral hover:bg-orange-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-calculator mr-2"></i>
                )}
                Calcular Orçamento
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 