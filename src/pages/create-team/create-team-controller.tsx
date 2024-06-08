"use client";

import { useForm } from "react-hook-form";
import CreateTeamView, { createTeamSchema } from "./create-team-view";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFetchParticipants, usePostTeam } from "@/lib/requests";
import { toast } from "sonner";
import { useState } from "react";
import { Option } from "@/components/ui/multiple-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { v4 as uuidv4 } from "uuid";

const CreateTeamController = () => {
  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      id: "",
      name: "",
      car_number: undefined,
      races: [] || undefined,
      participants: [] || undefined,
    },
  });

  const router = useRouter();
  const mutation = usePostTeam();
  const { data } = useFetchParticipants();
  const [value, setValue] = useState<Option[]>([]);  

  const participantsValue = value.map((participant) => ({
    name: participant.value,
    grade: undefined,
  }));

  const onSubmit = (data: z.infer<typeof createTeamSchema>) => {
    data.participants = participantsValue;
    data.id = uuidv4()

    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        setValue([])
        toast.success("Equipe cadastrada com sucesso!", {
          action: {
            label: "Ok",
            onClick: () => router.push("/"),
          },
        });
      },
      onError: (error: Error) => {
        toast.error(
          `Erro ao enviar serviço. Tente novamente. Causa: ${error.message}`,
          {
            action: {
              label: "Ok",
              onClick: () => {
                toast.dismiss();
              },
            },
          }
        );
      },
    });
  };

  if (!data) {
    return (
      <div>
        <div className="flex flex-col gap-20">
          <Skeleton className="w-[1340px] h-[40px]" />
          <Skeleton className="w-[1340px] h-[40px]" />
          <Skeleton className="w-[1340px] h-[40px]" />
        </div>
      </div>
    );
  }

  const participants = data.data.map((participant) => ({
    label: participant.name,
    value: participant.name,
  })) as Option[];

  return (
    <CreateTeamView
      options={participants}
      value={value}
      setValue={setValue}
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
};

export default CreateTeamController;
