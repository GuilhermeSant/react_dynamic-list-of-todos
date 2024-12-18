/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos, getUser } from './api';
import { Todo } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [iconStates, setIconStates] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        throw new Error('Error fetching todos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleSelectTodo = async (todo: Todo) => {
    setIsLoading(true);
    setSelectedTodo(todo);
    setSelectedUser(null);
    setIconStates(prevState => ({
      ...prevState,
      [todo.id]: true,
    }));
    try {
      const user = await getUser(todo.userId);

      setSelectedUser(user);
    } catch (error) {
      throw new Error('Error fetching user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (selectedTodo) {
      setIconStates(prevState => ({
        ...prevState,
        [selectedTodo.id]: false,
      }));
    }

    setSelectedTodo(null);
    setSelectedUser(null);
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'completed') {
        return todo.completed;
      }

      if (filter === 'active') {
        return !todo.completed;
      }

      return true;
    })
    .filter(todo =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                filter={filter}
                setFilter={setFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            <div className="block">
              {isLoading ? (
                <Loader />
              ) : (
                <TodoList
                  todos={filteredTodos}
                  onSelect={handleSelectTodo}
                  iconStates={iconStates}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          user={selectedUser}
          onClose={handleCloseModal}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
