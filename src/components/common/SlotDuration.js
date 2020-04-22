import React from 'react'
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';

export default function SlotDuration({onDurationChange, slotDuration}) {
  return (
    <div>
      <FormGroup>
        <Label>Duration of each slot</Label>
        <Input
          type="select"
          value={slotDuration}
          onChange={(e)=> onDurationChange(e.target.value)}
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
        </Input>
      </FormGroup>
    </div>
  )
}
