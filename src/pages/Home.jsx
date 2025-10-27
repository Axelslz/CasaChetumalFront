import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReservationModal from "../pages/Reservation";
import NavbarHome from "../components/NavbarHome";
import CartModal from "../components/CartModal";
import PaymentMethod from "../components/PaymentMethod";
import InfoModal from "../components/InfoModal";
import {
  Play,
  MapPin,
  ClipboardPlus,
  Mail,
  Star,
  X,
  MapPinned,
  Sparkles,
  Users,
  Trophy,
  HeartHandshake,
  Clock,
  Phone,
  PartyPopper,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useCart } from "../context/CartContext.jsx";

const terminosContent = (
    <>
      <h1>Términos y Condiciones de Casa Chetumal</h1>
      <p>
        <strong>Última actualización:</strong> 14 de octubre de 2025
      </p>
  
      <p>
        Bienvenido a Casa Chetumal. Por favor, lee estos términos y condiciones
        cuidadosamente antes de utilizar nuestro sitio web y nuestros servicios.
      </p>
  
      <h3>1. Aceptación de los Términos</h3>
      <p>
        Al acceder y utilizar este sitio web, aceptas cumplir y estar sujeto a
        los siguientes términos y condiciones. Si no estás de acuerdo con alguna
        parte de los términos, no podrás acceder al servicio.
      </p>
  
      <h3>2. Servicios Ofrecidos</h3>
      <p>
        Casa Chetumal ofrece servicios de renta de un salón para eventos. Las
        características, precios y disponibilidad de los servicios están sujetos
        a cambios sin previo aviso.
      </p>
  
      <h3>3. Reservaciones y Pagos</h3>
      <p>
        Para realizar una reservación, el usuario debe proporcionar información
        veraz y completa. Todas las reservaciones están sujetas a nuestra
        confirmación. Los métodos de pago aceptados y las políticas de
        cancelación serán especificados durante el proceso de reservación.
      </p>
  
      <h3>4. Uso Aceptable del Sitio Web</h3>
      <p>
        Te comprometes a no utilizar este sitio para ningún propósito ilegal o
        prohibido por estos términos. No puedes usar el sitio de ninguna manera
        que pueda dañar, deshabilitar o sobrecargar nuestro servidor o redes.
      </p>
  
      <h3>5. Propiedad Intelectual</h3>
      <p>
        Todo el contenido presente en este sitio web, incluyendo textos,
        gráficos, logos e imágenes (el "Contenido"), es propiedad de Casa
        Chetumal y está protegido por las leyes de derechos de autor. No se
        permite la reproducción o distribución del Contenido sin nuestro permiso
        explícito por escrito.
      </p>
  
      <h3>6. Limitación de Responsabilidad</h3>
      <p>
        Casa Chetumal no será responsable por ningún daño directo o indirecto que
        resulte del uso o la incapacidad de usar nuestro sitio web o servicios.
      </p>
  
      <h3>7. Modificaciones</h3>
      <p>
        Nos reservamos el derecho de modificar estos términos y condiciones en
        cualquier momento. Te recomendamos revisar esta página periódicamente
        para estar al tanto de cualquier cambio.
      </p>
  
      <h3>8. Contacto</h3>
      <p>
        Si tienes alguna pregunta sobre estos Términos, por favor contáctanos
        en:
      </p>
      <p>
        <strong>Correo electrónico:</strong> casachetumal92@gmail.com
      </p>
      <p>
        <strong>Teléfono:</strong> 961-255-2540
      </p>
    </>
  );
  const privacidadContent = (
    <>
      <h1>Política de Privacidad de Casa Chetumal</h1>
      <p>
        <strong>Última actualización:</strong> 14 de octubre de 2025
      </p>
  
      <p>
        En Casa Chetumal, respetamos tu privacidad y nos comprometemos a proteger
        tus datos personales. Esta política explica cómo recopilamos, usamos y
        salvaguardamos tu información.
      </p>
  
      <h3>1. Información que Recopilamos</h3>
      <p>Podemos recopilar la siguiente información:</p>
      <ul>
        <li>
          <strong>Información de Contacto:</strong> Nombre, apellidos, número de
          teléfono y correo electrónico cuando llenas nuestro formulario de
          reservación.
        </li>
        <li>
          <strong>Información de Identificación:</strong> Opcionalmente, una
          fotografía de tu identificación (INE/IFE) para fines de seguridad en la
          reservación.
        </li>
        <li>
          <strong>Información Técnica:</strong> Datos de navegación como tu
          dirección IP o tipo de navegador, de forma automática para mejorar la
          experiencia en nuestro sitio.
        </li>
      </ul>
  
      <h3>2. ¿Cómo Usamos tu Información?</h3>
      <p>Utilizamos tu información para los siguientes propósitos:</p>
      <ul>
        <li>Procesar y gestionar tu reservación.</li>
        <li>Comunicarnos contigo sobre tu evento y nuestros servicios.</li>
        <li>Mejorar la seguridad y el funcionamiento de nuestro sitio web.</li>
        <li>Cumplir con nuestras obligaciones legales.</li>
      </ul>
  
      <h3>3. ¿Con Quién Compartimos tu Información?</h3>
      <p>
        <strong>No vendemos ni alquilamos tus datos personales a terceros.</strong>{" "}
        Solo compartiremos tu información si es estrictamente necesario para
        cumplir con la ley o para proteger nuestros derechos.
      </p>
  
      <h3>4. Seguridad de tus Datos</h3>
      <p>
        Implementamos medidas de seguridad para proteger tu información contra el
        acceso no autorizado, la alteración o la destrucción.
      </p>
  
      <h3>5. Tus Derechos</h3>
      <p>
        Tienes derecho a acceder, rectificar o cancelar tus datos personales,
        así como a oponerte al tratamiento de los mismos. Para ejercer estos
        derechos, por favor contáctanos a través del correo electrónico
        proporcionado.
      </p>
      <p>
        <strong>Correo electrónico:</strong> casachetumal92@gmail.com
      </p>
    </>
  );
  const cookiesContent = (
    <>
      <h1>Política de Cookies de Casa Chetumal</h1>
      <p>
        <strong>Última actualización:</strong> 14 de octubre de 2025
      </p>
  
      <h3>1. ¿Qué son las Cookies?</h3>
      <p>
        Una cookie es un pequeño archivo de texto que un sitio web almacena en tu
        computadora o dispositivo móvil cuando visitas el sitio. Permite que el
        sitio web recuerde tus acciones y preferencias (como el inicio de sesión
        o el idioma) durante un período de tiempo.
      </p>
  
      <h3>2. ¿Cómo Usamos las Cookies?</h3>
      <p>En Casa Chetumal, utilizamos cookies para:</p>
      <ul>
        <li>
          <strong>Cookies Esenciales:</strong> Son necesarias para que el sitio
          web funcione correctamente. Por ejemplo, para mantener el progreso de
          tu reservación entre páginas.
        </li>
        <li>
          <strong>Cookies de Rendimiento:</strong> Nos ayudan a entender cómo los
          visitantes interactúan con nuestro sitio web, recopilando información
          de forma anónima. Esto nos permite mejorar la experiencia del usuario.
        </li>
      </ul>
  
      <h3>3. Cómo Controlar las Cookies</h3>
      <p>
        Puedes controlar y/o eliminar las cookies como desees. Para más
        detalles, consulta aboutcookies.org. Puedes eliminar todas las cookies
        que ya están en tu computadora y configurar la mayoría de los navegadores
        para evitar que se instalen.
      </p>
  
      <p>
        Al continuar utilizando nuestro sitio web, aceptas el uso de cookies como
        se describe en esta política.
      </p>
      <h3>4. Contacto</h3>
      <p>Si tienes preguntas sobre nuestro uso de cookies, contáctanos:</p>
      <p>
        <strong>Correo electrónico:</strong> casachetumal92@gmail.com
      </p>
    </>
);

