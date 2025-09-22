'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buttonVariants = exports.Button = void 0;
const React = require('react');
const react_slot_1 = require('@radix-ui/react-slot');
const class_variance_authority_1 = require('class-variance-authority');
const utils_1 = require('@/lib/utils');
const buttonVariants = (0, class_variance_authority_1.cva)(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'neon-button bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 neon-glow-md hover:neon-glow-lg',
        destructive:
          'bg-gradient-to-r from-destructive to-red-500 text-destructive-foreground hover:from-destructive/90 hover:to-red-500/90 neon-glow-md hover:neon-glow-lg',
        outline:
          'border border-primary/50 bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary neon-glow-sm hover:neon-glow-md',
        secondary:
          'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/70 neon-glow-sm hover:neon-glow-md',
        ghost:
          'hover:bg-primary/10 hover:text-primary transition-all duration-300',
        link: 'text-primary underline-offset-4 hover:underline neon-text',
        neon: 'neon-button bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground animate-neon-pulse hover:animate-none',
        cyber:
          'cyber-border bg-gradient-to-r from-primary/20 to-accent/20 text-primary hover:from-primary/30 hover:to-accent/30 animate-cyber-border',
        holographic:
          'holographic text-white font-bold animate-holographic-shift',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        xl: 'h-12 rounded-lg px-10 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
exports.buttonVariants = buttonVariants;
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? react_slot_1.Slot : 'button';
    return (
      <Comp
        className={(0, utils_1.cn)(
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
exports.Button = Button;
Button.displayName = 'Button';
