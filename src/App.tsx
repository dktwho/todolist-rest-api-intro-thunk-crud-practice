import React, {useCallback, useEffect} from 'react'
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Menu} from '@mui/icons-material';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, deleteTodolistThunkCreator,
    FilterValuesType,
    getTodosThunkCreator,
    removeTodolistAC,
    TodolistDomainType
} from './state/todolists-reducer'
import {
    addTaskThunkCreator, ArgsType,
    removeTaskThunkCreator,
    updateTaskThunkCreator
} from './state/tasks-reducer';
import {useSelector} from 'react-redux';
import {AppRootStateType, useAppDispatch} from './state/store';
import { TaskType} from './api/todolists-api'


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskThunkCreator(id, todolistId))
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskThunkCreator(title, todolistId))
    }, []);


    const updateTask = useCallback(function (id: string,  todolistId: string, args: ArgsType ) {
        dispatch(updateTaskThunkCreator(todolistId, id, args))
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(deleteTodolistThunkCreator(id))
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const action = changeTodolistTitleAC(id, title);
        dispatch(action);
    }, []);

    const addTodolist = useCallback((title: string) => {
        const action = addTodolistAC(title);
        dispatch(action);
    }, [dispatch]);

    useEffect(() => {
        dispatch(getTodosThunkCreator())
    }, [])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];

                            return <Grid item key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={allTodolistTasks}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        updateTask={updateTask}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
