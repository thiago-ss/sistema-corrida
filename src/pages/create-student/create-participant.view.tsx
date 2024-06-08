import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const createParticipantSchema = z.object({
  name: z.string(),
  grade: z.number(),
});

type CreateParticipantViewProps = {
  form: UseFormReturn<z.infer<typeof createParticipantSchema>>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

const CreateParticipantView = ({ form, onSubmit }: CreateParticipantViewProps) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
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
        <Button className="mt-10" type="submit">Cadastrar</Button>
      </form>
    </Form>
  );
};

export default CreateParticipantView;
