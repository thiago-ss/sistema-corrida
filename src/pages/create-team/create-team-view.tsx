import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiple-selector";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Option } from "@/components/ui/multiple-selector";

export const createTeamSchema = z.object({
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

type CreateTeamViewProps = {
  form: UseFormReturn<z.infer<typeof createTeamSchema>>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  options: Option[];
  value: any;
  setValue: any;
};

const CreateTeamView = ({
  form,
  onSubmit,
  options,
  value,
  setValue,
}: CreateTeamViewProps) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
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
                  defaultOptions={options}
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
  );
};

export default CreateTeamView;
