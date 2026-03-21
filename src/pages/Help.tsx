import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookOpen, Video, TicketCheck, MessageCircleQuestion, ExternalLink, Mail, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "How do I create a new product?",
    answer: "Navigate to Products → click 'Add Product'. Fill in the required fields like Product Name, SKU, and Short Description, then attach media and set attributes before saving.",
  },
  {
    question: "How do I bulk import products?",
    answer: "Go to Import / Export → select 'Import'. Upload a CSV or Excel file matching the required template format. You can download a sample template from the same page.",
  },
  {
    question: "How do I assign a brand to a product?",
    answer: "First create the brand under Setup → Brands. Then when creating or editing a product, select the brand from the Brand field in the Organization sidebar.",
  },
  {
    question: "What are attributes and how do I use them?",
    answer: "Attributes are custom properties (e.g. Color, Material, Battery Life) that describe your products. Create them under Setup → Attributes, then assign values when editing individual products.",
  },
  {
    question: "How do I manage digital assets?",
    answer: "Use the Assets page to upload and organize images, videos, and documents. You can then link these assets to products from the product's Media tab.",
  },
  {
    question: "Can I export my product data?",
    answer: "Yes. Go to Import / Export → Export. Choose the format (CSV or Excel), select which fields to include, and download your data.",
  },
  {
    question: "How do workflows work?",
    answer: "Workflows guide you through end-to-end processes like product creation. Each workflow shows sequential steps — from brand setup to final product publishing — so nothing is missed.",
  },
  {
    question: "How do I invite team members?",
    answer: "Go to Team → click 'Invite Member'. Enter their email and assign a role. They'll receive an invitation to join your workspace.",
  },
];

const tutorials = [
  { title: "Getting Started with KapxrPIM", duration: "5 min read", type: "Guide" },
  { title: "Creating Your First Product", duration: "3 min read", type: "Guide" },
  { title: "Bulk Import & Export", duration: "4 min read", type: "Guide" },
  { title: "Managing Digital Assets", duration: "6 min video", type: "Video" },
  { title: "Setting Up Categories & Attributes", duration: "4 min read", type: "Guide" },
  { title: "Using Workflows Effectively", duration: "5 min video", type: "Video" },
];

export default function Help() {
  useAppPageTitle("Help & Support");
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketPriority, setTicketPriority] = useState("Medium");

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim()) {
      toast({ title: "Missing subject", description: "Please provide a subject for your ticket.", variant: "destructive" });
      return;
    }
    toast({ title: "Ticket submitted", description: "We'll get back to you within 24 hours." });
    setTicketSubject("");
    setTicketDescription("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-10 h-11 bg-card border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MessageCircleQuestion, label: "FAQ", description: "Common questions", color: "bg-primary/10 text-primary" },
            { icon: BookOpen, label: "Tutorials", description: "Step-by-step guides", color: "bg-success/10 text-success" },
            { icon: Video, label: "Videos", description: "Watch & learn", color: "bg-warning/10 text-warning" },
            { icon: TicketCheck, label: "Raise Ticket", description: "Get support", color: "bg-destructive/10 text-destructive" },
          ].map((item) => (
            <Card key={item.label} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageCircleQuestion className="h-4 w-4 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`}>
                        <AccordionTrigger className="text-sm text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">No results found for "{searchQuery}"</p>
                )}
              </CardContent>
            </Card>

            {/* Raise a Ticket */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TicketCheck className="h-4 w-4 text-destructive" />
                  Raise a Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Input
                      placeholder="Brief description of the issue"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <div className="flex gap-2">
                      {["Low", "Medium", "High"].map((p) => (
                        <Button
                          key={p}
                          size="sm"
                          variant={ticketPriority === p ? "default" : "outline"}
                          className="h-9 flex-1"
                          onClick={() => setTicketPriority(p)}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your issue in detail..."
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmitTicket} className="gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tutorials sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-success" />
                  Tutorials & Guides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tutorials.map((t, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${t.type === "Video" ? "bg-warning/10" : "bg-success/10"}`}>
                      {t.type === "Video" ? (
                        <Video className="h-3.5 w-3.5 text-warning" />
                      ) : (
                        <BookOpen className="h-3.5 w-3.5 text-success" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed font-semibold truncate">{t.title}</p>
                      <p className="pim-list-meta">{t.duration}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Button variant="outline" className="w-full gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
  );
}
