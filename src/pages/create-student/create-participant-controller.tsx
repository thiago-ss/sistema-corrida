"use client";

import { useForm } from "react-hook-form";
import CreateParticipantView, {
  createParticipantSchema,
} from "./create-participant.view";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostParticipant } from "@/lib/requests";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const CreateParticipantController = () => {
  const form = useForm<z.infer<typeof createParticipantSchema>>({
    resolver: zodResolver(createParticipantSchema),
    defaultValues: {
      name: "",
      grade: 0,
    },
  });

  const router = useRouter();

  const mutation = usePostParticipant();
  const queryClient = useQueryClient();

  const onSubmit = (data: z.infer<typeof createParticipantSchema>) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["participants"] });
        toast.success("Aluno cadastrado com sucesso!", {
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

  return (
    <div>
      <CreateParticipantView
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default CreateParticipantController;
