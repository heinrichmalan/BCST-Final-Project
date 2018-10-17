import React from "react";
import { Link } from "react-router-dom";
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

class GoalTemplate extends React.Component {
    
    render() {
        return (
            <div>
                <p>Create a goal using the goal template</p>
                <form>
                    <FormGroup controlId="goalStart">
                        <ControlLabel>Goal Start*</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Start date ..."
                        />
                    </FormGroup>
                    <FormGroup controlId="goalEnd">
                        <ControlLabel>Goal End*</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="End date ..."
                        />
                    </FormGroup>
                    <FormGroup controlId="goalStatement">
                        <ControlLabel>Goal Activity*</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="To ..."
                        />
                    </FormGroup>

                    <FormGroup controlId="goalMeasurement">
                        <ControlLabel>Goal Measurement</ControlLabel>
                        <FormControl componentClass="select" placeholder="select">
                            <option value="none">-</option>
                            <option value="select">at least</option>
                            <option value="other">in under</option>
                        </FormControl>
                    </FormGroup>

                    <FormGroup controlId="goalMeasurement2">
                        <FormControl
                            type="text"
                            placeholder="Enter value here"
                        />
                    </FormGroup>

                    <FormGroup controlId="goalMeasurement3">
                        <FormControl componentClass="select" placeholder="select">
                            <option value="none">-</option>
                            <option value="times">time(s)</option>
                            <option value="steps">step(s)</option>
                            <option value="ms">metre(s)</option>
                            <option value="kms">kilometre(s)</option>
                            <option value="secs">second(s)</option>
                            <option value="pts">point(s)</option>
                        </FormControl>
                    </FormGroup>

                    <FormGroup controlId="goalFrequency">
                        <ControlLabel>Goal Frequency</ControlLabel>
                        <FormControl componentClass="select" placeholder="select">
                            <option value="none">-</option>
                            <option value="select">at least</option>
                        </FormControl>
                    </FormGroup>

                    <FormGroup controlId="goalFrequency2">
                        <FormControl
                            type="text"
                            placeholder="Enter value here"
                        />
                    </FormGroup>

                    <FormGroup controlId="goalFrequency3">
                        <FormControl componentClass="select" placeholder="select">
                            <option value="none">-</option>
                            <option value="times">time(s)</option>
                            <option value="days">day(s)</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="goalFrequency4">
                        <p>per</p>
                        <FormControl componentClass="select" placeholder="select">
                            <option value="none">-</option>
                            <option value="day">day</option>
                            <option value="week">week</option>
                            <option value="month">month</option>
                        </FormControl>
                    </FormGroup>
                </form>
            </div>
        )
    }
}

export default GoalTemplate;