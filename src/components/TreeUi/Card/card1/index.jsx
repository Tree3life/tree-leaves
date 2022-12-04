import React from 'react';
import './index.css'

export default function Card1(props) {
  return (
      <div className="card" >
          {props.children}
      </div>
  )
}
