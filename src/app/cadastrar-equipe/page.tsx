"use client";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostTeam, useFetchParticipants } from "@/lib/requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Option } from "@/components/ui/autocomplete";
import { v4 as uuidv4 } from "uuid";

const createTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  car_number: z.number(),
  participants: z
    .array(
      z.object({
        name: z.string(),
        grade: z.number().optional(),
      })
    )
    .optional(),
  races: z
    .array(
      z.object({
        team_id: z.string(),
        name: z.string(),
        data: z.number().optional(),
      })
    )
    .optional(),
});

const CadastrarEquipe = () => {
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
  const [value, setValue] = useState<any[]>([]);  

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
      <div className="absolute -translate-y-[50%] -translate-x-[50%] top-1/2 left-1/2 w-[80%]">
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
    <div className="absolute -translate-y-[50%] -translate-x-[50%] top-1/2 left-1/2 w-[80%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da equipe</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="car_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do carro</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...form.register("car_number", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alunos</FormLabel>
                <FormControl>
                  <MultipleSelector
                    value={value}
                    onChange={(value) => setValue(value)}
                    defaultOptions={participants}
                    placeholder="Selecione os alunos"
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        Nenhum aluno encontrado
                      </p>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Cadastrar</Button>
        </form>
      </Form>
    </div>
  );
};

export default CadastrarEquipe;
