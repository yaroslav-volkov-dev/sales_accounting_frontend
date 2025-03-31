import { useUserQuery } from "@/api/queries/auth";
import { useStartSessionMutation } from "@/api/queries/users";
import { useCreateWorkspaceMutation } from "@/api/queries/workspaces";
import { Loader } from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { OrganizationMemberModel } from "@/models";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createWorkspaceSchema = z.object({
  organizationName: z.string().min(1),
})

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>

const AddWorkspaceBlock = () => {
  const { register, handleSubmit } = useForm<CreateWorkspaceFormData>();
  const { mutate: createWorkspace, isPending: isCreatingWorkspacePending } = useCreateWorkspaceMutation();

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
  )
}

const SelectWorkspaceBlock = ({ workspaces }: { workspaces: OrganizationMemberModel[] }) => {
  const { mutate: startSession, isPending: isStartingSessionPending } = useStartSessionMutation()

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-medium text-center">Select Workspace</h1>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {workspaces?.map((memberOrganization) => (
          <Card key={memberOrganization?.id}>
            <CardHeader className="text-lg font-semibold">{memberOrganization?.organization?.name}</CardHeader>
            <CardContent>
              <Button
                onClick={() => startSession({ workspaceId: memberOrganization?.organizationId })}
                isLoading={isStartingSessionPending}
              >
                Start Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const SelectWorkspacePage = () => {
  const { data: userData, isPending: isUserDataPending } = useUserQuery();

  if (isUserDataPending) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  const memberOrganizations = userData?.memberOrganizations || []

  if (memberOrganizations.length === 0) {
    return (
      <AddWorkspaceBlock />
    )
  }

  if (memberOrganizations.length > 0) {
    return (
      <SelectWorkspaceBlock workspaces={memberOrganizations} />
    )
  }

  return null
}; 