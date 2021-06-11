import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { createTable } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"


function TableNew(props){
    const {loadDashboard,newTableAddState,setNewTableAddState}=props
    const [tableFormState,setTableFormState]=useState(tableFormBlank)
    const [tableErrorState,setTableErrorState]=useState(null)
    
    const history=useHistory()
    
    const tableFormBlank={
        table_name:"",
        capacity:0
    }

    function tableFormCheck(){
        const tableFormErrors = []
        if(tableFormState.capacity <1){
            tableFormErrors.push("capacity must be 1 or more; cannot be 0")
        }
        if(tableFormState.table_name<2){
            tableFormErrors.push("table_name must be at least 2 characters")
        }
            if(tableFormErrors.length===0){
               return true
            } else{
                setTableErrorState(new Error(tableFormErrors.toString()));
            return false
        }
    }

    function submitHandler(event){
        event.preventDefault() //submission default prevention
        setTableErrorState(null)
        const signal=new AbortController().signal //create an abort controller instance signal 
        //check form's date submission locally on front end first
        if (tableFormCheck()){//if no errors then true
                //API post
                createTable(tableFormState,signal) //actual API call via imported Util
                    .then(()=>loadDashboard())
                    .then(()=>setNewTableAddState(newTableAddState+1))
                    .then(()=> history.push("/dashboard"))//send user to reservation date URL)
                    .catch(setTableErrorState)
        }
    }

    function changeHandler({target}){
        let value=target.value
        if (target.name==="capacity"){
            value=Number(target.value)
            console.log(target.value)
        }
        setTableFormState({...tableFormState,[target.name]:value})
    }
    return (
        <div>
            <ErrorAlert error={tableErrorState}/>
            <form onSubmit={submitHandler}>
                <input 
                    type="text"
                    id="table_name"
                    name="table_name"
                    minLength="2"
                    value={tableFormState.table_name}
                    onChange={changeHandler}
                    required
                />
                <br/>
                <input 
                    type="number"
                    id="capacity"
                    name="capacity"
                    min="1"
                    step="1"
                    onChange={changeHandler}
                    placeholder="#"
                    value={tableFormState.capacity}
                    required
                />
                <br/>
                <button type="submit">Submit</button>
                <button type="button" onClick={history.goBack}>Cancel</button>
            </form>
        </div>
    )
}

export default TableNew