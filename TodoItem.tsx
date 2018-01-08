import * as React from 'react'
import * as cx from 'classnames'
import { Todo } from './src/Interfaces'

interface Props {
  todo: Todo,
  onToggle: (todo: Todo) => void,
  onDestroy: (todo: Todo) => void,
  onUpdate: (todo: Todo, title: string) => void,
}

interface State {
  editing: boolean,
  title: string
}

export default class TodoItem extends React.PureComponent<Props, State> {

  constructor (props: Props) {

    super(props)
    this.state = { editing: false, title: '' }

  }

  render () {

    let { todo } = this.props
    let { editing, title } = this.state

    return <li className={cx({ completed: todo.completed, editing })}>
      <div className="view">
        <input className="toggle" type="checkbox" onChange={this.toggle} checked={todo.completed}/>
        <label onDoubleClick={this.startEditing}>{todo.title}</label>
        <button className="destroy" onClick={this.destroy}/>
      </div>
      <input type="text" className="edit"
             value={title}
             onBlur={this.handleSubmit}
             onKeyDown={this.handleKeyDown}
             onInput={this.handleInput}
      />
    </li>
  }

  /**
   * Start editing on double click
   * @param {React.MouseEvent<HTMLLabelElement>} e
   */
  startEditing = (e: React.MouseEvent<HTMLLabelElement>) => {
    this.setState({ editing: true, title: this.props.todo.title })
  }

  /**
   * Handle editing control keys
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */
  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    switch (e.key) {

      case 'Escape':
        this.setState({ editing: false })
        break

      case 'Enter':
        this.handleSubmit()
        break

    }

  }

  /**
   * Handle input value changed
   * @param {React.FormEvent<HTMLInputElement>} e
   */
  handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ title: (e.target as HTMLInputElement).value })
  }

  /**
   * Handle input submitting
   */
  handleSubmit = () => {
    if (this.state.title !== '') {
      this.props.onUpdate(this.props.todo, this.state.title)
      this.setState({ editing: false })
    }
  }

  /**
   * Toggle item state
   */
  toggle = () => {
    this.props.onToggle(this.props.todo)
  }

  /**
   * Destroy or remove item
   */
  destroy = () => {
    this.props.onDestroy(this.props.todo)
  }

}
