import { Link } from 'react-router-dom';
import {
  QrCode,
  Shield,
  Smartphone,
  Heart,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  ExternalLink,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';

const faqs = [
  {
    question: '¿Cómo registro a mi mascota?',
    isStepByStep: true,
    steps: [
      { number: 1, text: 'Crea tu cuenta gratis en nuestra plataforma' },
      {
        number: 2,
        text: 'Completa el perfil de tu mascota con foto, nombre, información médica y tus datos de contacto',
      },
      { number: 3, text: 'Descarga el código QR generado' },
      {
        number: 4,
        text: 'Compra tu correa en nuestra tienda: ',
        hasLink: true,
        linkText: 'lulutracker',
        linkUrl: 'https://lulutracker.myshopify.com/',
      },
    ],
    finalText: '¡Listo! Tu mascota estará protegida en minutos.',
  },
  {
    question: '¿Qué pasa cuando alguien encuentra a mi mascota?',
    answer:
      'Cuando alguien escanea el código QR de la placa, verá instantáneamente la información de tu mascota y tus datos de contacto.',
  },
  {
    question: '¿Puedo actualizar la información de mi mascota?',
    answer:
      '¡Absolutamente! Una de las grandes ventajas de Lulutracker es que puedes actualizar toda la información en cualquier momento desde tu cuenta: cambiar número de teléfono, agregar información médica, actualizar foto, etc. Los cambios son instantáneos sin necesidad de reemplazar la placa.',
  },
  {
    question: '¿La placa es resistente al agua y duración?',
    answer:
      'Sí, nuestras placas están diseñadas para resistir el uso diario de tu mascota. Son impermeables, resistentes a rasguños y fabricadas con materiales duraderos de alta calidad. Están hechas para durar años, incluso con mascotas muy activas.',
  },
  {
    question: '¿Puedo usar una placa para varias mascotas?',
    answer:
      'Cada placa está diseñada para una mascota individual, ya que cada código QR es único y lleva a un perfil específico. Sin embargo, puedes tener múltiples mascotas registradas en tu misma cuenta, cada una con su propia placa.',
  },
  {
    question: '¿Esta segura mi información?',
    answer:
      'Totalmente. Tus datos están protegidos y encriptados. Tú decides qué información mostrar públicamente cuando alguien escanea el QR. Los datos sensibles como tu dirección exacta nunca se muestran, solo la información de contacto que tú autorices.',
  },
];

const Home = () => {
  const [openIndex, setOpenIndex] = useState(null as number | null);
  const SHOP_URL = 'https://lulutracker.myshopify.com/';

  // useInView hooks for scroll animations
  const productSection = useInView();
  const howItWorksSection = useInView();
  const comparisonSection = useInView();
  const missionSection = useInView();
  const faqSection = useInView();
  const ctaSection = useInView();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slideUp">
            <div className="mb-4 inline-block rounded-full bg-blue-100 dark:bg-blue-900 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
              🐾 Collar Inteligente con QR
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 sm:text-6xl">
              El collar que puede salvar
              <br />
              <span className="text-blue-600 dark:text-blue-400">la vida de tu mascota</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Un collar con código QR único + perfil digital completo. Si tu
              mascota se pierde, quien la encuentre podrá contactarte en
              segundos.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Comprar Collar Ahora
                </Button>
              </a>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Ver tu Perfil
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              ✓ Envío gratis | ✓ Perfil digital incluido | ✓ Sin mensualidades
            </p>
          </div>
        </div>
      </section>

      {/* Product Explanation */}
      <section ref={productSection.ref as any} className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center scroll-animate animate-fadeIn ${productSection.isInView ? 'is-visible' : ''}`}>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
              ¿Qué incluye tu Collar LuluTracker?
            </h2>
            <p className="mb-12 text-lg text-gray-600 dark:text-gray-300">
              No es solo un collar, es un sistema completo de protección
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className={`border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-8 scroll-animate animate-slideInLeft ${productSection.isInView ? 'is-visible' : ''}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  1. Collar Físico con QR
                </h3>
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Collar duradero con código QR único y resistente al agua. Se
                coloca en el collar de tu mascota y es escaneable desde
                cualquier smartphone.
              </p>
              <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  Ver Modelos Disponibles
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </Card>

            <Card className={`border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-8 scroll-animate animate-slideInRight animation-delay-200 ${productSection.isInView ? 'is-visible' : ''}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 dark:bg-green-500">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  2. Perfil Digital Gratuito
                </h3>
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Plataforma web donde creas el perfil de tu mascota: foto,
                nombre, contacto de emergencia, información médica y más.
                Actualízalo cuando quieras.
              </p>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="hover:bg-[#0091073b] dark:hover:bg-green-900/30 border-green-700 dark:border-green-500 text-green-700 dark:text-green-400"
                >
                  Crear Perfil Ahora
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section ref={howItWorksSection.ref as any} className="bg-gray-50 dark:bg-gray-800 py-20" id="como_funciona">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`scroll-animate animate-fadeIn ${howItWorksSection.isInView ? 'is-visible' : ''}`}>
            <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
              ¿Cómo funciona?
            </h2>
            <p className="mb-12 text-center text-lg text-gray-600 dark:text-gray-300">
              Tan simple como en tres pasos
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className={`relative overflow-hidden bg-white dark:bg-gray-700 p-8 text-center scroll-animate animate-slideUp ${howItWorksSection.isInView ? 'is-visible' : ''}`}>
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-lg font-bold text-white">
                1
              </div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Compra tu collar
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Elige el modelo que más te guste en nuestra tienda y recíbelo en
                tu casa.
              </p>
              <a
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Ir a la tienda →
              </a>
            </Card>

            <Card className={`relative overflow-hidden bg-white dark:bg-gray-700 p-8 text-center scroll-animate animate-slideUp animation-delay-200 ${howItWorksSection.isInView ? 'is-visible' : ''}`}>
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-lg font-bold text-white">
                2
              </div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Crea el perfil digital
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Registra a tu mascota con foto, datos de contacto y toda la
                información importante.
              </p>
              <Link
                to="/login"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Crear perfil gratis →
              </Link>
            </Card>

            <Card className={`relative overflow-hidden bg-white dark:bg-gray-700 p-8 text-center scroll-animate animate-slideUp animation-delay-400 ${howItWorksSection.isInView ? 'is-visible' : ''}`}>
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-lg font-bold text-white">
                3
              </div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Protégela para siempre
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Coloca el collar y vive tranquilo. Si se pierde, quien la
                encuentre te contactará al instante.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Traditional vs LuluTracker */}
      <section ref={comparisonSection.ref as any} className="py-20 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className={`scroll-animate animate-fadeIn ${comparisonSection.isInView ? 'is-visible' : ''}`}>
            <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
              Placas tradicionales vs LuluTracker
            </h2>
            <p className="mb-12 text-center text-lg text-gray-600 dark:text-gray-300">
              El futuro de la identificación de mascotas
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className={`border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-8 scroll-animate animate-slideInLeft ${comparisonSection.isInView ? 'is-visible' : ''}`}>
              <div className="mb-6 flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Placas Tradicionales
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500">✗</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Información limitada (solo nombre y teléfono)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500">✗</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Se desgasta y es difícil de leer
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500">✗</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    No se puede actualizar si cambias de número
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500">✗</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Sin información médica o alergias
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500">✗</span>
                  <span className="text-gray-700 dark:text-gray-300">Sin foto de tu mascota</span>
                </li>
              </ul>
            </Card>

            <Card className={`border-2 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30 p-8 scroll-animate animate-slideInRight animation-delay-200 ${comparisonSection.isInView ? 'is-visible' : ''}`}>
              <div className="mb-6 flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  LuluTracker
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-500">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Perfil completo con toda la información
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-500">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    QR duradero y resistente al agua
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-500">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Actualiza tus datos cuando quieras, gratis
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-500">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Información médica, alergias, veterinario
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-500">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Foto y múltiples contactos de emergencia
                  </span>
                </li>
              </ul>
              <div className="mt-8">
                <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Comprar Ahora
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section ref={missionSection.ref as any} className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 py-20 text-white">
        <div className={`mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 scroll-animate animate-scaleIn ${missionSection.isInView ? 'is-visible' : ''}`}>
          <Heart className="mx-auto mb-6 h-16 w-16" />
          <h2 className="mb-6 text-4xl font-bold">Nuestra Misión</h2>
          <p className="mb-8 text-xl text-blue-100 dark:text-blue-200">
            En LuluTracker creemos que cada mascota merece regresar a casa. Por
            eso creamos una solución simple, accesible y efectiva que combina
            tecnología con amor por los animales. No más mascotas perdidas sin
            forma de contacto.
          </p>
          <p className="mb-10 text-lg text-blue-200 dark:text-blue-300">
            Miles de mascotas se pierden cada día. Con LuluTracker, aumentas
            hasta 10 veces las posibilidades de que tu mejor amigo regrese a
            salvo a casa.
          </p>
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary" className="gap-2">
              <ShoppingCart className="h-5 w-5" />
              Protege a tu mascota hoy
            </Button>
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqSection.ref as any} className="bg-white dark:bg-gray-900 py-16" id="preguntas_frecuentes">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 scroll-animate animate-fadeIn ${faqSection.isInView ? 'is-visible' : ''}`}>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Todo lo que necesitas saber sobre Lulutracker y cómo proteger a
              tu mascota
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="pr-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-5">
                    {faq.isStepByStep ? (
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Es muy simple:
                        </p>
                        {faq.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex gap-4">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-sm font-bold text-white">
                              {step.number}
                            </div>
                            <p className="flex-1 pt-1 text-gray-600 dark:text-gray-300 leading-relaxed">
                              {step.text}
                              {step.hasLink && (
                                <a
                                  href={step.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium"
                                >
                                  {step.linkText}
                                </a>
                              )}
                            </p>
                          </div>
                        ))}
                        {faq.finalText && (
                          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                            {faq.finalText}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                        {faq.hasLink && (
                          <a
                            href={faq.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium"
                          >
                            {faq.linkText}
                          </a>
                        )}
                        {faq.hasLink &&
                          '. ¡Listo! Tu mascota estará protegida en minutos.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section ref={ctaSection.ref as any} className="bg-white dark:bg-gray-900 py-20">
        <div className={`mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 scroll-animate animate-slideUp ${ctaSection.isInView ? 'is-visible' : ''}`}>
          <Smartphone className="mx-auto mb-6 h-16 w-16 text-blue-600 dark:text-blue-400" />
          <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100">
            Tecnología simple, tranquilidad infinita
          </h2>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            No necesitas instalar ninguna app. Quien encuentre a tu mascota solo
            escanea el código QR con la cámara del teléfono y verá toda la
            información para contactarte de inmediato.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                <ShoppingCart className="h-5 w-5" />
                Ver Collares Disponibles
              </Button>
            </a>
            <Link to="/dashboard">
              <Button size="lg" variant="outline">
                Explorar Demo
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            💳 Pago seguro | 📦 Envío a todo el país | 🔄 Devoluciones sin
            complicaciones
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
