import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { JobApplication, jobApplicationSchema } from "@shared/schema";
import { COMPANY_INFO } from "@/lib/constants";
import { useJobApplication } from "@/hooks/use-quote";
import { trackWhatsAppClick } from "@/lib/analytics";

interface WorkWithUsProps {
  onOpenQuoteModal: (service?: string) => void;
}

export default function WorkWithUs({ onOpenQuoteModal }: WorkWithUsProps) {
  const { sendApplication, isLoading } = useJobApplication();
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  const form = useForm<JobApplication>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: { name: "", phone: "", email: "", city: "", experience: "", courses: "" },
  });

  const handleSubmit = async (data: JobApplication) => {
    let recaptchaToken = "";
    if (siteKey) {
      await new Promise<void>((resolve) => grecaptcha.ready(resolve));
      recaptchaToken = await grecaptcha.execute(siteKey, { action: "job_application_submit" });
    }
    sendApplication({ ...data, recaptchaToken });
    form.reset();
  };

  const whatsappMessage = encodeURIComponent(
    "Olá! Tenho interesse em trabalhar na Cuidar e Crescer."
  );

  const seekingItems = [
    "Tenham experiência comprovada com crianças",
    "Possuam cursos na área infantil (ou interesse em se qualificar)",
    "Sejam responsáveis, pontuais e organizadas",
    "Tenham postura ética e comprometimento",
    "Gostem genuinamente de crianças",
    "Sejam pacientes, carinhosas e atentas às necessidades infantis",
    "Tenham boa comunicação com a família",
    "Estejam alinhadas com um cuidado respeitoso e consciente",
  ];

  const differentialItems = [
    "Formação ou cursos em áreas como: recreação, primeiros socorros, desenvolvimento infantil, pedagogia ou similares",
    "Experiência como babá mensalista",
    "Referências profissionais",
    "Conhecimento de atividades pedagógicas e estímulos adequados para cada idade",
    "Perfil profissional, discreto e confiável",
  ];

  const offerItems = [
    { icon: "fas fa-home", text: "Oportunidade de trabalhar com famílias selecionadas" },
    { icon: "fas fa-star", text: "Valorização da profissional de babá" },
    { icon: "fas fa-handshake", text: "Organização e transparência nas contratações" },
    { icon: "fas fa-headset", text: "Acompanhamento e suporte da agência" },
    { icon: "fas fa-chart-line", text: "Possibilidade de crescimento profissional" },
    { icon: "fas fa-heart", text: "Parceria com uma agência que prioriza o respeito e a qualidade do serviço" },
  ];

  return (
    <div className="pt-20 lg:pt-24">
      <Helmet>
        <title>Vagas para Babá em Santos SP · Trabalhe na Cuidar & Crescer</title>
        <meta name="description" content="Faça parte da equipe Cuidar & Crescer. Vagas para babás profissionais em Santos e região. Treinamento incluso e crescimento profissional." />
        <link rel="canonical" href="https://babascuidarecrescer.com.br/trabalhe-conosco" />
        <meta property="og:title" content="Vagas para Babá em Santos SP · Trabalhe na Cuidar & Crescer" />
        <meta property="og:description" content="Vagas para babás profissionais em Santos e região. Treinamento incluso." />
        <meta property="og:url" content="https://babascuidarecrescer.com.br/trabalhe-conosco" />
      </Helmet>
      {/* Hero / Introdução */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-verde/5 to-azul/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-5xl font-bold mb-6">
              Trabalhe <span className="text-verde">Conosco</span>
            </h1>
            <p className="text-xl text-vermelho font-semibold mb-8">
              Agência Cuidar e Crescer
            </p>
            <div className="text-left space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Na Cuidar e Crescer, acreditamos que cuidar de uma criança é uma missão de grande responsabilidade, amor e propósito. Nosso compromisso é conectar famílias a profissionais qualificadas, éticas e verdadeiramente comprometidas com o desenvolvimento infantil.
              </p>
              <p>
                Se você é uma babá dedicada, responsável e apaixonada por contribuir para o crescimento saudável e feliz das crianças, queremos conhecer você!
              </p>
              <p>
                Buscamos profissionais que compreendam que o papel da babá vai além do cuidado básico: envolve estímulos adequados para cada fase do desenvolvimento, segurança, afeto, organização da rotina e apoio às famílias com excelência e profissionalismo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quem buscamos */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-4xl font-bold mb-8 text-center">
              Quem <span className="text-vermelho">Buscamos</span>
            </h2>
            <p className="text-gray-600 text-lg text-center mb-10">
              Procuramos profissionais que:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {seekingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm"
                >
                  <i className="fas fa-check-circle text-verde mt-1 flex-shrink-0"></i>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais valorizados */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-vermelho/5 to-rosa/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-4xl font-bold mb-10 text-center">
              Diferenciais <span className="text-vermelho">Valorizados</span>
            </h2>
            <div className="space-y-4">
              {differentialItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-5 bg-white rounded-xl shadow-sm"
                >
                  <i className="fas fa-award text-vermelho mt-1 flex-shrink-0"></i>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* O que oferecemos */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-4xl font-bold mb-10 text-center">
              O Que <span className="text-verde">Oferecemos</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerItems.map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-2xl shadow-lg text-center"
                >
                  <div className="bg-verde/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${item.icon} text-verde text-xl`}></i>
                  </div>
                  <p className="text-gray-700 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Frase final + CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-verde/5 to-azul/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Na Cuidar e Crescer, acreditamos que <strong className="text-verde">profissionais valorizadas cuidam melhor</strong>. Por isso, buscamos construir relações baseadas em confiança, respeito e excelência.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              Se você deseja fazer parte da nossa equipe e contribuir para o desenvolvimento saudável das crianças, <strong>envie seu cadastro e venha crescer conosco!</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Formulário de cadastro */}
      <section id="cadastro" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-2 text-warm-gray text-center">Envie seu Cadastro</h2>
              <p className="text-gray-500 text-center mb-8">
                Preencha seus dados e entraremos em contato
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade/Região *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Santos - SP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experiência com crianças</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva sua experiência cuidando de crianças, tempo de atuação, idades que já trabalhou..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="courses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cursos e Formação</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Liste seus cursos, formações ou certificações na área infantil..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-verde text-white py-3 rounded-full hover:bg-verde/80 transition-colors shadow-lg font-semibold text-lg"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Enviar Cadastro
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    Seus dados serão utilizados exclusivamente para fins de recrutamento pela {COMPANY_INFO.name}.
                  </p>
                </form>
              </Form>
            </div>

            {/* CTAs alternativos */}
            <div className="mt-10 text-center space-y-4">
              <p className="text-gray-600 font-medium">
                Prefere entrar em contato diretamente?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("work_with_us_cta")}
                  className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-600 transition-colors shadow-lg"
                >
                  <i className="fab fa-whatsapp text-xl"></i>
                  Quero fazer parte da equipe
                </a>
                <a
                  href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent("Trabalhe Conosco — Cadastro de Babá")}`}
                  className="inline-flex items-center justify-center gap-2 bg-vermelho text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-vermelho/80 transition-colors shadow-lg"
                >
                  <i className="fas fa-envelope text-xl"></i>
                  Enviar por E-mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
