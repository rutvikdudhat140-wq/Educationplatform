import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    message: '',
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
    submitLabel = 'Submit Application',
}) {
    const handleFieldChange = (field) => (event) => {
        const value = event.target.value;
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
    };

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
            <DialogContent className="sm:max-w-xl">
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="apply-name">Name</Label>
                            <Input
                                id="apply-name"
                                value={form.name}
                                onChange={handleFieldChange('name')}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apply-email">Email</Label>
                            <Input
                                id="apply-email"
                                type="email"
                                value={form.email}
                                onChange={handleFieldChange('email')}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apply-phone">Phone Number</Label>
                            <Input
                                id="apply-phone"
                                value={form.phone}
                                onChange={handleFieldChange('phone')}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apply-message">Message</Label>
                            <Textarea
                                id="apply-message"
                                value={form.message}
                                onChange={handleFieldChange('message')}
                                placeholder="Write your message"
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm font-medium text-red-600">{error}</p>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
