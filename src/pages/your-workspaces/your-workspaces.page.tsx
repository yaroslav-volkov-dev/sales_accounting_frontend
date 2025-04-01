import { UserQueryResponse, useUserQuery } from "@/api/queries/auth";
import { useStartSessionMutation } from "@/api/queries/users";
import { useCreateWorkspaceMutation } from "@/api/queries/workspaces";
import { Loader } from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createWorkspaceSchema = z.object({
  organizationName: z.string().min(1),
})

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>

const AddWorkspaceDialog = () => {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit } = useForm<CreateWorkspaceFormData>();

  const { mutate: createWorkspace, isPending: isCreatingWorkspacePending } = useCreateWorkspaceMutation({
    onSuccess: () => {
      setOpen(false)
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add workspace</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit((data) => createWorkspace(data))}>
          <DialogHeader>
            <DialogTitle>Add Workspace</DialogTitle>
            <DialogDescription>
              Add new workspace to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                placeholder="Name"
                {...register('organizationName', { required: true })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" isLoading={isCreatingWorkspacePending}>
              Save
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
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

const SelectWorkspaceBlock = ({ workspaces }: { workspaces: UserQueryResponse['memberships'] }) => {
  const { mutate: startSession, variables } = useStartSessionMutation()

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-medium text-center">Select Workspace</h1>
      <div className="flex justify-start">
        <AddWorkspaceDialog />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {workspaces?.map((memberOrganization) => (
          <Card key={memberOrganization?.id}>
            <CardHeader className="text-lg font-semibold">{memberOrganization?.organization?.name}</CardHeader>
            <CardContent>
              <Button
                onClick={() => startSession({ workspaceId: memberOrganization?.organizationId })}
                isLoading={variables?.workspaceId === memberOrganization?.organizationId}
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

  const memberOrganizations = userData?.memberships || []

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