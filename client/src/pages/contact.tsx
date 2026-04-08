import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ContactForm, contactFormSchema } from "@shared/schema";
import { SERVICES, COMPANY_INFO } from "@/lib/constants";
import { useContact } from "@/hooks/use-contact";
import { trackWhatsAppClick } from "@/lib/analytics";
import { loadRecaptcha } from "@/lib/recaptcha";
interface ContactPageProps {
  onOpenQuoteModal: (service?: string) => void;
}

export default function Contact({ onOpenQuoteModal }: ContactPageProps) {
  const { sendContact, isLoading } = useContact();
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", phone: "", email: "", serviceType: "", message: "" },
  });

  const handleSubmit = async (data: ContactForm) => {
    let recaptchaToken = "";
    if (siteKey) {
      await loadRecaptcha();
      await new Promise<void>((resolve) => grecaptcha.ready(resolve));
      recaptchaToken = await grecaptcha.execute(siteKey, { action: "contact_submit" });
    }
    sendContact({ ...data, recaptchaToken });
    form.reset();
  };

  return (
    <div className="pt-20 lg:pt-24">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-3xl lg:text-5xl font-bold mb-6">
                Entre em <span className="text-vermelho">Contato</span>
              </h1>
              <p className="text-xl text-gray-600">
                Solicite seu orçamento ou tire suas dúvidas. Estamos aqui para ajudar!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl font-bold mb-8 text-warm-gray">Formas de Contato</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-700 text-white p-4 rounded-full">
                      <i className="fab fa-whatsapp text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">WhatsApp</h3>
                      <p className="text-gray-600">Resposta rápida e atendimento personalizado</p>
                      <a 
                        href={`https://wa.me/${COMPANY_INFO.whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick("contact_info")}
                        className="text-green-700 font-medium hover:underline"
                      >
                        {COMPANY_INFO.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-vermelho text-white p-4 rounded-full">
                      <i className="fas fa-envelope text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">E-mail</h3>
                      <p className="text-gray-600">Para dúvidas e orçamentos detalhados</p>
                      <a 
                        href={`mailto:${COMPANY_INFO.email}`} 
                        className="text-vermelho-dark font-medium hover:underline"
                      >
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-azul text-white p-4 rounded-full">
                      <i className="fas fa-clock text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Horário de Atendimento</h3>
                      <p className="text-gray-600">Segunda a sexta: 8h às 18h</p>
                      <p className="text-gray-600">Sábados: 8h às 14h</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-vermelho/10 to-verde/10 rounded-2xl">
                  <h3 className="font-semibold text-lg mb-3 text-warm-gray">Atendimento 24h para Emergências</h3>
                  <p className="text-gray-600 text-sm">
                    Para situações urgentes com nossas babás já contratadas, oferecemos suporte 24 horas por dia.
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold mb-6 text-warm-gray">Fale Conosco</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone/WhatsApp *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(11) 99999-9999"
                                  {...field}
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
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
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

                      <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Serviço de Interesse</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
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
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                              <Textarea 
                                rows={4} 
                                placeholder="Conte-nos sobre suas necessidades..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <p className="text-xs text-gray-500">
                        Seus dados serão utilizados apenas para contato e orçamento.
                        Não armazenamos informações pessoais em nossa base de dados, conforme LGPD.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          type="submit"
                          className="flex-1 bg-vermelho hover:bg-vermelho/80"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                          ) : (
                            <i className="fas fa-paper-plane mr-2"></i>
                          )}
                          Enviar Mensagem
                        </Button>
                        <a 
                          href={`https://wa.me/${COMPANY_INFO.whatsapp}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => trackWhatsAppClick("contact_form_cta")}
                          className="flex-1"
                        >
                          <Button className="w-full bg-green-700 hover:bg-green-800">
                            <i className="fab fa-whatsapp mr-2"></i> WhatsApp
                          </Button>
                        </a>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
