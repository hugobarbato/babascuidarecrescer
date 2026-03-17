import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ServiceCard } from "@/components/ui/service-card";
import { SERVICES, COMPANY_INFO, PRICING_TABLE } from "@/lib/constants";
import { ContactForm, contactFormSchema } from "@shared/schema";
import { useContact } from "@/hooks/use-quote";
import { trackWhatsAppClick } from "@/lib/analytics";

interface HomeProps {
  onOpenQuoteModal: (service?: string) => void;
}

export default function Home({ onOpenQuoteModal }: HomeProps) {
  const { sendContact, isLoading: isContactLoading } = useContact();

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { lgpdConsent: false },
  });

  const handleContactSubmit = (data: ContactForm) => {
    sendContact(data);
    contactForm.reset();
  };

  return (
    <div className="pt-20 lg:pt-24">

      {/* ── Hero ── */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-sm font-semibold text-coral uppercase tracking-widest mb-4">
              Desde {COMPANY_INFO.founded} · Baixada Santista e região
            </p>
            <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              <span className="text-coral">Cuidado</span> e{" "}
              <span className="text-soft-blue">desenvolvimento</span> com{" "}
              <span className="text-sage">acolhimento</span>,{" "}
              <span className="text-soft-purple">segurança</span> e{" "}
              <span className="text-soft-pink">profissionalismo</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed">
              Conectamos famílias a babás treinadas e certificadas — profissionais que cuidam com técnica,
              carinho e olhar atento para o desenvolvimento de cada criança.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onOpenQuoteModal()}
                className="bg-coral text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 transition-all shadow-lg transform hover:scale-105"
              >
                <i className="fas fa-calculator mr-2"></i> Solicitar Orçamento
              </Button>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("home_hero")}
              >
                <Button className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 transition-all shadow-lg transform hover:scale-105">
                  <i className="fab fa-whatsapp mr-2"></i> Falar no WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Serviços ── */}
      <section id="servicos" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Conheça <span className="text-coral">Nossos Serviços</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modalidades pensadas para cada momento da rotina familiar — do dia a dia ao cuidado especial em eventos e viagens.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                detailHref={`/services/${service.id}`}
                onRequestQuote={() => onOpenQuoteModal(service.name)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Por que escolher a Cuidar & Crescer ── */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-coral/5 to-sage/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Profissional cuidando de criança em ambiente seguro"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Por que escolher a{" "}
                  <span className="text-coral">Cuidar & Crescer</span>?
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Seleção criteriosa, treinamento certificado e metodologia própria — tudo para que você confie plenamente em quem cuida dos seus filhos.
                </p>
                <div className="space-y-5">
                  {[
                    {
                      bg: "bg-coral",
                      icon: "fas fa-user-shield",
                      title: "Seleção Rigorosa",
                      text: "Verificação de experiências, referências e histórico profissional antes de qualquer vínculo.",
                    },
                    {
                      bg: "bg-sage",
                      icon: "fas fa-graduation-cap",
                      title: "Curso de Babá Profissional",
                      text: "Todas as profissionais passam por treinamento completo com primeiros socorros e desenvolvimento infantil.",
                    },
                    {
                      bg: "bg-soft-blue",
                      icon: "fas fa-seedling",
                      title: "Metodologia Montessoriana",
                      text: "Educação respeitosa e afirmativa, autonomia e desenvolvimento sensorial integrados à rotina.",
                    },
                    {
                      bg: "bg-soft-purple",
                      icon: "fas fa-mobile-alt",
                      title: "Sem Uso de Telas",
                      text: "Compromisso firme: estímulo real através do brincar, da música, da leitura e da presença ativa.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className={`${item.bg} text-white p-3 rounded-full flex-shrink-0`}>
                        <i className={`${item.icon} text-lg`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curso de Babá Profissional ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="text-coral">Treinamento</span> das nossas profissionais
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Antes de qualquer atendimento, todas as babás concluem nosso Curso de Babá Profissional — 12 módulos que garantem padrão de qualidade em cada visita.
              </p>
            </div>
            <div className="bg-gradient-to-br from-coral/5 to-sage/5 rounded-2xl p-8 lg:p-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Cuidados Pessoais padrão Cuidar e Crescer",
                  "Ética da Babá Profissional",
                  "Organograma de Atendimento",
                  "Atendimento de Recém-nascidos até 1 ano",
                  "Metodologia Cuidar e Crescer",
                  "Higiene e Banho Seguro",
                  "Alimentação e Manuseio de Leite",
                  "Janela de Sono",
                  "Saltos de Desenvolvimento",
                  "Brincar Estimulante",
                  "Segurança e Primeiros Socorros",
                  "Desenvolvimento Infantil",
                ].map((topic, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-coral mt-0.5 flex-shrink-0">
                      <i className="fas fa-check-circle"></i>
                    </span>
                    <span className="text-gray-700 text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sobre ── */}
      <section id="sobre" className="py-16 lg:py-24 bg-gradient-to-br from-sage/5 to-soft-blue/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                <span className="text-sage">Sobre</span> a <span className="text-coral">Cuidar & Crescer</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-warm-gray">Nossa História</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Somos uma empresa especializada no Cuidado e Desenvolvimento Infantil. Uma equipe de profissionais dedicados e apaixonados por cuidar e promover o desenvolvimento integral e personalizado das crianças.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Atuando no mercado desde {COMPANY_INFO.founded}, sendo a rede de apoio de diversas famílias. Nosso compromisso é oferecer um serviço acolhedor, seguro, estimulante e personalizado, onde cada criança é cuidada com paixão e tem a oportunidade de crescer com dedicação.
                </p>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                  alt="Família feliz com crianças brincando em ambiente seguro e colorido"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-coral text-4xl mb-4">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-warm-gray">Missão</h3>
                <p className="text-gray-600 leading-relaxed">{COMPANY_INFO.mission}</p>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-sage text-4xl mb-4">
                  <i className="fas fa-eye"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-warm-gray">Visão</h3>
                <p className="text-gray-600 leading-relaxed">{COMPANY_INFO.vision}</p>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-soft-blue text-4xl mb-4">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-warm-gray">Valores</h3>
                <p className="text-gray-600 leading-relaxed">{COMPANY_INFO.values}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores / Preços ── */}
      <section id="valores" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              <span className="text-coral">Valores</span> dos Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparência total em nossos preços para que você possa planejar com segurança
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto mb-8">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-coral to-orange-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Serviço</th>
                  <th className="px-6 py-4 text-left font-semibold">Dias de Semana</th>
                  <th className="px-6 py-4 text-left font-semibold">Finais de Semana</th>
                  <th className="px-6 py-4 text-left font-semibold">Adicionais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {PRICING_TABLE.map((row, index) => (
                  <tr key={index} className={`hover:bg-gray-50 ${index === 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""}`}>
                    <td className="px-6 py-6">
                      <div className="font-semibold text-warm-gray">{row.service}</div>
                      <div className="text-sm text-gray-500">{row.description}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="whitespace-pre-line text-warm-gray">{row.weekday}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="whitespace-pre-line text-warm-gray">{row.weekend}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="whitespace-pre-line text-gray-600">{row.additional}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-6 mb-8">
            {PRICING_TABLE.map((row, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div
                  className={`px-6 py-4 text-white ${
                    index === 0 ? "bg-gradient-to-r from-coral to-orange-400" :
                    index === 1 ? "bg-gradient-to-r from-soft-blue to-blue-400" :
                    index === 2 ? "bg-gradient-to-r from-soft-pink to-pink-400" :
                    "bg-gradient-to-r from-yellow-500 to-orange-500"
                  }`}
                >
                  <h3 className="font-semibold text-lg">{row.service}</h3>
                  <p className="text-sm opacity-90">{row.description}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">Dias de semana:</span>
                    <div className="text-gray-600 whitespace-pre-line">{row.weekday}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Finais de semana:</span>
                    <div className="text-gray-600 whitespace-pre-line">{row.weekend}</div>
                  </div>
                  <div className="border-t pt-4">
                    <span className="font-medium text-gray-700">Adicionais:</span>
                    <div className="text-gray-600 whitespace-pre-line">{row.additional}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-16">
            <Button
              onClick={() => onOpenQuoteModal()}
              className="bg-coral text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 transition-all shadow-lg"
            >
              <i className="fas fa-calculator mr-2"></i>
              Calcular Meu Orçamento
            </Button>
          </div>

          <div className="bg-gradient-to-r from-coral/10 to-sage/10 p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-3">
              <i className="fas fa-info-circle mr-2 text-coral"></i>
              Informações Importantes sobre Pagamentos:
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>• Os serviços são realizados mediante pagamento ou sinal de até 50% do valor acordado</p>
              <p>• Atendimentos mensalistas possuem valor fixo, não será descontado mediante cancelamento ou diminuição de horas</p>
              <p>• Pagamentos devem ser feitos na data combinada previamente ou em até 48 horas após o atendimento</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contato ── */}
      <section id="contato" className="py-16 lg:py-24 bg-gradient-to-br from-sage/5 to-soft-blue/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Entre em <span className="text-coral">Contato</span>
              </h2>
              <p className="text-xl text-gray-600">
                Solicite seu orçamento ou tire suas dúvidas. Estamos aqui para ajudar!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl font-bold mb-8 text-warm-gray">Formas de Contato</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-500 text-white p-4 rounded-full">
                      <i className="fab fa-whatsapp text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">WhatsApp</h4>
                      <p className="text-gray-600">Resposta rápida e atendimento personalizado</p>
                      <a href={`https://wa.me/${COMPANY_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick("home_contact_info")} className="text-green-500 font-medium hover:underline">
                        {COMPANY_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-coral text-white p-4 rounded-full">
                      <i className="fas fa-envelope text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">E-mail</h4>
                      <p className="text-gray-600">Para dúvidas e orçamentos detalhados</p>
                      <a href={`mailto:${COMPANY_INFO.email}`} className="text-coral font-medium hover:underline">
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-soft-blue text-white p-4 rounded-full">
                      <i className="fas fa-clock text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Horário de Atendimento</h4>
                      <p className="text-gray-600">Segunda a sexta: 8h às 18h</p>
                      <p className="text-gray-600">Sábados: 8h às 14h</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-coral/10 to-sage/10 rounded-2xl">
                  <h4 className="font-semibold text-lg mb-3 text-warm-gray">Atendimento 24h para Emergências</h4>
                  <p className="text-gray-600 text-sm">
                    Para situações urgentes com nossas babás já contratadas, oferecemos suporte 24 horas por dia.
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 text-warm-gray">Fale Conosco</h3>

                  <Form {...contactForm}>
                    <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={contactForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome *</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={contactForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone/WhatsApp *</FormLabel>
                              <FormControl><Input placeholder="(11) 99999-9999" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={contactForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail *</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={contactForm.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Serviço de Interesse</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione um serviço" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SERVICES.map((service) => (
                                  <SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={contactForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                              <Textarea rows={4} placeholder="Conte-nos sobre suas necessidades..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={contactForm.control}
                        name="lgpdConsent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-xs text-gray-500">
                                * Seus dados serão utilizados apenas para contato e orçamento.
                                Não armazenamos informações pessoais em nossa base de dados, conforme LGPD.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          type="submit"
                          className="flex-1 bg-coral hover:bg-orange-500"
                          disabled={isContactLoading}
                        >
                          {isContactLoading ? (
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                          ) : (
                            <i className="fas fa-paper-plane mr-2"></i>
                          )}
                          Enviar Mensagem
                        </Button>
                        <a href={`https://wa.me/${COMPANY_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick("home_form_cta")} className="flex-1">
                          <Button type="button" className="w-full bg-green-500 hover:bg-green-600">
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

      {/* ── CTA Final ── */}
      <section className="py-16 lg:py-20 bg-coral">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Sua família merece o melhor cuidado
          </h2>
          <p className="text-white/90 text-lg mb-10 max-w-xl mx-auto">
            Solicite um orçamento agora — é rápido e sem compromisso. Ou fale direto no WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onOpenQuoteModal()}
              className="bg-white text-coral px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-50 transition-all shadow-lg transform hover:scale-105"
            >
              <i className="fas fa-calculator mr-2"></i> Solicitar Orçamento
            </Button>
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("home_bottom_cta")}
            >
              <Button className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 transition-all shadow-lg transform hover:scale-105">
                <i className="fab fa-whatsapp mr-2"></i> Falar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

