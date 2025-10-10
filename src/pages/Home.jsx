import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReservationModal from "../pages/Reservation";
import NavbarHome from "../components/NavbarHome";
import CartModal from "../components/CartModal";
import PaymentMethod from "../components/PaymentMethod";
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
} from "lucide-react";
import { useCart } from "../context/CartContext.jsx" 

const CasaChetumal = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false); 
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();

  const { pendingReservation, clearCart } = useCart(); 
  
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
  
  const videos = [
    {
      id: 1,
      title: "Salón",
      description: "Espacios elegantes diseñados para crear momentos únicos",
      thumbnail:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1198&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
  ];

  const handleVideoClick = (index) => {
    setCurrentVideo(index);
    setPlayingVideo(playingVideo === index ? null : index);
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
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            {pendingReservation && ( // El indicador depende del contexto
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
                <button className="bg-gradient-to-r from-amber-900 to-orange-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:from-amber-950 hover:to-orange-950 transform hover:scale-105 transition-all duration-300 shadow-xl">
                  <MapPin className="inline-block mr-2" size={20} />
                  Ver Ubicación
                </button>
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
                <div className="relative group cursor-pointer transform transition-all duration-700 hover:scale-[1.02]" onClick={() => handleVideoClick(0)}>
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 aspect-video shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    <div className="absolute inset-1 bg-white rounded-3xl overflow-hidden">
                      {playingVideo === 0 ? (
                        <div className="relative w-full h-full">
                          <video className="w-full h-full object-cover" autoPlay controls loop muted onError={() => setPlayingVideo(null)}>
                            <source src={videos[0].videoUrl} type="video/mp4" />
                            Tu navegador no soporta videos HTML5.
                          </video>
                          <button onClick={(e) => { e.stopPropagation(); setPlayingVideo(null); }} className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300">
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <img src={videos[0].thumbnail} alt={videos[0].title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"/>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative">
                              <div className="absolute inset-0 w-20 h-20 bg-white/20 rounded-full animate-ping"></div>
                              <div className="absolute inset-0 w-20 h-20 bg-white/30 rounded-full animate-pulse"></div>
                              <div className="relative w-20 h-20 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-2xl border border-white/50">
                                <Play className="text-amber-900 ml-1" size={32} />
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                            <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">{videos[0].title}</h4>
                            <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-2xl">{videos[0].description}</p>
                            <div className="flex items-center mt-4 space-x-2">
                              <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                                ))}
                              </div>
                              <span className="text-white/80 text-sm">Calificación excepcional</span>
                            </div>
                          </div>
                          <div className="absolute top-6 right-6 pointer-events-none">
                            <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-white text-sm font-medium">Haz clic para reproducir</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: Users, title: "Capacidad", description: "Hasta 200 personas" },
                    { icon: Clock, title: "Disponibilidad", description: "7 días a la semana" },
                    { icon: Sparkles, title: "Servicios", description: "Con variedades de paquetes" },
                  ].map((feature, index) => (
                    <div key={index} className="text-center group">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <feature.icon size={24} className="text-white" />
                      </div>
                      <h5 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h5>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="paquetes" className="py-20 px-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-16 w-40 h-40 bg-gradient-to-tl from-yellow-200/20 to-orange-300/20 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-amber-300/20 rounded-full blur-lg animate-ping"></div>
            <div className="container mx-auto text-center relative z-10">
              <div className="mb-20">
                <div className="inline-block relative">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 relative">
                    ¿Por qué elegir{" "}
                    <span className="bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">Casa Chetumal?</span>
                  </h3>
                  <div className="flex justify-center items-center space-x-2 mb-4">
                    <div className="w-8 h-1 bg-gradient-to-r from-transparent to-amber-400 rounded-full"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                    <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-transparent rounded-full"></div>
                  </div>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Descubre las ventajas exclusivas que hacen de nuestro espacio la elección perfecta
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  { title: "Ubicación Premium", description: "En el corazón de la ciudad con fácil acceso y estacionamiento amplio para todos tus invitados", icon: MapPinned, gradient: "from-amber-400 to-orange-500", shadowColor: "shadow-amber-200", delay: "delay-0" },
                  { title: "Servicios Completos", description: "Todo lo que necesitas en un solo lugar para tu evento perfecto, sin complicaciones adicionales", icon: Sparkles, gradient: "from-orange-400 to-yellow-500", shadowColor: "shadow-orange-200", delay: "delay-150" },
                  { title: "Atención Personalizada", description: "Un equipo dedicado y profesional que se encarga de cada detalle para hacer tu día especial", icon: HeartHandshake, gradient: "from-orange-500 to-amber-400", shadowColor: "shadow-yellow-200", delay: "delay-300" },
                ].map((feature, index) => (
                  <div key={index} className={`group relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 md:p-10 transform hover:scale-105 transition-all duration-500 ${feature.shadowColor} shadow-xl hover:shadow-2xl border border-white/50 ${feature.delay} animate-fade-in-up`}>
                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm`}></div>
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm -z-10`}></div>
                    <div className={`relative mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6`}>
                      <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm"></div>
                      <feature.icon size={32} className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                    </div>
                    <h4 className={`text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>{feature.title}</h4>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed group-hover:text-gray-800 transition-colors duration-300">{feature.description}</p>
                    <div className="flex justify-center space-x-2 mt-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                      ))}
                    </div>
                    <div className="absolute top-4 right-4 w-6 h-6 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                  </div>
                ))}
              </div>
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { number: "500+", label: "Eventos Realizados", icon: PartyPopper },
                  { number: "98%", label: "Clientes Satisfechos", icon: Trophy },
                  { number: "15", label: "Años de Experiencia", icon: Star },
                  { number: "24/7", label: "Soporte Disponible", icon: Phone },
                ].map((stat, index) => (
                  <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl group">
                    <div className="mb-3 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                      <stat.icon size={20} className="text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <style jsx>{`
              @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
            `}</style>
          </section>

          <section id="contacto" className="py-20 px-6 bg-gray-900 text-white">
            <div className="container mx-auto text-center">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">¿Listo para crear momentos inolvidables?</h3>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Reserva hoy y permítenos hacer de tu evento algo extraordinario</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:from-amber-900 hover:to-orange-900 transform hover:scale-105 transition-all duration-300 shadow-xl w-full sm:w-auto" onClick={handleReservationClick}>
                  <ClipboardPlus className="inline-block mr-2" size={20} />
                  Reservar ahora
                </button>
                <button className="border-2 border-amber-500 text-amber-500 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-amber-900 hover:border-amber-900 hover:text-white transition-all duration-300 w-full sm:w-auto">
                  <Mail className="inline-block mr-2" size={20} />
                  Enviar Mensaje
                </button>
              </div>
            </div>
          </section>

          <div className="border-t border-dashed border-orange-300"></div>

          <footer className="bg-gray-900 text-white py-12 px-6">
            <div className="container mx-auto text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-2xl font-bold">Casa Chetumal</span>
              </div>
              <p className="text-gray-400 mb-6">Todos los derechos reservados © 2025 Casa Chetumal</p>
              <div className="flex justify-center space-x-6 text-sm">
                <a href="#" className="hover:text-amber-400 transition-colors">Términos</a>
                <a href="#" className="hover:text-amber-400 transition-colors">Privacidad</a>
                <a href="#" className="hover:text-amber-400 transition-colors">Cookies</a>
              </div>
            </div>
          </footer>
          
          <ReservationModal
            isOpen={showReservationModal}
            onClose={handleCloseModal}
            // Eliminamos onAddToCart porque ahora se maneja con el contexto
            openCartModal={handleCartClick} 
          />
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onProceedToPayment={handleProceedToPayment}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
      `}</style>
    </>
  );
};

export default CasaChetumal;
