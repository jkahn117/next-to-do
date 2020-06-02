import useSWR from 'swr';
import API, { graphqlOperation } from '@aws-amplify/api';
import { listTodos } from '../src/graphql/queries';

import ToDo from './todo';

export default function List() {
  const fetcher = query => API.graphql(graphqlOperation(query, { sortDirection: 'ASC' }))
                            .then(r => {
                              const { data: { listTodos: todos } } = r;
                              return todos
                            });

  const { data, error } = useSWR(listTodos, fetcher);
  
  if (error) {
    console.error(error);
    return <div>Failed to load</div>
  }
  if (!data) return <div>Loading...</div>
  
  const { items, nextToken } = data;

  return (
    <div className="space-y-4">
      { items.map((todo) => 
        <ToDo key={ todo.id } item={ todo } />
      )}
    </div>
  );
}
