import React, {useState} from "react";
import "./App.css";
import {Axelote, AxeloteError, AxeloteQueryBuilder} from "@axelote/js";
import SearchField from "./components/SearchField";
import {Car} from "./models/car";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Tag} from "primereact/tag";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import CreateButton from "./components/CreateButton";
import DeleteButton from "./components/DeleteButton";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Checkbox} from "primereact/checkbox";
import {Dialog} from "primereact/dialog";
import {Image as ImagePrime} from 'primereact/image';
import CarCalendar from "./components/CarCalendar";
import {InputNumber} from "primereact/inputnumber";
import {FileUpload} from "primereact/fileupload";

const App: React.FC = () => {

    const [phrase, setPhrase] = useState<string>("");
    const [cars, setCars] = useState<Car[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedCars, setSelectedCars] = useState<Car[] | undefined>(undefined);
    const [visibleEdit, setVisibleEdit] = useState<boolean>(false);

    const [brand, setBrand] = useState<string>("");
    const [model, setModel] = useState<string>("");
    const [vin, setVin] = useState<string>("");
    const [engineCapacity, setEngineCapacity] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [isValidated, setIsValidated] = useState<boolean>(true);
    const [carId, setCarId] = useState<number>(-1);

    const handleTableUpdate = async (e: React.FormEvent) => {
        const axelote = new Axelote({
            url: "http://localhost:8074"
        })

        let result = await axelote.returning("@sql select * from car order by brand");

        if (result instanceof Array) {
            setCars(result)
        } else if (result instanceof AxeloteError) {
            setErrorMessage(result.getMessage());
        } else {
            setErrorMessage("Something went wrong");
        }
    }

    const handleSearch = async (e: React.FormEvent) => {

        const params: Record<string, string> = {
            search: "%" + phrase + "%"
        }

        e.preventDefault();

        const axelote = new Axelote({
            url: "http://localhost:8074",
        })

        let result = await axelote.returning("@sql select * from car where upper(brand) like upper(:search) or upper(model) like upper(:search) or upper(vin) like upper(:search) or upper(engine_capacity) like upper(:search) order by brand", params);
        if (result instanceof Array) {
            setCars(result)
        } else if (result instanceof AxeloteError) {
            setErrorMessage(result.getMessage());
        } else {
            setErrorMessage("Something went wrong");
        }
    };

    const handleEditButton = async (e: React.FormEvent) => {

        e.preventDefault();

        if (model && brand && vin && engineCapacity && price) {
            const params: Record<string, any> = {
                car_id: carId,
                model: model,
                brand: brand,
                vin: vin,
                engine_capacity: engineCapacity,
                is_available: isAvailable ? "true" : "false",
                price: price
            }

            const axelote = new Axelote({
                url: "http://localhost:8074"
            })

            let query = AxeloteQueryBuilder.of("@sql update car set brand = :brand, model = :model, vin = :vin, engine_capacity = :engine_capacity, is_available = :is_available, price = :price")
                .append("@sql where id = :car_id")
                .build();

            let result = await axelote.void(query, params);

            if (result instanceof AxeloteError) {
                setErrorMessage(result.getMessage());
            }

            await handleTableUpdate(e);
            setVisibleEdit(false);
            setIsValidated(true);
        } else {
            setIsValidated(false);
        }
    }

    const statusBodyTemplate = (car: Car) => {
        let available = car.isAvailable === "true";
        return <Tag value={available ? "Available" : "Not available"}
                    severity={available ? "success" : "danger"}></Tag>;
    };

    const imageBodyTemplate = (car: Car) => {
        if (car.image !== null) {
            const img = new Image();
            img.src = `data:image/jpg;base64,${car.image}`;
            return <ImagePrime src={img.src} alt={car.brand + '_' + car.model} width="100" preview
                               className="w-6rem shadow-2 border-round"/>;
        } else {
            return ""
        }

    };

    const editButtonTemplate = (car: Car) => {
        return (
            <div>
                <Button icon="pi pi-pencil" rounded outlined
                        style={{width: "2.5rem", height: "2.5rem", marginRight: "0.4rem"}}
                        onClick={() => {
                            setModel(car.model);
                            setBrand(car.brand);
                            setVin(car.vin);
                            setEngineCapacity(car.engineCapacity);
                            setIsAvailable(car.isAvailable === 'true');
                            setVisibleEdit(true);
                            setCarId(car.id);
                            setPrice(car.price);
                        }}/>
            </div>
        )
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    };

    const priceBodyTemplate = (car: Car) => {
        if (car.price !== null) {
            return formatCurrency(car.price);
        } else {
            return ""
        }
    };

    return (
        <div className="App">
            <span className="heading">Car Rental</span>
            <SearchField phrase={phrase} setPhrase={setPhrase} handleSearch={handleSearch}/>
            <div style={{width: "auto"}}>
                <DataTable value={cars} stripedRows scrollable scrollHeight="375px"
                           selectionMode={"multiple"}
                           selection={selectedCars}
                           metaKeySelection={false}
                           onSelectionChange={(e) => setSelectedCars(e.value as Car[])}
                           style={{color: "white", marginTop: "2rem"}}
                           tableStyle={{
                               width: "auto",
                               minWidth: "55rem",
                               backgroundColor: "inherit",
                               borderSpacing: "0px"
                           }} sortField="brand">
                    {/*<Column selectionMode="multiple" headerStyle={{width: "auto"}}></Column>*/}
                    <Column field="brand" header="Brand" style={{width: "auto"}}></Column>
                    <Column field="model" header="Model" style={{width: "auto"}}></Column>
                    <Column header="Image" body={imageBodyTemplate} style={{width: "auto"}}></Column>
                    <Column field="vin" header="VIN" style={{width: "auto"}}></Column>
                    <Column field="engineCapacity" header="Engine Capacity" style={{width: "5rem"}}></Column>
                    <Column field="price" header="Price per day" body={priceBodyTemplate}
                            style={{width: "6rem"}}></Column>
                    <Column field="isAvailable" header="Status" body={statusBodyTemplate}
                            style={{width: "auto"}}></Column>
                    <Column body={editButtonTemplate} style={{width: "3rem", padding: "16px 0px"}}></Column>
                    <Column body={CarCalendar} style={{width: "3rem", padding: "16px 0px"}}></Column>
                </DataTable>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <CreateButton handleTableUpdate={handleTableUpdate}/>
                <DeleteButton selectedCars={selectedCars} handleTableUpdate={handleTableUpdate}/>
            </div>
            <Dialog header="Edit car" visible={visibleEdit} style={{width: "50vw"}}
                    onHide={() => setVisibleEdit(false)}>
                <form className="search" onSubmit={handleEditButton}
                      style={{display: "flex", flexDirection: "column"}}>
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
                    <label>Price </label>
                    <InputNumber inputId="currency-us" value={price} mode="currency"
                                 className={price ? "p-inputtext-sm" : "p-inputtext-sm p-invalid"}
                                 currency="USD" locale="en-US"
                                 style={{marginRight: "1rem", marginBottom: "1rem", width: "100%"}}
                                 onChange={e => e.value !== null ? setPrice(e.value) : ''}/>
                    <div style={{float: "right", marginBottom: "1rem"}}>
                        <Checkbox onChange={(e) => {
                            setIsAvailable(!isAvailable)
                        }} checked={isAvailable}/>
                        <label> Available</label>
                    </div>
                    <div className="card flex justify-content-center">
                        <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*"
                                    maxFileSize={1000000}/>
                    </div>
                    {isValidated ? "" :
                        <label style={{color: "red", marginBottom: "1rem"}}>Complete all fields</label>}
                    <Button icon="pi pi-pencil" style={{width: "100%"}} className="input__submit" type="submit"
                            raised/>
                </form>
            </Dialog>
        </div>
    );
};

export default App;
