"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FaqAccordion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I change my theme?</AccordionTrigger>
            <AccordionContent>
              Navigate to the color editor on the left panel. You can modify
              individual color tokens or select from our preset themes using the
              dropdown in the top bar.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I export my theme?</AccordionTrigger>
            <AccordionContent>
              Yes! Click the Export button in the top right corner to generate a
              globals.css file with all your custom theme variables.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Does it support dark mode?</AccordionTrigger>
            <AccordionContent>
              Absolutely. Toggle between light and dark mode using the switch at
              the top of the editor. Each mode has independent color settings.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How do I reset to defaults?</AccordionTrigger>
            <AccordionContent>
              Select any preset theme from the dropdown menu to reset all
              colors, fonts, and other settings to that preset&apos;s defaults.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
