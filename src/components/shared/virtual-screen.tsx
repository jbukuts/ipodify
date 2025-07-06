import {
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type ReactElement
} from 'react';
import MenuItem from './menu-item';
import Screen from './screen';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInView } from 'react-intersection-observer';
import flattenChildren from 'react-keyed-flatten-children';
import LoadItem from './load-item';

interface VirtualScreenProps {
  children?: ReactElement<typeof MenuItem>[];
  total?: number;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  loading?: boolean;
}

export default function VirtualScreen(props: VirtualScreenProps) {
  const {
    children,
    total,
    fetchNextPage = () => null,
    hasNextPage = true,
    loading = false
  } = props;

  const arr = flattenChildren(children) as ReactElement<typeof MenuItem>[];
  const rootFontSize = useMemo(
    () => parseFloat(getComputedStyle(document.documentElement).fontSize),
    []
  );

  const { ref, inView } = useInView();
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: total ?? arr.length + (hasNextPage ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => rootFontSize * 2,
    overscan: 2
  });

  useEffect(() => {
    if (inView) {
      console.log('next page!');
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <Screen className='relative' ref={parentRef} loading={loading}>
      <div
        style={{ height: rowVirtualizer.getTotalSize() }}
        className='relative w-full'>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoader = virtualRow.index > arr.length - 1;
          const isFirstLoader = virtualRow.index === arr.length;

          const styles: CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: virtualRow.size,
            transform: `translateY(${virtualRow.start}px)`
          };

          if (isLoader)
            return (
              <LoadItem
                style={styles}
                key={virtualRow.index}
                ref={isFirstLoader ? ref : undefined}
              />
            );

          return cloneElement(arr[virtualRow.index], {
            key: virtualRow.index,
            style: styles
          } as ComponentProps<typeof MenuItem>);
        })}
      </div>
    </Screen>
  );
}

interface VirtualScreenPropsAgain {
  children: (po: { index: number; style: CSSProperties }) => ReactElement;
  loaded: number;
  total?: number;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  loading?: boolean;
}

export function VirtualScreenAgain(props: VirtualScreenPropsAgain) {
  const {
    children: Comp,
    total,
    loaded,
    fetchNextPage = () => null,
    hasNextPage = true,
    loading = false
  } = props;

  const rootFontSize = useMemo(
    () => parseFloat(getComputedStyle(document.documentElement).fontSize),
    []
  );

  const { ref, inView } = useInView();
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: total ?? loaded + (hasNextPage ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => rootFontSize * 2,
    overscan: 2
  });

  useEffect(() => {
    if (inView) {
      console.log('next page!');
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <Screen className='relative' ref={parentRef} loading={loading}>
      <div
        style={{ height: rowVirtualizer.getTotalSize() }}
        className='relative w-full'>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoader = virtualRow.index > loaded - 1;
          const isFirstLoader = virtualRow.index === loaded;

          const styles: CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: virtualRow.size,
            transform: `translateY(${virtualRow.start}px)`
          };

          if (isLoader)
            return (
              <LoadItem
                style={styles}
                key={virtualRow.index}
                ref={isFirstLoader ? ref : undefined}
              />
            );

          return (
            <Comp
              key={virtualRow.index}
              {...{ index: virtualRow.index, style: styles }}
            />
          );
        })}
      </div>
    </Screen>
  );
}
