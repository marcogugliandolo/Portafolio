/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from 'motion/react';
import { Github, Linkedin, Mail, ExternalLink, Terminal, Database, Server, Code2, Menu, X, ArrowRight, Globe, Download, Sun, Moon, Cpu, Music, Coins, Shield, LineChart, Box, Activity, Wrench, FileText, FlaskConical, LayoutGrid, AppWindow, Sparkles } from 'lucide-react';

const ProjectCard = ({ project, index }: any) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={onMouseMove}
      className="group relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl p-6 md:p-10 hover:bg-white/80 dark:hover:bg-zinc-900/60 transition-all duration-500 flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(16, 185, 129, 0.1), transparent 80%)`
          ),
        }}
      />
      <div className="relative z-10">
        <div className="mb-8 bg-zinc-50 dark:bg-black w-20 h-20 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:border-emerald-500/30 transition-colors">
          {project.icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 transition-colors flex items-center justify-between group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          {project.title}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-base mb-8 flex-grow leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag: string) => (
            <span key={tag} className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-black/5 dark:bg-black/30 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-auto">
          {project.links.map((link: any, i: number) => (
            link.action ? (
              <button 
                key={i}
                onClick={link.action}
                className="inline-flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg bg-black/5 dark:bg-white/5 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-zinc-950 transition-colors w-full text-left"
              >
                {link.label} <LayoutGrid className="w-4 h-4" />
              </button>
            ) : (
              <a 
                key={i}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg bg-black/5 dark:bg-white/5 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-zinc-950 transition-colors"
              >
                {link.label} <ExternalLink className="w-4 h-4" />
              </a>
            )
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isProgramsModalOpen, setIsProgramsModalOpen] = useState(false);

  // Mouse tracking for glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Experiencia', href: '#experience' },
    { name: 'Proyectos', href: '#portfolio' },
    { name: 'Sobre mí', href: '#about' },
    { name: 'Contacto', href: '#contact' },
  ];

  const services = [
    { 
      title: 'Desarrollo Web', 
      description: 'Creación de aplicaciones web dinámicas, escalables y optimizadas usando PHP, HTML5, CSS3 y JavaScript.', 
      icon: <Globe className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> 
    },
    { 
      title: 'Administración de Sistemas', 
      description: 'Despliegue, configuración y mantenimiento de servidores y servicios en la nube para garantizar alta disponibilidad.', 
      icon: <Server className="w-6 h-6 text-blue-500 dark:text-blue-400" /> 
    },
    { 
      title: 'Gestión de Bases de Datos (DBA)', 
      description: 'Diseño, optimización y administración de bases de datos relacionales para un alto rendimiento y seguridad.', 
      icon: <Database className="w-6 h-6 text-purple-500 dark:text-purple-400" /> 
    },
  ];

  const programsList = [
    { name: 'Panel de Control Raspberry Pi - 1', url: 'https://panel1.marcogugliandolo.com', icon: <Cpu className="w-8 h-8 text-emerald-500" /> },
    { name: 'Panel de Control Raspberry Pi - 2', url: 'https://panel2.marcogugliandolo.com', icon: <Cpu className="w-8 h-8 text-emerald-600" /> },
    { name: 'Guacamole', url: 'https://guacamole.marcogugliandolo.com', icon: <Shield className="w-8 h-8 text-green-500" /> },
    { name: 'Grafana', url: 'https://grafana.marcogugliandolo.com', icon: <LineChart className="w-8 h-8 text-orange-500" /> },
    { name: 'Portainer', url: 'https://portainer.marcogugliandolo.com', icon: <Box className="w-8 h-8 text-cyan-500" /> },
    { name: 'Kuma', url: 'https://kuma.marcogugliandolo.com', icon: <Activity className="w-8 h-8 text-red-500" /> },
    { name: 'Herramientas', url: 'https://herramientas.marcogugliandolo.com', icon: <Wrench className="w-8 h-8 text-zinc-500" /> },
    { name: 'Curriculum', url: 'https://curriculum.marcogugliandolo.com', icon: <FileText className="w-8 h-8 text-blue-400" /> },
  ];

  const projects = [
    {
      title: 'PhpMyAdmin',
      description: 'Gestión de bases de datos MySQL a través de interfaz web.',
      links: [
        { label: 'Acceder a PhpMyAdmin', url: 'https://mysql.marcogugliandolo.com/phpmyadmin' }
      ],
      icon: <Database className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />,
      tags: ['MySQL', 'DBA', 'Herramientas'],
    },
    {
      title: 'Owncloud',
      description: 'Servidor de almacenamiento en la nube autoalojado para sincronización y compartición de archivos.',
      links: [
        { label: 'Acceder a Owncloud', url: 'https://nube.marcogugliandolo.com/owncloud' }
      ],
      icon: <Server className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      tags: ['Cloud', 'SysAdmin', 'Almacenamiento'],
    },
    {
      title: 'Programas y Apps',
      description: 'Colección de herramientas, paneles de control y servicios autoalojados.',
      links: [
        { label: 'Abrir Launchpad', action: () => setIsProgramsModalOpen(true) }
      ],
      icon: <AppWindow className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
      tags: ['Apps', 'Servicios', 'Tools'],
    }
  ];

  const skills = [
    'Administración de Sistemas', 'Desarrollo Web', 'PHP', 'Bases de Datos (DBA)', 'HTML5', 'CSS3', 'JavaScript', 'Redes'
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white selection:bg-emerald-500/30 font-sans transition-colors duration-300 relative z-0 overflow-x-hidden">
      {/* Mouse Glow Effect */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(16, 185, 129, 0.06), transparent 80%)`
          ),
        }}
      />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Apple-style Ambient Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-zinc-50 dark:bg-black transition-colors duration-300">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-300/40 dark:bg-emerald-900/40 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-300/40 dark:bg-blue-900/40 mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-purple-300/40 dark:bg-purple-900/40 mix-blend-multiply dark:mix-blend-screen filter blur-[150px] opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-3 shadow-lg shadow-black/5' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#home" className="text-xl font-bold tracking-tighter flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-300">
              <Terminal className="w-6 h-6" />
            </div>
            <span className="hidden sm:block">Marco Gugliandolo López<span className="text-emerald-500">.</span></span>
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                {link.name}
              </a>
            ))}
            
            <button 
              onClick={toggleTheme} 
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-all text-sm font-medium"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Modo Oscuro</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="flex items-center gap-2 p-2 rounded-full bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-2xl pt-32 px-6 lg:hidden flex flex-col items-center"
          >
            <div className="flex flex-col items-center gap-8 text-3xl font-light w-full max-w-sm">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border-b border-black/5 dark:border-white/5 pb-6 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          {/* Floating Icons Background */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {[Github, Terminal, Database, Server, Code2, Globe, Cpu, Box].map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 5 + i, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
                className="absolute text-emerald-500/20 dark:text-emerald-400/10"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              >
                <Icon size={40 + (i * 10)} />
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Disponible para nuevos proyectos
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-black to-zinc-600 dark:from-white dark:to-zinc-500">
                Desarrollador Web <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">& Administrador de Sistemas.</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12 font-light leading-relaxed">
                Construyo aplicaciones web robustas, gestiono bases de datos y aseguro infraestructuras. Bienvenido a mi espacio digital.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a 
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  href="#portfolio" 
                  className="px-8 py-4 rounded-full bg-emerald-500 text-white dark:text-zinc-950 font-bold hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20 group"
                >
                  Ver proyectos 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  href="#contact" 
                  className="px-8 py-4 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  Contactar
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto lg:ml-auto w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[280px] aspect-square mt-12 lg:mt-0"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full rotate-6 scale-105 blur-xl"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white/50 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
                <img 
                  src="https://media.licdn.com/dms/image/v2/D4D03AQFUjFuiKgWAgA/profile-displayphoto-crop_800_800/B4DZfP4rrSGkAI-/0/1751539432988?e=1775088000&v=beta&t=njQ3gX_eR9Qw0yeLti2ru3x1RWrGHhYNMsFGlI7BCLQ" 
                  alt="Marco Gugliandolo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Marco+Gugliandolo&background=10b981&color=fff&size=256";
                  }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16 md:text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Áreas de Experiencia</h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Tecnologías y áreas en las que me especializo.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl p-6 md:p-10 hover:bg-white/80 dark:hover:bg-zinc-900/60 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] group"
                >
                  <div className="mb-6 w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/10 dark:border-white/10">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Proyectos Destacados</h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">Una selección de herramientas y servicios que he desplegado y desarrollado.</p>
            </div>
            <a href="https://github.com/marcogugliandolo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm font-medium">
              <Github className="w-4 h-4" /> Ver GitHub
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Sobre mí</h2>
                <div className="space-y-4 text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mb-8">
                  <p>
                    Soy Administrador de Sistemas Informáticos en Red. He creado este sitio web como un espacio para mostrar algunas de las aplicaciones que he desarrollado, especialmente en el ámbito del desarrollo web.
                  </p>
                  <p>
                    La mayoría de mis proyectos están realizados en PHP, aunque también utilizo otras tecnologías como HTML5, CSS y JavaScript para crear experiencias completas.
                  </p>
                  <p>
                    Este espacio me permite compartir parte del trabajo que realizo y seguir aprendiendo en el proceso, combinando mi pasión por la programación con la administración de sistemas.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
                  <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-500" />
                    Stack Tecnológico
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill, index) => (
                      <motion.span 
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ 
                          scale: 1.1, 
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: '#10b981'
                        }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-zinc-700 dark:text-zinc-300 transition-colors cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 relative overflow-hidden transition-colors duration-300">
          {/* Decorative background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">Contacto</h2>
              <p className="text-lg md:text-xl text-emerald-800/70 dark:text-emerald-100/60 mb-10 font-light max-w-2xl mx-auto">
                Si quieres charlar sobre tecnología, compartir ideas o simplemente saludar, no dudes en escribirme.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:contacto@marcogugliandolo.com" 
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-emerald-500 text-white dark:text-zinc-950 font-bold text-base sm:text-lg hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.2)] dark:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] dark:hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]"
                >
                  <Mail className="w-5 h-5" /> Enviar un correo
                </motion.a>
              </div>

              <div className="flex justify-center gap-6">
                <a href="mailto:contacto@marcogugliandolo.com" className="group flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <div className="p-4 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 group-hover:border-emerald-500/50 transition-all shadow-sm dark:shadow-none">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider">Email</span>
                </a>
                <a href="https://es.linkedin.com/in/marco-gugliandolo-l%C3%B3pez-692a7b147" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <div className="p-4 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 group-hover:border-emerald-500/50 transition-all shadow-sm dark:shadow-none">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider">LinkedIn</span>
                </a>
                <a href="https://github.com/marcogugliandolo" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <div className="p-4 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 group-hover:border-emerald-500/50 transition-all shadow-sm dark:shadow-none">
                    <Github className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider">GitHub</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-black/5 dark:border-white/5 text-center text-zinc-500 text-sm bg-white/30 dark:bg-black/30 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Construido por Marco Gugliandolo López</span>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
            aria-label="Volver arriba"
          >
            <ArrowRight className="w-6 h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Programs Launchpad Modal */}
      <AnimatePresence>
        {isProgramsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProgramsModalOpen(false)}
              className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-black/5 dark:border-white/5">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <LayoutGrid className="w-6 h-6 text-emerald-500" />
                  Programas y Aplicaciones
                </h2>
                <button 
                  onClick={() => setIsProgramsModalOpen(false)}
                  className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                  {programsList.map((program, idx) => (
                    <a 
                      key={idx}
                      href={program.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-3 p-4 rounded-3xl hover:bg-white/50 dark:hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 shadow-sm border border-black/5 dark:border-white/5 flex items-center justify-center group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                        {program.icon}
                      </div>
                      <span className="text-xs md:text-sm font-medium text-center text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors line-clamp-2">
                        {program.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
