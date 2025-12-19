import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const api = import.meta.env.VITE_API;

export const getTodo = createAsyncThunk("todo/getTodo", async () => {
    try {
        const { data } = await axios.get(`${api}/api/to-dos`);
        return data.data; 
    } catch (error) {
        console.error(error);
    }
});

export const addTodo = createAsyncThunk(
  "todo/addTodo",
  async (newTodo: FormData, { dispatch }) => { // Accept FormData
    try {
        await axios.post(`${api}/api/to-dos`, newTodo);
        dispatch(getTodo());
    } catch (error) {
        console.error(error);
    }
});

export const delTodo = createAsyncThunk(
  "todo/delTodo",
  async (id: number, { dispatch }) => {
    try {
        await axios.delete(`${api}/api/to-dos?id=${id}`);
        dispatch(getTodo());
    } catch (error) {
        console.error(error);
    }
});

export const editTodo = createAsyncThunk(
  "todo/editTodo",
  async (editedTodo: any, { dispatch }) => {
    try {
        const { data } = await axios.put(
          `${api}/api/to-dos?id=${editedTodo.id}`,
          editedTodo
        );
        dispatch(getTodo());
        return data.data; 
    } catch (error) {
        console.error(error);
    }
});

export const checkTodo = createAsyncThunk(
  "todo/checkTodo",
  async (obj: any, { dispatch }) => {
    try {
        const { data } = await axios.put(
          `${api}/completed?id=${obj.id}`,
          { ...obj, isCompleated: !obj.isCompleated }
        );
        dispatch(getTodo());
        return data.data;
    } catch (error) {
        console.error(error);
    }
});

export const infoTodo = createAsyncThunk(
  "todo/infoTodo",
  async (id: number) => { 
    try {
        const { data } = await axios.get(`${api}/api/to-dos/${id}`);
        return data.data;
    } catch (error) {
        console.error(error);
    }
});

export const delimg = createAsyncThunk(
  "todo/delimg",
  async (id: number, { dispatch }) => {
    try {
        await axios.delete(`${api}/api/to-dos/images/${id}`);
        dispatch(getTodo());
    } catch (error) {
        console.error(error);
    }
});

export const addimg = createAsyncThunk(
  "todo/addimg",
  async (obj: { id: number; images: File[] }, { dispatch }) => {
    const formData = new FormData();
    if (obj.images) {
        for (let i = 0; i < obj.images.length; i++) {
            formData.append("images", obj.images[i]);
        }
    }

    try {
        await axios.post(`${api}/api/to-dos/${obj.id}/images`, formData);
        dispatch(getTodo());
    } catch (error) {
        console.error(error);
    }
});
