import { Select } from "@chakra-ui/react";
import type { ZZConfigName } from "src/lib/types"
import { METHOD_SOLVERS } from "src/lib";


interface SelectEOStepProps {
  eoStep: ZZConfigName
  setEOStep: (step: ZZConfigName) => void
}

export default function SelectEOStepDropdown({ eoStep, setEOStep }: SelectEOStepProps) {
  return (
    <Select
      value={eoStep}
      onChange={e => setEOStep(e.target.value as ZZConfigName)}
      variant="filled"
      width="8rem"
    >
      {METHOD_SOLVERS.ZZ.map(step => <option value={step}>{step}</option>)}
    </Select>
  )
}

