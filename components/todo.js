import { mutate } from 'swr';
import API, { graphqlOperation } from '@aws-amplify/api';

import { listTodos } from '../src/graphql/queries';
import { updateTodo as updateTodoMutation } from '../src/graphql/mutations';

export default function ToDo({ item }) {
  function updateItem(data, newValue) {
    const idx = data.items.findIndex(i => i.id === item.id);
    let copy = [ ...data.items ];
    copy[idx] = { ...copy[idx], complete: newValue };

    return { ...data, items: copy };
  }

  async function handleItemChecked(event) {
    const complete = event.target.checked;
    
    // 1. perform optimistic update
    mutate(listTodos, data => {
      return updateItem(data, complete);
    }, false);

    // 2. send to API, update with result
    const params = {
      id: item.id,
      complete
    };

    mutate(listTodos, async data => {
      try {
        const { data: { updateTodo } } = await API.graphql(graphqlOperation(updateTodoMutation, { input: params }));
        const idx = data.items.findIndex(i => i.id === item.id);
        data.items.splice(idx, 1, updateTodo);
      } catch (e) {
        console.error('Failed to update item');
        console.error(e);
      }
      
      return data;
    });
  }

  return (
    <div className="flex items-start w-full">
      <label className="inline-flex w-full">
        <input type="checkbox" 
              checked={ `${item.complete ? 'checked' : '' }` }
              onChange={ handleItemChecked }
              className="form-checkbox h-6 w-6 text-green-500" />
        <div className="mx-4 flex-grow border-b border-gray-300">
          <div className="mb-2">
            <div className={ `font-semibold text-lg ${item.complete ? 'line-through' : ''}` }>{ item ? item.name : '' }</div>
            <div className="text-xs text-gray-600 font-light">{ item.description }</div>
          </div>
        </div>
      </label>
    </div>
  );
}