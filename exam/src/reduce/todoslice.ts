import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getTodo, infoTodo } from './api'

export interface Image {
    id: number
    imageName: string
}

export interface TodoItem {
    id: number
    name: string
    description: string
    images: Image[]   
}

export interface CounterState {
    data: TodoItem[]
    info: TodoItem | null   
    loading: boolean
}

const initialState: CounterState = {
    data: [],
    info: null,
    loading: false,
}


export const counterSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getTodo.fulfilled, (state, action: PayloadAction<TodoItem[]>) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(getTodo.pending, (state) => {
            state.loading = true
        })
        builder.addCase(infoTodo.fulfilled, (state, action: PayloadAction<TodoItem>) => {
            state.info = action.payload
        })

    },
})

// Action creators are generated for each case reducer function
export const { } = counterSlice.actions

export default counterSlice.reducer