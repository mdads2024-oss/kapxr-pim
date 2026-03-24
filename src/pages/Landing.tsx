import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  CirclePlay,
  Database,
  Github,
  Layers3,
  Linkedin,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Twitter,
  Workflow,
  Youtube,
  Zap,
} from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import kapxrLogo from "@/assets/kapxr-logo.png";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useBillingPlansQuery } from "@/hooks/useBillingQueries";
import { setSelectedPlan } from "@/lib/billingSelection";
import type { BillingInterval } from "@/types/billing";
import { apiClient } from "@/services/api/client";

const aboutArtworkSrc =
  "/@fs/Users/manish/.cursor/projects/Users-manish-Desktop-Manish-Yadav-Root-Qubical-AI-Qubical-projects-kapxrpim-main/assets/Screenshot_2026-03-21_at_2.27.36_AM-b692120b-ed6f-41e0-9ce1-7879cd9f511a.png";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

type LandingFeature = { icon: string; title: string; description: string };
type LandingMetric = { k?: string; label?: string; value: string | number; tone?: string; v?: string };
type LandingContent = {
  features: LandingFeature[];
  services: string[];
  hero_metrics: LandingMetric[];
  snapshot_stats: LandingMetric[];
  workbench_metrics: LandingMetric[];
  about_metrics: LandingMetric[];
  about_stats: LandingMetric[];
  hero_badge?: string;
  hero_title?: string;
  hero_highlight?: string;
  hero_subtitle?: string;
  hero_ctas?: Array<{ label: string; to: string; variant?: "default" | "outline" }>;
  cta_title?: string;
  cta_subtitle?: string;
  footer_brand_description?: string;
  footer_badges?: string[];
  footer_groups?: Array<{
    title: string;
    links: Array<{ label: string; href?: string; to?: string }>;
  }>;
  footer_legal_links?: Array<{ label: string; href?: string }>;
  footer_social_links?: Array<{ label: string; href?: string }>;
};

const iconMap = {
  Layers3,
  Sparkles,
  Database,
  ShieldCheck,
  Workflow,
} as const;

