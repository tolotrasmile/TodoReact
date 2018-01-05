import { Todo } from './Interfaces'

declare type ChangeCallback = (store: TodoStore) => void

export default class TodoStore {

  private static i = 0
  public todos: Todo[] = TodoStore.store('todos', [])
  private callbacks: ChangeCallback[] = []

  private static increment () {
    return this.i++
  }

  private static store (namespace: string, data: Todo[]) {

    if (data.length > 0) {
      localStorage.setItem(namespace, JSON.stringify(data))
    }

    let store = localStorage.getItem(namespace)
    console.log(store)
    return (store && JSON.parse(store)) || []
  }

  private static uuid (): string {
    let random = 0
    let uuid = ''

    for (let i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-'
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
    }

    return uuid
  }

  /**
   * Call all callbacks
   */
  inform () {
    this.todos = TodoStore.store('todos', this.todos)
    this.callbacks.forEach(cb => cb(this))
  }

  /**
   * Add callback into the callback list
   * @param {(store: TodoStore) => void} cb
   */
  onChange (cb: (store: TodoStore) => void) {
    this.callbacks.push(cb)
  }

  /**
   * Add new item
   * @param {string} title
   */
  addTodo (title: string): void {
    this.todos = [{ id: TodoStore.uuid(), title: title, completed: false }, ...this.todos]
    this.inform()
  }

  /**
   * Remove item
   * @param {Todo} todo
   */
  removeTodo (todo: Todo): void {
    this.todos = this.todos.filter(t => t !== todo)
    this.inform()
  }

  /**
   * Toggle item state
   * @param {Todo} todo
   */
  toggleTodo (todo: Todo): void {
    this.todos = this.todos.map(t => t === todo ? { ...t, completed: !t.completed } : t)
    this.inform()
  }

  /**
   * Toggle all item state
   * @param {boolean} completed
   */
  toggleAll (completed = true): void {
    this.todos = this.todos.map(t => completed === !t.completed ? { ...t, completed } : t)
    this.inform()
  }

  /**
   * Update item title
   * @param {Todo} todo
   * @param {string} title
   */
  updateTitle (todo: Todo, title: string): void {
    this.todos = this.todos.map(t => t === todo ? { ...t, title } : t)
    this.inform()
  }

  /**
   * Remove completed items
   */
  clearCompleted (): void {
    this.todos = this.todos.filter(t => !t.completed)
    this.inform()
  }
}
