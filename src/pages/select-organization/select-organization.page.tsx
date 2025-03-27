import { useUserQuery } from "@/api/queries/auth";
import { useCreateWorkspaceMutation } from "@/api/queries/workspaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createWorkspaceSchema = z.object({
  organizationName: z.string().min(1),
})

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>

export const SelectWorkspacePage = () => {
  const { register, handleSubmit } = useForm<CreateWorkspaceFormData>();

  const { mutate: createWorkspace, isPending: isCreatingWorkspacePending } = useCreateWorkspaceMutation();
  const { data } = useUserQuery();

  const ownedOrganizations = data?.user?.ownedOrganizations || [];
  const memberOrganizations = data?.user?.memberOrganizations || [];

  return (
    <div className="py-10 flex justify-center items-center">
      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">No Workspaces Found</CardTitle>
          <CardDescription className="text-base">
            It seems you are not a member or owner of any workspaces. You can create a new workspace or join an existing one using the invite link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-2xl font-medium">
            Create New Workspace
          </div>

          <div className="my-10 flex flex-col">
            <Label className="text-lg font-medium">Enter workspace name</Label>
            <Input
              placeholder="Workspace name"
              className="mt-3"
              {...register('organizationName')}
            />
            <div className="flex justify-center mt-6">
              <Button
                className="w-50 h-12"
                onClick={handleSubmit((data) => createWorkspace(data))}
                isLoading={isCreatingWorkspacePending}
              >
                Create
              </Button>
            </div>
          </div>

          <Separator />
          <div className="text-center text-2xl font-medium">
            Or Join Existing Workspace
          </div>
          <div className="mt-4">
            <Label className="text-lg font-medium mb-2">Join Existing Workspace</Label>
            <Input
              placeholder="Paste invite link here"
              className="flex-1"
            />
            <div className="flex justify-center mt-6">
              <Button
                className="w-50 h-12"
              >
                Join
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 