export default function Landing() {
  const shouldReduceMotion = useReducedMotion();
  const { toast } = useToast();
  const { data: plans = [] } = useBillingPlansQuery();
  const { data: landingContent } = useQuery({
    queryKey: ["landing-content"],
    queryFn: () => apiClient.get<LandingContent | null>("/landing/content"),
  });
  const [activeSection, setActiveSection] = useState<"features" | "services" | "about" | "pricing" | "cta">("features");
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 20, mass: 0.2 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 20, mass: 0.2 });
  const pagePointerX = useMotionValue(0);
  const pagePointerY = useMotionValue(0);
  const pageSpringX = useSpring(pagePointerX, { stiffness: 80, damping: 22, mass: 0.4 });
  const pageSpringY = useSpring(pagePointerY, { stiffness: 80, damping: 22, mass: 0.4 });
  const pageGlowX = useTransform(pageSpringX, (x) => x - 170);
  const pageGlowY = useTransform(pageSpringY, (y) => y - 170);
  const rotateX = useTransform(springY, [-16, 16], [4, -4]);
  const rotateY = useTransform(springX, [-16, 16], [-4, 4]);
  const { scrollYProgress } = useScroll();
  const featureParallaxA = useTransform(scrollYProgress, [0, 1], [0, -22]);
  const featureParallaxB = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const heroLeftParallax = useTransform(scrollYProgress, [0, 0.35], [0, shouldReduceMotion ? 0 : -26]);
  const heroRightParallax = useTransform(scrollYProgress, [0, 0.35], [0, shouldReduceMotion ? 0 : 22]);

  const handlePanelMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    pointerX.set((x / rect.width) * 22);
    pointerY.set((y / rect.height) * 22);
  };

  const resetPanelPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleLandingMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    pagePointerX.set(event.clientX);
    pagePointerY.set(event.clientY);
  };

  const resetLandingMouse = () => {
    if (typeof window === "undefined") return;
    pagePointerX.set(window.innerWidth / 2);
    pagePointerY.set(window.innerHeight / 3);
  };

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newsletterEmail.trim().toLowerCase();

    if (!email) {
      notifyError(toast, "Email required", "Please enter your work email.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      notifyError(toast, "Invalid email", "Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmittingNewsletter(true);
      await apiClient.post<{ id: number; email: string }>("/newsletter/subscribe", { email });
      notifySuccess(toast, "Subscribed successfully", "You will receive our monthly product updates.");
      setNewsletterEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again in a moment.";
      if (message.toLowerCase().includes("already")) {
        notifyError(toast, "Already subscribed", "This email is already on our update list.");
      } else {
        notifyError(toast, "Subscription failed", message);
      }
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  useEffect(() => {
    const sectionIds: Array<"features" | "services" | "about" | "pricing" | "cta"> = [
      "features",
      "services",
      "about",
      "pricing",
      "cta",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id as "features" | "services" | "about" | "pricing" | "cta");
        }
      },
      {
        root: null,
        threshold: [0.25, 0.45, 0.65],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const getPlanPrice = (monthlyPrice: number, yearlyPrice: number) => {
    return billingInterval === "yearly" ? yearlyPrice : monthlyPrice;
  };

  const buildSignupLink = (planCode: "starter" | "growth" | "pro") =>
    `/signup?plan=${planCode}&interval=${billingInterval}`;

  const features = landingContent?.features ?? [];
  const services = landingContent?.services ?? [];
  const heroMetrics = landingContent?.hero_metrics ?? [];
  const snapshotStats = landingContent?.snapshot_stats ?? [];
  const workbenchMetrics = landingContent?.workbench_metrics ?? [];
  const aboutMetrics = landingContent?.about_metrics ?? [];
  const aboutStats = landingContent?.about_stats ?? [];
  const heroBadge = landingContent?.hero_badge ?? "Built for Modern Commerce Teams";
  const heroTitle = landingContent?.hero_title ?? "The Product Experience Platform for High-Scale Catalogs";
  const heroHighlight = landingContent?.hero_highlight ?? "High-Scale Catalogs";
  const heroSubtitle =
    landingContent?.hero_subtitle ??
    "KapxrPIM helps teams centralize product data, streamline content operations, and publish faster across channels with confidence.";
  const heroCtas = landingContent?.hero_ctas ?? [];
  const ctaTitle = landingContent?.cta_title ?? "Ready to transform your product operations?";
  const ctaSubtitle =
    landingContent?.cta_subtitle ?? "Start your KapxrPIM workspace and onboard your team in minutes.";
  const footerBrandDescription =
    landingContent?.footer_brand_description ??
    "The modern product operations platform for catalog-rich businesses. Centralize data, accelerate enrichment, and publish confidently across channels.";
  const footerBadges = landingContent?.footer_badges ?? [];
  const footerGroups = landingContent?.footer_groups ?? [];
  const footerLegalLinks = landingContent?.footer_legal_links ?? [];
  const footerSocialLinks = landingContent?.footer_social_links ?? [];

  return (
    <div
      className="min-h-screen bg-background overflow-hidden"
      onMouseMove={handleLandingMouseMove}
      onMouseLeave={resetLandingMouse}
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          className="absolute h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl"
          style={{ x: pageGlowX, y: pageGlowY }}
          animate={shouldReduceMotion ? { opacity: 0 } : { opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <img src={kapxrLogo} alt="Kapxr" className="h-8 w-8 rounded-md" />
            <span className="text-base font-semibold tracking-tight">KapxrPIM</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="#features"
              className={cn(
                "transition-colors relative pb-1",
                activeSection === "features" ? "text-foreground" : "hover:text-foreground"
              )}
            >
              Features
              {activeSection === "features" && (
                <motion.span
                  layoutId="landing-nav-active-underline"
                  className="absolute left-0 -bottom-0 h-0.5 w-full rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </a>
            <a
              href="#services"
              className={cn(
                "transition-colors relative pb-1",
                activeSection === "services" ? "text-foreground" : "hover:text-foreground"
              )}
            >
              Services
              {activeSection === "services" && (
                <motion.span
                  layoutId="landing-nav-active-underline"
                  className="absolute left-0 -bottom-0 h-0.5 w-full rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </a>
            <a
              href="#about"
              className={cn(
                "transition-colors relative pb-1",
                activeSection === "about" ? "text-foreground" : "hover:text-foreground"
              )}
            >
              About
              {activeSection === "about" && (
                <motion.span
                  layoutId="landing-nav-active-underline"
                  className="absolute left-0 -bottom-0 h-0.5 w-full rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </a>
            <a
              href="#pricing"
              className={cn(
                "transition-colors relative pb-1",
                activeSection === "pricing" ? "text-foreground" : "hover:text-foreground"
              )}
            >
              Pricing
              {activeSection === "pricing" && (
                <motion.span
                  layoutId="landing-nav-active-underline"
                  className="absolute left-0 -bottom-0 h-0.5 w-full rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </a>
            <a
              href="#cta"
              className={cn(
                "transition-colors relative pb-1",
                activeSection === "cta" ? "text-foreground" : "hover:text-foreground"
              )}
            >
              Get Started
              {activeSection === "cta" && (
                <motion.span
                  layoutId="landing-nav-active-underline"
                  className="absolute left-0 -bottom-0 h-0.5 w-full rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link to="/signin">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/signup">
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <motion.section
          className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center md:px-6 md:py-20"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="space-y-5" style={{ y: heroLeftParallax }}>
            <Badge variant="secondary" className="text-xs w-fit">{heroBadge}</Badge>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              {heroTitle.replace(heroHighlight, "")}
              <span className="text-primary">{heroHighlight}</span>
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {heroCtas.map((cta) => (
                <Button
                  key={`${cta.label}-${cta.to}`}
                  asChild
                  size="lg"
                  variant={cta.variant === "outline" ? "outline" : "default"}
                  className={cta.label.toLowerCase().includes("watch") ? "gap-2" : undefined}
                >
                  <Link to={cta.to}>
                    {cta.label}
                    {cta.label.toLowerCase().includes("start") && <ArrowRight className="h-4 w-4" />}
                    {cta.label.toLowerCase().includes("watch") && <CirclePlay className="h-4 w-4" />}
                  </Link>
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Fast onboarding</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Team collaboration</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> API-ready architecture</span>
            </div>
            <div className="grid max-w-xl grid-cols-3 gap-2 pt-2">
              {heroMetrics.map((metric) => (
                <div key={String(metric.k ?? metric.label)} className="rounded-lg border border-border/50 bg-background/70 px-3 py-2">
                  <p className="text-sm font-semibold">{String(metric.v ?? metric.value)}</p>
                  <p className="text-[11px] text-muted-foreground">{String(metric.k ?? metric.label ?? "")}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} style={{ y: heroRightParallax }}>
            <Card className="bg-card border-border shadow-sm relative overflow-hidden">
              <motion.div
                className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl"
                animate={shouldReduceMotion ? { opacity: 0.25 } : { scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Operational Snapshot
                </CardTitle>
                <CardDescription>What teams improve with KapxrPIM in 30 days</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 relative z-10">
                {snapshotStats.map((item) => (
                  <motion.div
                    key={String(item.label)}
                    className="rounded-lg border border-border/50 bg-background/75 p-3"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.16 }}
                  >
                    <p className="text-xl font-semibold">{String(item.value)}</p>
                    <p className="text-xs text-muted-foreground">{String(item.label)}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
            <motion.div
              className="mt-3 rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              onMouseMove={handlePanelMouseMove}
              onMouseLeave={resetPanelPointer}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Boxes className="h-3.5 w-3.5 text-primary" />
                  Live Product Workbench
                </p>
                <p className="inline-flex items-center gap-1 text-[11px] text-success">
                  <Activity className="h-3.5 w-3.5" />
                  Realtime Sync
                </p>
              </div>

              <div className="space-y-3">
                {workbenchMetrics.map((row, index) => (
                  <div key={row.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium">{Number(row.value)}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className={`h-full rounded-full ${row.tone ?? "bg-primary"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Number(row.value)}%` }}
                        transition={{ duration: 0.9, delay: 0.15 + index * 0.12 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border/60 bg-background/80 px-2.5 py-2">
                  <p className="text-[10px] text-muted-foreground">Products synced</p>
                  <p className="text-base font-semibold">12,486</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/80 px-2.5 py-2">
                  <p className="text-[10px] text-muted-foreground">Errors prevented</p>
                  <p className="text-base font-semibold">1,274</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
          <motion.div
            className="mb-6 space-y-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45 }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Motion-powered product operations
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Why KapxrPIM</h2>
            <p className="text-sm text-muted-foreground">
              Everything your merchandising, catalog, and growth teams need in one platform.
            </p>
          </motion.div>
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={item}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.18 }}
                style={{ y: index % 2 === 0 ? featureParallaxA : featureParallaxB }}
              >
                <Card className="relative overflow-hidden border-border/70 h-full transition-shadow hover:shadow-lg">
                  <motion.div
                    className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl"
                animate={shouldReduceMotion ? { opacity: 0.18 } : { scale: [1, 1.15, 1], opacity: [0.18, 0.32, 0.18] }}
                    transition={{ duration: 4.8 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <motion.span
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary"
                        animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
                        transition={{ duration: 3.5 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {(() => {
                          const Icon = iconMap[feature.icon as keyof typeof iconMap] ?? Workflow;
                          return <Icon className="h-4 w-4" />;
                        })()}
                      </motion.span>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    <motion.div
                      className="mt-3 h-1.5 rounded-full bg-gradient-to-r from-primary/50 via-primary/20 to-transparent"
                      initial={{ scaleX: 0.4, opacity: 0.55 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.5, delay: 0.08 * index }}
                      style={{ transformOrigin: "left" }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="about" className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="grid gap-6 p-5 md:grid-cols-2 md:p-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45 }}
                className="space-y-4"
              >
                <Badge variant="secondary" className="w-fit">About Kapxr</Badge>
                <CardTitle className="text-2xl md:text-3xl">
                  Built for teams that treat product data like a growth engine.
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  We build category-defining product operations software for modern digital commerce organizations.
                </CardDescription>
                <p className="text-sm text-muted-foreground">
                  KapxrPIM combines clarity, speed, and governance so your teams can move from scattered sheets to controlled, scalable growth operations with confidence.
                </p>
                <Separator />
                <div id="services" className="grid gap-2 text-sm md:grid-cols-2">
                  {services.map((service) => (
                    <div key={service} className="inline-flex items-center gap-2 rounded-md bg-background/60 px-2.5 py-2">
                      <Workflow className="h-3.5 w-3.5 text-primary" />
                      {service}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="relative isolate overflow-hidden rounded-xl border border-border/60 bg-background/75 p-4 shadow-[0_22px_55px_-38px_hsl(var(--foreground)/0.55)] backdrop-blur-sm"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-background/92 via-background/70 to-background/88" />
                  <div className="absolute inset-y-0 right-0 w-[68%] overflow-hidden rounded-r-xl">
                    <div
                      className="h-full w-full scale-[1.03] bg-cover bg-right opacity-36 saturate-110 contrast-110 brightness-90"
                      style={{ backgroundImage: `url("${aboutArtworkSrc}")` }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/74 to-background/28" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,hsl(var(--primary)/0.2),transparent_42%)]" />
                  <div className="absolute inset-[10px] rounded-lg border border-border/70 shadow-[inset_0_1px_0_hsl(var(--background)/0.9)]" />
                  <div className="absolute inset-[2px] rounded-[10px] border border-background/80" />
                </div>
                <div className="relative z-10 mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">Kapxr Command Center</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-success">
                    <Activity className="h-3.5 w-3.5" />
                    Live
                  </span>
                </div>

                <div className="relative z-10 space-y-3">
                  {aboutMetrics.map((metric, index) => (
                    <div key={metric.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className="font-medium">{Number(metric.value)}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Number(metric.value)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.1 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative z-10 mt-4 grid grid-cols-2 gap-2">
                  {aboutStats.map((stat) => (
                    <div key={String(stat.label)} className="rounded-lg border border-border/60 bg-card p-2.5">
                      <p className="text-[10px] text-muted-foreground">{String(stat.label)}</p>
                      <p className="text-base font-semibold">{String(stat.value)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </section>

        <section id="pricing" className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
          <div className="mb-6 text-center">
            <Badge variant="secondary" className="mb-2">Pricing</Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Plans That Fit Your Business</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Recurring subscription plans powered by PayPal billing agreement flow.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/90 p-1.5 shadow-sm">
              <Button
                type="button"
                size="sm"
                className={cn(
                  "h-9 min-w-[122px] rounded-lg px-5 transition-all",
                  billingInterval === "monthly"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_10px_18px_-12px_hsl(var(--primary)/0.55)]"
                    : "bg-background text-muted-foreground border border-border/70 hover:bg-muted/40"
                )}
                onClick={() => setBillingInterval("monthly")}
              >
                Monthly
              </Button>
              <Button
                type="button"
                size="sm"
                className={cn(
                  "h-9 min-w-[122px] rounded-lg px-5 transition-all",
                  billingInterval === "yearly"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_10px_18px_-12px_hsl(var(--primary)/0.55)]"
                    : "bg-background text-muted-foreground border border-border/70 hover:bg-muted/40"
                )}
                onClick={() => setBillingInterval("yearly")}
              >
                Annually
              </Button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => {
              const isStarter = plan.code === "starter";
              const isGrowth = plan.code === "growth";
              const isPro = plan.code === "pro";
              return (
                <Card
                  key={plan.code}
                  className={cn(
                    "group relative overflow-hidden border p-0 transition-transform duration-300 hover:-translate-y-1",
                    isStarter && "border-border/70 bg-card shadow-sm",
                    isGrowth && "border-border bg-card text-foreground shadow-sm",
                    isPro && "border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-background text-foreground shadow-sm",
                    "hover:shadow-[0_24px_36px_-28px_hsl(var(--primary)/0.55)]"
                  )}
                >
                  <motion.div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    initial={false}
                    animate={shouldReduceMotion ? { opacity: 0 } : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      backgroundImage:
                        "linear-gradient(120deg, hsl(var(--primary)/0.10), transparent 40%, hsl(var(--primary)/0.16), transparent 78%)",
                      backgroundSize: "180% 180%",
                    }}
                  />
                  {isGrowth && (
                    <div className="absolute right-3 top-3">
                      <Badge className="bg-primary/15 text-primary border border-primary/30">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-3xl">{plan.name} Plan</CardTitle>
                    <p className="text-5xl font-bold tracking-tight">
                      ${getPlanPrice(plan.monthlyPrice, plan.yearlyPrice)}
                      <span className="ml-1 text-xl font-medium text-muted-foreground">/month</span>
                    </p>
                    <CardDescription className="text-sm text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-5">
                    <Button
                      asChild
                      className="w-full"
                    >
                      <Link
                        to={buildSignupLink(plan.code)}
                        onClick={() => setSelectedPlan({ planCode: plan.code, interval: billingInterval })}
                      >
                        {isStarter ? "Book a Demo" : `Get started with ${plan.name}`}
                      </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-border/80" />
                      <span className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">
                        WHAT YOU WILL GET
                      </span>
                      <div className="h-px flex-1 bg-border/80" />
                    </div>

                    <ul className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="inline-flex items-start gap-2 text-sm text-foreground/90"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                      <li className="inline-flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        {plan.seatsIncluded} Employee Profiles
                      </li>
                      <li className="inline-flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        {plan.connectorsIncluded} Channel Connectors
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="cta" className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-6">
          <Card className="bg-card border-border relative overflow-hidden">
            <motion.div
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl"
              animate={shouldReduceMotion ? { opacity: 0.25 } : { scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl"
              animate={shouldReduceMotion ? { opacity: 0.2 } : { scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <CardContent className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold inline-flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  {ctaTitle}
                </p>
                <p className="text-sm text-muted-foreground">{ctaSubtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild>
                  <Link to="/signin">Sign in</Link>
                </Button>
                <Button asChild className="gap-1.5">
                  <Link to="/signup">Start Free</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="border-t bg-background/80 backdrop-blur">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 lg:grid-cols-5 md:px-6">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <img src={kapxrLogo} alt="KapxrPIM" className="h-8 w-8 rounded-md" />
                <span className="text-base font-semibold tracking-tight">KapxrPIM</span>
              </div>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                {footerBrandDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {footerBadges.map((badge) => (
                  <Badge key={badge} variant="secondary">{badge}</Badge>
                ))}
              </div>
            </div>
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-semibold">{group.title}</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link to={link.to} className="hover:text-foreground transition-colors">{link.label}</Link>
                      ) : (
                        <a href={link.href ?? "#"} className="hover:text-foreground transition-colors">{link.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 pb-8 md:px-6">
            <div className="rounded-xl border border-border/60 bg-card/70 p-4 md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold">Product Updates Newsletter</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monthly updates on features, integrations, and product operations best practices.
                  </p>
                </div>
                <form onSubmit={handleNewsletterSubmit} className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
                  <Input
                    type="email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    placeholder="Enter your work email"
                    className="h-9 sm:w-64"
                  />
                  <Button size="sm" className="h-9" type="submit" disabled={isSubmittingNewsletter}>
                    {isSubmittingNewsletter ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
              <p>© {new Date().getFullYear()} KapxrPIM. All rights reserved.</p>
              <div className="flex items-center gap-4">
                {footerSocialLinks.map((link) => (
                  <a key={link.label} href={link.href ?? "#"} aria-label={link.label} className="hover:text-foreground transition-colors">
                    {link.label === "LinkedIn" ? (
                      <Linkedin className="h-4 w-4" />
                    ) : link.label === "X" ? (
                      <Twitter className="h-4 w-4" />
                    ) : link.label === "YouTube" ? (
                      <Youtube className="h-4 w-4" />
                    ) : (
                      <Github className="h-4 w-4" />
                    )}
                  </a>
                ))}
                {footerLegalLinks.map((link) => (
                  <a key={link.label} href={link.href ?? "#"} className="hover:text-foreground transition-colors">{link.label}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
