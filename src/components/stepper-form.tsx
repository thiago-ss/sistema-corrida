"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { Step, Stepper, useStepper } from "@/components/stepper";
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
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { useFetchTeams, useUpdateTeamRace } from "@/lib/requests";
import { Race } from "@/lib/types";
import { toast } from "sonner";

const steps = [
  { label: "Modalidade", description: "Selecione a modalidade" },
  { label: "Equipe", description: "Selecione a equipe" },
  { label: "Dado", description: "Informe o dado da prova" },
];

const FirstFormSchema = z.object({
  race: z.object({
    race_id: z.string(),
    race_name: z.string(),
  }),
});

const SecondFormSchema = z.object({
  team: z.object({
    team_id: z.string(),
    team_name: z.string(),
  }),
});

const ThirdFormSchema = z.object({
  data: z.number(),
});

export default function StepperForm() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper variant="circle-alt" initialStep={0} steps={steps}>
        {steps.map((stepProps, index) => (
          <Step key={stepProps.label} {...stepProps}>
            {index === 0 && <FirstStepForm />}
            {index === 1 && <SecondStepForm />}
            {index === 2 && <ThirdStepForm />}
          </Step>
        ))}
        <MyStepperFooter />
      </Stepper>
    </div>
  );
}

function FirstStepForm() {
  const { nextStep } = useStepper();

  const form = useForm({
    resolver: zodResolver(FirstFormSchema),
  });

  const races = [
    { label: "Rampa em 45°", value: "Rampa em 45°" },
    {
      label: "Velocidade máxima em pista reta",
      value: "Velocidade máxima em pista reta",
    },
    {
      label: "Tração com retenção de peso",
      value: "Tração com retenção de peso",
    },
  ];

  function onSubmit(data: z.infer<typeof FirstFormSchema>) {
    localStorage.setItem("modalidade", data.race.race_id);
    nextStep();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="race"
          render={({ field }) => (
            <FormItem className="mx-[300px]">
              <FormLabel>Modalidades</FormLabel>
              <FormControl>
                <AutoComplete
                  options={races}
                  emptyMessage="Modalidade não encontrada."
                  onValueChange={(value) =>
                    form.setValue("race", {
                      race_id: value.value,
                      race_name: value.label,
                    })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  );
}

function SecondStepForm() {
  const { nextStep } = useStepper();

  const form = useForm({
    resolver: zodResolver(SecondFormSchema),
  });

  const { data } = useFetchTeams();
  const teams =
    data && data.data ? data.data.map((team) => ({
      label: team.name,
      value: team.id,
    })) : [];

  function onSubmit(data: z.infer<typeof SecondFormSchema>) {
    localStorage.setItem("equipe", data.team.team_id);
    nextStep();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className="space-y-6">
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem className="mx-[300px]">
              <FormLabel>Equipes</FormLabel>
              <FormControl>
                <AutoComplete
                  options={teams}
                  emptyMessage="Não existem equipes cadastradas."
                  onValueChange={(value) =>
                    form.setValue("team", {
                      team_id: value.value,
                      team_name: value.label,
                    })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  );
}

function ThirdStepForm() {
  const { resetSteps } = useStepper();

  const form = useForm({
    resolver: zodResolver(ThirdFormSchema),
  });

  const mutation = useUpdateTeamRace(localStorage.getItem("equipe") as string);

  function onSubmit(data: z.infer<typeof ThirdFormSchema>) {
    const raceData = {
      name: localStorage.getItem("modalidade"),
      data: data.data,
    } as Race;

    mutation.mutate(raceData, {
      onSuccess: () => {
        toast.success("Dado registrado!", {
          action: {
            label: "Ok",
            onClick: () => toast.dismiss(),
          },
        });
        resetSteps();
      },
      onError: (error) => {
        toast.error(`Erro ao registrar dado. Causa: ${error.message}`, {
          action: {
            label: "Ok",
            onClick: () => toast.dismiss(),
          },
        });
      },
    });
  }

  const modalidade = localStorage.getItem("modalidade");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className="space-y-6">
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem className="mx-[300px]">
              <FormLabel>{getFormLabel(modalidade)}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder={getPlaceholder(modalidade)}
                  onChange={(e) =>
                    form.setValue("data", parseInputValue(e, modalidade))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  );
}

function getFormLabel(modalidade: string | null) {
  switch (modalidade) {
    case "Rampa em 45°":
      return "Distância";
    case "Velocidade máxima em pista reta":
      return "Tempo";
    default:
      return "Peso";
  }
}

function getPlaceholder(modalidade: string | null) {
  switch (modalidade) {
    case "Rampa em 45°":
      return "Distância em centímetros";
    case "Velocidade máxima em pista reta":
      return "Tempo em segundos";
    default:
      return "Peso em gramas";
  }
}

function parseInputValue(e: any, modalidade: string | null) {
  if (e && e.target) {
    if (modalidade === "Velocidade máxima em pista reta") {
      return parseFloat(e.target.value);
    } else {
      return parseInt(e.target.value);
    }
  }
  return null;
}

function StepperFormActions() {
  const { prevStep, isDisabledStep, isLastStep } = useStepper();

  return (
    <div className="w-full flex justify-end gap-2">
      <Button
        disabled={isDisabledStep}
        onClick={prevStep}
        size="sm"
        variant="secondary"
        type="button"
      >
        Anterior
      </Button>
      <Button size="sm" type="submit">
        {isLastStep ? "Cadastrar" : "Próximo"}
      </Button>
    </div>
  );
}

function MyStepperFooter() {
  const { activeStep, resetSteps, steps } = useStepper();

  if (activeStep !== steps.length) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button onClick={resetSteps}>Recomeçar</Button>
    </div>
  );
}
