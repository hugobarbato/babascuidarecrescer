import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { QuoteRequest, quoteRequestSchema } from "@shared/schema";
import { SERVICES } from "@/lib/constants";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuoteRequest) => void;
  isLoading: boolean;
  initialService?: string;
}

export function QuoteModal({ isOpen, onClose, onSubmit, isLoading, initialService }: QuoteModalProps) {
  const [serviceType, setServiceType] = useState<string>("");

  const form = useForm<QuoteRequest>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      childrenCount: 1,
      lgpdConsent: false,
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

  const handleSubmit = (data: QuoteRequest) => {
    onSubmit(data);
    form.reset();
    setServiceType("");
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
                  render={({ field }) => (
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

              {/* Data */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Horários */}
              {showTimeFields && (
                <>
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário Início *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário Fim *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Campos para Viagens */}
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

              {/* Quantidade de Crianças */}
              <FormField
                control={form.control}
                name="childrenCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Crianças *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Endereço */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço/Bairro/Cidade *</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro, Cidade - SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dados Pessoais */}
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp *</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          placeholder="Conte-nos sobre necessidades específicas, rotinas especiais, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* LGPD Consent */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <FormField
                control={form.control}
                name="lgpdConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-gray-600">
                        Concordo que meus dados sejam utilizados apenas para contato e orçamento. 
                        Não armazenamos informações pessoais em nossa base de dados, conforme LGPD. *
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

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
