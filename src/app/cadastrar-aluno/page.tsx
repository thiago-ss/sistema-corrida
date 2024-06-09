"use client"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { usePostParticipant } from "@/lib/requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createParticipantSchema = z.object({
  name: z.string(),
  grade: z.number(),
});

const CadastrarAluno = () => {
  const form = useForm<z.infer<typeof createParticipantSchema>>({
    resolver: zodResolver(createParticipantSchema),
    defaultValues: {
      name: "",
      grade: 0,
    },
  });

  const router = useRouter();

  const mutation = usePostParticipant();

  const onSubmit = (data: z.infer<typeof createParticipantSchema>) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
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
    <div className="absolute -translate-y-[50%] -translate-x-[50%] top-1/2 left-1/2 w-[80%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do aluno</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-10" type="submit">
            Cadastrar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CadastrarAluno;
