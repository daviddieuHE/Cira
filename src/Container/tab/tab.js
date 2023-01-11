import React from 'react'
import './tab.css'



export default function Tab() {

  return (
    <div className='tableau'>
        <div className='tableau-parent'>
                    <div className='heading-container'>
                            <span className='primary-text'>
                                {""}
                                Welcome to your city issue management panel, let's see what can be fix in our City !
                            </span>
                    </div>
            <div className='tableau-tableau'>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>State</th>
                        </tr>
                    </thead>
                    <tbody className='tbody_corps'>

                    </tbody>
                </table>
            </div>

        </div>
    </div>
  )
}

