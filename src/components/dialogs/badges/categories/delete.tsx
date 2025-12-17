import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { TrashIcon } from "lucide-react";

export default function DeleteBadgeCategoryByIdDialog({
  id,
  onDelete,
}: {
  id: Id<"badgeCategories">;
  onDelete: () => void;
}) {
  const deleteBadgeCategory = useMutation(api.badges.badgeCategories.remove);

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger>
          <AlertDialogTrigger>
            <Button variant="destructive" size="icon">
              <TrashIcon />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Delete Badge Category</TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the badge
            category from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteBadgeCategory({
                id,
              }).finally(() => onDelete())
            }
          >
            Delete Badge Category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
