import { useState } from 'react';
import useSWR, { useSWRPages, mutate } from 'swr';
import API, { graphqlOperation } from '@aws-amplify/api';
import { listTodos } from '../src/graphql/queries';

import ToDo from './todo';

export default function ListPaged({ className }) {
  // const [ itemsPerPage, setItemsPerPage ] = useState(10);

  const fetcher = (query, nextToken) => {
    return API.graphql(graphqlOperation(query, { nextToken, limit: 10 }))
                            .then(r => {
                              const { data: { listTodos: todos } } = r;
                              return todos
                            });
                          }

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // key
    'listTodos',

    // page component, the data for this page of items
    ({ offset, withSWR }) => {
      const { data, error } = withSWR(
        useSWR([ listTodos, offset ], fetcher)
      );

      if (error) {
        console.log(error)
      }
      if (!data) return <p>Loading...</p>
      console.log(data)

      return data.items.map(todo =>
        <ToDo key={ todo.id } item={ todo } />
      )
    },
    // find the nextToken value
    ({ data }) => {
      return data && data.nextToken ? data.nextToken : null;
    },

    // dependencies
    [ ]
  );

  return (
    <div className={ className }>
      <div>
        { pages }
      </div>

      {/* <div>
        <label className="block">
          <span className="text-gray-600">Items per page</span>
          <select className="form-select block mt-1"
                  value={ itemsPerPage }
                  onChange={ handleChange }>
            <option>1</option>
            <option>5</option>
            <option>10</option>
          </select>
        </label>
      </div> */}

      {/* <button onClick={loadMore} disabled={isReachingEnd || isLoadingMore}>
        {isLoadingMore ? '. . .' : isReachingEnd ? 'no more data' : 'load more'}
      </button> */}
    </div>
  );
}
