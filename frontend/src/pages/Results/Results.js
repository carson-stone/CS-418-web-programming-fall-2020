import React, { useEffect, useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { SEARCH_MUTATION } from '../Home/Home';

// from https://www.cssscript.com/remove-html-tags-prevent-xss/
function removeHtmlTags(a) {
  return a.replace(/(<([^>]+)>)/gi, '');
}

export default function (props) {
  let { results: initialResults, query: initialQuery } = props.location.state;
  const [results, setResults] = useState(initialResults);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([
    <span className='page-num active' key='1'>
      1
    </span>,
  ]);
  const [resultSets, setResultSets] = useState([]);

  const [uniqueResults, setUniqueResults] = useState([]);
  const [resultImages, setResultImages] = useState([]);
  const [figure, setFigure] = useState(null);

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
        results.filter(({ patentId, ...figure }) => {
          if (uniqueIds.has(patentId)) {
            uniqueIds.delete(patentId);
            return { patentId, ...figure };
          }
        })
      );
    }
  }, [results]);

  useEffect(() => {
    function imageStatus(path) {
      var http = new XMLHttpRequest();

      http.open('HEAD', path, false);
      http.send();

      return http.status;
    }

    const allImages = [
      ...uniqueResults.map(({ patentId: id, object, ...figure }) => {
        const images = [];
        let counter = 0;

        while (true) {
          try {
            const imagePath = `${process.env.PUBLIC_URL}/dataset/${id}-D0000${counter}.png`;

            if (imageStatus(imagePath) === 404) {
              throw "image doesn't exist";
            }

            const image = (
              <div
                key={Math.random() + id}
                className='result-img-container'
                onClick={() =>
                  setFigure({
                    id,
                    object,
                    description: figure.description,
                    aspect: figure.aspect,
                    image: imagePath,
                  })
                }
              >
                {object !== '0' && (
                  <h3>
                    {object.indexOf(search.current.value) === -1 ? (
                      <>{object}</>
                    ) : (
                      <p className='highlight'>{object}</p>
                    )}
                  </h3>
                )}
                <img
                  className='result-img'
                  src={`${process.env.PUBLIC_URL}/dataset/${id}-D0000${counter}.png`}
                />
              </div>
            );

            counter++;
            images.push(image);
          } catch (error) {
            return [...images];
          }
        }
      }),
    ];

    setResultImages([...allImages]);
  }, [uniqueResults]);

  useEffect(() => {
    const resultCount = resultImages.reduce(
      (total, result) => total + result.length,
      0
    );

    const newPageCount = Math.max(Math.ceil(resultCount / 20), 1);
    const newPageNumbers = [];

    for (let i = 1; i <= newPageCount; ++i) {
      if (page == i) {
        newPageNumbers.push(
          <span className='page-num active' onClick={() => setPage(i)} key={i}>
            {i}
          </span>
        );
      } else {
        newPageNumbers.push(
          <span className='page-num' onClick={() => setPage(i)} key={i}>
            {i}
          </span>
        );
      }
    }

    setPageNumbers(newPageNumbers);

    const newResultSets = [];
    let resultSet = [];

    for (let k = 0; k < resultImages.length; ++k) {
      for (let i = 0; i < resultImages[k].length; ++i) {
        if (resultSet.length === 20) {
          newResultSets.push(resultSet);
          resultSet = [];
        }

        resultSet.push(resultImages[k][i]);
      }
    }
    newResultSets.push(resultSet);

    setResultSets(newResultSets);
  }, [resultImages]);

  useEffect(() => {
    const newPageNumbers = [];

    pageNumbers.forEach((num) => {
      newPageNumbers.push(
        <span
          className='page-num'
          onClick={() => setPage(num.props.children)}
          key={num.props.children}
        >
          {num.props.children}
        </span>
      );
    });

    let index = 0;

    pageNumbers.forEach((num) => {
      if (num.props.children == page) {
        index = num.props.children - 1;
      }
    });

    newPageNumbers[index] = (
      <span
        className='page-num active'
        onClick={() => setPage(index + 1)}
        key={index + 1}
      >
        {index + 1}
      </span>
    );

    setPageNumbers(newPageNumbers);
  }, [page]);

  if (loading) return <h1>loading</h1>;
  if (error) return <h1>{error.message}</h1>;

  if (figure) {
    return (
      <Redirect
        to={{
          pathname: '/figure',
          state: { ...figure },
        }}
      />
    );
  }

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
            setPage(1);
            setQuery(removeHtmlTags(search.current.value).trim());
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

      <div className='page-nums'>{pageNumbers.map((page) => page)}</div>

      <div id='results'>
        {resultSets[page - 1] && resultSets[page - 1].map((result) => result)}
      </div>

      <div className='page-nums'>{pageNumbers.map((page) => page)}</div>
    </div>
  );
}
