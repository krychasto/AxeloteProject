import React, {useEffect, useState} from "react";
import {Sidebar} from "primereact/sidebar";
import {Button} from "primereact/button";
import {Calendar, CalendarChangeEvent} from "primereact/calendar";
import {InputNumber} from "primereact/inputnumber";

interface Props {

}

const CarCalendar: React.FC<Props> = () => {

    const [visible, setVisible] = useState<boolean>(false);
    const [dates, setDates] = useState<Date | Date[] | string | null>();
    const [price, setPrice] = useState<number>(0);

    const onDataChange = (e: Date[]) => {
        if (e[1] === null) {
            setPrice(20); // todo change to car per day price
        } else if (e[0] !== null) {
            let totalCost = (e[1].getDate()-e[0].getDate() + 1) * 20; // todo change to car per day price
            setPrice(totalCost);
        }
    }

    return (
        <div>
            <Button icon="pi pi-arrow-left" onClick={() => setVisible(true)}/>
            <Sidebar visible={visible} position="right" onHide={() => {
                setVisible(false);
                setDates(null);
                setPrice(0);
            }}>
                <h2>Rent a car</h2>
                <p>
                    <label>Date</label>
                    <Calendar value={dates} onChange={(e: CalendarChangeEvent) => {
                        setDates(e.value);
                        onDataChange(e.value as Date[]);
                    }} selectionMode="range" readOnlyInput showButtonBar style={{marginLeft: "1rem"}}/>
                </p>
                <p>
                    <label>Price</label>
                    <InputNumber inputId="currency-us" value={price} readOnly mode="currency"
                                 currency="USD" locale="en-US" style={{marginLeft: "0.9rem"}}/>
                </p>
                <p>
                    <Button label="Rent" style={{width:"100%"}}/>
                </p>
            </Sidebar>
        </div>
    )
};

export default CarCalendar;