/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Dispatch, ReactNode, SetStateAction } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useStepContext } from '.';


export type StepContextType = StepState | undefined;

export interface StepState {
  formState: object;
  setFormState: Dispatch<SetStateAction<object>>;
  numSteps: number | undefined;
  setNumSteps: Dispatch<SetStateAction<number | undefined>>;
  currentStep: number;
  handleGoToStep: (a: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

const bc = `c4p--step-actions`;

export interface StepActionsProps {
  buttonRenderer: (stepData: StepState) => ReactNode;
  className?: string;
}

export const StepActions = ({
  buttonRenderer,
  className,
}: StepActionsProps) => {
  const data = useStepContext();
  return (
    <div className={cx(`${bc}__button-container`, className)}>
      {buttonRenderer(data)}
    </div>
  );
};

StepActions.displayName = 'StepActions';

StepActions.propTypes = {
  buttonRenderer: PropTypes.func,
  className: PropTypes.string,
};
