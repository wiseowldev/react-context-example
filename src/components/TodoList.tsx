import { z } from "zod";
import { TodoProvider, useTodoContext } from "../context/TodoContext";
import TodoItem from "./TodoItem";
import {zodResolver} from "@hookform/resolvers/zod";

import styles from "./TodoList.module.css"
import { useForm } from "react-hook-form";
import { useCallback } from "react";

const formSchema = z.object({
  name: z.string().min(1, "the name is required")
});

type IFormSchema = z.infer<typeof formSchema>;
const defaultForm: IFormSchema = {name: ""}

function TodoList() {
  const {items, addItem} = useTodoContext();
  const form = useForm<IFormSchema>({
    defaultValues: defaultForm,
    resolver: zodResolver(formSchema)
  })

  const onSubmit = useCallback((form: IFormSchema) => addItem({name: form.name}), [addItem]);

  return (
    <div className={styles.Container}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input {...form.register("name")} />
        <button type="submit">add item</button>
      </form>

      <div className={styles.List}>{items.map(i => <TodoItem key={i.id} item={i} />)}</div>
    </div>
  )
}

//we export this wrapped component to add the todo provider context to the todolist component
export default function Wrapped() {
  return (
    <TodoProvider>
      <TodoList />
    </TodoProvider>
  )
}
