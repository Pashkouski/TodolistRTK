import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store";
import {
  addTodolistTC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
  todolistsAction,
} from "./todolists-reducer";
import {
  removeTaskTC,
  TasksStateType,
  tasksThunks,
  updateTaskTC,
} from "./tasks-reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { TaskStatuses } from "common/enum";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todolists
  );
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    (state) => state.tasks
  );
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    dispatch(fetchTodolistsTC());
  }, []);

  const removeTask = useCallback(
    function (id: string, todolistId: string) {
      const thunk = removeTaskTC(id, todolistId);
      dispatch(thunk);
    },
    [dispatch]
  );

  const addTask = useCallback(
    function (title: string, todolistId: string) {
      dispatch(tasksThunks.addTask({ todolistId, title }));
    },
    [dispatch]
  );

  const changeStatus = useCallback(
    function (id: string, status: TaskStatuses, todolistId: string) {
      const thunk = updateTaskTC(id, { status }, todolistId);
      dispatch(thunk);
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    function (id: string, newTitle: string, todolistId: string) {
      const thunk = updateTaskTC(id, { title: newTitle }, todolistId);
      dispatch(thunk);
    },
    [dispatch]
  );

  const changeFilter = useCallback(
    function (filter: FilterValuesType, id: string) {
      dispatch(todolistsAction.changeTodolistFilter({ id, filter }));
    },
    [dispatch]
  );

  const removeTodolist = useCallback(
    function (id: string) {
      const thunk = removeTodolistTC(id);
      dispatch(thunk);
    },
    [dispatch]
  );

  const changeTodolistTitle = useCallback(
    function (id: string, title: string) {
      const thunk = changeTodolistTitleTC(id, title);
      dispatch(thunk);
    },
    [dispatch]
  );

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = addTodolistTC(title);
      dispatch(thunk);
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
