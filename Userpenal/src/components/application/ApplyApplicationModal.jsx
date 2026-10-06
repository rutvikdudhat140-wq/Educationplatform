import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export const createEmptyApplicationForm = () => ({ ...emptyForm });

export default function ApplyApplicationModal({
  open,
  title,
  form,
  setForm,
  loading,
  error,
  onClose,
  onSubmit,
  submitLabel = "Submit Application",
}) {
  const handleFieldChange = (field) => (event) => {
    setForm({
      ...form,
      [field]: event.target.value,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !value && onClose()}
    >
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <form onSubmit={onSubmit}>
          <DialogHeader className="px-5 py-3 border-b bg-surface">
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>

            <p className="text-xs text-ink-muted">
              Enter your details to submit your application.
            </p>
          </DialogHeader>

          <div className="px-5 py-4 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="apply-name">Full Name</Label>
              <Input
                id="apply-name"
                value={form.name}
                onChange={handleFieldChange("name")}
                placeholder="Enter your full name"
                className="h-9"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="apply-email">Email</Label>
                <Input
                  id="apply-email"
                  type="email"
                  value={form.email}
                  onChange={handleFieldChange("email")}
                  placeholder="Enter your email"
                  className="h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="apply-phone">Phone</Label>
                <Input
                  id="apply-phone"
                  value={form.phone}
                  onChange={handleFieldChange("phone")}
                  placeholder="Enter phone number"
                  className="h-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="apply-message">Message</Label>
              <Textarea
                id="apply-message"
                value={form.message}
                onChange={handleFieldChange("message")}
                placeholder="Write your message..."
                rows={2}
                className="resize-none"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-600">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="px-5 py-3 border-t bg-surface">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={loading}
            >
              {loading ? "Submitting..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
