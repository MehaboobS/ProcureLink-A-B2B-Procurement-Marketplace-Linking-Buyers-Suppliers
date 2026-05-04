"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Command({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command"
      className={cn("flex max-h-80 flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className)}
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="command-empty" className={cn("px-3 py-6 text-center text-sm text-muted-foreground", className)} {...props} />
}

function CommandGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="command-group" className={cn("flex flex-col overflow-hidden p-1", className)} {...props} />
}

function CommandItem({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="command-item"
      className={cn(
        "flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Command, CommandEmpty, CommandGroup, CommandItem }