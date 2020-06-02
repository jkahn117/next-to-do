import { useState } from 'react';
import Head from 'next/head';
import PlusCircleIcon from 'heroicons/solid/plus-circle.svg';

import List from '../components/list';
// import ListPaged from '../components/list-paged';
import New from '../components/new';

// Configure AWS Amplify
import awsconfig from '../src/aws-exports';
import API from '@aws-amplify/api';
API.configure(awsconfig);

export default function Home() {
  const [ creatingNew, setCreatingNew ] = useState(false);

  function onItemCreated() {
    setCreatingNew(false);
  }

  return (
    <div>
      <Head>
        <title>Simple Task Manager</title>
      </Head>

      <main className="max-w-xl m-auto bg-white shadow p-4">
        <header className="">
          <div className="py-4 px-4 flex justify-between text-indigo-600">
            <h1 className="inline text-3xl font-bold leading-tight">
              Tasks
            </h1>
          </div>
        </header>

        <div className="px-4">
          <List />
          {/* <ListPaged /> --- still in progress */}

          <New className={ `transition-all ease-in-out duration-1000 ${creatingNew ? '' : 'hidden'}` }
                onCreate={ onItemCreated } />
        </div>

        <div className="flex p-4 pt-8">
          <a href="#" 
              onClick={ () => { setCreatingNew(true) }}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition ease-in-out duration-500">
            <PlusCircleIcon className="h-6 w-6" />
            <span className="font-bold text-lg ml-2">New Task</span>
          </a>
        </div>
      </main>
    </div>
  )
}
