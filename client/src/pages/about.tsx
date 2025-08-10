import { COMPANY_INFO } from "@/lib/constants";

export default function About() {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="py-16 lg:py-24 bg-gradient-to-br from-sage/5 to-soft-blue/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-3xl lg:text-5xl font-bold mb-6">
                <span className="text-sage">Sobre</span> a <span className="text-coral">Cuidar & Crescer</span>
              </h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-warm-gray">Nossa História</h2>
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
              {/* Missão */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-coral text-4xl mb-4">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-warm-gray">Missão</h3>
                <p className="text-gray-600 leading-relaxed">
                  {COMPANY_INFO.mission}
                </p>
              </div>

              {/* Visão */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-sage text-4xl mb-4">
                  <i className="fas fa-eye"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-warm-gray">Visão</h3>
                <p className="text-gray-600 leading-relaxed">
                  {COMPANY_INFO.vision}
                </p>
              </div>

              {/* Valores */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-soft-blue text-4xl mb-4">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-warm-gray">Valores</h3>
                <p className="text-gray-600 leading-relaxed">
                  {COMPANY_INFO.values}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
