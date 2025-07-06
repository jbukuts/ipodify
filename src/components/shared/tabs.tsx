'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '#/lib/utils';

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      className={cn('flex flex-col', className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      {...props}
      data-slot='tabs-list'
      className={cn(
        'inline-flex w-fit items-center divide-x-[0.125rem] divide-fg text-fg',
        className
      )}>
      {children}
      <div className='h-full flex-1 border-b-[0.125rem]' />
    </TabsPrimitive.List>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot='tabs-trigger'
      className={cn(
        "focus-visible:outline-ring text-foreground relative z-30 inline-flex items-center justify-center gap-1.5 px-2 py-0.5 pb-[0.25rem] text-xs whitespace-nowrap first:border-l-[0.125rem] last:border-r-[0.125rem] hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-bg data-[state=active]:text-fg [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "after:absolute after:bottom-0 after:h-0 after:w-full after:border-b-[0.125rem] after:border-b-fg after:content-[''] data-[state=active]:after:border-b-transparent",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot='tabs-content'
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
