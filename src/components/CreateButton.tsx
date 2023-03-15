import React, {useState} from "react";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import "./CreateButton.css";
import {Checkbox} from "primereact/checkbox";
import {Axelote} from "@axelote/js";

interface Props {
    handleTableUpdate: (e: React.FormEvent) => void;
}

const CreateButton: React.FC<Props> = ({handleTableUpdate}) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);
    const [brand, setBrand] = useState<string>("");
    const [model, setModel] = useState<string>("");
    const [vin, setVin] = useState<string>("");
    const [engineCapacity, setEngineCapacity] = useState<string>("");
    const [isValidated, setIsValidated] = useState<boolean>(true);

    const handleAdd = async (e: React.FormEvent) => {

        e.preventDefault();

        if (model && brand && vin && engineCapacity) {
            const params: Record<string, string> = {
                model: model,
                brand: brand,
                vin: vin,
                engine_capacity: engineCapacity,
                is_available: checked ? "true" : "false"
            }

            const axelote = new Axelote({
                url: "http://localhost:8074"
            })

            let result = await axelote.void("@sql insert into car (brand, model, vin, engine_capacity, is_available) VALUES (:brand, :model, :vin, :engine_capacity, :is_available)", params);

            setVisible(false);
            setBrand("");
            setModel("");
            setVin("");
            setEngineCapacity("");
            setChecked(false);
            setIsValidated(true);
            handleTableUpdate(e);
        } else {
            setIsValidated(false);
        }

    }

    return (
        <div style={{marginTop: "1rem"}}>
            <Button label="Add" style={{left: "-20rem", marginRight: "1rem"}} icon="pi pi-plus"
                    onClick={() => setVisible(true)}/>
            <Dialog header="Add new car" visible={visible} style={{width: "50vw"}} onHide={() => setVisible(false)}>
                <form className="search" onSubmit={handleAdd} style={{display: "flex", flexDirection: "column"}}>
                    <label>Brand </label>
                    <InputText value={brand} className={brand ? "p-inputtext-sm" : "p-inputtext-sm p-invalid"}
                               style={{marginRight: "1rem", marginBottom: "1rem", width: "100%"}}
                               onChange={e => setBrand(e.target.value)}/>
                    <label>Model </label>
                    <InputText value={model} className={model ? "p-inputtext-sm" : "p-inputtext-sm p-invalid"}
                               style={{marginRight: "1rem", marginBottom: "1rem", width: "100%"}}
                               onChange={e => setModel(e.target.value)}/>
                    <label>VIN </label>
                    <InputText value={vin} className={vin ? "p-inputtext-sm" : "p-inputtext-sm p-invalid"}
                               style={{marginRight: "1rem", marginBottom: "1rem", width: "100%"}}
                               onChange={e => setVin(e.target.value)}/>
                    <label>Engine Capacity </label>
                    <InputText value={engineCapacity}
                               className={engineCapacity ? "p-inputtext-sm" : "p-inputtext-sm p-invalid"}
                               style={{marginRight: "1rem", marginBottom: "1rem", width: "100%"}}
                               onChange={e => setEngineCapacity(e.target.value)}/>
                    <div style={{float: "right", marginBottom: "1rem"}}>
                        <Checkbox onChange={(e) => {
                            setChecked(!checked)
                        }} checked={checked}/>
                        <label> Available</label>
                    </div>
                    {isValidated ? "" : <label style={{color: "red", marginBottom: "1rem"}}>Complete all fields</label>}
                    <Button icon="pi pi-plus" style={{width: "100%"}} className="input__submit" type="submit" raised/>
                </form>
            </Dialog>
        </div>
    );
};

export default CreateButton;

