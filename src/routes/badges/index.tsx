import DeleteBadgeByIdDialog from "@/components/dialogs/badges/delete";
import { Button } from "@/components/ui/button";
import { DebounceInput } from "@/components/ui/debounce-input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useAuth } from "@workos-inc/authkit-react";
import { usePaginatedQuery } from "convex/react";
import { DownloadIcon, PencilIcon, PlusIcon } from "lucide-react";
import z from "zod";

export const Route = createFileRoute("/badges/")({
  validateSearch: z.object({
    search: z.string().default(""),
  }),
  component: RouteComponent,
});

export const badgeColumns: ColumnDef<Doc<"badges">>[] = [
  {
    accessorKey: "name",
    header: () => <Label>Name</Label>,
    cell: ({ row }) => <Label>{row.getValue("name")}</Label>,
  },
  {
    accessorKey: "description",
    header: () => <Label>Description</Label>,
    cell: ({ row }) => <span>{row.getValue("description")}</span>,
  },
  {
    accessorKey: "points",
    header: () => <Label>Points</Label>,
    cell: ({ row }) => <span>{row.getValue("points")}</span>,
  },
];

export const BADGES_PAGE_SIZE = 10;

function RouteComponent() {
  const router = useRouter();
  const { search } = Route.useSearch();

  const { organizationId } = useAuth();

  const {
    results: data,
    isLoading,
    loadMore,
    status,
  } = usePaginatedQuery(
    api.badges.badges.get,
    {
      organizationId,
      search,
    },
    {
      initialNumItems: BADGES_PAGE_SIZE,
    },
  );

  const table = useReactTable({
    data: data,
    columns: badgeColumns,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <div className="flex flex-col w-full h-full gap-3 p-1 overflow-hidden">
      <div className="flex w-full h-auto items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Label className="text-lg">Badges</Label>
        </div>
        <div className="flex items-center gap-3">
          <DebounceInput
            type="text"
            placeholder="Search badges..."
            className="min-w-[250px]"
            defaultValue={search}
            onChange={(evt) =>
              router.navigate({
                to: "/badges",
                search: {
                  search: evt.target.value,
                },
              })
            }
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/badges/create">
                <Button variant="outline">
                  <PlusIcon />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Add Badge</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {!isLoading ? (
        <div className="overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}

                  <TableHead>Actions</TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Link
                            to="/badges/$id"
                            params={{ id: row.original._id }}
                          >
                            <Button variant="outline">
                              <PencilIcon />
                            </Button>
                          </Link>

                          <DeleteBadgeByIdDialog
                            id={row.original._id}
                            onDelete={() =>
                              status === "CanLoadMore" &&
                              loadMore(BADGES_PAGE_SIZE - (data.length - 1))
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={badgeColumns.length + 1}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {status === "CanLoadMore" && (
            <Button
              variant="ghost"
              disabled={isLoading}
              className="w-full"
              onClick={() => loadMore(BADGES_PAGE_SIZE)}
            >
              <DownloadIcon />
              <span>Load more</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <div className="flex items-center gap-3">
            <Spinner className="text-primary" />
            <Label className="text-muted-foreground">Loading badges...</Label>
          </div>
        </div>
      )}
    </div>
  );
}
