import React from 'react';

export default function (props) {
  const { id, object, description, aspect, image } = props.location.state;

  return (
    <div>
      <h1>{object}</h1>
      <img className='result-img' src={`${image}`} />

      <form>
        <div className='form-row figure'>
          <label>Description</label>
          <span>{description}</span>
        </div>
        <div className='form-row figure'>
          <label>Patent ID</label>
          <span>{id}</span>
        </div>
        <div className='form-row figure'>
          <label>Aspect</label>
          <span>{aspect}</span>
        </div>
      </form>
    </div>
  );
}
