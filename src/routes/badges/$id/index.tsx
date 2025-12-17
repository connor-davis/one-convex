import DeleteBadgeCategoryByIdDialog from "@/components/dialogs/badges/categories/delete";
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
import { Item, ItemContent, ItemHeader } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { ChevronLeftIcon, MinusIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/badges/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { organizationId } = useAuth();

  const [categoryName, setCategoryName] = useState<string | undefined>(
    undefined,
  );

  const badge = useQuery(api.badges.badges.getOne, { id: id as Id<"badges"> });

  const update = useMutation(api.badges.badges.update);
  const createCategory = useMutation(api.badges.badgeCategories.create);

  const { results: categories } = usePaginatedQuery(
    api.badges.badgeCategories.get,
    {
      organizationId,
      search: categoryName ?? "",
    },
    {
      initialNumItems: 10,
    },
  );

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
          onSubmit={updateForm.handleSubmit(async (values) => {
            try {
              await update({
                id: id as Id<"badges">,
                imageId: values.imageId,
                name: values.name,
                description: values.description,
                points: values.points,
                categoryId: values.categoryId,
              });

              return toast.success("Success", {
                description: "The badge has been updated.",
                duration: 2000,
              });
            } catch (error) {
              console.log(error);

              return toast.error("Error", {
                description: "An error occurred while updating the badge.",
                duration: 2000,
              });
            }
          })}
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

          <FormField
            control={updateForm.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Popover>
                  <PopoverTrigger>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        {field.value ? "Change Category" : "Select Category"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col p-3 gap-3 w-full md:w-96 max-h-96 overflow-y-auto">
                    <Item size="sm">
                      <ItemHeader>Available Categories</ItemHeader>
                      <ItemContent>
                        <InputGroup>
                          <InputGroupInput
                            type="text"
                            value={categoryName}
                            onChange={(evt) =>
                              setCategoryName(evt.target.value)
                            }
                            placeholder="Search for or create a category"
                          />
                          <InputGroupAddon align="inline-end">
                            <SearchIcon />
                          </InputGroupAddon>
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              variant="outline"
                              onClick={() => {
                                if (!categoryName) return;

                                createCategory({
                                  name: categoryName,
                                  organizationId,
                                }).finally(() => setCategoryName(""));
                              }}
                            >
                              <PlusIcon />
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                      </ItemContent>
                    </Item>

                    {categories.map((category) => (
                      <Item
                        key={category._id}
                        size="sm"
                        variant="muted"
                        className={cn(
                          "border border-input bg-input/30 p-3",
                          field.value === category._id
                            ? "border-primary/10 bg-primary/5"
                            : "",
                        )}
                        onClick={() => {
                          if (field.value === category._id) {
                            field.onChange(null);
                          } else {
                            field.onChange(category._id);
                          }
                        }}
                      >
                        <ItemContent className="flex flex-row items-center justify-between gap-3 w-full">
                          <Label>{category.name}</Label>

                          <DeleteBadgeCategoryByIdDialog
                            id={category._id}
                            onDelete={() => {}}
                          />
                        </ItemContent>
                      </Item>
                    ))}
                  </PopoverContent>
                </Popover>

                <FormDescription>
                  The category this badge belongs to.
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
