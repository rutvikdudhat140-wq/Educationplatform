"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  calendarProps,
  popoverContentProps,
  formatDate = (value) => format(value, "PPP"),
  disabled,
  ...props
}) {
  const [internalDate, setInternalDate] = React.useState()
  const selectedDate = date ?? internalDate

  function handleSelect(value) {
    setInternalDate(value)
    onDateChange?.(value)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            disabled={disabled}
            data-empty={!selectedDate}
            data-slot="date-picker"
            className={cn(
              "justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
              className
            )}
            {...props}
          />
        }
      >
        <CalendarIcon />
        {selectedDate ? formatDate(selectedDate) : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" {...popoverContentProps}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={disabled}
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
