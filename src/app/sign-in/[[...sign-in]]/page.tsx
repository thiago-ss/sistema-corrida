import Header from "@/components/header";
import { SignIn } from "@clerk/nextjs"

const Page = () => {
  return (
    <div className="flex items-center justify-center">
      <SignIn />
    </div>
  )
}

export default Page;