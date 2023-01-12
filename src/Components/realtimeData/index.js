import StartFirebase from "../firebaseConfig";
import React, { Children } from "react";
import {ref, onValue, update, set, Database} from 'firebase/database';
import {Table} from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const db = StartFirebase();


function changeStatus(key){
alert('issues/'+key);
}

export class RealtimeData extends React.Component{
    constructor(){
        super();
        this.state = {
            tableData: []
        }
    }

    componentDidMount(){
        const dbRef = ref(db,'issues');

        onValue(dbRef, (snapshot)=>{
            let records = [];
            snapshot.forEach(childSnapshot=>{
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({"key": keyName, 'data':data})
            });
            this.setState({tableData: records}) 
        });
    }
    
    render(){
        return(
            <Table className="container w-75" bordered striped variant="light">
                <thead>
                    <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.tableData.map((row, index)=>{
                        return(
                        <tr>
                            <td>{index+1}</td>
                            <td>{row.data.title}</td>
                            <td>{row.data.category}</td>
                            <td>{row.data.description}</td>
                            <td>{row.data.date}</td>
                            <td>{row.data.geolocation}</td>
                            <td><button type="submit" onClick={() => { changeStatus(row.key) }}>{row.data.status}</button></td>
                            
                        </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }

}