const CasaChetumal = () => {

  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();

  const [infoModalState, setInfoModalState] = useState({
    isOpen: false,
    title: "",
    content: null,
  });

  const { pendingReservation, clearCart } = useCart();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://casachetumalback.onrender.com/api/carousel-images');
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue exitosa');
        }
        const images = await response.json();
        setGalleryImages(images);
      } catch (error) {
        console.error("Error al cargar las imágenes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);
 

  const openInfoModal = (title, content) => {
    setInfoModalState({ isOpen: true, title, content });
  };

  const closeInfoModal = () => {
    setInfoModalState({ isOpen: false, title: "", content: null });
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleProceedToPayment = () => {
    if (pendingReservation) {
      setPaymentData(pendingReservation);
      setIsCartOpen(false);
      setShowPayment(true);
    } else {
      alert("Tu carrito está vacío.");
    }
  };

  const handleBackToCart = () => {
    setShowPayment(false);
    setIsCartOpen(true);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setShowPayment(false);
    setPaymentData(null);
    navigate("/");
  };

  const handlePrevClick = () => {
    if (galleryImages.length === 0) return;
    setCurrentImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const handleNextClick = () => {
    if (galleryImages.length === 0) return;
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  };

  const handleReservationClick = () => {
    setShowReservationModal(true);
    setIsMobileMenuOpen(false);
  };

  const handleCloseModal = () => {
    setShowReservationModal(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (galleryImages.length > 0) {
      const interval = setInterval(() => {
        handleNextClick();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [galleryImages.length]); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {showPayment && paymentData ? (
        <PaymentMethod
          cartData={paymentData}
          onBack={handleBackToCart}
          onSuccess={handlePaymentSuccess}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          <NavbarHome
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
            handleNavClick={handleNavClick}
            handleReservationClick={handleReservationClick}
            handleCartClick={handleCartClick}
          />

          <button
            onClick={handleCartClick}
            className="md:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:from-amber-600 hover:to-orange-600 transform hover:scale-110 transition-all duration-300 animate-bounce"
            aria-label="Carrito de compras"
          >
            <ShoppingCart size={24} />
            {pendingReservation && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-7 w-7 flex items-center justify-center font-bold animate-pulse border-2 border-white">
                1
              </span>
            )}
          </button>

          <section className="relative py-20 px-6">
            <div className="container mx-auto text-center">
              <div className="mb-8 animate-fade-in">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
                  Bienvenido a{" "}
                  <span className="bg-gradient-to-r from-amber-900 to-orange-950 bg-clip-text text-transparent">
                    Casa Chetumal
                  </span>
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-900 mb-8 max-w-3xl mx-auto leading-relaxed">
                  El espacio perfecto para tus eventos especiales, donde cada
                  momento se convierte en un recuerdo inolvidable
                </p>
                <a
                  href="https://maps.app.goo.gl/oRGLKwbPqJreNoRA9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-amber-900 to-orange-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:from-amber-950 hover:to-orange-950 transform hover:scale-105 transition-all duration-300 shadow-xl inline-block"
                >
                  <MapPin className="inline-block mr-2" size={20} />
                  Ver Ubicación
                </a>
              </div>
              <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-20 animate-bounce"></div>
              <div className="absolute top-32 right-16 w-16 h-16 bg-orange-200 rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-200 rounded-full opacity-25 animate-bounce delay-1000"></div>
            </div>
          </section>

          <section className="py-20 px-6 bg-white/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-16 w-32 h-32 bg-gradient-to-tl from-yellow-200/30 to-orange-300/30 rounded-full blur-2xl animate-bounce"></div>
            <div className="container mx-auto relative z-10">
              <div className="text-center mb-16">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                  Descubre Nuestro Espacio
                </h3>
                <div className="flex justify-center items-center space-x-2 mb-6">
                  <div className="w-8 h-1 bg-gradient-to-r from-transparent to-amber-400 rounded-full"></div>
                  <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                  <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-transparent rounded-full"></div>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Un recorrido por nuestras instalaciones diseñadas para hacer
                  de tu evento una experiencia única
                </p>
              </div>
              <div className="max-w-5xl mx-auto">
                {isLoading ? (
                  <div className="aspect-video flex items-center justify-center bg-gray-200 rounded-3xl">
                    <p className="text-gray-500">Cargando imágenes...</p>
                  </div>
                ) : galleryImages.length > 0 ? (
                  <div className="relative group transform transition-all duration-700 hover:scale-[1.02]">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 aspect-video shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                      <div className="absolute inset-1 bg-white rounded-3xl overflow-hidden">
                        <img
                          src={galleryImages[currentImage].imageUrl}
                          alt={galleryImages[currentImage].title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-500"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                          <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {galleryImages[currentImage].title}
                          </h4>
                          <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-2xl">
                            {galleryImages[currentImage].description}
                          </p>
                          <div className="flex items-center mt-4 space-x-2">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-5 h-5 text-amber-400 fill-current"
                                />
                              ))}
                            </div>
                            <span className="text-white/80 text-sm">
                              Calificación excepcional
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handlePrevClick}
                      className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-all duration-300 z-10"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNextClick}
                      className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-all duration-300 z-10"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gray-200 rounded-3xl">
                    <p className="text-red-500">No se pudieron cargar las imágenes del carrusel.</p>
                  </div>
                )}
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Users,
                      title: "Capacidad",
                      description: "Hasta 60 personas",
                    },
                    {
                      icon: Clock,
                      title: "Disponibilidad",
                      description: "7 días a la semana",
                    },
                    {
                      icon: Sparkles,
                      title: "Servicios",
                      description:
                        "Con variedades de paquetes y mucho más",
                    },
                  ].map((feature, index) => (
                    <div key={index} className="text-center group">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <feature.icon size={24} className="text-white" />
                      </div>
                      <h5 className="text-xl font-bold text-gray-800 mb-2">
                        {feature.title}
                      </h5>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            id="paquetes"
            className="py-20 px-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden"
          >
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-16 w-40 h-40 bg-gradient-to-tl from-yellow-200/20 to-orange-300/20 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-amber-300/20 rounded-full blur-lg animate-ping"></div>
            <div className="container mx-auto text-center relative z-10">
              <div className="mb-20">
                <div className="inline-block relative">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 relative">
                    ¿Por qué elegir{" "}
                    <span className="bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">
                      Casa Chetumal?
                    </span>
                  </h3>
                  <div className="flex justify-center items-center space-x-2 mb-4">
                    <div className="w-8 h-1 bg-gradient-to-r from-transparent to-amber-400 rounded-full"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                    <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-transparent rounded-full"></div>
                  </div>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Descubre las ventajas exclusivas que hacen de nuestro espacio
                  la elección perfecta
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  {
                    title: "Ubicación Premium",
                    description:
                      "En el corazón de la ciudad con fácil acceso y estacionamiento amplio para todos tus invitados",
                    icon: MapPinned,
                    gradient: "from-amber-400 to-orange-500",
                    shadowColor: "shadow-amber-200",
                    delay: "delay-0",
                  },
                  {
                    title: "Servicios Completos",
                    description:
                      "Todo lo que necesitas en un solo lugar para tu evento perfecto, sin complicaciones adicionales",
                    icon: Sparkles,
                    gradient: "from-orange-400 to-yellow-500",
                    shadowColor: "shadow-orange-200",
                    delay: "delay-150",
                  },
                  {
                    title: "Atención Personalizada",
                    description:
                      "Un equipo dedicado y profesional que se encarga de cada detalle para hacer tu día especial",
                    icon: HeartHandshake,
                    gradient: "from-orange-500 to-amber-400",
                    shadowColor: "shadow-yellow-200",
                    delay: "delay-300",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`group relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-10 transform hover:scale-105 transition-all duration-500 ${feature.shadowColor} shadow-xl hover:shadow-2xl border border-white/50 ${feature.delay} animate-fade-in-up`}
                  >
                    <div
                      className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm`}
                    ></div>
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm -z-10`}
                    ></div>
                    <div
                      className={`relative mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6`}
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm"></div>
                      <feature.icon
                        size={32}
                        className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                      />
                    </div>
                    <h4
                      className={`text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}
                    >
                      {feature.title}
                    </h4>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                      {feature.description}
                    </p>
                    <div className="flex justify-center space-x-2 mt-6">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                    <div className="absolute top-4 right-4 w-6 h-6 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                  </div>
                ))}
              </div>
              <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:max-w-4xl mx-auto">
                {[
                  {
                    number: "500+",
                    label: "Eventos Realizados",
                    icon: PartyPopper,
                  },
                  { number: "98%", label: "Clientes Satisfechos", icon: Trophy },
                  { number: "24/7", label: "Soporte Disponible", icon: Phone },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl group"
                  >
                    <div className="mb-3 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                      <stat.icon
                        size={20}
                        className="text-white group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <style jsx>{`
              @keyframes fade-in-up {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-fade-in-up {
                animation: fade-in-up 0.8s ease-out forwards;
              }
            `}</style>
          </section>

          <section id="contacto" className="bg-gray-900 text-white py-8 px-1">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ponte en Contacto con Nosotros
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                  Estamos aquí para ayudarte a planificar tu evento perfecto.
                </p>
              </div>

              <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-900 p-3 rounded-full">
                      <Phone className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold">Teléfono</h4>
                      <a
                        href="tel:+529611234567"
                        className="text-lg text-gray-300 hover:text-orange-400 transition-colors"
                      >
                        961 255 2540
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-900 p-3 rounded-full">
                      <Mail className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold">Correo</h4>
                      <a
                        href="mailto:contacto@casachetumal.com"
                        className="text-lg text-gray-300 hover:text-orange-400 transition-colors"
                      >
                        casachetumal92@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-900 p-3 rounded-full">
                      <Clock className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold">Horario</h4>
                      <p className="text-lg text-gray-300">
                        Lun - Vie: 9 AM - 5PM 
                        Sáb: 9 AM - 2 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-8 text-center">
                  <h4 className="text-xl font-semibold mb-4">
                    Síguenos en Nuestras Redes
                  </h4>
                  <div className="flex justify-center space-x-5">
                    {/* Link de Facebook */}
                    <a
                      href="https://www.facebook.com/share/16ZZFNTVrW/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-900 p-3 rounded-full hover:bg-orange-500 transition-colors transform hover:scale-110"
                    >
                      <FaFacebook size={28} /> 
                    </a>
                    
                    {/* Link de Instagram */}
                    <a
                      href="https://www.instagram.com/casachetumalterraza?igsh=MXA5MHRjZTFvbDBjdA=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-900 p-3 rounded-full hover:bg-orange-500 transition-colors transform hover:scale-110"
                    >
                      <FaInstagram size={28} /> 
                    </a>
                    
                    {/* Link de WhatsApp */}
                    <a
                      href="https://api.whatsapp.com/send?phone=5219612552540&text=Hola%20me%20gustaria%20saber%20mas%20informacion%20del%20salon%20por%20favor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-900 p-3 rounded-full hover:bg-orange-500 transition-colors transform hover:scale-110"
                    >
                      <FaWhatsapp size={28} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-dashed border-orange-300"></div>

          <footer className="bg-gray-900 text-white py-2 px-3">
            <div className="container mx-auto text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-2xl font-bold">Casa Chetumal</span>
              </div>
              <p className="text-gray-400 mb-6">
                Todos los derechos reservados © 2025 Casa Chetumal
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <button
                  onClick={() =>
                    openInfoModal("Términos y Condiciones", terminosContent)
                  }
                  className="hover:text-amber-400 transition-colors"
                >
                  Términos
                </button>
                <button
                  onClick={() =>
                    openInfoModal("Política de Privacidad", privacidadContent)
                  }
                  className="hover:text-amber-400 transition-colors"
                >
                  Privacidad
                </button>
                <button
                  onClick={() =>
                    openInfoModal("Política de Cookies", cookiesContent)
                  }
                  className="hover:text-amber-400 transition-colors"
                >
                  Cookies
                </button>
              </div>
            </div>
          </footer>

          <ReservationModal
            isOpen={showReservationModal}
            onClose={handleCloseModal}
          />

          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onProceedToPayment={handleProceedToPayment}
          />

          <InfoModal
            isOpen={infoModalState.isOpen}
            onClose={closeInfoModal}
            title={infoModalState.title}
          >
            {infoModalState.content}
          </InfoModal>
        </div>
      )}
    </>
  );
};

export default CasaChetumal;


//50 cucharas $77
//50 tenedores $77
//60 charolas $120
//10 vasos rojos $45  50 $250
//20 vasos termicos $194



//Coca-cola 3L 53 
//agua mineral 3L 30 
//pepsi 3L 60
