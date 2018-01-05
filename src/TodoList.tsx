import * as React from 'react'
import * as cx from 'classnames'
import TodoItem from '../TodoItem'
import TodoStore from './TodoStore'
import { Todo } from './Interfaces'

const Filters = {
  completed: (todo: Todo) => todo.completed,
  active: (todo: Todo) => !todo.completed,
  all: (todo: Todo) => true
}

type FilterOptions = 'all' | 'completed' | 'active'

interface TodoListProps {
}

interface TodoListState {
  todos: Todo[],
  newTodo: string,
  filter: FilterOptions
}

export default class TodoList extends React.Component<TodoListProps, TodoListState> {

  private store: TodoStore = new TodoStore()
  private toggleTodo: (todo: Todo) => void
  private removeTodo: (todo: Todo) => void
  private updateTitle: (todo: Todo, title: string) => void
  private clearCompleted: () => void

  constructor (props: TodoListProps) {

    super(props)

    this.toggleTodo = this.store.toggleTodo.bind(this.store)
    this.removeTodo = this.store.removeTodo.bind(this.store)
    this.updateTitle = this.store.updateTitle.bind(this.store)
    this.clearCompleted = this.store.clearCompleted.bind(this.store)

    this.state = { todos: [], newTodo: '', filter: 'all' }
    this.store.onChange(store => this.setState({ todos: store.todos }))
  }

  get remainingCount (): number {
    return this.store.todos.reduce((count, todos) => !todos.completed ? count + 1 : count, 0)
  }

  render () {

    const { todos, filter } = this.state
    let todoFiltered = todos.filter(Filters[filter])
    const remaining = this.remainingCount

    return <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input className="new-todo"
               placeholder="What needs to be done?"
               value={this.state.newTodo}
               onInput={this.updateNewTodo}
               onKeyPress={this.addTodo}
        />
      </header>
      <section className="main">
        {
          remaining > 0 &&
          <input className="toggle-all" type="checkbox" checked={remaining === 0} onChange={this.toggle}/>
        }
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todoFiltered.map(todo => {
            return <TodoItem todo={todo}
                             onToggle={this.toggleTodo}
                             onDestroy={this.removeTodo}
                             onUpdate={this.updateTitle}
                             key={todo.id}/>
          })}
        </ul>
      </section>
      <footer className="footer">
        {
          remaining > 0 &&
          <span className="todo-count"><strong>{remaining}</strong> item{remaining > 1 && 's'} left</span>
        }
        <ul className="filters">
          <li>
            <a href="#/"
               className={cx({ selected: filter === 'all' })}
               onClick={this.setFilter('all')}>
              All
            </a>
          </li>
          <li>
            <a href="#/active"
               className={cx({ selected: filter === 'active' })}
               onClick={this.setFilter('active')}>
              Active
            </a>
          </li>
          <li>
            <a href="#/completed"
               className={cx({ selected: filter === 'completed' })}
               onClick={this.setFilter('completed')}>
              Completed
            </a>
          </li>
        </ul>
        {
          remaining < todos.length &&
          <button className="clear-completed" onClick={this.clearCompleted}>Clear completed</button>
        }
      </footer>
    </section>
  }

  /**
   * Update new item title
   * @param {React.FormEvent<HTMLInputElement>} e
   */
  updateNewTodo = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ newTodo: (e.target as HTMLInputElement).value })
  }

  /**
   * Add new item
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */
  addTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.state.newTodo !== '' && e.key === 'Enter') {
      this.store.addTodo(this.state.newTodo)
      this.setState({ newTodo: '' })
    }
  }

  /**
   * Change the filter
   * @param {FilterOptions} filter
   * @returns {() => void}
   */
  setFilter = (filter: FilterOptions) => {
    return () => {
      this.setState({ filter })
    }
  }

  /**
   * Toggle states
   * @param {React.FormEvent<HTMLInputElement>} e
   */
  toggle = (e: React.FormEvent<HTMLInputElement>) => {
    this.store.toggleAll(this.remainingCount > 0)
  }

}
