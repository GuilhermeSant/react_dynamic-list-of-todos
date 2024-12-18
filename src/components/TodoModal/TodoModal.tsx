import React from 'react';
import { Loader } from '../Loader';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

export const TodoModal: React.FC<{
  todo: Todo;
  user: User | null;
  onClose: () => void;
  isLoading: boolean;
}> = ({ todo, user, onClose, isLoading }) => (
  <div className="modal is-active" data-cy="modal">
    <div className="modal-background" />

    {isLoading ? (
      <Loader />
    ) : (
      <>
        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              Todo #{todo.id}
            </div>
            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={onClose}
            />
          </header>
          <div className="modal-card-body">
            <p className="block" data-cy="modal-title">
              {todo.title}
            </p>
            <p className="block" data-cy="modal-user">
              <strong
                className={
                  todo.completed ? 'has-text-success' : 'has-text-danger'
                }
              >
                {todo.completed ? 'Done' : 'Planned'}
              </strong>{' '}
              by {user && <a href={`mailto:${user.email}`}>{user.name}</a>}
            </p>
          </div>
        </div>
      </>
    )}
  </div>
);
