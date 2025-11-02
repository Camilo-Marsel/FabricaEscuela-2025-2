import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from './button';

interface BackButtonProps {
  to: string;
  label?: string;
  className?: string;
}

export const BackButton = ({ to, label = 'Volver', className = '' }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      onClick={() => navigate(to)}
      className={`gap-2 text-muted-foreground hover:text-foreground ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      <span>{label}</span>
    </Button>
  );
};
