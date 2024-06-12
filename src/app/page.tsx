import StepperForm from "@/components/stepper-form";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const Home = () => {
  const { userId } = auth();
  return (
    <div className="absolute -translate-y-[50%] -translate-x-[50%] top-1/2 left-1/2 w-[80%]">
      {userId ? (
        <StepperForm />
      ) : (
        <div className="flex flex-col gap-10 items-center justify-center">
          <h1>Faça login para ter acesso às funcionalidades de cadastro do sistema</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
