import StartFirebase from "../firebaseConfig";
import React, { Children } from "react";
import {ref, onValue} from 'firebase/database';
import {Table} from 'react-bootstrap';

const db = StartFirebase();

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
            <Table>
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
                            <td>{row.data.status}</td>
                        </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }

}