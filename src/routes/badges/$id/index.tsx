import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { ChevronLeftIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/badges/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const badge = useQuery(api.badges.badges.getOne, { id: id as Id<"badges"> });
  const update = useMutation(api.badges.badges.update);

  const updateForm = useForm<Doc<"badges">>({
    values: {
      ...((badge ?? {}) as Doc<"badges">),
    },
  });

  return (
    <div className="flex flex-col w-full h-full gap-3 p-1 overflow-hidden">
      <div className="flex w-full h-auto items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/badges">
            <Button variant="ghost">
              <ChevronLeftIcon />
            </Button>
          </Link>

          <Label className="text-lg">Badge Details</Label>
        </div>
        <div className="flex items-center gap-3"></div>
      </div>

      <Form {...updateForm}>
        <form
          className="flex flex-col w-full h-full gap-3 overflow-hidden overflow-y-auto"
          onSubmit={updateForm.handleSubmit((values) =>
            update({
              id: id as Id<"badges">,
              imageId: values.imageId,
              name: values.name,
              description: values.description,
              points: values.points,
              categoryId: values.categoryId,
            }),
          )}
        >
          <FormField
            control={updateForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the badge as it will appear to users.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={updateForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field}></Textarea>
                </FormControl>
                <FormDescription>
                  A brief description of the badge and how to earn it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={updateForm.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      placeholder="Points"
                      {...field}
                      onChange={(evt) =>
                        field.onChange(evt.target.valueAsNumber)
                      }
                    />
                    <InputGroupAddon align="inline-start">
                      <InputGroupButton
                        onClick={() => {
                          const value = Number(field.value) ?? 0;

                          if (value > 0)
                            return field.onChange(
                              Number((value - 1).toFixed(2)),
                            );
                        }}
                      >
                        <MinusIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={() => {
                          const value = Number(field.value) ?? 0;

                          return field.onChange(Number((value + 1).toFixed(2)));
                        }}
                      >
                        <PlusIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormDescription>
                  A brief description of the badge and how to earn it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full">Save Details</Button>
        </form>
      </Form>
    </div>
  );
}
