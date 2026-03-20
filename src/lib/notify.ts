type ToastFn = (props: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  className?: string;
}) => void;

export function notifySuccess(toast: ToastFn, title: string, description?: string) {
  toast({
    title,
    description,
    className: "border-success/30 bg-success/10 text-foreground",
  });
}

export function notifyInfo(toast: ToastFn, title: string, description?: string) {
  toast({
    title,
    description,
    variant: "default",
  });
}

export function notifyError(toast: ToastFn, title: string, description?: string) {
  toast({
    title,
    description,
    variant: "destructive",
  });
}
