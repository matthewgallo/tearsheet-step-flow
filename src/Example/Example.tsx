import { useEffect, useRef, useState } from 'react';
import { CodeSnippet, TextInput, ProgressIndicator, ProgressStep, Button, TileGroup, RadioTile } from '@carbon/react';
import { StepActions, StepGroup, useStepContext } from './StepFlow';
import './App.scss'
import { StepTearsheet } from './StepTearsheet';
import { StepState } from './StepFlow/StepActions';

const introExample = true;

const useStepFocus = (stepPrimaryFocus: string) => {
  useEffect(() => {
    const stepFocusElement = document?.querySelector(stepPrimaryFocus) as HTMLElement;
    stepFocusElement?.focus();
  }, [stepPrimaryFocus]);
};

function Step1() {
  const { setFormState, formState } = useStepContext();
  const { email } = formState || {};
  return (
    <div className="step-container">
      <h4>Step 1</h4>
      <TextInput
        id="email"
        onChange={(e) => {
          setFormState((prev: object) => ({
            ...prev,
            email: e.target.value,
          }));
        }}
        labelText="Email"
        value={email ?? ''}
      />
    </div>
  );
}

function Step2() {
  const { setFormState, formState } = useStepContext();
  const { city, state } = formState || {};
  useStepFocus('#city');
  return (
    <div className="step-container">
      <h4>Step 2</h4>
      <div className="step-form-items">
        <TextInput
          id="city"
          onChange={(e) => {
            setFormState((prev: object) => ({
              ...prev,
              city: e.target.value,
            }));
          }}
          labelText="City"
          value={city ?? ''}
        />
        <TextInput
          id="state"
          onChange={(e) => {
            setFormState((prev: object) => ({
              ...prev,
              state: e.target.value,
            }));
          }}
          labelText="State"
          value={state ?? ''}
        />
      </div>
    </div>
  );
}

function Step3() {
  // Example showing how to get step state via hook
  const { formState } = useStepContext();
  return (
    <div className="step-container">
      <h4>Step 3</h4>
      <div>
        Form state
        <CodeSnippet type="multi">{JSON.stringify(formState)}</CodeSnippet>
      </div>
    </div>
  );
}

const buildCustomInfluencer = (
  { currentStep, handleGoToStep }: StepState,
  includeIntro: boolean,
  showIntro: boolean,
  selectedFlow: string
) => {
  if (showIntro) {
    return null;
  }
  return (
    <div className="tearsheet-stories__dummy-content-block">
      {includeIntro && (
        <h6 className="selected-intro-option">{selectedFlow}</h6>
      )}
      <ProgressIndicator
        vertical
        onChange={(stepIndex) => handleGoToStep(stepIndex + 1)}
      >
        <ProgressStep
          complete={currentStep > 1}
          current={currentStep === 1}
          label="Step 1"
          secondaryLabel="Optional label"
        />
        <ProgressStep
          complete={currentStep > 2}
          current={currentStep === 2}
          label="Step 2"
        />
        <ProgressStep
          current={currentStep === 3}
          label="Step 3"
          complete={currentStep > 3}
        />
        {includeIntro && selectedFlow === 'plus' && (
          <ProgressStep current={currentStep === 4} label="Plus only step" />
        )}
      </ProgressIndicator>
    </div>
  );
};

const PlusOnly = () => <>This step only renders for plus flows.</>;

export const Example = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState('standard');

  const handleNextDisabledState = (formState: {
    email?: string,
    city?: string,
    state?: string,
  }, currentStep: number) => {
    if (showIntro) {
      return false;
    }
    if (!formState?.email && currentStep === 1) {
      return true;
    }
    if ((!formState?.city || !formState?.state) && currentStep === 2) {
      return true;
    }
    return false;
  };

  const handleBackDisabledState = (currentStep: number) => {
    if (showIntro) {
      return true;
    }
    if (currentStep === 1 && !introExample) {
      return true;
    }
    return false;
  };

  return (
    <div ref={ref}>
      <Button onClick={() => setOpen(true)}>
        {open ? 'Close' : 'Open'}
      </Button>
      <StepTearsheet
        influencer={
          !showIntro
            ? (state: StepState) =>
                buildCustomInfluencer(
                  state,
                  introExample,
                  showIntro,
                  selectedFlow
                )
            : null
        }
        open={open}
        onClose={() => setOpen(false)}
        title={'Tearsheet title'}
        hasCloseIcon={false}
        selectorPrimaryFocus="#email"
      >
        {showIntro && (
          <TileGroup
            valueSelected={selectedFlow}
            defaultSelected="standard"
            legend="Options"
            name="radio tile group"
            onChange={(a) => setSelectedFlow(a)}
          >
            <RadioTile
              className="custom-intro-tile"
              id="radio-tile-1"
              value="standard"
            >
              Standard
            </RadioTile>
            <RadioTile
              className="custom-intro-tile"
              id="radio-tile-2"
              value="premium"
            >
              Premium
            </RadioTile>
            <RadioTile
              className="custom-intro-tile"
              id="radio-tile-3"
              value="plus"
            >
              Plus
            </RadioTile>
          </TileGroup>
        )}
        {/* Steps */}
        {!showIntro && (
          <StepGroup>
            <Step1 />
            <Step2 />
            <Step3 />
            {introExample && selectedFlow === 'plus' && <PlusOnly />}
          </StepGroup>
        )}

        {/* Step actions */}
        <StepActions
          className={'my-custom-action-set'}
          buttonRenderer={({
            currentStep,
            handleNext,
            numSteps,
            handleGoToStep,
            setFormState,
            handlePrevious,
            formState,
          }) => (
            <>
              <Button
                className="step-action-button step-action-button__cancel"
                kind="ghost"
                onClick={() => {
                  setOpen(false);
                  if (introExample) {
                    setShowIntro(true);
                  }
                }}
                size="xl"
              >
                Cancel
              </Button>
              <Button
                className="step-action-button"
                kind="secondary"
                onClick={() => {
                  if (currentStep === 1 && introExample) {
                    setShowIntro(true);
                    return;
                  }
                  handlePrevious();
                }}
                disabled={handleBackDisabledState(currentStep)}
                size="xl"
              >
                Back
              </Button>
              <Button
                disabled={handleNextDisabledState(formState, currentStep)}
                size="xl"
                className="step-action-button"
                onClick={() => {
                  if (showIntro) {
                    setShowIntro(false);
                    return;
                  }
                  if (currentStep === numSteps) {
                    // submit
                    setOpen(false);
                    handleGoToStep(1);
                    setFormState({});
                    if (introExample) {
                      setShowIntro(true);
                    }
                  } else {
                    handleNext();
                  }
                }}
              >
                {currentStep === numSteps ? 'Submit' : 'Next'}
              </Button>
            </>
          )}
        />
      </StepTearsheet>
    </div>
  );
}
