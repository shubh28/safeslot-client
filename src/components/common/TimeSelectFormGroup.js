import React, { Component } from 'react'
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
export default class TimeSelectFormGroup extends Component {

  createHours = type => {
    const options = [];
    const { shop_open_hours, shop_close_hours } = this.props;
    if (type === 'start') {
      const endTime = shop_close_hours !== 0 ? parseInt(shop_close_hours) : 23;
      for (let i = 0; i <= endTime; i++) {
        options.push(i);
      }
    } else {
      const startTime = shop_open_hours !== 0 ? parseInt(shop_open_hours) : 0;
      console.log(startTime, 'startTime')
      for (let i = startTime; i <= 23; i++) {
        options.push(i);
      }
    }
    return options;
  };

  createMinutes = type => {
    const options = [];
    const { shop_close_minutes, shop_open_minutes } = this.props;
    for (let i = 0; i <= 45; i += 15) {
      options.push(i);
    }
    return options;
  };

  render() {
    const {
      shop_open_hours,
      shop_open_minutes,
      onOpenHoursChanged,
      onOpenMinsChanged,

      shop_close_hours,
      shop_close_minutes,
      onCloseHoursChanged,
      onCloseMinsChanged
    } = this.props;

    return (
      <div>
        <TimeSelect
          label="Shop Opening Time"
          hours={shop_open_hours}
          minutes={shop_open_minutes}
          onHoursChanged={onOpenHoursChanged}
          onMinutesChanged={onOpenMinsChanged}
          hoursList={this.createHours("start")}
          minutesList={this.createMinutes("start")}
        />
        <TimeSelect
          label="Shop Closing Time"
          hours={shop_close_hours}
          minutes={shop_close_minutes}
          onHoursChanged={onCloseHoursChanged}
          onMinutesChanged={onCloseMinsChanged}
          hoursList={this.createHours("end")}
          minutesList={this.createMinutes("end")}
        />
      </div>
    )
  }
}

function TimeSelect({
  label,
  hours,
  minutes,
  onHoursChanged,
  onMinutesChanged,
  hoursList,
  minutesList,
}) {
  return (
    <FormGroup
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Label style={{ width: '50%' }}>{label}</Label>
      <Input
        type="select"
        style={{ width: '20%' }}
        value={hours}
        onChange={(e) => { onHoursChanged(e.target.value) }}
      >
        {hoursList.map((item) => {
          return <option key={item} value={item}>
            {item.toString().padStart(2, '0')}
          </option>
        })}
      </Input>
        &nbsp;:&nbsp;
      <Input
        type="select"
        style={{ width: '20%' }}
        value={minutes}
        onChange={(e) => { onMinutesChanged(e.target.value) }}
      >
        {minutesList.map((item) => {
          return <option key={item} value={item}>
            {item.toString().padStart(2, '0')}
          </option>
        })}
      </Input>
    </FormGroup>
  )
}

