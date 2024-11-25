import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ITodoItem } from "../types";

const STORAGE_KEY = "items";

interface AddTodoItemInput { name: string }
export type AddItemFn = (item: AddTodoItemInput) => void;
export type MarkCompletedFn = (id: string) => void;
export type RemoveItemFn = (id: string) => void;

interface ITodoContext {
  addItem: AddItemFn;
  removeItem: RemoveItemFn;
  markCompleted: MarkCompletedFn;
  items: ITodoItem[];
}

const TodoContext = createContext<ITodoContext | undefined>(undefined);

interface ITodoProviderProps extends PropsWithChildren { }

const getItemsFromStorage = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as ITodoItem[];

export function TodoProvider({ children }: ITodoProviderProps) {
  const itemsRef = useRef<ITodoItem[]>(getItemsFromStorage()); //use a backing ref object to avoid stale state operations
  const [items, setItems] = useState<ITodoItem[]>(getItemsFromStorage());

  const addItem: AddItemFn = useCallback((item) => {
    const newItem: ITodoItem = {
      name: item.name,
      id: Math.ceil(Math.random() * new Date().getTime()).toString(),
      completed: false
    }
    itemsRef.current = [...itemsRef.current, newItem];
    setItems([...itemsRef.current]);
  }, []);

  const removeItem: RemoveItemFn = useCallback((id: string) => {
    const index = itemsRef.current.findIndex(todoItem => todoItem.id === id);
    if (index > -1) {
      itemsRef.current.splice(index, 1);
      setItems([...itemsRef.current]);
    }
  }, []);

  const markCompleted: MarkCompletedFn = useCallback((id: string) => {
    const index = itemsRef.current.findIndex(todoItem => todoItem.id === id);
    if (index > -1) {
      itemsRef.current[index].completed = !itemsRef.current[index].completed;
      setItems([...itemsRef.current]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const context: ITodoContext = { addItem, removeItem, markCompleted, items };
  return <TodoContext.Provider value={context}>{children}</TodoContext.Provider>;
}

//expose the use context hook with an extra check if the context is called from a todo provider child
// eslint-disable-next-line react-refresh/only-export-components
export function useTodoContext() {
  const context = useContext(TodoContext);
  if (context === undefined) throw Error("The useTodoContext hook can only be called from within a TodoProvider boundary");
  return context;
}
