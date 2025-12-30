import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Minus, Plus } from 'lucide-react';

interface HoursInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  currentHours: number;
  onSave: (additionalHours: number) => void;
}

export function HoursInputDialog({
  open,
  onOpenChange,
  date,
  currentHours,
  onSave,
}: HoursInputDialogProps) {
  const [additionalHours, setAdditionalHours] = useState<string>('');

  useEffect(() => {
    if (open) {
      setAdditionalHours('');
    }
  }, [open]);

  const handleSave = () => {
    const numericHours = parseFloat(additionalHours) || 0;
    onSave(numericHours);
    onOpenChange(false);
  };

  const handleIncrement = () => {
    const current = parseFloat(additionalHours) || 0;
    setAdditionalHours((current + 0.5).toString());
  };

  const handleDecrement = () => {
    const current = parseFloat(additionalHours) || 0;
    setAdditionalHours((current - 0.5).toString());
  };

  const quickHours = [-1, -0.5, 0.5, 1, 1.5, 2, 3];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-display">
            <Clock className="w-5 h-5 text-primary" />
            Add Study Hours
          </DialogTitle>
        </DialogHeader>

        {date && (
          <div className="space-y-6 py-4">
            <p className="text-center text-muted-foreground">
              {format(date, 'EEEE, MMMM d, yyyy')}
            </p>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current total today</p>
              <p className="text-2xl font-semibold">{currentHours.toFixed(1)} hours</p>
            </div>

            {/* Additional Hours Input with +/- buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                className="h-12 w-12 rounded-xl shrink-0"
              >
                <Minus className="h-5 w-5" />
              </Button>
              
              <div className="relative flex items-center">
                <Input
                  type="number"
                  step="0.5"
                  value={additionalHours}
                  onChange={(e) => setAdditionalHours(e.target.value)}
                  placeholder="0"
                  className="w-32 h-16 text-center text-3xl font-semibold rounded-xl pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
                  hrs
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                className="h-12 w-12 rounded-xl shrink-0"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick select buttons */}
            <div className="flex justify-center gap-2 flex-wrap">
              {quickHours.map((h) => (
                <Button
                  key={h}
                  variant={parseFloat(additionalHours) === h ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setAdditionalHours(h.toString())}
                  className="rounded-lg px-4 min-w-[60px]"
                >
                  {h > 0 ? `+${h}h` : `${h}h`}
                </Button>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="rounded-lg">
            Add Hours
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
