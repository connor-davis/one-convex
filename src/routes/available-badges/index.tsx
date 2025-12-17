import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/available-badges/")({
  component: RouteComponent,
});

function RouteComponent() {
  const badgesByCategory = useQuery(api.badges.badges.getAvailableBadges);

  return (
    <div className="flex flex-col w-full h-full gap-3 p-1 overflow-hidden">
      <div className="flex w-full h-auto items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Label className="text-lg">Available Badges</Label>
        </div>
        <div className="flex items-center gap-3"></div>
      </div>

      {Object.keys(badgesByCategory ?? {}).length > 0 ? (
        <Accordion type="single" collapsible>
          {Object.keys(badgesByCategory ?? {}).map((category) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger>{category}</AccordionTrigger>
              <AccordionContent>
                {(badgesByCategory ?? {})[category].map((badge) => (
                  <Item
                    key={badge._id}
                    variant="outline"
                    className="bg-input dark:bg-input/20"
                  >
                    <ItemMedia>
                      <Avatar className="size-16">
                        <AvatarImage src="https://github.com/evilrabbit.png" />
                        <AvatarFallback>ER</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-lg">{badge.name}</ItemTitle>
                      <ItemDescription className="text-md">
                        {badge.description}
                      </ItemDescription>
                    </ItemContent>
                    <ItemContent className="text-primary text-3xl font-mono font-bold">
                      {badge.points} pts
                    </ItemContent>
                  </Item>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex flex-col w-full h-full items-center justify-center gap-3">
          <Item>
            <ItemContent>
              <ItemDescription>
                No badges available at the moment.
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>
      )}
    </div>
  );
}
