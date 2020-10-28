import React, { useEffect, useState, useRef } from 'react';
import { useMutation } from 'react-apollo';
import { SEARCH_MUTATION } from '../Home/Home';

export default function (props) {
  let { results: initialResults, query: initialQuery } = props.location.state;
  const [results, setResults] = useState(initialResults);
  const [query, setQuery] = useState(initialQuery);

  const [uniqueResults, setUniqueResults] = useState([]);
  const [resultImages, setResultImages] = useState([]);

  const search = useRef(null);

  const [searchAgain, { loading, error }] = useMutation(SEARCH_MUTATION, {
    onCompleted: (data) => {
      setResults(data.search.figures);
    },
  });

  useEffect(() => {
    const uniqueIds = new Set();

    if (results.length === 0) {
      setUniqueResults([]);
    }

    if (results.length > 0) {
      results.forEach(({ patentId }) => {
        uniqueIds.add(patentId);
      });

      setUniqueResults(
        results.filter(({ patentId, object }) => {
          if (uniqueIds.has(patentId)) {
            uniqueIds.delete(patentId);
            return { patentId, object };
          }
        })
      );
    }
  }, [results]);

  useEffect(() => {
    const allImages = [
      ...uniqueResults.map(({ patentId: id, object }) => {
        const images = [];
        let counter = 0;

        while (true) {
          try {
            const image = (
              <div key={Math.random() + id} className='result-img-container'>
                {object !== '0' && <h3>{object}</h3>}
                <img
                  className='result-img'
                  src={require(`../../dataset/${id}-D0000${counter}.png`)}
                />
              </div>
            );

            counter++;

            images.push(image);
          } catch (error) {
            return images;
          }
        }
      }),
    ];

    setResultImages([...allImages]);
  }, [uniqueResults]);

  if (loading) return <h1>loading</h1>;
  if (error) return <h1>{error.message}</h1>;

  return (
    <div>
      <span>
        <h1>
          {resultImages.reduce((total, result) => total + result.length, 0)}{' '}
          results for "{query}"
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(search.current.value);
            searchAgain({ variables: { description: search.current.value } });
          }}
        >
          <span id='search-box-and-btn'>
            <input
              type='text'
              name='description'
              placeholder='ex. toaster designs'
              ref={search}
              defaultValue={query}
            />
            <button className='primary'>Search</button>
          </span>
        </form>
      </span>

      <div id='results'>
        {uniqueResults.length > 0 && resultImages.map((result) => result)}
      </div>
    </div>
  );
}
