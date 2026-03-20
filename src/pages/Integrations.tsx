import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const integrations = [
  { name: "Shopify", description: "Sync products, inventory and orders with your Shopify store.", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/shopify.svg", status: "Connected", connected: true, category: "E-commerce" },
  { name: "Amazon", description: "List and manage products on Amazon Marketplace.", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazon.svg", status: "Not Connected", connected: false, category: "Marketplace" },
  { name: "WooCommerce", description: "Integrate with WordPress WooCommerce stores.", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/woocommerce.svg", status: "Not Connected", connected: false, category: "E-commerce" },
  { name: "Magento", description: "Connect to Adobe Commerce / Magento for product syndication.", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/magento.svg", status: "Not Connected", connected: false, category: "E-commerce" },
  { name: "BigCommerce", description: "Push product data to your BigCommerce storefront.", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bigcommerce.svg", status: "Connected", connected: true, category: "E-commerce" },
  { name: "ShipStation", description: "Automate shipping and fulfillment workflows.", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/shipstation.svg", status: "Not Connected", connected: false, category: "Fulfillment" },
];

export default function Integrations() {
  return (
    <AppLayout title="Integrations">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Connect third-party platforms to sync product data automatically</p>
          <Button size="sm" className="h-9 gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Integration
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((item) => (
            <Card key={item.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center p-2">
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="h-6 w-6 dark:invert"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <span className="text-[11px] text-muted-foreground">{item.category}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      item.connected
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-xs">{item.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <Switch checked={item.connected} />
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    {item.connected ? "Configure" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
}
