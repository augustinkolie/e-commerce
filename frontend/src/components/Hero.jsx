import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, ChevronDown } from 'lucide-react';

const slides = [
  {
    id: 1,
    subtitle: "L'élégance à fleur de peau",
    title: "Révélez votre\nVéritable Style",
    description: "Découvrez une collection de prêt-à-porter d'exception. L'harmonie parfaite entre coupes modernes et matières nobles pour une allure qui ne laisse personne indifférent.",
    image: "/hero_bg.png",
    category: "Vêtements",
    buttonText: "Découvrir la Collection",
    textColor: "text-white",
    subColor: "text-primary"
  },
  {
    id: 2,
    subtitle: "L'avenir commence ici",
    title: "Le Sommet du\nHigh-Tech",
    description: "Dépassez les limites de l'usage avec nos innovations de pointe. Chaque gadget est une prouesse technologique conçue pour magnifier votre quotidien et booster votre créativité.",
    image: "/shopping_lifestyle.png",
    category: "Électronique",
    buttonText: "Voir les Innovations",
    textColor: "text-white",
    subColor: "text-primary"
  },
  {
    id: 3,
    subtitle: "Sublimez votre espace",
    title: "L'Art de Vivre\nchez Soi",
    description: "Transformez votre intérieur en un havre de paix et de design. Une sélection exclusive de mobilier et d'objets de décoration pour créer l'ambiance qui vous ressemble.",
    image: "/salon_premium_v2.png",
    category: "Maison",
    buttonText: "Décorer mon Intérieur",
    textColor: "text-white",
    subColor: "text-primary"
  },
  {
    id: 4,
    subtitle: "Élégance & Précision au poignet",
    title: "L'Horlogerie de\nPrestige",
    description: "L'art de l'exception rencontre un design intemporel. Découvrez des pièces d'horlogerie conçues pour marquer chaque instant de votre succès.",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1600",
    category: "Accessoires",
    buttonText: "Explorer la Collection",
    textColor: "text-white",
    subColor: "text-primary"
  },
  {
    id: 5,
    subtitle: "Performance & Bien-être",
    title: "Dépassez vos\nLimites",
    description: "L'innovation au service de votre dépassement. Équipez-vous avec le meilleur de la technologie fitness pour transformer vos efforts en résultats.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600",
    category: "Sportif",
    buttonText: "S'équiper maintenant",
    textColor: "text-white",
    subColor: "text-primary"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[750px] md:h-[850px] w-full overflow-hidden group">
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            {/* Background Image with Enhanced Ken Burns */}
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[7000ms] ease-out ${isActive ? "scale-110" : "scale-100"
                }`}
              style={{
                backgroundImage: `url('${slide.image}')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content with Staggered Animations */}
            <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
              <div className={`max-w-2xl ${slide.textColor}`}>
                <p className={`${slide.subColor} font-bold text-lg mb-4 drop-shadow-md tracking-wider uppercase transition-all duration-1000 delay-300 transform ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                  {slide.subtitle}
                </p>
                <h1 className={`text-6xl md:text-7xl font-bold mb-6 leading-[1.1] drop-shadow-2xl transition-all duration-1000 delay-500 transform ${isActive ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
                  {slide.title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </h1>
                <p className={`text-xl mb-10 text-gray-100 drop-shadow-md font-light leading-relaxed transition-all duration-1000 delay-700 transform ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                  {slide.description}
                </p>
                <div className={`transition-all duration-1000 delay-1000 transform ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                  <Link
                    to="/category"
                    state={{ category: slide.category }}
                    className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg inline-flex items-center space-x-3 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 shadow-2xl cursor-pointer group/btn"
                  >
                    <span>{slide.buttonText}</span>
                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows with refined hover */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/20 border border-white/20 hover:border-white/50 text-white p-4 rounded-full backdrop-blur-sm transition-all duration-300 z-20 cursor-pointer opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/20 border border-white/20 hover:border-white/50 text-white p-4 rounded-full backdrop-blur-sm transition-all duration-300 z-20 cursor-pointer opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
      >
        <ChevronRight size={28} />
      </button>

      {/* Visual Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10 z-30">
        <div
          key={currentSlide}
          className="h-full bg-primary animate-progress"
          style={{ animationDuration: '5000ms' }}
        ></div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 h-2 rounded-full cursor-pointer ${index === currentSlide ? "w-12 bg-primary shadow-[0_0_15px_rgba(255,102,0,0.5)]" : "w-3 bg-white/40 hover:bg-white/70"
              }`}
          ></button>
        ))}
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-50 hover:opacity-100 transition-opacity">
        <ChevronDown size={32} className="text-white drop-shadow-lg" />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation-name: progress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero;
