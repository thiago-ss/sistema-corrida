import * as React from "react";
import { HorizontalStep } from "./horizontal-step";
import type { StepProps } from "./types";
import { useStepper } from "./use-stepper";

interface StepInternalConfig {
  index: number;
  isCompletedStep?: boolean;
  isCurrentStep?: boolean;
  isLastStep?: boolean;
}

interface FullStepProps extends StepProps, StepInternalConfig {}

const Step = React.forwardRef<HTMLLIElement, StepProps>(
  (props, ref: React.Ref<any>) => {
    const {
      description,
      icon,
      state,
      checkIcon,
      errorIcon,
      index,
      isCompletedStep,
      isCurrentStep,
      isLastStep,
      isKeepError,
      label,
      onClickStep,
    } = props as FullStepProps;

    const { isError, isLoading, clickable } = useStepper();

    const hasVisited = isCurrentStep || isCompletedStep;

    const sharedProps = {
      isLastStep,
      isCompletedStep,
      isCurrentStep,
      index,
      isError,
      isLoading,
      clickable,
      label,
      description,
      hasVisited,
      icon,
      isKeepError,
      checkIcon,
      state,
      errorIcon,
      onClickStep,
    };

    const renderStep = () => {
      return <HorizontalStep ref={ref} {...sharedProps} />;
    };

    return renderStep();
  }
);

Step.displayName = "Step";

export { Step };
