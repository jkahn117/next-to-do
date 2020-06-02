import { mutate } from 'swr';
import { useFormik, FormikProvider, Form } from 'formik';
import { v4 } from 'uuid';
import API, { graphqlOperation } from '@aws-amplify/api';
import CheckCircleIcon from 'heroicons/outline/check-circle.svg';
import XCircleIcon from 'heroicons/outline/x-circle.svg';

import { listTodos } from '../src/graphql/queries';
import { createTodo } from '../src/graphql/mutations';

export default function New({ className, onCreate }) {
  async function createTodoMutation(newTodo) {
    return API.graphql(graphqlOperation(createTodo, { input: newTodo }));
  }

  const formik = useFormik({
    initialValues: {
      name: '',
    },

    onSubmit: (values, { resetForm }) => {
      const newTodo = {
        name: values.name,
        complete: false,
        // createdAt: new Date()
      };

      // @ see https://github.com/vercel/swr/blob/master/examples/optimistic-ui/pages/index.js
      // (1) perform optimistic update by updating the cache (do not validate)
      mutate(listTodos, data => {
        return {
          ...data,
          // provide a temporary id for the todo
          items: [ ...data.items, { ...newTodo, id: v4() } ]
        }
      }, false);

      // (2) send request and wait for API to respond
      mutate(listTodos, async data => {
        // AppSync returns the new item only
        const { data: { createTodo } } = await createTodoMutation(newTodo);
        data.items.push(createTodo);
        return data;
      });
      
      // reset the form
      resetForm({});
      if (onCreate) onCreate();
    },

    onReset: () => {
      if (onCreate) onCreate();
    }
  })

  return (
    <div className={ className }>
      <FormikProvider value={ formik }>
        <Form className="w-full">
          <div className="flex items-start w-full py-4">
            <label className="inline-flex items-center w-full">
              <input type="checkbox" disabled
                    className="form-checkbox h-6 w-6 text-green-500" />
              <div className="mx-4 flex-grow">
                <div className="mb-2">
                  <input className="w-5/6 pb-2 mr-4 font-semibold text-lg border-b border-gray-300 focus:outline-none focus:border-indigo-800"
                      id="name"
                      type="text"
                      placeholder="Get milk"
                      aria-label="Task name"
                      onChange={ formik.handleChange }
                      value={ formik.values.name } />
                  <button className="mr-2 text-indigo-600 border-transparent hover:text-indigo-800 focus:outline-none" 
                      disabled={ `${formik.isSubmitting ? 'disabled' : '' }` }
                      type="submit">
                    <CheckCircleIcon className="h-6 w-6" />
                  </button>
                  <button className="text-gray-600 border-transparent hover:text-gray-800 focus:outline-none" type="reset">
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </label>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
}