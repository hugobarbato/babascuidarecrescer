import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ServiceCard } from "@/components/ui/service-card";
import { SERVICES, COMPANY_INFO, PRICING_TABLE } from "@/lib/constants";
import { ContactForm, contactFormSchema } from "@shared/schema";
import { useContact } from "@/hooks/use-contact";
import { trackWhatsAppClick } from "@/lib/analytics";

interface HomeProps {
  onOpenQuoteModal: (service?: string) => void;
}

export default function Home({ onOpenQuoteModal }: HomeProps) {
  const { sendContact, isLoading: isContactLoading } = useContact();

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", phone: "", email: "", serviceType: "", message: "" },
  });

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  const handleContactSubmit = async (data: ContactForm) => {
    let recaptchaToken = "";
    if (siteKey) {
      await new Promise<void>((resolve) => grecaptcha.ready(resolve));
      recaptchaToken = await grecaptcha.execute(siteKey, { action: "contact_submit" });
    }
    sendContact({ ...data, recaptchaToken });
    contactForm.reset();
  };

  return (
    <div className="pt-20 lg:pt-24">
      <Helmet>
        <title>Babás em Santos SP · Cuidar & Crescer — Babá Profissional</title>
        <meta name="description" content="Babás profissionais em Santos e Baixada Santista. Seleção rigorosa, treinamento próprio e metodologia Montessoriana. Solicite orçamento online gratuito." />
        <link rel="canonical" href="https://babascuidarecrescer.com.br/" />
        <meta property="og:title" content="Babás em Santos SP · Cuidar & Crescer — Babá Profissional" />
        <meta property="og:description" content="Babás profissionais em Santos e Baixada Santista. Seleção rigorosa, treinamento próprio e metodologia Montessoriana." />
        <meta property="og:url" content="https://babascuidarecrescer.com.br/" />
      </Helmet>

      {/* ── Hero ── */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-bege via-white to-azul/10">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-sm font-semibold text-vermelho uppercase tracking-widest mb-4">
              Desde {COMPANY_INFO.founded} · Baixada Santista e região
            </p>
            <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              <span className="text-vermelho">Cuidado</span> e{" "}
              <span className="text-azul">desenvolvimento</span> com{" "}
              <span className="text-verde">acolhimento</span>,{" "}
              <span className="text-roxo">segurança</span> e{" "}
              <span className="text-rosa">profissionalismo</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed">
              Conectamos famílias em Santos e Baixada Santista a babás treinadas e certificadas — profissionais que cuidam com técnica,
              carinho e olhar atento para o desenvolvimento de cada criança.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onOpenQuoteModal()}
                className="bg-vermelho text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-vermelho/80 transition-all shadow-lg transform hover:scale-105"
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
              Conheça <span className="text-vermelho">Nossos Serviços</span>
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
      <section className="py-16 lg:py-24 bg-gradient-to-r from-vermelho/5 to-verde/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Babá profissional cuidando de criança em ambiente seguro em Santos"
                  loading="lazy"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Por que escolher a{" "}
                  <span className="text-vermelho">Cuidar & Crescer</span>?
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Seleção criteriosa, treinamento certificado e metodologia própria — tudo para que você confie plenamente em quem cuida dos seus filhos.
                </p>
                <div className="space-y-5">
                  {[
                    {
                      bg: "bg-vermelho",
                      icon: "fas fa-user-shield",
                      title: "Seleção Rigorosa",
                      text: "Verificação de experiências, referências e histórico profissional antes de qualquer vínculo.",
                    },
                    {
                      bg: "bg-verde",
                      icon: "fas fa-graduation-cap",
                      title: "Curso de Babá Profissional",
                      text: "Todas as profissionais passam por treinamento completo com primeiros socorros e desenvolvimento infantil.",
                    },
                    {
                      bg: "bg-azul",
                      icon: "fas fa-seedling",
                      title: "Metodologia Montessoriana",
                      text: "Educação respeitosa e afirmativa, autonomia e desenvolvimento sensorial integrados à rotina.",
                    },
                    {
                      bg: "bg-roxo",
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
                <span className="text-vermelho">Treinamento</span> das nossas profissionais
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Antes de qualquer atendimento, todas as babás concluem nosso Curso de Babá Profissional — 12 módulos que garantem padrão de qualidade em cada visita.
              </p>
            </div>
            <div className="bg-gradient-to-br from-vermelho/5 to-verde/5 rounded-2xl p-8 lg:p-10">
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
                    <span className="text-vermelho mt-0.5 flex-shrink-0">
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
      <section id="sobre" className="py-16 lg:py-24 bg-gradient-to-br from-verde/5 to-azul/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                <span className="text-verde">Sobre</span> a <span className="text-vermelho">Cuidar & Crescer</span>
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
                  loading="lazy"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-vermelho text-4xl mb-4">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-warm-gray">Missão</h3>
                <p className="text-gray-600 leading-relaxed">{COMPANY_INFO.mission}</p>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-verde text-4xl mb-4">
                  <i className="fas fa-eye"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-warm-gray">Visão</h3>
                <p className="text-gray-600 leading-relaxed">{COMPANY_INFO.vision}</p>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-azul text-4xl mb-4">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-warm-gray">Valores</h3>
                <p className="text-gray-600 leading-relaxed">{COMPANY_INFO.values}</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── Contato ── */}
      <section id="contato" className="py-16 lg:py-24 bg-gradient-to-br from-verde/5 to-azul/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Entre em <span className="text-vermelho">Contato</span>
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
                    <div className="bg-vermelho text-white p-4 rounded-full">
                      <i className="fas fa-envelope text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">E-mail</h4>
                      <p className="text-gray-600">Para dúvidas e orçamentos detalhados</p>
                      <a href={`mailto:${COMPANY_INFO.email}`} className="text-vermelho font-medium hover:underline">
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-azul text-white p-4 rounded-full">
                      <i className="fas fa-clock text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Horário de Atendimento</h4>
                      <p className="text-gray-600">Segunda a sexta: 8h às 18h</p>
                      <p className="text-gray-600">Sábados: 8h às 14h</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-vermelho/10 to-verde/10 rounded-2xl">
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

                      <p className="text-xs text-gray-400">
                        Seus dados serão utilizados apenas para contato e orçamento.
                        Não armazenamos informações pessoais em nossa base de dados, conforme LGPD.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          type="submit"
                          className="flex-1 bg-vermelho hover:bg-vermelho/80"
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
      <section className="py-16 lg:py-20 bg-vermelho">
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
              className="bg-white text-vermelho px-8 py-4 rounded-full text-lg font-semibold hover:bg-bege transition-all shadow-lg transform hover:scale-105"
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

