import {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  type ComponentProps,
  type CSSProperties,
  type ReactNode
} from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import Screen from './screen';
import LoadItem from './load-item';

const PADDING = 0.25;

interface BetterVirtualScreenProps {
  loaded: number;
  total?: number;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  loading?: boolean;
  children: (po: { index: number; style: CSSProperties }) => ReactNode;
}

const InnerElement = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ style, ...rest }, ref) => {
    const fontSize = useMemo(
      () => parseFloat(getComputedStyle(document.documentElement).fontSize),
      []
    );

    return (
      <div
        className='relative'
        ref={ref}
        style={{
          ...style,
          height: `${(typeof style!.height === 'string' ? parseFloat(style!.height!) : style!.height!) + PADDING * fontSize}px`
        }}
        {...rest}
      />
    );
  }
);

function InternalBetterVirtualScreen(props: BetterVirtualScreenProps) {
  const {
    loaded,
    total,
    fetchNextPage = () => null,
    children: Comp,
    loading = false,
    hasNextPage = true
  } = props;

  const fontSize = useMemo(
    () => parseFloat(getComputedStyle(document.documentElement).fontSize),
    []
  );

  const isItemLoaded = useCallback((index: number) => index < loaded, [loaded]);
  const count = total ?? loaded + (hasNextPage ? 1 : 0);

  if (loading) return <Screen loading />;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          loadMoreItems={fetchNextPage}
          itemCount={count}>
          {({ onItemsRendered, ref }) => (
            <List
              innerElementType={InnerElement}
              itemCount={count}
              onItemsRendered={onItemsRendered}
              ref={ref}
              itemSize={fontSize * 2}
              width={width}
              height={height}>
              {({ index, style }: { index: number; style: CSSProperties }) => {
                const s: CSSProperties = {
                  ...style,
                  top: `${(typeof style.top === 'string' ? parseFloat(style.top!) : style.top!) + PADDING * fontSize}px`
                };

                return !isItemLoaded(index) ? (
                  <LoadItem key={index} style={s} />
                ) : (
                  <Comp {...{ index, style: s }} />
                );
              }}
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
}

const BetterVirtualScreen = memo(InternalBetterVirtualScreen);
export default BetterVirtualScreen;
