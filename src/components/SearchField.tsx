import React from "react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import "./SearchField.css";

interface Props {
    phrase: string;
    setPhrase: React.Dispatch<React.SetStateAction<string>>;
    handleSearch: (e: React.FormEvent) => void;
}

const SearchField: React.FC<Props> = ({phrase, setPhrase, handleSearch}) => {
    return (
        <form className="search" onSubmit={handleSearch}>
            <InputText type="input"
                       placeholder="Enter a brand, model, vin, engine capacity"
                       value={phrase}
                       style={{width: "49rem", marginRight: "1rem", background: "inherit", color: "white", borderColor:"inherit"}}
                       onChange={(e) => setPhrase(e.target.value)}/>
            <Button icon="pi pi-search" className="input__submit" type="submit" rounded raised style={{backgroundColor:"inherit", borderColor:"black", borderRadius:"10px"}}/>
        </form>
    );
};

export default SearchField;