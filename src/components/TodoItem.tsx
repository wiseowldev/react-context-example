import { useCallback } from "react";
import { useTodoContext } from "../context/TodoContext";
import { ITodoItem } from "../types";

import styles from "./TodoItem.module.css";

interface ITodoItemProps {
  item: ITodoItem
}

export default function TodoItem(props: ITodoItemProps) {
  const { markCompleted, removeItem } = useTodoContext();
  const handleChange = useCallback(() => markCompleted(props.item.id), [props.item.id, markCompleted]);
  const handleDelete = useCallback(() => removeItem(props.item.id), [props.item.id, removeItem]);

  return (
    <div className={styles.Container}>
      <input type="checkbox" checked={props.item.completed} onChange={handleChange} />
      <p className={props.item.completed ? styles.Completed : undefined}>{props.item.name}</p>
      <button onClick={() => handleDelete()}>delete</button>
    </div>
  )
}
