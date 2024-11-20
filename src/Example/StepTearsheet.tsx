import { Tearsheet } from '@carbon/ibm-products';
import { ReactNode, useState } from 'react';
import { StepContext } from './StepFlow';
import { StepContextType, StepState } from './StepFlow/StepActions';

interface Props {
  children?: ReactNode
  influencer?: ReactNode | ((a: StepState) => ReactNode) | null;
  open?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  hasCloseIcon?: boolean;
  closeIconDescription?: string;
  selectorPrimaryFocus?: string;
}

export const StepTearsheet = ({influencer, children, open, onClose, title, hasCloseIcon, closeIconDescription = 'Close', selectorPrimaryFocus, ...rest}: Props) => {
  const [numSteps, setNumSteps] = useState<number>();
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState({});

  const context: StepContextType = {
    formState,
    setFormState,
    numSteps,
    setNumSteps,
    currentStep,
    handleGoToStep: (step) => setCurrentStep(step),
    handleNext: () => setCurrentStep((step) => step + 1),
    handlePrevious: () => setCurrentStep((step) => step - 1),
  };

  // @ts-expect-error need to fix this
  const influencerContent = influencer?.(context) || null;

  return (
    <StepContext.Provider value={context}>
      <Tearsheet {...rest} influencer={influencerContent} open={open} onClose={onClose} title={title} hasCloseIcon={hasCloseIcon} closeIconDescription={closeIconDescription} selectorPrimaryFocus={selectorPrimaryFocus}>
        {children}
      </Tearsheet>
    </StepContext.Provider>
  )
}