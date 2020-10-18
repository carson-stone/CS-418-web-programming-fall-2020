import React, { useEffect, useState } from 'react';

export default function (props) {
  const { results, query } = props.location.state;
  const [uniqueResults, setUniqueResults] = useState([]);

  useEffect(() => {
    const uniqueIds = new Set();

    if (results.length > 0) {
      results.forEach(({ patentId }) => {
        uniqueIds.add(patentId);
      });
    }

    setUniqueResults(
      results.filter(({ patentId, object }) => {
        if (uniqueIds.has(patentId)) {
          uniqueIds.delete(patentId);
          return { patentId, object };
        }
      })
    );
  }, []);

  return (
    <div>
      <h1>
        {uniqueResults.length} results for "{query}"
      </h1>

      <div id='results'>
        {uniqueResults.length > 0 &&
          uniqueResults.map(({ patentId: id, object }) => (
            <div key={Math.random() + id} className='result-img-container'>
              {object !== '0' && <h3>{object}</h3>}
              <img
                className='result-img'
                src={require(`../../dataset/${id}-D00000.png`)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
