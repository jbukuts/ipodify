import { cn } from '#/lib/utils';
import {
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps
} from 'react';
import Marquee from 'react-fast-marquee';

interface SmartMarqueeProps
  extends Pick<ComponentProps<'p'>, 'children' | 'className' | 'onClick'> {
  wrapperClassName?: string;
  autoPlay?: boolean;
}

export default function SmartMarquee(props: SmartMarqueeProps) {
  const {
    children,
    className,
    wrapperClassName,
    onClick,
    autoPlay = false
  } = props;

  const ref = useRef(null);
  const [overflow, setOverflow] = useState(false);
  const [hover, setHover] = useState(false);

  const checkOverflow = useCallback(() => {
    if (ref.current) {
      const { scrollWidth, clientWidth } = ref.current;
      setOverflow(scrollWidth > clientWidth);
    }
  }, []);

  useLayoutEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [checkOverflow]);

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={cn('h-min w-auto overflow-hidden', wrapperClassName)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      {!overflow ? (
        <p
          ref={ref}
          className={cn(
            'overflow-hidden leading-tight whitespace-nowrap',
            className
          )}>
          {children}
        </p>
      ) : (
        <Marquee
          play={hover || autoPlay}
          className='[&_.rfm-child]:mr-3 [&_.rfm-child]:leading-tight'>
          {children}
        </Marquee>
      )}
    </div>
  );
}

export function InternalBetterSmartMarquee(props: SmartMarqueeProps) {
  const {
    children,
    className,
    wrapperClassName,
    onClick,
    autoPlay = false
  } = props;

  const ref = useRef(null);
  const [overflow, setOverflow] = useState(false);
  const [hover, setHover] = useState(false);

  const checkOverflow = useCallback(() => {
    if (ref.current) {
      const { scrollWidth, clientWidth } = ref.current;
      setOverflow(scrollWidth > clientWidth);
    }
  }, []);

  useLayoutEffect(() => {
    checkOverflow();
  }, [checkOverflow, children]);

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={cn('relative h-min w-auto overflow-hidden', wrapperClassName)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <p
        ref={ref}
        className={cn(
          'absolute top-0 w-full overflow-hidden leading-tight whitespace-nowrap',
          overflow && 'opacity-0',
          className
        )}>
        {children}
      </p>
      <Marquee
        play={hover || autoPlay}
        className={cn(
          '[&_.rfm-child]:mr-3 [&_.rfm-child]:leading-tight',
          !overflow && 'pointer-events-none opacity-0'
        )}>
        {children}
      </Marquee>
    </div>
  );
}

const BetterSmartMarquee = memo(InternalBetterSmartMarquee);
export { BetterSmartMarquee };
