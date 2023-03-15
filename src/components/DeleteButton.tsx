import {Car} from "../models/car";
import {Button} from "primereact/button";
import React from "react";
import {Axelote, AxeloteVoidResponse} from "@axelote/js";

interface Props {
    selectedCars: Car[] | undefined;
    handleTableUpdate: (e: React.FormEvent) => void;
}

const DeleteButton: React.FC<Props> = ({selectedCars, handleTableUpdate}) => {

    const handleDelete = (e: React.FormEvent) => {

        e.preventDefault();

        if (selectedCars !== undefined) {
            selectedCars.forEach(async (car) => {

                const params: Record<string, number> = {
                    id: car.id,
                }

                const axelote = new Axelote({
                    url: "http://localhost:8074"
                })

                const result: AxeloteVoidResponse = await axelote.void("@sql delete from car where id = :id", params);
            })
        }
        handleTableUpdate(e);
    }

    return (
        <div style={{marginTop: "1rem"}}>
            <form onSubmit={handleDelete}>
                <Button label="Delete" style={{left: "-20.5rem"}} icon="pi pi-trash"/>
            </form>
        </div>
    )
}

export default DeleteButton;